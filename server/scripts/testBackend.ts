import app from '../index';
import type { Server } from 'http';
import { sendClientOrderNotificationEmail } from '../services/emailService';

async function runTests() {
  console.log('🧪 Starting Himroots Complete Integration Test Suite (Payment, Email, Support)...\n');

  const server: Server = app.listen(0);
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 5000;
  const baseUrl = `http://127.0.0.1:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, extra?: any) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`, extra || '');
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // 1. Health & Product API
    // -------------------------------------------------------------
    console.log('--- 1. Health & Product Verification ---');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert(healthRes.status === 200, 'GET /api/health returns 200');

    const productsRes = await fetch(`${baseUrl}/api/products`);
    const productsData = await productsRes.json();
    assert(productsRes.status === 200, 'GET /api/products returns 200');
    assert(Array.isArray(productsData.data) && productsData.data.length > 0, 'Products list non-empty');
    const testProduct = productsData.data[0];

    // -------------------------------------------------------------
    // 2. Order Creation & Razorpay Order Generation
    // -------------------------------------------------------------
    console.log('\n--- 2. Order Creation & Price Authority ---');
    const createOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 2, price: 1, total: 1 }], // Client tries spoofing price
        customer: { name: 'Aarav Sharma', email: 'aarav@himroots.in', phone: '9816012345' },
        shipping: { address: 'Forest Rest House Road', city: 'Manali', state: 'Himachal Pradesh', pincode: '175131', country: 'India' },
      }),
    });

    const createOrderData = await createOrderRes.json();
    assert(createOrderRes.status === 201, 'Order created with 201');
    assert(createOrderData.success === true, 'Order creation returns success: true');
    const order1 = createOrderData.order;
    const razorpay1 = createOrderData.razorpay;

    const expectedSubtotal = testProduct.price * 2;
    const expectedShipping = expectedSubtotal > 2000 ? 0 : 150;
    const expectedTotal = expectedSubtotal + expectedShipping;

    assert(order1.subtotal === expectedSubtotal, `Authentic subtotal calculated: ₹${order1.subtotal}`);
    assert(order1.shippingFee === expectedShipping, `Authentic shipping calculated: ₹${order1.shippingFee}`);
    assert(order1.total === expectedTotal, `Authentic total calculated: ₹${order1.total}`);
    assert(order1.paymentStatus === 'pending', 'Order paymentStatus initialized to pending');
    assert(Boolean(razorpay1?.orderId), `Razorpay order ID generated: ${razorpay1?.orderId}`);
    assert(razorpay1?.amount === Math.round(expectedTotal * 100), `Razorpay amount in paise: ${razorpay1?.amount}`);

    // -------------------------------------------------------------
    // 3. Payment Flow: Successful Payment & Signature Verification
    // -------------------------------------------------------------
    console.log('\n--- 3. Payment: Successful Verification ---');
    const paymentId1 = `pay_test_${Date.now()}_success`;
    const verifyRes = await fetch(`${baseUrl}/api/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order1.id,
        razorpayOrderId: razorpay1.orderId,
        razorpayPaymentId: paymentId1,
        razorpaySignature: 'simulated_test_signature',
      }),
    });

    const verifyData = await verifyRes.json();
    assert(verifyRes.status === 200, 'POST /api/orders/verify returns 200');
    assert(verifyData.success === true, 'Payment verification returns success: true');
    assert(verifyData.paymentStatus === 'paid', 'Payment status marked as paid');
    assert(verifyData.orderStatus === 'processing', 'Order fulfillment status updated to processing');

    // Verify IDOR Protection: reject requests without token or with forged token
    const unauthLookupRes = await fetch(`${baseUrl}/api/orders/${order1.id}`);
    assert(unauthLookupRes.status === 401, 'Order lookup without token rejected with 401 (IDOR protection)');

    const badTokenLookupRes = await fetch(`${baseUrl}/api/orders/${order1.id}?token=forged_token_xyz`);
    assert(badTokenLookupRes.status === 403, 'Order lookup with invalid token rejected with 403 (IDOR protection)');

    const guessedNumberLookupRes = await fetch(`${baseUrl}/api/orders/${order1.orderNumber}`);
    assert(
      guessedNumberLookupRes.status === 401 || guessedNumberLookupRes.status === 403,
      'Guessed sequential order number without token rejected with 401/403 (IDOR protection)'
    );

    // Verify order in database lookup with valid signed token
    const lookupAfterPayRes = await fetch(`${baseUrl}/api/orders/${order1.id}?token=${order1.orderToken}`);
    const lookupAfterPay = await lookupAfterPayRes.json();
    assert(lookupAfterPayRes.status === 200, 'Order lookup with valid signed token returns 200');
    assert(lookupAfterPay.order.payment_status === 'paid', 'Database order confirmed as paid');
    assert(lookupAfterPay.order.order_status === 'processing', 'Database order status confirmed as processing');

    // -------------------------------------------------------------
    // 4. Duplicate Payment Prevention / Idempotency
    // -------------------------------------------------------------
    console.log('\n--- 4. Payment: Duplicate Callback Prevention (Idempotency) ---');
    const duplicateRes = await fetch(`${baseUrl}/api/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order1.id,
        razorpayOrderId: razorpay1.orderId,
        razorpayPaymentId: paymentId1, // Exact same payment ID
        razorpaySignature: 'simulated_test_signature',
      }),
    });

    const duplicateData = await duplicateRes.json();
    assert(duplicateRes.status === 200, 'Duplicate request handled with 200');
    assert(duplicateData.alreadyProcessed === true, 'Duplicate payment safely identified as already processed');
    assert(duplicateData.paymentStatus === 'paid', 'Payment status remains paid without corrupting state');

    // -------------------------------------------------------------
    // 5. Cash on Delivery (COD) Policy Enforcement
    // -------------------------------------------------------------
    console.log('\n--- 5. Cash on Delivery (COD) Policy Enforcement ---');
    const codOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        customer: { name: 'Rohan Mehra', email: 'rohan@example.com', phone: '9816012345' },
        shipping: { address: 'The Mall', city: 'Shimla', state: 'Himachal Pradesh', pincode: '171001' },
        paymentMethod: 'cod',
      }),
    });
    const codOrderData = await codOrderRes.json();
    assert(codOrderRes.status === 400, 'COD order request is strictly rejected with 400 Bad Request');
    assert(codOrderData.success === false, 'COD order returns success: false');
    assert(
      codOrderData.error && codOrderData.error.toLowerCase().includes('cash on delivery'),
      'COD order returns clear explanation that COD is disabled in favor of prepaid Razorpay'
    );

    const unsupportedPaymentRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        customer: { name: 'Rohan Mehra', email: 'rohan@example.com', phone: '9816012345' },
        shipping: { address: 'The Mall', city: 'Shimla', state: 'Himachal Pradesh', pincode: '171001' },
        paymentMethod: 'bitcoin',
      }),
    });
    assert(unsupportedPaymentRes.status === 400, 'Arbitrary unsupported payment methods rejected with 400');

    // -------------------------------------------------------------
    // 6. Payment Flow: Invalid Signature Rejection
    // -------------------------------------------------------------
    console.log('\n--- 6. Payment: Invalid Signature Handling ---');
    // Create new order for invalid signature test
    const createOrder2Res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        customer: { name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543210' },
        shipping: { address: 'The Ridge', city: 'Shimla', state: 'Himachal Pradesh', pincode: '171001' },
      }),
    });
    const order2 = (await createOrder2Res.json()).order;

    const invalidSigRes = await fetch(`${baseUrl}/api/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order2.id,
        razorpayOrderId: 'order_test_fake',
        razorpayPaymentId: 'invalid_test_payment_id',
        razorpaySignature: 'invalid_signature_test',
      }),
    });

    const invalidSigData = await invalidSigRes.json();
    assert(invalidSigRes.status === 400, 'Invalid signature rejected with 400');
    assert(invalidSigData.success === false, 'Invalid signature returns success: false');

    // Verify order 2 was NOT marked as paid
    const lookupOrder2 = await (await fetch(`${baseUrl}/api/orders/${order2.id}?token=${order2.orderToken}`)).json();
    assert(lookupOrder2.order.payment_status === 'pending' || lookupOrder2.order.payment_status === 'failed', 'Unverified order is not marked paid');

    // -------------------------------------------------------------
    // 6. Payment Flow: Missing Required Verification Parameters
    // -------------------------------------------------------------
    console.log('\n--- 6. Payment: Missing Parameter Validation ---');
    const missingParamsRes = await fetch(`${baseUrl}/api/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: order2.id }), // missing razorpayOrderId and razorpayPaymentId
    });
    assert(missingParamsRes.status === 400, 'Missing verification parameters rejected with 400');

    // -------------------------------------------------------------
    // 7. Email: Direct Dispatch & Simulated Failure Test
    // -------------------------------------------------------------
    console.log('\n--- 7. Email: Direct Dispatch & Failure Hooks ---');
    const mockEmailPayload = {
      orderNumber: 'HM-20260925-TEST',
      orderDateTime: '25 Sep 2026, 1:00 PM',
      paymentStatus: 'PAID',
      customer: { name: 'Aarav Sharma', email: 'aarav@example.com', phone: '9816012345' },
      shipping: { address: 'Mall Road', city: 'Shimla', state: 'HP', pincode: '171001' },
      items: [{ productName: testProduct.name, quantity: 1, price: testProduct.price, subtotal: testProduct.price }],
      subtotal: testProduct.price,
      shippingFee: 150,
      discount: 0,
      total: testProduct.price + 150,
      razorpayOrderId: 'order_mock_123',
      razorpayPaymentId: 'pay_mock_123',
    };

    // Test dispatch handling (checks success or clean handling when domain is awaiting DNS verification)
    const emailSuccessRes = await sendClientOrderNotificationEmail(mockEmailPayload);
    assert(
      emailSuccessRes.success === true || (emailSuccessRes.error && emailSuccessRes.error.includes('domain is not verified')),
      'Client order notification email dispatched or recognized pending domain verification'
    );

    // Test email provider failure simulation hook
    const emailFailRes = await sendClientOrderNotificationEmail({
      ...mockEmailPayload,
      customer: { ...mockEmailPayload.customer, email: 'simulate_fail@test.com' },
    });
    assert(emailFailRes.success === false, 'Email failure simulation accurately reports success: false');

    // -------------------------------------------------------------
    // 8. Critical Requirement: Payment Success + Email Failure
    // -------------------------------------------------------------
    console.log('\n--- 8. Critical Requirement: Payment Success + Email Failure ---');
    // Order where email fails, but payment MUST remain paid
    const createOrder3Res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        customer: { name: 'Kavita Rawat', email: 'simulate_fail@customer.com', phone: '9876543210' },
        shipping: { address: 'Lower Bazaar', city: 'Kullu', state: 'Himachal Pradesh', pincode: '175101' },
      }),
    });
    const order3Data = await createOrder3Res.json();
    const order3 = order3Data.order;
    const razorpay3 = order3Data.razorpay;

    const emailFailPayRes = await fetch(`${baseUrl}/api/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order3.id,
        razorpayOrderId: razorpay3.orderId,
        razorpayPaymentId: `pay_test_${Date.now()}_email_fail`,
        razorpaySignature: 'simulated_test_signature',
      }),
    });

    const emailFailPayData = await emailFailPayRes.json();
    assert(emailFailPayRes.status === 200, 'Customer receives 200 even if notification email fails');
    assert(emailFailPayData.success === true, 'Response reports success: true');
    assert(emailFailPayData.paymentStatus === 'paid', 'Order response reports paid');

    // Verify order in store/database still reports paid
    const lookupOrder3 = await (await fetch(`${baseUrl}/api/orders/${order3.id}?token=${order3.orderToken}`)).json();
    assert(lookupOrder3.order.payment_status === 'paid', 'CRITICAL: Database payment_status remains PAID');

    // -------------------------------------------------------------
    // 9. Customer Support Form
    // -------------------------------------------------------------
    console.log('\n--- 9. Customer Support Form ---');
    // Valid submission
    const validSupportRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sunita Verma',
        email: 'sunita@example.com',
        phone: '9876543210',
        orderId: order1.orderNumber,
        category: 'Delivery Issue',
        message: 'Could you please confirm the courier tracking dispatch date?',
      }),
    });
    assert(validSupportRes.status === 201, 'Valid support inquiry submitted with 201');
    const validSupportData = await validSupportRes.json();
    assert(validSupportData.success === true, 'Support response success: true');

    // Invalid submission: missing required message & invalid email
    const invalidSupportRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'S', // too short
        email: 'invalid-email',
        message: 'Hi', // too short
      }),
    });
    assert(invalidSupportRes.status === 400, 'Invalid support form rejected with 400');

    // Spam honeypot trap
    const spamSupportRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Spam Bot',
        email: 'spammer@bot.com',
        message: 'Buy cheap watches now!',
        honeypot: 'bot_filled_field',
      }),
    });
    const spamData = await spamSupportRes.json();
    assert(spamSupportRes.status === 200, 'Spam bot dropped silently with 200');
    assert(spamData.success === true, 'Spam response reports clean receipt without emailing client');

    // -------------------------------------------------------------
    // 10. Webhook Reconciliation & Stock Decrementing Test
    // -------------------------------------------------------------
    console.log('\n--- 10. Webhook Reconciliation & Stock Decrementing ---');
    // Create new order to be reconciled purely via webhook (simulating user closed browser tab)
    const createWebhookOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 2 }],
        customer: { name: 'Karan Joshi', email: 'karan@example.com', phone: '9816099999' },
        shipping: { address: 'Forest Road', city: 'Manali', state: 'Himachal Pradesh', pincode: '175131' },
      }),
    });
    const webhookOrderData = await createWebhookOrderRes.json();
    const webhookOrder = webhookOrderData.order;
    const webhookRazorpay = webhookOrderData.razorpay;

    // Send payment.captured webhook payload
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: `pay_webhook_${Date.now()}`,
            order_id: webhookRazorpay.orderId,
            amount: webhookRazorpay.amount,
            status: 'captured',
            notes: {
              orderId: webhookOrder.id,
              orderNumber: webhookOrder.orderNumber,
            },
          },
        },
      },
    };

    const webhookRes = await fetch(`${baseUrl}/api/webhooks/razorpay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'test_webhook_sig',
      },
      body: JSON.stringify(webhookPayload),
    });

    const webhookData = await webhookRes.json();
    assert(webhookRes.status === 200, 'POST /api/webhooks/razorpay returned 200');
    assert(webhookData.success === true, 'Webhook reconciled payment successfully');
    assert(webhookData.alreadyProcessed === false, 'Webhook processed new payment cleanly');

    // Verify order state was updated to paid & processing via webhook alone
    const lookupWebhookOrder = await (await fetch(`${baseUrl}/api/orders/${webhookOrder.id}?token=${webhookOrder.orderToken}`)).json();
    assert(lookupWebhookOrder.order.payment_status === 'paid', 'Order verified as paid via webhook');
    assert(lookupWebhookOrder.order.order_status === 'processing', 'Order status moved to processing via webhook');

    // Duplicate webhook test (Idempotency)
    const duplicateWebhookRes = await fetch(`${baseUrl}/api/webhooks/razorpay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'test_webhook_sig',
      },
      body: JSON.stringify(webhookPayload),
    });
    const duplicateWebhookData = await duplicateWebhookRes.json();
    assert(duplicateWebhookRes.status === 200, 'Duplicate webhook handled with 200');
    assert(duplicateWebhookData.alreadyProcessed === true, 'Duplicate webhook safely flagged as alreadyProcessed');

    // Invalid webhook signature rejection test
    const invalidWebhookSigRes = await fetch(`${baseUrl}/api/webhooks/razorpay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'invalid_webhook_sig',
      },
      body: JSON.stringify({ event: 'payment.captured', payload: {} }),
    });
    assert(invalidWebhookSigRes.status === 400, 'Webhook with invalid signature strictly rejected with 400');

    // -------------------------------------------------------------
    // 11. Production Mode Guard Enforcement
    // -------------------------------------------------------------
    console.log('\n--- 11. Production Mode Guard: Refusal without Live Credentials ---');
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    // Verify createOrder throws error in production without live keys
    const prodCreateOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        customer: { name: 'Prod Test', email: 'prod@example.com', phone: '9876543210' },
        shipping: { address: 'Prod Address', city: 'Shimla', state: 'HP', pincode: '171001' },
      }),
    });
    assert(
      prodCreateOrderRes.status === 500 || prodCreateOrderRes.status === 400,
      'Order creation strictly blocked in production without live Razorpay keys'
    );

    // Verify verifyOrder throws/rejects in production without live keys
    const prodVerifyRes = await fetch(`${baseUrl}/api/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: 'some-order-id',
        razorpayOrderId: 'order_prod_test',
        razorpayPaymentId: 'pay_prod_test',
        razorpaySignature: 'simulated_test_signature',
      }),
    });
    assert(
      prodVerifyRes.status === 500 || prodVerifyRes.status === 400,
      'Payment verification strictly refused in production without live Razorpay keys'
    );

    // Restore development environment
    process.env.NODE_ENV = originalNodeEnv;

    // -------------------------------------------------------------
    // 12. Input Sanitization & Stored XSS Neutralization
    // -------------------------------------------------------------
    console.log('\n--- 12. Input Sanitization & Stored XSS Neutralization ---');
    const xssContactRes = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Safe User <script>alert("hacked")</script>',
        email: 'xss-safe@example.com',
        phone: '9876543210',
        category: 'General Enquiry',
        message: 'Hello <img src=x onerror=alert(1)> from Himroots inquiry form!',
      }),
    });
    assert(xssContactRes.status === 201, 'Sanitized inquiry processed successfully (201)');

    const xssOrderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: testProduct.id, quantity: 1 }],
        customer: {
          name: 'Jane Doe <script>evil()</script>',
          email: 'janexss@example.com',
          phone: '9876543210',
        },
        shipping: {
          address: 'Mall Road <iframe src="evil.com"></iframe> Apt 4B',
          city: 'Manali',
          state: 'Himachal Pradesh',
          pincode: '175131',
        },
      }),
    });
    const xssOrderData = await xssOrderRes.json();
    assert(xssOrderRes.status === 201, 'Order with XSS payload sanitized and created');
    assert(xssOrderData.order.customer.name === 'Jane Doe', 'Customer name stripped of script tags');
    assert(xssOrderData.order.shipping.address === 'Mall Road Apt 4B', 'Shipping address stripped of iframe tags');

    console.log(`\n=======================================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} passed, ${failed} failed`);
    console.log(`=======================================================\n`);
  } catch (err) {
    console.error('💥 Test suite exception:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
