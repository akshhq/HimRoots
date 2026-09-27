import { config, isEmailConfigured } from '../config/env';

export interface EmailOrderLineItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface EmailCustomerDetails {
  name: string;
  email: string;
  phone: string;
}

export interface EmailShippingDetails {
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface OrderNotificationEmailData {
  orderNumber: string;
  orderId?: string;
  orderDateTime: string;
  paymentStatus: string;
  customer: EmailCustomerDetails;
  shipping: EmailShippingDetails;
  items: EmailOrderLineItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  razorpayOrderId?: string;
  razorpayPaymentId: string;
}

export interface SupportInquiryEmailData {
  name: string;
  email: string;
  phone?: string | null;
  orderId?: string | null;
  category: string;
  message: string;
  submittedAt: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Universal email dispatcher (Resend or Brevo via HTTP REST API)
 */
async function dispatchEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendEmailResult> {
  const { to, subject, html, replyTo } = params;

  // Simulation test hook: Allows deterministic testing of email failure handling
  if (
    (replyTo && replyTo.includes('simulate_fail')) ||
    (typeof to === 'string' && to.includes('simulate_fail')) ||
    (Array.isArray(to) && to.some(t => t.includes('simulate_fail')))
  ) {
    return {
      success: false,
      error: 'Simulated transactional email provider failure (503 Service Unavailable)',
    };
  }

  // If live credentials are not set, run in safe simulation mode
  if (!isEmailConfigured) {
    const toStr = Array.isArray(to) ? to.join(', ') : to;
    console.log(`\n📧 [EMAIL SIMULATION]`);
    console.log(`   To: ${toStr}`);
    console.log(`   From: ${config.email.from}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Reply-To: ${replyTo || 'None'}`);
    console.log(`   Status: Simulated (Set EMAIL_API_KEY to send real emails)\n`);
    
    return {
      success: true,
      simulated: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    };
  }

  // 1. Resend Provider
  if (config.email.provider === 'resend' || config.email.apiKey.startsWith('re_')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.email.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.email.from,
          to: Array.isArray(to) ? to : [to],
          subject: subject,
          html: html,
          reply_to: replyTo || undefined,
        }),
      });

      const resData = (await response.json()) as any;

      if (!response.ok) {
        console.error('❌ Resend API Error Response:', resData);
        return {
          success: false,
          error: resData?.message || `Resend HTTP error ${response.status}`,
        };
      }

      return {
        success: true,
        messageId: resData.id,
      };
    } catch (err: any) {
      console.error('❌ Network exception contacting Resend:', err);
      return {
        success: false,
        error: err.message || 'Resend network connection failed',
      };
    }
  }

  // 2. Brevo Provider
  if (config.email.provider === 'brevo') {
    try {
      const recipients = (Array.isArray(to) ? to : [to]).map(e => ({ email: e }));
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': config.email.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: config.email.from.replace(/.*<([^>]+)>.*/, '$1') || config.email.from, name: 'Himroots Wellness' },
          to: recipients,
          subject: subject,
          htmlContent: html,
          replyTo: replyTo ? { email: replyTo } : undefined,
        }),
      });

      const resData = (await response.json()) as any;

      if (!response.ok) {
        console.error('❌ Brevo API Error Response:', resData);
        return {
          success: false,
          error: resData?.message || `Brevo HTTP error ${response.status}`,
        };
      }

      return {
        success: true,
        messageId: resData.messageId,
      };
    } catch (err: any) {
      console.error('❌ Network exception contacting Brevo:', err);
      return {
        success: false,
        error: err.message || 'Brevo network connection failed',
      };
    }
  }

  return {
    success: false,
    error: `Unknown email provider '${config.email.provider}'`,
  };
}

/**
 * Dispatches New Order Notification Email to the Himroots Client Order Inbox
 */
export async function sendClientOrderNotificationEmail(
  data: OrderNotificationEmailData
): Promise<SendEmailResult> {
  const subject = `New Order - ${data.orderNumber}`;

  const itemsHtml = data.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #2d2d2d;">
        <td style="padding: 12px 8px; font-weight: 600; color: #ffffff;">${item.productName}</td>
        <td style="padding: 12px 8px; text-align: center; color: #d4d4d4;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; color: #d4d4d4;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #D4AF37;">₹${item.subtotal.toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0a09; color: #e5e5e5; margin: 0; padding: 24px; }
    .card { max-width: 650px; margin: 0 auto; background-color: #171513; border: 1px solid #332d25; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1c1917, #0c0a09); padding: 32px 24px; text-align: center; border-bottom: 1px solid #443c2c; }
    .brand-title { color: #D4AF37; font-size: 22px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 6px 0; }
    .header-sub { color: #a8a29e; font-size: 13px; margin: 0; }
    .content { padding: 24px; }
    .status-badge { display: inline-block; background-color: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #D4AF37; border-bottom: 1px solid #292524; padding-bottom: 8px; margin: 24px 0 12px 0; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 14px; }
    .meta-table td { padding: 6px 0; }
    .meta-label { color: #a8a29e; width: 38%; }
    .meta-value { color: #ffffff; font-weight: 500; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14px; }
    .items-table th { background-color: #211d19; color: #a8a29e; padding: 10px 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
    .totals-box { margin-top: 20px; background-color: #211d19; border-radius: 8px; padding: 16px; font-size: 14px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .grand-total { border-top: 1px solid #443c2c; margin-top: 8px; padding-top: 8px; font-size: 18px; font-weight: bold; color: #D4AF37; }
    .footer { text-align: center; padding: 24px; font-size: 11px; color: #78716c; border-top: 1px solid #292524; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand-title">🌿 HIMROOTS WELLNESS</div>
      <p class="header-sub">Official Client Order Notification</p>
    </div>
    
    <div class="content">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <span style="font-size: 12px; color: #a8a29e; text-transform: uppercase;">Order Number</span>
          <div style="font-size: 20px; font-weight: bold; color: #ffffff; font-family: monospace;">${data.orderNumber}</div>
        </div>
        <div>
          <span class="status-badge">${data.paymentStatus}</span>
        </div>
      </div>

      <div class="section-title">Customer Contact Details</div>
      <table class="meta-table">
        <tr><td class="meta-label">Customer Name:</td><td class="meta-value">${data.customer.name}</td></tr>
        <tr><td class="meta-label">Email Address:</td><td class="meta-value"><a href="mailto:${data.customer.email}" style="color: #D4AF37; text-decoration: none;">${data.customer.email}</a></td></tr>
        <tr><td class="meta-label">Phone Number:</td><td class="meta-value"><a href="tel:${data.customer.phone}" style="color: #ffffff; text-decoration: none;">${data.customer.phone}</a></td></tr>
        <tr><td class="meta-label">Order Timestamp:</td><td class="meta-value">${data.orderDateTime}</td></tr>
      </table>

      <div class="section-title">Shipping & Delivery Destination</div>
      <table class="meta-table">
        <tr><td class="meta-label">Street Address:</td><td class="meta-value">${data.shipping.address}</td></tr>
        <tr><td class="meta-label">City:</td><td class="meta-value">${data.shipping.city}</td></tr>
        <tr><td class="meta-label">State:</td><td class="meta-value">${data.shipping.state}</td></tr>
        <tr><td class="meta-label">PIN Code:</td><td class="meta-value" style="font-weight: bold; color: #D4AF37;">${data.shipping.pincode}</td></tr>
        <tr><td class="meta-label">Country:</td><td class="meta-value">${data.shipping.country || 'India'}</td></tr>
      </table>

      <div class="section-title">Purchased Formulations</div>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th style="text-align: center;">Qty</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Item Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals-box">
        <div class="total-row"><span>Subtotal:</span><span>₹${data.subtotal.toFixed(2)}</span></div>
        <div class="total-row"><span>Shipping Delivery:</span><span>${data.shippingFee === 0 ? 'Complimentary (Free)' : `₹${data.shippingFee.toFixed(2)}`}</span></div>
        ${data.discount > 0 ? `<div class="total-row"><span>Discount:</span><span>-₹${data.discount.toFixed(2)}</span></div>` : ''}
        <div class="total-row grand-total"><span>Total Paid:</span><span>₹${data.total.toFixed(2)}</span></div>
      </div>

      <div class="section-title">Razorpay Transaction Verification</div>
      <table class="meta-table" style="font-family: monospace; font-size: 13px;">
        <tr><td class="meta-label">Razorpay Order ID:</td><td class="meta-value">${data.razorpayOrderId}</td></tr>
        <tr><td class="meta-label">Razorpay Payment ID:</td><td class="meta-value" style="color: #4ade80;">${data.razorpayPaymentId}</td></tr>
      </table>
    </div>

    <div class="footer">
      This is an automated notification dispatched to the Himroots fulfillment operations team.<br>
      Please prepare products from the Trans-Himalayan harvest store for packaging & courier dispatch.
    </div>
  </div>
</body>
</html>`;

  return dispatchEmail({
    to: config.email.clientOrderEmail,
    subject,
    html,
    replyTo: data.customer.email,
  });
}

/**
 * Dispatches Order Confirmation Receipt to the Customer
 */
export async function sendCustomerOrderConfirmationEmail(
  data: OrderNotificationEmailData
): Promise<SendEmailResult> {
  const subject = `Order Confirmed: ${data.orderNumber} | Himroots Wellness`;

  const itemsList = data.items
    .map(
      (item) => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2d2d2d; font-size: 14px;">
        <div><strong>${item.quantity}x</strong> ${item.productName}</div>
        <div style="color: #D4AF37; font-weight: bold;">₹${item.subtotal.toFixed(2)}</div>
      </div>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0c0a09; color: #e5e5e5; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #171513; border: 1px solid #332d25; border-radius: 12px; overflow: hidden; padding: 32px 24px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #D4AF37; font-size: 22px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px 0;">🌿 HIMROOTS WELLNESS</h1>
      <p style="color: #a8a29e; font-size: 14px; margin: 0;">Pure Trans-Himalayan Sea Buckthorn & Vitality</p>
    </div>

    <div style="background-color: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
      <h2 style="color: #4ade80; font-size: 18px; margin: 0 0 6px 0;">Thank You for Your Order!</h2>
      <p style="color: #d4d4d4; font-size: 13px; margin: 0;">We have received your order <strong>${data.orderNumber}</strong>. Our packaging team in Himachal Pradesh is preparing your pure wild harvest with care.</p>
    </div>

    <h3 style="color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #332d25; padding-bottom: 6px;">Order Summary</h3>
    ${itemsList}

    <div style="margin-top: 16px; text-align: right; font-size: 16px; font-weight: bold; color: #D4AF37;">
      Total Paid: ₹${data.total.toFixed(2)}
    </div>

    <h3 style="color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #332d25; padding-bottom: 6px; margin-top: 24px;">Delivery Destination</h3>
    <p style="color: #d4d4d4; font-size: 14px; line-height: 1.6; margin: 8px 0;">
      ${data.customer.name}<br>
      ${data.shipping.address}<br>
      ${data.shipping.city}, ${data.shipping.state} - ${data.shipping.pincode}
    </p>

    <div style="background-color: #211d19; border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 12px; color: #a8a29e; text-align: center;">
      Need assistance or have a query regarding delivery? Reach out to our dedicated support team at 
      <a href="mailto:${config.email.clientSupportEmail}" style="color: #D4AF37; text-decoration: none;">${config.email.clientSupportEmail}</a>.
    </div>
  </div>
</body>
</html>`;

  return dispatchEmail({
    to: data.customer.email,
    subject,
    html,
  });
}

/**
 * Dispatches Customer Contact/Support Inquiries to the Himroots Client Support Inbox
 */
export async function sendClientSupportInquiryEmail(
  data: SupportInquiryEmailData
): Promise<SendEmailResult> {
  const subject = `[Support] ${data.category} - ${data.name}`;

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0c0a09; color: #e5e5e5; margin: 0; padding: 24px;">
  <div style="max-width: 650px; margin: 0 auto; background-color: #171513; border: 1px solid #332d25; border-radius: 12px; overflow: hidden; padding: 28px;">
    <div style="border-bottom: 1px solid #332d25; padding-bottom: 16px; margin-bottom: 20px;">
      <span style="color: #D4AF37; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">Himroots Customer Care Portal</span>
      <h2 style="color: #ffffff; font-size: 20px; margin: 6px 0 0 0;">New Support Inquiry: ${data.category}</h2>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
      <tr>
        <td style="color: #a8a29e; width: 30%; padding: 6px 0;">Customer Name:</td>
        <td style="color: #ffffff; font-weight: bold;">${data.name}</td>
      </tr>
      <tr>
        <td style="color: #a8a29e; padding: 6px 0;">Email Address:</td>
        <td><a href="mailto:${data.email}" style="color: #D4AF37; text-decoration: none; font-weight: 500;">${data.email}</a></td>
      </tr>
      <tr>
        <td style="color: #a8a29e; padding: 6px 0;">Contact Phone:</td>
        <td style="color: #ffffff;">${data.phone || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="color: #a8a29e; padding: 6px 0;">Order Reference:</td>
        <td style="color: #ffffff; font-family: monospace;">${data.orderId || 'None'}</td>
      </tr>
      <tr>
        <td style="color: #a8a29e; padding: 6px 0;">Category:</td>
        <td><span style="display: inline-block; background-color: #26221c; color: #D4AF37; border: 1px solid #443c2c; padding: 2px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">${data.category}</span></td>
      </tr>
      <tr>
        <td style="color: #a8a29e; padding: 6px 0;">Submitted At:</td>
        <td style="color: #a8a29e;">${data.submittedAt}</td>
      </tr>
    </table>

    <div style="background-color: #211d19; border: 1px solid #332d25; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <div style="color: #D4AF37; font-size: 11px; text-transform: uppercase; font-weight: bold; margin-bottom: 8px; letter-spacing: 1px;">Customer Message:</div>
      <div style="color: #ffffff; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
    </div>

    <div style="text-align: center; padding-top: 12px; border-top: 1px solid #292524; font-size: 12px; color: #78716c;">
      To reply directly to this customer, simply click <strong>"Reply"</strong> in your email client.
    </div>
  </div>
</body>
</html>`;

  return dispatchEmail({
    to: config.email.clientSupportEmail,
    subject,
    html,
    replyTo: data.email,
  });
}
