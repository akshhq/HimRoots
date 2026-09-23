import express from 'express';
import cors from 'cors';
import { config, isSupabaseAdminConfigured, isRazorpayConfigured } from './config/env';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import contactRouter from './routes/contact';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev server and production domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
app.use((req, _res, next) => {
  if (config.nodeEnv !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health & Status Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Himroots Wellness API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    integrations: {
      supabase: isSupabaseAdminConfigured ? 'configured' : 'fallback_mode',
      razorpay: isRazorpayConfigured ? 'configured' : 'mock_test_mode',
    },
  });
});

// Mount Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/contact', contactRouter);

// 404 Handler for undefined API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: `API endpoint '${req.method} ${req.originalUrl}' not found`,
    });
  }
  next();
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`
🌿 =======================================================
   HIMROOTS WELLNESS BACKEND SERVER RUNNING
   URL: http://localhost:${config.port}
   Environment: ${config.nodeEnv}
   Database: ${isSupabaseAdminConfigured ? 'Connected (Supabase)' : 'Local Fallback'}
   Payments: ${isRazorpayConfigured ? 'Live / Test Active' : 'Simulation Mode'}
======================================================= 🌿
    `);
  });
}

export default app;
