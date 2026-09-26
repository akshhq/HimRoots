import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

interface RateLimitRecord {
  timestamps: number[];
}

// Background cleanup for database rate limit records (runs every 30 mins)
if (supabaseAdmin) {
  setInterval(async () => {
    try {
      await (supabaseAdmin as any).rpc('prune_rate_limits');
    } catch {
      // Ignore if table/RPC is not yet migrated
    }
  }, 30 * 60 * 1000).unref();
}

/**
 * Creates a distributed rate limiter middleware backed by Supabase with in-memory fallback.
 * Safe for serverless and multi-instance hosting.
 * @param windowMs Time window in milliseconds
 * @param maxRequests Maximum allowed requests per IP within the window
 * @param message Custom message returned when limit is exceeded
 * @param limiterName Unique namespace for the limiter (e.g. 'api', 'order', 'contact')
 */
export function createRateLimiter(
  windowMs: number,
  maxRequests: number,
  message: string = 'Too many requests. Please slow down and try again shortly.',
  limiterName: string = 'default'
) {
  const memoryStore = new Map<string, RateLimitRecord>();

  // In-memory cleanup every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (validTimestamps.length === 0) {
        memoryStore.delete(key);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }, 5 * 60 * 1000).unref();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Extract client IP address safely
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown';
    const rateLimitKey = `${limiterName}:${ip}`;

    // 1. Distributed Check via Supabase if configured
    if (supabaseAdmin) {
      try {
        const windowStart = new Date(Date.now() - windowMs).toISOString();
        const { count, error } = await (supabaseAdmin as any)
          .from('rate_limits')
          .select('id', { count: 'exact', head: true })
          .eq('key', rateLimitKey)
          .gte('created_at', windowStart);

        if (!error && typeof count === 'number') {
          if (count >= maxRequests) {
            res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
            res.status(429).json({
              success: false,
              error: message,
            });
            return;
          }

          // Asynchronously record request entry
          (supabaseAdmin as any)
            .from('rate_limits')
            .insert({ key: rateLimitKey })
            .then(() => {})
            .catch(() => {});

          next();
          return;
        }
      } catch {
        // Fall back gracefully to local memory store if database table is not yet migrated
      }
    }

    // 2. In-Memory Fallback Check
    const now = Date.now();
    let record = memoryStore.get(rateLimitKey);

    if (!record) {
      record = { timestamps: [] };
      memoryStore.set(rateLimitKey, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (record.timestamps.length >= maxRequests) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      res.status(429).json({
        success: false,
        error: message,
      });
      return;
    }

    record.timestamps.push(now);
    next();
  };
}

// Preset distributed rate limiters
export const apiLimiter = createRateLimiter(60 * 1000, 120, 'Too many requests to Himroots API. Please try again in a minute.', 'api');
export const orderLimiter = createRateLimiter(10 * 60 * 1000, 15, 'Too many order requests from this IP. Please wait a few minutes before trying again.', 'order');
export const contactLimiter = createRateLimiter(10 * 60 * 1000, 8, 'Too many inquiry submissions. Please wait a few minutes before submitting another message.', 'contact');

