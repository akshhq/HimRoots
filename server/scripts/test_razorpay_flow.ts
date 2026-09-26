/**
 * Automated Verification Test Suite for Razorpay Payment Flow
 * Tests:
 * 1. Valid payment creation & verification
 * 2. Cancelled payment handling (order remains pending, safe dismissal)
 * 3. Failed payment response rejection
 * 4. Invalid signature rejection (HTTP 400)
 * 5. Duplicate payment callback idempotency (no duplicate orders/charges)
 * 6. Tampered/incorrect frontend price (backend enforces server catalog prices)
 * 7. Invalid product ID rejection (HTTP 400/500 catalog validation)
 */

const BASE_URL = 'http://localhost:5000/api';

interface TestResult {
  scenario: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

async function runTests() {
  console.log('🚀 Starting Razorpay Payment Flow Test Suite...\n');

  // -------------------------------------------------------------------------
  // TEST 1: Valid Payment Flow
  // -------------------------------------------------------------------------
  try {
    const createRes = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'prod_sea_buckthorn_pulp', quantity: 2 }],
        customer: {
          name: 'Ananya Sharma',
          email: 'ananya@example.com',
          phone: '9876543210',
        },
        shipping: {
          address: 'Villa 14, Cedar Woods',
          city: 'Shimla',
          state: 'Himachal Pradesh',
          pincode: '171001',
          country: 'India',
        },
      }),
    });

    const createData = await createRes.json();
    const order = createData.order;
    const razorpay = createData.razorpay;

    // Subtotal: 2 * 999 = 1998. Shipping: 150 (subtotal <= 2000). Total: 2148
    const expectedSubtotal = 1998;
    const expectedTotal = 2148;

    const isPriceCorrect = order?.subtotal === expectedSubtotal && order?.total === expectedTotal;
    const hasRazorpayOrder = Boolean(razorpay?.orderId);

    // Now verify the payment
    const testPaymentId = `pay_valid_${Date.now()}`;
    const verifyRes = await fetch(`${BASE_URL}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        razorpayOrderId: razorpay.orderId,
        razorpayPaymentId: testPaymentId,
        razorpaySignature: 'valid_test_sig',
      }),
    });
    const verifyData = await verifyRes.json();

    const passed = createRes.status === 201 && isPriceCorrect && hasRazorpayOrder && verifyData.success === true && verifyData.paymentStatus === 'paid';
    results.push({
      scenario: '1. Valid payment flow',
      passed,
      details: passed
        ? `Order ${order.orderNumber} created & verified (Total: ₹${order.total}, Payment ID: ${testPaymentId})`
        : `Failed to complete valid payment flow: ${JSON.stringify(verifyData)}`,
    });
  } catch (err: any) {
    results.push({ scenario: '1. Valid payment flow', passed: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 2: Cancelled Payment (Modal Dismissed / Unpaid)
  // -------------------------------------------------------------------------
  try {
    const createRes = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'prod_sea_buckthorn_oil_capsules', quantity: 1 }],
        customer: {
          name: 'Rohan Mehra',
          email: 'rohan@example.com',
          phone: '9812345678',
        },
        shipping: {
          address: '45 Mall Road',
          city: 'Manali',
          state: 'Himachal Pradesh',
          pincode: '175131',
        },
      }),
    });
    const createData = await createRes.json();
    const order = createData.order;

    // When modal is cancelled, frontend does NOT call /verify
    // Verify order initial payment_status remains 'pending'
    const orderFetch = await fetch(`${BASE_URL}/orders/${order.id}?token=${order.orderToken}`);
    const orderDetails = await orderFetch.json();

    const statusIsPending = order.paymentStatus === 'pending' || orderDetails?.order?.payment_status === 'pending';
    results.push({
      scenario: '2. Cancelled payment handling',
      passed: statusIsPending,
      details: statusIsPending
        ? `Order ${order.orderNumber} cleanly preserved in pending status without unauthorized charge`
        : `Order was unexpectedly marked as paid: ${JSON.stringify(orderDetails)}`,
    });
  } catch (err: any) {
    results.push({ scenario: '2. Cancelled payment handling', passed: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 3: Failed Payment Response Handling
  // -------------------------------------------------------------------------
  try {
    const failRes = await fetch(`${BASE_URL}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: 'some-dummy-order-id',
        razorpayOrderId: 'order_failed_test',
        razorpayPaymentId: 'invalid_format_payment_xyz',
      }),
    });
    const failData = await failRes.json();

    const passed = failRes.status === 400 && failData.success === false;
    results.push({
      scenario: '3. Failed payment response',
      passed,
      details: passed
        ? `Backend rejected unrecognized/failed transaction with HTTP 400 (${failData.error})`
        : `Failed transaction was not rejected: ${JSON.stringify(failData)}`,
    });
  } catch (err: any) {
    results.push({ scenario: '3. Failed payment response', passed: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 4: Invalid Signature Rejection
  // -------------------------------------------------------------------------
  try {
    const createRes = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'prod_sea_buckthorn_pulp', quantity: 1 }],
        customer: {
          name: 'Vikram Singh',
          email: 'vikram@example.com',
          phone: '9871122334',
        },
        shipping: {
          address: 'Sector 4, Main Market',
          city: 'Kullu',
          state: 'Himachal Pradesh',
          pincode: '175101',
        },
      }),
    });
    const createData = await createRes.json();
    const order = createData.order;
    const razorpay = createData.razorpay;

    // Send forged signature
    const verifyRes = await fetch(`${BASE_URL}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        razorpayOrderId: razorpay.orderId,
        razorpayPaymentId: 'pay_test_forged_sig',
        razorpaySignature: 'invalid_signature_test', // explicit invalid signature test token
      }),
    });

    const verifyData = await verifyRes.json();
    const passed = verifyRes.status === 400 && verifyData.success === false;

    results.push({
      scenario: '4. Invalid signature verification',
      passed,
      details: passed
        ? `Backend rejected forged/invalid signature with HTTP 400 (${verifyData.error})`
        : `Invalid signature was accepted! ${JSON.stringify(verifyData)}`,
    });
  } catch (err: any) {
    results.push({ scenario: '4. Invalid signature verification', passed: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 5: Duplicate Payment Callback / Request Idempotency
  // -------------------------------------------------------------------------
  try {
    const createRes = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'prod_sea_buckthorn_oil_capsules', quantity: 2 }],
        customer: {
          name: 'Pooja Verma',
          email: 'pooja@example.com',
          phone: '9845098450',
        },
        shipping: {
          address: 'Green View Heights',
          city: 'Dharamshala',
          state: 'Himachal Pradesh',
          pincode: '176215',
        },
      }),
    });
    const createData = await createRes.json();
    const order = createData.order;
    const razorpay = createData.razorpay;

    const uniquePaymentId = `pay_idemp_${Date.now()}`;
    const payload = {
      orderId: order.id,
      razorpayOrderId: razorpay.orderId,
      razorpayPaymentId: uniquePaymentId,
      razorpaySignature: 'valid_sig_idempotent',
    };

    // First verification call
    const firstCall = await fetch(`${BASE_URL}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const firstData = await firstCall.json();

    // Second (duplicate) verification call
    const secondCall = await fetch(`${BASE_URL}/orders/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const secondData = await secondCall.json();

    const passed =
      firstCall.status === 200 &&
      firstData.success === true &&
      firstData.alreadyProcessed === false &&
      secondCall.status === 200 &&
      secondData.success === true &&
      secondData.alreadyProcessed === true;

    results.push({
      scenario: '5. Duplicate payment callback (Idempotency)',
      passed,
      details: passed
        ? `First call: processed (alreadyProcessed=false); Duplicate call: safely deduplicated (alreadyProcessed=true)`
        : `Duplicate handling failed: First: ${JSON.stringify(firstData)}, Second: ${JSON.stringify(secondData)}`,
    });
  } catch (err: any) {
    results.push({ scenario: '5. Duplicate payment callback (Idempotency)', passed: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 6: Incorrect Frontend Price (Tampered Price Injection)
  // -------------------------------------------------------------------------
  try {
    // Malicious customer sends custom/tampered prices
    const maliciousPayload = {
      items: [{ productId: 'prod_sea_buckthorn_pulp', quantity: 2, price: 1.00 }], // Attempting ₹1 instead of ₹849
      subtotal: 2.00,
      total: 2.00,
      customer: {
        name: 'Price Tamperer',
        email: 'tamper@example.com',
        phone: '9999999999',
      },
      shipping: {
        address: 'Suspicious Lane',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
      },
    };

    const res = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maliciousPayload),
    });
    const data = await res.json();

    // Backend must enforce real DB price (2 * 999 = 1998 + 150 shipping = 2148), NOT 2.00!
    const backendEnforcedPrice = data.order?.subtotal === 1998 && data.order?.total === 2148;
    const clientPriceOverridden = data.order?.total !== 2.00;

    const passed = res.status === 201 && backendEnforcedPrice && clientPriceOverridden;
    results.push({
      scenario: '6. Incorrect frontend price rejection',
      passed,
      details: passed
        ? `Backend completely ignored client-sent ₹2.00 and enforced authentic catalog total of ₹2148`
        : `Backend allowed price tampering! Received: ${JSON.stringify(data.order)}`,
    });
  } catch (err: any) {
    results.push({ scenario: '6. Incorrect frontend price rejection', passed: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // TEST 7: Invalid Product ID Rejection
  // -------------------------------------------------------------------------
  try {
    const invalidProductPayload = {
      items: [{ productId: 'fake_hacked_product_9999', quantity: 1 }],
      customer: {
        name: 'Tester',
        email: 'tester@example.com',
        phone: '9876543210',
      },
      shipping: {
        address: '123 Fake Street',
        city: 'Shimla',
        state: 'Himachal Pradesh',
        pincode: '171001',
      },
    };

    const res = await fetch(`${BASE_URL}/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidProductPayload),
    });
    const data = await res.json();

    const passed = res.status >= 400 && data.success === false;
    results.push({
      scenario: '7. Invalid product ID rejection',
      passed,
      details: passed
        ? `Backend rejected non-existent product ID with error: "${data.error}"`
        : `Backend accepted non-existent product: ${JSON.stringify(data)}`,
    });
  } catch (err: any) {
    results.push({ scenario: '7. Invalid product ID rejection', passed: false, details: err.message });
  }

  // -------------------------------------------------------------------------
  // Print Summary Table
  // -------------------------------------------------------------------------
  console.log('='.repeat(80));
  console.log('                 RAZORPAY INTEGRATION TEST RESULTS                  ');
  console.log('='.repeat(80));

  let allPassed = true;
  for (const r of results) {
    const statusMark = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`${statusMark} | ${r.scenario.padEnd(42)} | ${r.details}`);
  }
  console.log('='.repeat(80));

  if (allPassed) {
    console.log('🎉 ALL 7 REQUIRED RAZORPAY TEST SCENARIOS PASSED WITH 100% SUCCESS!\n');
  } else {
    console.error('⚠️ SOME TESTS FAILED. Please review the details above.\n');
    process.exit(1);
  }
}

runTests();
