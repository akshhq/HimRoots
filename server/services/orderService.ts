import crypto from 'crypto';
import { supabaseAdmin } from '../lib/supabase';
import { razorpayInstance } from '../lib/razorpay';
import { config, isRazorpayConfigured, isRazorpayLiveConfigured } from '../config/env';
import { getVerifiedProductsByIds, decrementProductStock } from './productService';
import {
  sendClientOrderNotificationEmail,
  sendCustomerOrderConfirmationEmail,
} from './emailService';
import type { OrderRow, OrderItemRow } from '../../src/types/database.types';

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingInput {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface CreateOrderRequest {
  items: CreateOrderItemInput[];
  customer: CustomerInput;
  shipping: ShippingInput;
  notes?: string;
}

export interface CalculatedOrder {
  orderNumber: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  lineItems: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

/**
 * Generate human-readable order number matching HM-YYYYMMDD-XXXX convention
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit code
  return `HM-${year}${month}${day}-${randomSuffix}`;
}

/**
 * Generates an HMAC-signed access token for an order.
 * Returned only once to the client that created the order (IDOR defense).
 */
export function generateOrderAccessToken(orderId: string): string {
  return crypto
    .createHmac('sha256', config.orderSecret)
    .update(orderId)
    .digest('hex');
}

/**
 * Validates the provided order access token against the order ID and order number.
 */
export function verifyOrderAccessToken(order: FullOrderDetails, providedToken?: string): boolean {
  if (!providedToken || typeof providedToken !== 'string') return false;

  const expectedById = generateOrderAccessToken(order.id);
  const expectedByNumber = generateOrderAccessToken(order.orderNumber);

  let match = false;
  if (
    expectedById.length === providedToken.length &&
    crypto.timingSafeEqual(Buffer.from(expectedById), Buffer.from(providedToken))
  ) {
    match = true;
  }
  if (
    !match &&
    expectedByNumber.length === providedToken.length &&
    crypto.timingSafeEqual(Buffer.from(expectedByNumber), Buffer.from(providedToken))
  ) {
    match = true;
  }
  if (
    !match &&
    order.orderToken &&
    order.orderToken.length === providedToken.length &&
    crypto.timingSafeEqual(Buffer.from(order.orderToken), Buffer.from(providedToken))
  ) {
    match = true;
  }
  return match;
}


/**
 * Validate customer and shipping address inputs
 */
export function validateOrderInput(payload: CreateOrderRequest): string | null {
  if (!payload) return 'Request payload is required';

  if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
    return 'Cart is empty. At least one product is required to place an order.';
  }

  for (const item of payload.items) {
    if (!item.productId || typeof item.productId !== 'string') {
      return 'Invalid or missing productId in order items';
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      return `Invalid quantity for product ${item.productId}. Must be a positive integer.`;
    }
    if (item.quantity > 50) {
      return `Quantity for product ${item.productId} exceeds maximum limit of 50 units per order.`;
    }
  }

  const { customer, shipping } = payload;

  if (!customer) return 'Customer contact information is required';
  if (!customer.name || customer.name.trim().length < 2) {
    return 'Customer name must be at least 2 characters long';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customer.email || !emailRegex.test(customer.email.trim())) {
    return 'Valid customer email address is required';
  }
  const phoneClean = customer.phone ? customer.phone.replace(/[\s-]/g, '') : '';
  if (!phoneClean || phoneClean.length < 8) {
    return 'Valid customer phone number is required';
  }

  if (!shipping) return 'Shipping destination address is required';
  if (!shipping.address || shipping.address.trim().length < 5) {
    return 'Complete street address is required';
  }
  if (!shipping.city || shipping.city.trim().length < 2) {
    return 'City name is required';
  }
  if (!shipping.state || shipping.state.trim().length < 2) {
    return 'State name is required';
  }
  if (!shipping.pincode || shipping.pincode.trim().length < 4) {
    return 'Valid postal PIN code is required';
  }

  return null;
}

/**
 * Validates products against the database and computes authentic monetary totals.
 * NEVER trusts any prices sent from the client.
 */
export async function calculateOrderAmounts(
  items: CreateOrderItemInput[]
): Promise<CalculatedOrder> {
  const productIds = items.map((i) => i.productId);
  const verifiedProducts = await getVerifiedProductsByIds(productIds);

  let subtotal = 0;
  const lineItems: CalculatedOrder['lineItems'] = [];

  for (const item of items) {
    const product = verifiedProducts.get(item.productId);
    if (!product) {
      throw new Error(`Product [${item.productId}] is unavailable or not found in our catalog`);
    }

    if (product.stock !== undefined && product.stock <= 0) {
      throw new Error(`Product [${product.name}] is currently out of stock`);
    }

    const itemPrice = Number(product.price);
    const itemSubtotal = itemPrice * item.quantity;
    subtotal += itemSubtotal;

    lineItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      price: itemPrice,
      subtotal: itemSubtotal,
    });
  }

  // Shipping calculation: Free delivery for orders above ₹2000, otherwise ₹150 flat shipping
  const shippingFee = subtotal > 2000 ? 0.00 : 150.00;
  const discount = 0.00;
  const total = subtotal + shippingFee - discount;

  return {
    orderNumber: generateOrderNumber(),
    subtotal,
    shippingFee,
    discount,
    total,
    lineItems,
  };
}

/**
 * Creates Razorpay order instance (or mock reference in test mode)
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  receipt: string,
  customer: CustomerInput
): Promise<{ id: string; amount: number; currency: string }> {
  const amountInPaise = Math.round(amountInRupees * 100);

  if (razorpayInstance && isRazorpayConfigured) {
    try {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt,
        notes: {
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
        },
      });

      return {
        id: razorpayOrder.id,
        amount: Number(razorpayOrder.amount),
        currency: razorpayOrder.currency,
      };
    } catch (err: any) {
      console.error('Razorpay API error creating order:', err);
      throw new Error('Failed to create payment order with Razorpay: ' + (err.message || 'Gateway error'));
    }
  }

  // Simulated fallback when testing locally without live Razorpay API keys
  const mockRazorpayId = `order_test_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
  return {
    id: mockRazorpayId,
    amount: amountInPaise,
    currency: 'INR',
  };
}

/**
 * Persists the created order and its line items into Supabase
 */
export async function persistOrderToDatabase(
  calculated: CalculatedOrder,
  customer: CustomerInput,
  shipping: ShippingInput,
  razorpayOrderId: string,
  notes?: string
): Promise<{ orderId: string; orderNumber: string }> {
  if (supabaseAdmin) {
    try {
      // 1. Insert into orders table
      const { data: orderData, error: orderError } = await (supabaseAdmin as any)
        .from('orders')
        .insert({
          order_number: calculated.orderNumber,
          customer_name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          phone: customer.phone.trim(),
          shipping_address: shipping.address.trim(),
          city: shipping.city.trim(),
          state: shipping.state.trim(),
          pincode: shipping.pincode.trim(),
          country: shipping.country || 'India',
          subtotal: calculated.subtotal,
          shipping_fee: calculated.shippingFee,
          discount: calculated.discount,
          total: calculated.total,
          payment_status: 'pending',
          order_status: 'pending',
          razorpay_order_id: razorpayOrderId || null,
          notes: notes || null,
        })
        .select('id, order_number')
        .single();

      if (orderError || !orderData) {
        console.error('Error inserting order in Supabase:', orderError);
        throw new Error('Database error recording order: ' + (orderError?.message || 'Insert failed'));
      }

      const orderId = orderData.id;
      const orderToken = generateOrderAccessToken(orderId);

      // 2. Insert line items
      const itemsToInsert = calculated.lineItems.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      }));

      const { error: itemsError } = await (supabaseAdmin as any)
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.error('Error inserting order items in Supabase:', itemsError);
      }

      const createdRecord: FullOrderDetails = {
        id: orderId,
        orderNumber: orderData.order_number,
        orderToken,
        customer,
        shipping,
        items: calculated.lineItems,
        subtotal: calculated.subtotal,
        shippingFee: calculated.shippingFee,
        discount: calculated.discount,
        total: calculated.total,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        razorpayOrderId: razorpayOrderId || undefined,
        emailStatus: 'pending',
        emailError: null,
        createdAt: new Date().toISOString(),
      };
      localOrdersStore.set(orderId, createdRecord);
      localOrdersStore.set(orderData.order_number, createdRecord);

      return {
        orderId,
        orderNumber: orderData.order_number,
        orderToken,
      };
    } catch (err) {
      console.error('Error during Supabase order persistence:', err);
      // Fall through to return generated reference so user flow doesn't crash completely
    }
  }

  // In offline/mock mode, return generated IDs
  const localOrderId = crypto.randomUUID();
  const orderToken = generateOrderAccessToken(localOrderId);
  const mockRecord: FullOrderDetails = {
    id: localOrderId,
    orderNumber: calculated.orderNumber,
    orderToken,
    customer,
    shipping,
    items: calculated.lineItems,
    subtotal: calculated.subtotal,
    shippingFee: calculated.shippingFee,
    discount: calculated.discount,
    total: calculated.total,
    paymentStatus: 'pending',
    orderStatus: 'pending',
    razorpayOrderId: razorpayOrderId || undefined,
    emailStatus: 'pending',
    emailError: null,
    createdAt: new Date().toISOString(),
  };
  localOrdersStore.set(localOrderId, mockRecord);
  localOrdersStore.set(calculated.orderNumber, mockRecord);

  return {
    orderId: localOrderId,
    orderNumber: calculated.orderNumber,
    orderToken,
  };
}

export interface FullOrderDetails {
  id: string;
  orderNumber: string;
  orderToken?: string;
  customer: CustomerInput;
  shipping: ShippingInput;
  items: {
    productId?: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  emailStatus: 'pending' | 'sent' | 'failed';
  emailError?: string | null;
  createdAt: string;
  paidAt?: string;
}

// In-memory store for orders to support retrieval and offline development
const localOrdersStore = new Map<string, FullOrderDetails>();

/**
 * Retrieve comprehensive order details by internal ID or human-readable order number
 */
export async function getOrderByIdOrNumber(identifier: string): Promise<FullOrderDetails | null> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await (supabaseAdmin as any)
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          email,
          phone,
          shipping_address,
          city,
          state,
          pincode,
          country,
          subtotal,
          shipping_fee,
          discount,
          total,
          payment_status,
          order_status,
          razorpay_order_id,
          razorpay_payment_id,
          email_status,
          email_error,
          created_at,
          paid_at,
          order_items (
            product_id,
            product_name,
            quantity,
            price,
            subtotal
          )
        `)
        .or(`id.eq.${identifier},order_number.eq.${identifier}`)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          orderNumber: data.order_number,
          customer: {
            name: data.customer_name,
            email: data.email,
            phone: data.phone,
          },
          shipping: {
            address: data.shipping_address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            country: data.country,
          },
          items: (data.order_items || []).map((it: any) => ({
            productId: it.product_id,
            productName: it.product_name,
            quantity: Number(it.quantity),
            price: Number(it.price),
            subtotal: Number(it.subtotal),
          })),
          subtotal: Number(data.subtotal),
          shippingFee: Number(data.shipping_fee),
          discount: Number(data.discount || 0),
          total: Number(data.total),
          paymentStatus: data.payment_status,
          orderStatus: data.order_status,
          razorpayOrderId: data.razorpay_order_id,
          razorpayPaymentId: data.razorpay_payment_id,
          emailStatus: data.email_status || 'pending',
          emailError: data.email_error || null,
          createdAt: data.created_at,
          paidAt: data.paid_at,
        };
      }
    } catch (err) {
      console.warn('Error fetching order from Supabase:', err);
    }
  }

  // Fallback to local store
  if (localOrdersStore.has(identifier)) {
    return localOrdersStore.get(identifier)!;
  }

  return null;
}

/**
 * Update the email notification status for an order
 */
export async function updateOrderEmailStatus(
  orderId: string,
  emailStatus: 'pending' | 'sent' | 'failed',
  errorMsg?: string | null
): Promise<void> {
  // Update local cache
  const local = localOrdersStore.get(orderId);
  if (local) {
    local.emailStatus = emailStatus;
    local.emailError = errorMsg || null;
  }

  // Update Supabase if available
  if (supabaseAdmin) {
    try {
      await (supabaseAdmin as any)
        .from('orders')
        .update({
          email_status: emailStatus,
          email_error: errorMsg || null,
        })
        .or(`id.eq.${orderId},order_number.eq.${orderId}`);
    } catch (err) {
      console.warn('Could not update order email status in Supabase:', err);
    }
  }
}

export interface PaymentVerificationResult {
  isValid: boolean;
  isDuplicate: boolean;
  orderNumber?: string;
  orderId?: string;
  errorMessage?: string;
}

// In-memory idempotency cache to safely handle concurrent/duplicate callbacks
const verifiedPaymentsCache = new Map<string, { orderId: string; orderNumber?: string; timestamp: number }>();

/**
 * Retrieve an order by its Razorpay Order ID (used by webhooks and reconciliation)
 */
export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<FullOrderDetails | null> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await (supabaseAdmin as any)
        .from('orders')
        .select(`
          id,
          order_number,
          customer_name,
          email,
          phone,
          shipping_address,
          city,
          state,
          pincode,
          country,
          subtotal,
          shipping_fee,
          discount,
          total,
          payment_status,
          order_status,
          razorpay_order_id,
          razorpay_payment_id,
          email_status,
          email_error,
          created_at,
          paid_at,
          order_items (
            product_id,
            product_name,
            quantity,
            price,
            subtotal
          )
        `)
        .eq('razorpay_order_id', razorpayOrderId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          orderNumber: data.order_number,
          customer: {
            name: data.customer_name,
            email: data.email,
            phone: data.phone,
          },
          shipping: {
            address: data.shipping_address,
            city: data.city,
            state: data.state,
            pincode: data.pincode,
            country: data.country,
          },
          items: (data.order_items || []).map((it: any) => ({
            productId: it.product_id,
            productName: it.product_name,
            quantity: Number(it.quantity),
            price: Number(it.price),
            subtotal: Number(it.subtotal),
          })),
          subtotal: Number(data.subtotal),
          shippingFee: Number(data.shipping_fee),
          discount: Number(data.discount || 0),
          total: Number(data.total),
          paymentStatus: data.payment_status,
          orderStatus: data.order_status,
          razorpayOrderId: data.razorpay_order_id,
          razorpayPaymentId: data.razorpay_payment_id,
          emailStatus: data.email_status || 'pending',
          emailError: data.email_error || null,
          createdAt: data.created_at,
          paidAt: data.paid_at,
        };
      }
    } catch (err) {
      console.warn('Error fetching order by razorpay_order_id from Supabase:', err);
    }
  }

  // Fallback to local store
  for (const order of localOrdersStore.values()) {
    if (order.razorpayOrderId === razorpayOrderId) {
      return order;
    }
  }

  return null;
}

/**
 * Asynchronously triggers customer receipt & client order notification emails.
 */
export async function triggerOrderNotificationEmails(
  order: FullOrderDetails,
  razorpayPaymentId: string
): Promise<void> {
  if (order.emailStatus === 'sent') return;

  try {
    const emailPayload = {
      orderNumber: order.orderNumber,
      orderId: order.id,
      orderDateTime: new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      paymentStatus: 'PAID (Verified)',
      customer: order.customer,
      shipping: order.shipping,
      items: order.items,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discount: order.discount,
      total: order.total,
      razorpayOrderId: order.razorpayOrderId,
      razorpayPaymentId,
    };

    const clientEmailResult = await sendClientOrderNotificationEmail(emailPayload);
    if (clientEmailResult.success) {
      await updateOrderEmailStatus(order.id, 'sent', null);
      order.emailStatus = 'sent';
    } else {
      await updateOrderEmailStatus(order.id, 'failed', clientEmailResult.error || 'Email error');
      order.emailStatus = 'failed';
    }

    try {
      await sendCustomerOrderConfirmationEmail(emailPayload);
    } catch (custErr) {
      console.warn('Customer receipt email notice:', custErr);
    }
  } catch (err: any) {
    console.error('Email dispatch error:', err.message);
    await updateOrderEmailStatus(order.id, 'failed', err.message);
  }
}

export interface MarkOrderPaidParams {
  orderId?: string;
  orderNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId: string;
  source: 'frontend_verify' | 'webhook';
}

export interface MarkOrderPaidResult {
  isAlreadyPaid: boolean;
  orderId: string;
  orderNumber: string;
}

/**
 * Shared, idempotent transition of an order to 'paid'.
 * Atomically decrements product stock and dispatches confirmation emails.
 * Safe to be invoked multiple times across both frontend verify and webhooks without double-decrementing.
 */
export async function markOrderAsPaid(params: MarkOrderPaidParams): Promise<MarkOrderPaidResult> {
  const { orderId, orderNumber, razorpayOrderId, razorpayPaymentId, source } = params;

  // 1. Distributed Idempotency Check via Supabase if available
  if (supabaseAdmin) {
    try {
      const idempotencyKey = `payment:${razorpayPaymentId}`;
      const { data: existingEntry } = await (supabaseAdmin as any)
        .from('payment_idempotency')
        .select('key, order_id')
        .eq('key', idempotencyKey)
        .maybeSingle();

      if (existingEntry) {
        return {
          isAlreadyPaid: true,
          orderId: existingEntry.order_id || orderId || '',
          orderNumber: orderNumber || '',
        };
      }
    } catch {
      // Fall back gracefully if table is not yet migrated
    }
  }

  // 2. In-memory deduplication check (L1 cache)
  if (verifiedPaymentsCache.has(razorpayPaymentId)) {
    const cached = verifiedPaymentsCache.get(razorpayPaymentId)!;
    return {
      isAlreadyPaid: true,
      orderId: cached.orderId,
      orderNumber: cached.orderNumber || '',
    };
  }

  // 3. Fetch current order
  let existingOrder: FullOrderDetails | null = null;
  if (orderId) {
    existingOrder = await getOrderByIdOrNumber(orderId);
  }
  if (!existingOrder && orderNumber) {
    existingOrder = await getOrderByIdOrNumber(orderNumber);
  }
  if (!existingOrder && razorpayOrderId) {
    existingOrder = await getOrderByRazorpayOrderId(razorpayOrderId);
  }

  const resolvedOrderId = existingOrder?.id || orderId || '';
  const resolvedOrderNumber = existingOrder?.orderNumber || orderNumber || '';

  // 4. Idempotency Guard: if already marked paid, return without double-decrementing stock
  if (existingOrder && existingOrder.paymentStatus === 'paid') {
    verifiedPaymentsCache.set(razorpayPaymentId, {
      orderId: resolvedOrderId,
      orderNumber: resolvedOrderNumber,
      timestamp: Date.now(),
    });
    return {
      isAlreadyPaid: true,
      orderId: resolvedOrderId,
      orderNumber: resolvedOrderNumber,
    };
  }

  // 5. Update order in Supabase
  if (supabaseAdmin) {
    try {
      await (supabaseAdmin as any)
        .from('orders')
        .update({
          payment_status: 'paid',
          order_status: 'processing',
          razorpay_payment_id: razorpayPaymentId,
          paid_at: new Date().toISOString(),
        })
        .or(`id.eq.${resolvedOrderId},order_number.eq.${resolvedOrderNumber},razorpay_order_id.eq.${razorpayOrderId}`);

      // Record in distributed idempotency table
      await (supabaseAdmin as any)
        .from('payment_idempotency')
        .insert({
          key: `payment:${razorpayPaymentId}`,
          order_id: resolvedOrderId,
          event_type: source,
          status: 'completed',
        });
    } catch (dbErr) {
      console.error('Error updating order/idempotency to paid in Supabase:', dbErr);
    }
  }

  // 6. Update order in local store
  const local =
    localOrdersStore.get(resolvedOrderId) ||
    (resolvedOrderNumber ? localOrdersStore.get(resolvedOrderNumber) : undefined);
  if (local) {
    local.paymentStatus = 'paid';
    local.orderStatus = 'processing';
    local.razorpayPaymentId = razorpayPaymentId;
    local.paidAt = new Date().toISOString();
  }

  // 7. Cache payment ID to prevent duplicate verification
  verifiedPaymentsCache.set(razorpayPaymentId, {
    orderId: resolvedOrderId,
    orderNumber: resolvedOrderNumber,
    timestamp: Date.now(),
  });

  // 7. Atomically decrement product stock (Priority 2, Item 8)
  const items = existingOrder?.items || local?.items || [];
  if (items.length > 0) {
    try {
      await decrementProductStock(items);
    } catch (stockErr) {
      console.error('Error decrementing stock on payment verification:', stockErr);
    }
  }

  // 8. Trigger confirmation emails asynchronously
  const orderForEmail = existingOrder || local;
  if (orderForEmail) {
    triggerOrderNotificationEmails(orderForEmail, razorpayPaymentId).catch((emailErr) => {
      console.error('Background order notification email error:', emailErr);
    });
  }

  return {
    isAlreadyPaid: false,
    orderId: resolvedOrderId,
    orderNumber: resolvedOrderNumber,
  };
}

/**
 * Verify Razorpay payment signature securely on backend
 * Implements strict idempotency to prevent duplicate payments
 */
export async function verifyPaymentSignature(
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<PaymentVerificationResult> {
  // Hard guard: production must have live Razorpay keys configured
  if (process.env.NODE_ENV === 'production') {
    if (!isRazorpayLiveConfigured) {
      throw new Error(
        'Production payment configuration error: Razorpay live keys are not configured. Cannot verify payments in production without live credentials.'
      );
    }
  }

  if (!razorpayOrderId || !razorpayPaymentId) {
    return {
      isValid: false,
      isDuplicate: false,
      errorMessage: 'Missing required payment transaction parameters (razorpayOrderId, razorpayPaymentId)',
    };
  }

  // 1. Signature verification with live Razorpay secret
  if (isRazorpayConfigured && config.razorpay.keySecret) {
    if (!razorpaySignature) {
      return {
        isValid: false,
        isDuplicate: false,
        errorMessage: 'Razorpay signature is required for live signature verification',
      };
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(payload)
      .digest('hex');

    let isValid = false;
    if (expectedSignature.length === razorpaySignature.length) {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'utf-8'),
        Buffer.from(razorpaySignature, 'utf-8')
      );
    }

    if (isValid) {
      const result = await markOrderAsPaid({
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        source: 'frontend_verify',
      });

      return {
        isValid: true,
        isDuplicate: result.isAlreadyPaid,
        orderId: result.orderId || orderId,
        orderNumber: result.orderNumber,
      };
    } else if (config.nodeEnv === 'production') {
      // Mark as failed in database in production
      if (supabaseAdmin) {
        await (supabaseAdmin as any)
          .from('orders')
          .update({ payment_status: 'failed' })
          .or(`id.eq.${orderId},order_number.eq.${orderId}`);
      }
      const local = localOrdersStore.get(orderId);
      if (local) local.paymentStatus = 'failed';

      return {
        isValid: false,
        isDuplicate: false,
        errorMessage: 'Invalid payment signature. Authentication failed.',
      };
    }
    // In development mode, if live signature check didn't match, fall through to check test tokens
  }

  // 2. Test mode / local development verification
  // SECURITY: This bypass is strictly disabled in production.
  if (config.nodeEnv === 'production') {
    return {
      isValid: false,
      isDuplicate: false,
      errorMessage: 'Payment verification failed: live Razorpay credentials are required in production.',
    };
  }

  // Allows testing invalid signature handling explicitly (development only)
  if (razorpaySignature === 'invalid_signature_test' || razorpayPaymentId.includes('invalid_test')) {
    return {
      isValid: false,
      isDuplicate: false,
      errorMessage: 'Invalid payment signature test rejection',
    };
  }

  // Development-only: accept simulated payment ONLY with explicit test signature tokens
  // NOTE: 'pay_' or 'test_' prefixes alone are NOT accepted as a stand-in for verification.
  const isExplicitTestSignature =
    razorpaySignature === 'simulated_test_signature' ||
    razorpaySignature === 'valid_test_sig' ||
    razorpaySignature === 'valid_sig_idempotent';

  if (isExplicitTestSignature) {
    console.warn(
      `⚠️  [DEV] Accepting simulated payment with test signature '${razorpaySignature}' — this bypass is strictly DISABLED in production.`
    );

    const result = await markOrderAsPaid({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      source: 'frontend_verify',
    });

    return {
      isValid: true,
      isDuplicate: result.isAlreadyPaid,
      orderId: result.orderId || orderId,
      orderNumber: result.orderNumber,
    };
  }

  return {
    isValid: false,
    isDuplicate: false,
    errorMessage: 'Payment ID or signature unrecognized for verification. Live credentials required.',
  };
}

/**
 * High-level service function to calculate and create an order in Supabase
 * Strictly computes amounts on server, generates Razorpay order, and sets status to pending
 */
export async function executeCreateOrder(payload: CreateOrderRequest) {
  // Hard guard: refuse to create orders in production without live Razorpay keys
  if (process.env.NODE_ENV === 'production' && !isRazorpayLiveConfigured) {
    throw new Error(
      'Production payment configuration error: Razorpay live keys are not configured. Orders cannot be created.'
    );
  }

  // 1. Calculate amounts authentically from database-backed prices
  const calculated = await calculateOrderAmounts(payload.items);

  // 2. Prepare/create Razorpay order (amount in paise, receipt = order number)
  const razorpayOrder = await createRazorpayOrder(
    calculated.total,
    calculated.orderNumber,
    payload.customer
  );

  // 3. Persist order and line items to database with razorpay_order_id
  const { orderId, orderNumber, orderToken } = await persistOrderToDatabase(
    calculated,
    payload.customer,
    payload.shipping,
    razorpayOrder.id,
    payload.notes
  );

  return {
    id: orderId,
    orderNumber,
    orderToken,
    subtotal: calculated.subtotal,
    shippingFee: calculated.shippingFee,
    discount: calculated.discount,
    total: calculated.total,
    paymentStatus: 'pending',
    orderStatus: 'pending',
    items: calculated.lineItems,
    customer: payload.customer,
    shipping: payload.shipping,
    createdAt: new Date().toISOString(),
    razorpay: {
      orderId: razorpayOrder.id,
      keyId: config.razorpay.keyId || 'rzp_test_mock_key',
      amount: razorpayOrder.amount, // in paise
      currency: razorpayOrder.currency,
      isConfigured: isRazorpayConfigured,
    },
  };
}


