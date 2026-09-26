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

    // Verify order in database lookup
    const lookupAfterPayRes = await fetch(`${baseUrl}/api/orders/${order1.id}`);
    const lookupAfterPay = await lookupAfterPayRes.json();
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
    // 5. Payment Flow: Invalid Signature Rejection
    // -------------------------------------------------------------
    console.log('\n--- 5. Payment: Invalid Signature Handling ---');
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
    const lookupOrder2 = await (await fetch(`${baseUrl}/api/orders/${order2.id}`)).json();
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

    // Test successful dispatch simulation
    const emailSuccessRes = await sendClientOrderNotificationEmail(mockEmailPayload);
    assert(emailSuccessRes.success === true, 'Client order notification email dispatched successfully');

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
    const lookupOrder3 = await (await fetch(`${baseUrl}/api/orders/${order3.id}`)).json();
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
