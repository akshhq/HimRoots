import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

/**
 * Security headers middleware
 * Sets defensive headers to protect against common web vulnerabilities (XSS, clickjacking, MIME sniffing, data leakage)
 * Includes a Content Security Policy (CSP) compatible with the Razorpay payment modal.
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking by restricting frame embedding
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Modern security control: Disable legacy auditor (which introduced side-channel vulnerabilities)
  // in favor of the authoritative Content-Security-Policy below.
  res.setHeader('X-XSS-Protection', '0');

  // Control referrer information sent in HTTP requests
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Prevent download opening vulnerabilities in legacy browsers
  res.setHeader('X-Download-Options', 'noopen');

  // Disable DNS prefetching to protect user privacy
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // Cross-Origin Opener Policy: allows popup communication needed for payment gateways
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  // Authoritative Content Security Policy (CSP):
  // Strictly allowlists Himroots assets, Razorpay checkout modal & API endpoints, Google Fonts, and Supabase.
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://*.razorpay.com",
    "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com",
    "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://*.razorpay.com https://*.supabase.co https://api.himroots.in",
    "img-src 'self' data: https: blob:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);

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
 * In production: strictly allows https://himroots.in and https://www.himroots.in.
 * Localhost origins are only included when NODE_ENV !== 'production'.
 */
export function getCorsOrigins(): string[] {
  if (config.nodeEnv === 'production') {
    if (process.env.CORS_ORIGIN) {
      const parsed = process.env.CORS_ORIGIN.split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin && !origin.includes('localhost') && origin !== '*');
      if (parsed.length > 0) return parsed;
    }
    return ['https://himroots.in', 'https://www.himroots.in'];
  }

  // Non-production (development / test)
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  }

  return [
    'https://himroots.in',
    'https://www.himroots.in',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];
}

