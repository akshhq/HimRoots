import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

/**
 * Security headers middleware
 * Sets defensive headers to protect against common web vulnerabilities (XSS, clickjacking, MIME sniffing).
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking by restricting frame embedding
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Enable XSS filter in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Control referrer information sent in HTTP requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // HTTP Strict Transport Security in production
  if (config.nodeEnv === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Remove Express powered-by fingerprint
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * Validates CORS origins strictly
 */
export function getCorsOrigins(): string[] | string {
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  }

  // Safe defaults for production and local development
  return [
    'https://himroots.in',
    'https://www.himroots.in',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];
}
