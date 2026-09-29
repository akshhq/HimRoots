import express from 'express';
import cors from 'cors';
import { config, isSupabaseAdminConfigured } from './config/env';
import { securityHeaders, getCorsOrigins } from './middleware/security';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, logger } from './lib/logger';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import contactRouter from './routes/contact';
import webhooksRouter from './routes/webhooks';

const app = express();

// 1. Security Headers
app.use(securityHeaders);

// 2. CORS configuration with explicit origins (restricted in production)
const allowedOrigins = getCorsOrigins();
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or non-browser tools (e.g. curl, postman, health checks)
      if (!origin) return callback(null, true);

      if (Array.isArray(allowedOrigins)) {
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(new Error(`Origin '${origin}' not allowed by CORS policy`));
      }

      if (allowedOrigins === '*' || allowedOrigins === origin) {
        return callback(null, true);
      }

      return callback(new Error(`Origin '${origin}' not allowed by CORS policy`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Order-Token', 'x-razorpay-signature', 'x-request-id'],
    credentials: true,
  })
);

// 3. Request Body Parsing with rawBody capture for webhook signature verification
app.use(
  express.json({
    limit: '100kb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// 4. Structured Request Logger with Request IDs and Latency Tracking
app.use(requestLogger);

// 5. Rate Limiter for all API routes
app.use('/api', apiLimiter);

// 6. Health & Status Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Himroots Wellness API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    integrations: {
      supabase: isSupabaseAdminConfigured ? 'configured' : 'fallback_mode',
    },
  });
});

// 7. Mount Core API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/contact', contactRouter);
app.use('/api/webhooks', webhooksRouter);

// 8. 404 Handler for undefined API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: `API endpoint '${req.method} ${req.originalUrl}' not found`,
    });
  }
  next();
});

// 9. Centralized Safe Error Handling
app.use(errorHandler);

// 10. Start Server
// 10. Start Server with Graceful Shutdown Handling (SIGTERM/SIGINT)
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(config.port, () => {
    logger.info(
      {
        port: config.port,
        environment: config.nodeEnv,
        database: isSupabaseAdminConfigured ? 'Connected (Supabase)' : 'Local Fallback',
      },
      'Himroots Wellness backend server running'
    );
  });

  const handleGracefulShutdown = (signal: string) => {
    logger.info({ signal }, `Received ${signal}. Starting graceful shutdown...`);

    // Stop accepting new incoming requests
    server.close((err) => {
      if (err) {
        logger.error({ error: err }, 'Error closing HTTP server during shutdown');
        process.exit(1);
      }
      logger.info('HTTP server closed cleanly. In-flight requests drained.');
      process.exit(0);
    });

    // Hard fallback timeout (10 seconds)
    setTimeout(() => {
      logger.error('Forcefully terminating after 10s shutdown timeout.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
}

export default app;

