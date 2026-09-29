import pino from 'pino';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { config } from '../config/env';

/**
 * PII Sanitization Utilities
 * Mask customer email, phone, and delivery address to ensure sensitive patron data
 * is never logged in plaintext.
 */
export function maskEmail(email?: string): string {
  if (!email || typeof email !== 'string') return '***';
  const parts = email.split('@');
  if (parts.length !== 2) return '***';
  const [local, domain] = parts;
  const visible = local.length > 2 ? local.slice(0, 2) : local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function maskPhone(phone?: string): string {
  if (!phone || typeof phone !== 'string') return '***';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 4) return '***';
  return `${clean.slice(0, 3)}****${clean.slice(-2)}`;
}

export function maskAddress(address?: string): string {
  if (!address || typeof address !== 'string') return '***';
  const words = address.split(' ');
  return words.length > 2 ? `${words[0]} *** [REDACTED]` : '*** [REDACTED]';
}

/**
 * Structured Pino Logger
 * Outputs NDJSON with ISO timestamp, severity levels, and route context.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (config.nodeEnv === 'production' ? 'info' : 'debug'),
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) {
      return { severity: label.toUpperCase(), level: label };
    },
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.key_secret',
      '*.secret',
      '*.token',
      'customer.phone',
      'customer.address',
      'shipping.address',
    ],
    censor: '[REDACTED]',
  },
});

/**
 * Express Request Logger Middleware
 * Assigns unique X-Request-ID, attaches child logger to req, and logs completion.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const reqId = (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('X-Request-ID', reqId);

  const startTime = Date.now();
  const childLog = logger.child({
    reqId,
    method: req.method,
    route: req.baseUrl + req.path,
  });

  (req as any).log = childLog;
  (req as any).reqId = reqId;

  // Log on response completion
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Do not flood logs with health check probes unless warning/error
    if (req.path === '/api/health' && statusCode === 200) {
      return;
    }

    const logData = {
      statusCode,
      durationMs,
      ip: (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : req.socket.remoteAddress) || 'unknown',
    };

    if (statusCode >= 500) {
      childLog.error(logData, 'Request completed with server error');
    } else if (statusCode >= 400) {
      childLog.warn(logData, 'Request completed with client error');
    } else {
      childLog.info(logData, 'Request completed successfully');
    }
  });

  next();
}
