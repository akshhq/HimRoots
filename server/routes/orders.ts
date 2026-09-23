import { Router, Request, Response, NextFunction } from 'express';
import {
  validateOrderInput,
  calculateOrderAmounts,
  createRazorpayOrder,
  persistOrderToDatabase,
  verifyPaymentSignature,
  getOrderByIdOrNumber,
  updateOrderEmailStatus,
} from '../services/orderService';
import {
  sendClientOrderNotificationEmail,
  sendCustomerOrderConfirmationEmail,
} from '../services/emailService';
import { config, isRazorpayConfigured } from '../config/env';

const router = Router();

/**
 * POST /api/orders/create
 * Creates an order in database and generates Razorpay order payload
 */
router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, customer, shipping, notes } = req.body;

    // 1. Validate incoming payload
    const validationError = validateOrderInput({ items, customer, shipping, notes });
    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError,
      });
    }

    // 2. Fetch actual product prices from database & calculate authentic totals
    // NEVER TRUSTS ANY PRICES SENT FROM CLIENT
    const calculatedOrder = await calculateOrderAmounts(items);

    // 3. Prepare/create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      calculatedOrder.total,
      calculatedOrder.orderNumber,
      customer
    );

    // 4. Persist order into Supabase
    const { orderId, orderNumber } = await persistOrderToDatabase(
      calculatedOrder,
      customer,
      shipping,
      razorpayOrder.id,
      notes
    );

    // 5. Send trusted response back to frontend
    res.status(201).json({
      success: true,
      message: 'Order initiated successfully',
      order: {
        id: orderId,
        orderNumber: orderNumber,
        subtotal: calculatedOrder.subtotal,
        shippingFee: calculatedOrder.shippingFee,
        discount: calculatedOrder.discount,
        total: calculatedOrder.total,
        currency: 'INR',
        paymentStatus: 'pending',
        orderStatus: 'received',
        items: calculatedOrder.lineItems,
      },
      razorpay: {
        orderId: razorpayOrder.id,
        keyId: config.razorpay.keyId || 'rzp_test_mock_key',
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
        isConfigured: isRazorpayConfigured,
      },
    });
  } catch (error: any) {
    next(error);
  }
});

/**
 * POST /api/orders/verify
 * Verifies HMAC SHA256 payment signature and updates order status to 'paid'
 */
router.post('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification parameters (orderId, razorpayOrderId, razorpayPaymentId)',
      });
    }

    const verificationResult = await verifyPaymentSignature(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature || ''
    );

    if (!verificationResult.isValid) {
      return res.status(400).json({
        success: false,
        error: verificationResult.errorMessage || 'Payment verification failed: invalid signature or unrecognized payment transaction',
      });
    }

    // Trigger transactional email notification to Himroots client and customer
    // CRITICAL: Email failure must NEVER reverse or invalidate a successful payment!
    if (!verificationResult.isDuplicate) {
      try {
        const fullOrder = await getOrderByIdOrNumber(verificationResult.orderId || orderId);
        if (fullOrder) {
          const emailPayload = {
            orderNumber: fullOrder.orderNumber,
            orderId: fullOrder.id,
            orderDateTime: new Date().toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              dateStyle: 'medium',
              timeStyle: 'short',
            }),
            paymentStatus: 'PAID (Verified via Razorpay)',
            customer: fullOrder.customer,
            shipping: fullOrder.shipping,
            items: fullOrder.items,
            subtotal: fullOrder.subtotal,
            shippingFee: fullOrder.shippingFee,
            discount: fullOrder.discount,
            total: fullOrder.total,
            razorpayOrderId,
            razorpayPaymentId,
          };

          // 1. Dispatch client order notification
          const clientEmailResult = await sendClientOrderNotificationEmail(emailPayload);

          if (clientEmailResult.success) {
            await updateOrderEmailStatus(fullOrder.id, 'sent', null);
            console.log(`✅ [EMAIL DISPATCHED] Order notification email sent for ${fullOrder.orderNumber}`);
          } else {
            console.error(`⚠️ [EMAIL FAILURE] Client order email failed for ${fullOrder.orderNumber}:`, clientEmailResult.error);
            await updateOrderEmailStatus(fullOrder.id, 'failed', clientEmailResult.error || 'Provider rejected email');
          }

          // 2. Dispatch customer confirmation receipt (optional/best-effort)
          try {
            await sendCustomerOrderConfirmationEmail(emailPayload);
          } catch (custErr: any) {
            console.warn(`⚠️ [EMAIL WARNING] Customer receipt email failed for ${fullOrder.customer.email}:`, custErr.message);
          }
        }
      } catch (emailErr: any) {
        // Log error clearly on server without failing the customer order
        console.error(`🔥 [EMAIL EXCEPTION] Error processing notification for order ${orderId}:`, emailErr.message);
        await updateOrderEmailStatus(orderId, 'failed', emailErr.message);
      }
    }

    // Return successful order confirmation to the customer
    res.json({
      success: true,
      alreadyProcessed: verificationResult.isDuplicate,
      message: verificationResult.isDuplicate
        ? 'Payment already verified previously (idempotent duplicate request handled safely)'
        : 'Payment verified successfully and order marked as paid',
      orderId: verificationResult.orderId || orderId,
      orderNumber: verificationResult.orderNumber,
      paymentId: razorpayPaymentId,
      paymentStatus: 'paid',
      orderStatus: 'processing',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/:identifier
 * Safe lookup for order success screen (by order UUID or human-readable order_number)
 */
router.get('/:identifier', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier } = req.params;

    const fullOrder = await getOrderByIdOrNumber(identifier);

    if (fullOrder) {
      return res.json({
        success: true,
        order: {
          id: fullOrder.id,
          order_number: fullOrder.orderNumber,
          customer_name: fullOrder.customer.name,
          email: fullOrder.customer.email,
          phone: fullOrder.customer.phone,
          shipping_address: fullOrder.shipping.address,
          city: fullOrder.shipping.city,
          state: fullOrder.shipping.state,
          pincode: fullOrder.shipping.pincode,
          country: fullOrder.shipping.country,
          subtotal: fullOrder.subtotal,
          shipping_fee: fullOrder.shippingFee,
          total: fullOrder.total,
          payment_status: fullOrder.paymentStatus,
          order_status: fullOrder.orderStatus,
          email_status: fullOrder.emailStatus,
          created_at: fullOrder.createdAt,
          paid_at: fullOrder.paidAt,
          order_items: fullOrder.items.map((it) => ({
            product_name: it.productName,
            quantity: it.quantity,
            price: it.price,
            subtotal: it.subtotal,
          })),
        },
      });
    }

    return res.status(404).json({
      success: false,
      error: `Order '${identifier}' not found`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
