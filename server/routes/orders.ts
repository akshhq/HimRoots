import { Router } from 'express';
import {
  createOrder,
  getOrderByIdentifier,
  verifyOrderPayment,
} from '../controllers/orderController';
import { validateCreateOrder } from '../middleware/validation';
import { orderLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/orders
 * Core Order Creation: validates inputs, authenticates prices from database,
 * calculates subtotal, shipping, discount, total, and stores order with pending status.
 */
router.post('/', orderLimiter, validateCreateOrder, createOrder);

/**
 * POST /api/orders/create
 * Alias route for backwards compatibility with any existing clients.
 */
router.post('/create', orderLimiter, validateCreateOrder, createOrder);

/**
 * GET /api/orders/:identifier
 * Safe lookup for order success screen and customer receipts (by UUID or order number).
 */
router.get('/:identifier', getOrderByIdentifier);

/**
 * POST /api/orders/verify
 * Payment verification handler for future Razorpay integration stage.
 */
router.post('/verify', verifyOrderPayment);

export default router;
