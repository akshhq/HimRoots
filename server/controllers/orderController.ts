import { Request, Response, NextFunction } from 'express';
import {
  executeCreateOrder,
  getOrderByIdOrNumber,
  verifyPaymentSignature,
  updateOrderEmailStatus,
  verifyOrderAccessToken,
} from '../services/orderService';
import {
  sendClientOrderNotificationEmail,
  sendCustomerOrderConfirmationEmail,
} from '../services/emailService';

/**
 * Controller for Order Creation
 * Handles POST /api/orders
 * Calculates prices authentically from database, never trusts client amounts.
 */
export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { items, customer, shipping, notes } = req.body;

    // Normalizing item structure (accepting both { productId } and { id })
    const normalizedItems = (items || []).map((item: any) => ({
      productId: item.productId || item.id,
      quantity: Number(item.quantity),
    }));

    const order = await executeCreateOrder({
      items: normalizedItems,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      shipping: {
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim(),
        pincode: shipping.pincode.trim(),
        country: shipping.country?.trim() || 'India',
      },
      notes: notes?.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully and awaiting payment',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderToken: order.orderToken,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        total: order.total,
        currency: 'INR',
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        items: order.items,
        customer: order.customer,
        shipping: order.shipping,
        createdAt: order.createdAt,
      },
      razorpay: order.razorpay,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller for Order Lookup
 * Handles GET /api/orders/:identifier
 * Safe lookup for order success screen and order status checking.
 * IDOR Protected: requires valid signed order access token.
 */
export async function getOrderByIdentifier(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { identifier } = req.params;
    const identifierStr = Array.isArray(identifier) ? identifier[0] : identifier;
    const token = (req.query.token as string) || (req.headers['x-order-token'] as string);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access denied: valid order access token is required to view order details.',
      });
      return;
    }

    const fullOrder = await getOrderByIdOrNumber(identifierStr);

    if (!fullOrder) {
      res.status(404).json({
        success: false,
        error: `Order with reference '${identifier}' was not found.`,
      });
      return;
    }

    if (!verifyOrderAccessToken(fullOrder, token)) {
      res.status(403).json({
        success: false,
        error: 'Access denied: invalid or unauthorized order access token.',
      });
      return;
    }

    // Return safe, non-sensitive order information
    res.json({
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
        discount: fullOrder.discount,
        total: fullOrder.total,
        payment_status: fullOrder.paymentStatus,
        order_status: fullOrder.orderStatus,
        created_at: fullOrder.createdAt,
        paid_at: fullOrder.paidAt,
        order_items: fullOrder.items.map((it) => ({
          product_id: it.productId,
          product_name: it.productName,
          quantity: it.quantity,
          price: it.price,
          subtotal: it.subtotal,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
}


/**
 * Controller for Payment Verification (for future Razorpay stage)
 * Handles POST /api/orders/verify
 */
export async function verifyOrderPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      res.status(400).json({
        success: false,
        error: 'Missing required payment verification parameters (orderId, razorpayOrderId, razorpayPaymentId)',
      });
      return;
    }

    const verificationResult = await verifyPaymentSignature(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature || ''
    );

    if (!verificationResult.isValid) {
      res.status(400).json({
        success: false,
        error: verificationResult.errorMessage || 'Payment verification failed: invalid signature.',
      });
      return;
    }

    // Best-effort transactional email notification
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
            paymentStatus: 'PAID (Verified)',
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

          const clientEmailResult = await sendClientOrderNotificationEmail(emailPayload);
          if (clientEmailResult.success) {
            await updateOrderEmailStatus(fullOrder.id, 'sent', null);
          } else {
            await updateOrderEmailStatus(fullOrder.id, 'failed', clientEmailResult.error || 'Email error');
          }

          try {
            await sendCustomerOrderConfirmationEmail(emailPayload);
          } catch (custErr) {
            console.warn('Customer receipt email notice:', custErr);
          }
        }
      } catch (emailErr: any) {
        console.error('Email notification error:', emailErr.message);
        await updateOrderEmailStatus(orderId, 'failed', emailErr.message);
      }
    }

    res.json({
      success: true,
      alreadyProcessed: verificationResult.isDuplicate,
      message: verificationResult.isDuplicate
        ? 'Payment already verified previously'
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
}
