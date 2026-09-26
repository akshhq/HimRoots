import express from 'express';
import cors from 'cors';
import { config, isSupabaseAdminConfigured } from './config/env';
import { securityHeaders, getCorsOrigins } from './middleware/security';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import contactRouter from './routes/contact';

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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// 3. Request Body Parsing with strict size limits
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// 4. Request Logger (Development & Staging)
app.use((req, _res, next) => {
  if (config.nodeEnv !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

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
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`
🌿 =======================================================
   HIMROOTS WELLNESS BACKEND SERVER RUNNING
   URL: http://localhost:${config.port}
   Environment: ${config.nodeEnv}
   Database: ${isSupabaseAdminConfigured ? 'Connected (Supabase)' : 'Local Fallback'}
   Security: Enabled (Rate Limits, Strict CORS, Headers)
======================================================= 🌿
    `);
  });
}

export default app;
