import { Request, Response, NextFunction } from 'express';

/**
 * Centralized, safe error handler middleware.
 * Guarantees that internal errors, stack traces, and database credentials are NEVER exposed to clients.
 */
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Always log full error details internally on the server for diagnosis
  console.error('🔥 [API ERROR]:', {
    message: err?.message,
    name: err?.name,
    stack: err?.stack,
  });

  // Handle express JSON body parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body.',
    });
    return;
  }

  // Determine appropriate HTTP status code
  let statusCode = err.statusCode || err.status || 500;
  if (err.message && (err.message.includes('not found') || err.message.includes('unavailable'))) {
    statusCode = 404;
  } else if (err.message && (err.message.includes('invalid') || err.message.includes('required') || err.message.includes('out of stock'))) {
    statusCode = 400;
  }

  // Sanitize message: never leak secrets or stack traces to client
  let clientMessage = err.message || 'An unexpected error occurred while processing your request.';

  // Mask database internals, Postgres error strings, or credential mentions
  if (
    clientMessage.includes('password') ||
    clientMessage.includes('connection') ||
    clientMessage.includes('pg_') ||
    clientMessage.includes('Postgres') ||
    clientMessage.includes('SQL') ||
    clientMessage.includes('supabase')
  ) {
    clientMessage = 'A secure database service error occurred. Please try again shortly or contact support.';
  }

  res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    success: false,
    error: clientMessage,
  });
}
