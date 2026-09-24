import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

/**
 * Creates an in-memory sliding-window rate limiter middleware.
 * @param windowMs Time window in milliseconds
 * @param maxRequests Maximum allowed requests per IP within the window
 * @param message Custom message returned when limit is exceeded
 */
export function createRateLimiter(
  windowMs: number,
  maxRequests: number,
  message: string = 'Too many requests. Please slow down and try again shortly.'
) {
  const store = new Map<string, RateLimitRecord>();

  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of store.entries()) {
      const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (validTimestamps.length === 0) {
        store.delete(ip);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    // Extract client IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown';

    const now = Date.now();
    let record = store.get(ip);

    if (!record) {
      record = { timestamps: [] };
      store.set(ip, record);
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

// Preset rate limiters
export const apiLimiter = createRateLimiter(60 * 1000, 120, 'Too many requests to Himroots API. Please try again in a minute.');
export const orderLimiter = createRateLimiter(10 * 60 * 1000, 15, 'Too many order requests from this IP. Please wait a few minutes before trying again.');
export const contactLimiter = createRateLimiter(10 * 60 * 1000, 8, 'Too many inquiry submissions. Please wait a few minutes before submitting another message.');
