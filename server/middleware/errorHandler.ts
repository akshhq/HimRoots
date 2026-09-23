import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('🔥 Server Error Encountered:', err);

  const statusCode = err.statusCode || (err.message && err.message.includes('not found') ? 404 : 400);
  const isProduction = process.env.NODE_ENV === 'production';

  // Sanitize message: never leak secrets or stack traces to client
  let clientMessage = err.message || 'An unexpected error occurred while processing your request.';

  // Mask database credentials or internal Postgres errors
  if (clientMessage.includes('password') || clientMessage.includes('connection') || clientMessage.includes('pg_')) {
    clientMessage = 'A database service error occurred. Please try again shortly.';
  }

  res.status(statusCode >= 400 && statusCode < 600 ? statusCode : 500).json({
    success: false,
    error: clientMessage,
    ...(isProduction ? {} : { code: err.code }),
  });
}
