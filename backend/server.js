import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { products } from '../data.js';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../.env') });

const app = express();
const port = Number(process.env.PORT || 5000);
const isProduction = process.env.NODE_ENV === 'production';
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5000,http://localhost:3000,http://localhost:5173').split(',').map((v) => v.trim());

// Razorpay configuration
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
const razorpayReady = Boolean(razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('your') && !razorpayKeyId.includes('rzp_test_yourkey'));
const razorpay = razorpayReady ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret }) : null;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Resend configuration
const resendApiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY || '';
const orderEmail = process.env.CLIENT_ORDER_EMAIL || 'orders@himroots.in';
const supportEmail = process.env.CLIENT_SUPPORT_EMAIL || 'support@himroots.in';
const emailSender = process.env.EMAIL_FROM || 'Himroots Wellness <orders@himroots.in>';

// In-memory order cache
const orders = new Map();
const rateRecords = new Map();

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  if (isProduction) {
    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

app.use(cors({
  origin(origin, callback) {
    return !origin || origins.includes(origin) ? callback(null, true) : callback(new Error('Origin not allowed by CORS'));
  }
}));

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const times = (rateRecords.get(ip) || []).filter((time) => now - time < windowMs);
    if (times.length >= max) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please try again shortly.' });
    }
    times.push(now);
    rateRecords.set(ip, times);
    next();
  };
}

// Product resolver supporting pack variants
function productFor(identifier) {
  if (identifier === 'prod_001_pack-2' || identifier === 'prod_001-pack2' || identifier === 'SBP-500-2') {
    const base = products.find(p => p.id === 'prod_001');
    return {
      ...base,
      id: 'prod_001_pack-2',
      name: `${base.name} (Pack of 2)`,
      price: 1798,
      originalPrice: 2398,
      volume: '2 x 500 ml'
    };
  }
  return products.find((product) => 
    product.id === identifier || 
    product.slug === identifier || 
    product.sku === identifier ||
    (identifier === 'sea-buckthorn-juice' && product.slug === 'sea-buckthorn-pulp')
  );
}

// Send transactional emails via Resend
async function sendEmail({ to, subject, html }) {
  if (!resendApiKey || resendApiKey.includes('your')) {
    console.info('[email-mock]', { to, subject });
    return { success: true, mock: true };
  }
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: emailSender,
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    });
    const result = await resp.json();
    return { success: resp.ok, data: result };
  } catch (err) {
    console.error('[resend-error]', err);
    return { success: false, error: err.message };
  }
}

// Sync order to Supabase
async function syncOrderToSupabase(order) {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your')) return;
  try {
    await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        order_number: order.orderNumber,
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        shipping_address: order.shipping,
        items: order.items,
        subtotal: order.subtotal,
        shipping_fee: order.shippingFee,
        total: order.total,
        payment_status: order.paymentStatus,
        payment_id: order.paymentId || null,
        created_at: order.createdAt
      })
    });
  } catch (err) {
    console.error('[supabase-sync-error]', err.message);
  }
}

function validateOrder(body) {
  const errors = {};
  const { items, customer, shipping } = body || {};

  if (!Array.isArray(items) || !items.length) {
    errors.items = 'Your shopping cart is empty.';
  } else {
    items.forEach((item, index) => {
      const prod = productFor(item.productId || item.id);
      if (!prod) errors[`items.${index}`] = 'An item in the cart is unavailable.';
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
        errors[`items.${index}.quantity`] = 'Quantity must be between 1 and 50.';
      }
    });
  }

  if (!customer?.name?.trim() || customer.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }
  if (!/^\S+@\S+\.\S+$/.test(customer?.email || '')) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!String(customer?.phone || '').replace(/[^\d]/g, '').match(/^\d{8,}$/)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  for (const field of ['address', 'city', 'state', 'pincode']) {
    if (!shipping?.[field]?.trim()) {
      errors[field] = `Please enter your ${field}.`;
    }
  }
  return errors;
}

// ==========================================================================
// API ROUTES
// ==========================================================================
app.use('/api', rateLimit(120, 60_000));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Himroots Wellness API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    integrations: {
      razorpay: razorpayReady ? 'configured' : 'simulation_mode',
      resend: resendApiKey ? 'configured' : 'simulation_mode',
      supabase: supabaseUrl ? 'configured' : 'offline_mode'
    }
  });
});

app.get('/api/products', (_req, res) => {
  res.json({ success: true, count: products.length, data: products });
});

app.get('/api/products/:identifier', (req, res) => {
  const product = productFor(req.params.identifier);
  return product 
    ? res.json({ success: true, data: product }) 
    : res.status(404).json({ success: false, error: 'Product not found.' });
});

app.post('/api/contact', rateLimit(10, 600_000), async (req, res) => {
  const { name, email, message, category = 'General Enquiry', phone = '', honeypot = '' } = req.body || {};
  if (honeypot) return res.json({ success: true, message: 'Your message has been received.' });

  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !message?.trim() || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: 'Please provide your name, valid email, and a message.' });
  }

  // Send email to support
  await sendEmail({
    to: [supportEmail, orderEmail],
    subject: `[Himroots Contact] ${category} from ${name.trim()}`,
    html: `
      <h2>New Contact Submission</h2>
      <p><strong>Name:</strong> ${name.trim()}</p>
      <p><strong>Email:</strong> ${email.trim()}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="background: #f5f5f5; padding: 12px; border-left: 4px solid #dfb76c;">
        ${message.trim()}
      </blockquote>
    `
  });

  res.status(201).json({ success: true, message: 'Your message has been received. Our team will contact you shortly.' });
});

app.post(['/api/orders', '/api/orders/create'], rateLimit(20, 600_000), async (req, res) => {
  const errors = validateOrder(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, error: Object.values(errors)[0], details: errors });
  }

  const lineItems = req.body.items.map((item) => {
    const product = productFor(item.productId || item.id);
    const quantity = Number(item.quantity);
    return {
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      subtotal: product.price * quantity
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shippingFee;

  const id = crypto.randomUUID();
  const orderNumber = `HR-${Date.now().toString().slice(-6)}-${crypto.randomInt(100, 999)}`;

  let paymentOrder = {
    id: `order_sim_${Date.now().toString(36)}`,
    amount: total * 100,
    currency: 'INR'
  };

  if (razorpay) {
    paymentOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: orderNumber,
      notes: { localOrderId: id }
    });
  }

  const order = {
    id,
    orderNumber,
    items: lineItems,
    subtotal,
    shippingFee,
    total,
    customer: {
      name: req.body.customer.name.trim(),
      email: req.body.customer.email.trim().toLowerCase(),
      phone: req.body.customer.phone.trim()
    },
    shipping: {
      ...req.body.shipping,
      country: req.body.shipping.country || 'India'
    },
    paymentStatus: 'pending',
    orderStatus: 'pending',
    razorpayOrderId: paymentOrder.id,
    createdAt: new Date().toISOString()
  };

  orders.set(id, order);
  orders.set(orderNumber, order);

  res.status(201).json({
    success: true,
    message: 'Order created awaiting payment.',
    order,
    razorpay: {
      orderId: paymentOrder.id,
      keyId: razorpayReady ? razorpayKeyId : 'rzp_mock',
      amount: paymentOrder.amount,
      currency: 'INR',
      isConfigured: razorpayReady
    }
  });
});

app.get('/api/orders/:identifier', (req, res) => {
  const order = orders.get(req.params.identifier);
  return order ? res.json({ success: true, order }) : res.status(404).json({ success: false, error: 'Order not found.' });
});

app.post('/api/orders/verify', async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};
  const order = orders.get(orderId);

  if (!order || !razorpayOrderId || !razorpayPaymentId) {
    return res.status(400).json({ success: false, error: 'Missing payment parameters.' });
  }

  let valid = !isProduction && (razorpayPaymentId.startsWith('pay_sim_') || razorpayPaymentId.startsWith('test_'));

  if (razorpayReady && razorpaySignature) {
    const expected = crypto.createHmac('sha256', razorpayKeySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');
    valid = expected.length === razorpaySignature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpaySignature));
  }

  if (!valid) {
    return res.status(400).json({ success: false, error: 'Payment signature verification failed.' });
  }

  order.paymentStatus = 'paid';
  order.orderStatus = 'processing';
  order.paymentId = razorpayPaymentId;
  order.paidAt = new Date().toISOString();

  // Sync with Supabase (if configured)
  await syncOrderToSupabase(order);

  // Send Order Confirmation Emails
  await sendEmail({
    to: order.customer.email,
    subject: `Order Confirmed: ${order.orderNumber} | Himroots Wellness`,
    html: `
      <h2>Thank You for Your Order!</h2>
      <p>Hello ${order.customer.name},</p>
      <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
      <h3>Order Items:</h3>
      <ul>
        ${order.items.map(i => `<li>${i.productName} × ${i.quantity} — ₹${i.subtotal}</li>`).join('')}
      </ul>
      <p><strong>Total Paid:</strong> ₹${order.total}</p>
      <p>We are preparing your wild Himalayan formulations for express dispatch.</p>
      <br>
      <p>Warm regards,<br>The Himroots Wellness Team</p>
    `
  });

  await sendEmail({
    to: orderEmail,
    subject: `[New Paid Order] ${order.orderNumber} — ₹${order.total}`,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Order Number:</strong> ${order.orderNumber}</p>
      <p><strong>Customer:</strong> ${order.customer.name} (${order.customer.email}, ${order.customer.phone})</p>
      <p><strong>Address:</strong> ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} - ${order.shipping.pincode}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Payment ID:</strong> ${order.paymentId}</p>
    `
  });

  res.json({
    success: true,
    message: 'Payment verified successfully.',
    orderId: order.id,
    orderNumber: order.orderNumber,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus
  });
});

// ==========================================================================
// STATIC ASSET SERVING & CLIENT ROUTING
// ==========================================================================
app.use('/assets', express.static(path.resolve(here, '../assets'), { maxAge: isProduction ? '7d' : 0 }));
app.get(['/app.js', '/data.js', '/styles.css'], (req, res) => res.sendFile(path.resolve(here, '..', req.path.slice(1))));
app.get(['/robots.txt', '/sitemap.xml', '/site.webmanifest', '/favicon.ico'], (req, res) => {
  res.sendFile(path.resolve(here, '../assets', req.path.slice(1)));
});

// Wildcard client-side routing
app.get('/{*path}', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.resolve(here, '../index.html'));
});

app.use((err, _req, res, _next) => {
  console.error('[server error]', err);
  res.status(500).json({ success: false, error: 'Server error processing request.' });
});

app.listen(port, () => {
  console.log(`Himroots Wellness storefront active at http://localhost:${port}`);
});
