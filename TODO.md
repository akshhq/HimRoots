# Himroots Wellness — Production Launch Roadmap & Task List

> **Status:** Code Complete & Production-Hardened  
> **Last Updated:** September 2026

---

## 1. Developer Tasks

### Priority 1 — Critical (Must Fix Before Real Money Moves)

- [x] **1. Remove the Payment Simulation Bypass**
  - *What Done Looks Like:* Deleted mock payment generator (`pay_sim_` / `mockPaymentId`) in `src/pages/Checkout.tsx`. When Razorpay SDK or keys fail to load, checkout is completely blocked and a clear error state ("Payment could not be initialized, please retry or contact support") is displayed.
  - *Files Touched:* [`src/pages/Checkout.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/Checkout.tsx)

- [x] **2. Enforce Strict Payment Mode Server-Side**
  - *What Done Looks Like:* Server refuses creation and verification of orders when `NODE_ENV === 'production'` if live Razorpay keys are not configured (`isRazorpayLiveConfigured`). Removed acceptance of arbitrary `pay_` or `test_` ID prefixes in production mode.
  - *Files Touched:* [`server/services/orderService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/orderService.ts), [`server/config/env.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/config/env.ts)

- [x] **3. Add Razorpay Webhook Handler**
  - *What Done Looks Like:* Mounted `POST /api/webhooks/razorpay` with raw request body capture (`req.rawBody`) for timing-safe HMAC SHA-256 signature verification via `RAZORPAY_WEBHOOK_SECRET`. Handles `payment.captured` and `order.paid` events idempotently to reconcile orders if the customer closes their browser tab mid-payment.
  - *Files Touched:* [`server/routes/webhooks.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/routes/webhooks.ts), [`server/index.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/index.ts), [`server/services/orderService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/orderService.ts)

- [x] **4. Fix IDOR on Order Lookup**
  - *What Done Looks Like:* Generates an HMAC SHA-256 access token at order creation time (`orderToken`), stores it, and returns it only to the creator. `GET /api/orders/:identifier` strictly requires and verifies `?token=` or `X-Order-Token` header using `crypto.timingSafeEqual`, preventing unauthorized order enumeration or PII snooping.
  - *Files Touched:* [`server/routes/orders.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/routes/orders.ts), [`server/controllers/orderController.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/controllers/orderController.ts), [`server/services/orderService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/orderService.ts), [`src/pages/Checkout.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/Checkout.tsx), [`src/pages/OrderSuccess.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/OrderSuccess.tsx)

---

### Priority 2 — Operational Reliability

- [x] **5. Wire `VITE_API_BASE_URL` Through Frontend**
  - *What Done Looks Like:* Created centralized `apiFetch` HTTP client in `src/lib/api.ts` that prepends `import.meta.env.VITE_API_BASE_URL || ''` to every API request. Replaced all raw `fetch("/api/...")` calls in the application.
  - *Files Touched:* [`src/lib/api.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/lib/api.ts), [`src/pages/Checkout.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/Checkout.tsx), [`src/pages/Contact.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/Contact.tsx), [`src/pages/OrderSuccess.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/OrderSuccess.tsx)

- [x] **6. Fix CORS Wildcard**
  - *What Done Looks Like:* Replaced wildcard `cors({ origin: '*' })` with an explicit allowlist restricted to `https://himroots.in` and `https://www.himroots.in`. Localhost origins (`localhost:5173`, etc.) are only permitted when `NODE_ENV !== 'production'`.
  - *Files Touched:* [`server/middleware/security.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/middleware/security.ts), [`server/index.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/index.ts)

- [x] **7. Fix Dual / Split-Brain Product Catalog**
  - *What Done Looks Like:* Connected `Shop.tsx` and `ProductDetails.tsx` to `GET /api/products` as primary data source via `getStoreProducts()` and `getStoreProductBySlug()`, querying the database first and retaining `src/data/products.ts` solely as an offline/error fallback with clear code comments.
  - *Files Touched:* [`src/lib/supabase.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/lib/supabase.ts), [`src/pages/Shop.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/Shop.tsx), [`src/pages/ProductDetails.tsx`](file:///d:/Clg/Client%20Work/HimRoots/src/pages/ProductDetails.tsx)

- [x] **8. Implement Stock Decrementing**
  - *What Done Looks Like:* In both the `/api/orders/verify` route and the Razorpay webhook handler, stock quantities are atomically decremented in PostgreSQL and local state when an order transitions to `'paid'`, with an idempotency guard preventing double-decrementing on duplicate callbacks.
  - *Files Touched:* [`server/services/orderService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/orderService.ts), [`server/services/productService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/productService.ts)

- [x] **9. Make Backend Production-Buildable**
  - *What Done Looks Like:* Added `npm run build:server` (`esbuild server/index.ts --platform=node --bundle --packages=external --outfile=dist-server/index.js`) and `"start": "node dist-server/index.js"`. Enables clean execution in production environments using `npm install --omit=dev` without TypeScript devDependencies.
  - *Files Touched:* [`package.json`](file:///d:/Clg/Client%20Work/HimRoots/package.json), [`DEPLOYMENT.md`](file:///d:/Clg/Client%20Work/HimRoots/DEPLOYMENT.md)

- [x] **10. Replace In-Memory State with Persistent Storage**
  - *What Done Looks Like:* Added `payment_idempotency` and `rate_limits` distributed tables with RLS and automated cleanup in `supabase/schema.sql`. Updated `rateLimiter.ts` to query `public.rate_limits` and `orderService.ts` to persist processed payment IDs in `public.payment_idempotency`, retaining in-memory Maps only as L1 caching / offline fallbacks.
  - *Files Touched:* [`supabase/schema.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/schema.sql), [`server/middleware/rateLimiter.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/middleware/rateLimiter.ts), [`server/services/orderService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/orderService.ts)

---

### Additional Security & Backend Hardening

- [x] **11. Add Security Headers & Content Security Policy (CSP)**
  - *What Done Looks Like:* Configured custom Helmet-style security middleware setting strict headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS) and Content Security Policy permitting required Razorpay checkout scripts and domains (`checkout.razorpay.com`, `api.razorpay.com`, `lumberjack.razorpay.com`).
  - *Files Touched:* [`server/middleware/security.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/middleware/security.ts), [`server/index.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/index.ts)

- [x] **12. Add Deep Input Sanitization Against Stored XSS**
  - *What Done Looks Like:* Created `sanitizeText()` in `validation.ts` to strip `<script>`, `<style>`, `<iframe>`, inline event handlers, and HTML tags from customer notes, address fields, and contact form messages before inserting into PostgreSQL.
  - *Files Touched:* [`server/middleware/validation.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/middleware/validation.ts), [`server/controllers/contactController.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/controllers/contactController.ts)

- [x] **13. Add Graceful Shutdown Handling (SIGTERM/SIGINT)**
  - *What Done Looks Like:* Configured `process.on('SIGTERM')` and `process.on('SIGINT')` in `server/index.ts` to cleanly close the HTTP server and drain in-flight requests on deployment restarts, with a 10-second timeout safeguard.
  - *Files Touched:* [`server/index.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/index.ts)

- [x] **14. Fix Order Number Generator Race Condition**
  - *What Done Looks Like:* Replaced the potential collision pattern in `supabase/schema.sql` with an atomic PostgreSQL sequence (`order_number_seq`) combined with UTC date and an iterative existence check loop, guaranteeing collision-free unique order numbers even under high concurrency or direct SQL execution.
  - *Files Touched:* [`supabase/schema.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/schema.sql)

---

## 2. Client Tasks (Non-Technical / Business Owner)

This section contains step-by-step instructions written for the business owner. No programming knowledge is required to complete these steps.

### Step 1: Set Up the Database (Supabase)
The database stores your products, customer orders, shipping addresses, and contact messages.

- [ ] **Create a Supabase Account:** Go to [supabase.com](https://supabase.com) and click **Start your project**.
- [ ] **Create New Project:**
  - Name: `Himroots-Production`
  - Database Password: Choose a strong password and save it somewhere secure.
  - Region: Select **ap-south-1 (Mumbai)** for fastest speed in India.
  - Pricing Plan: Free tier is sufficient for launch.
- [ ] **Run the Database Setup Script:**
  - In the left sidebar, click the **SQL Editor** (icon looks like `>_`).
  - Open the file [`supabase/schema.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/schema.sql) from this project folder, copy all text, paste it into the editor, and click **Run**.
  - Open the file [`supabase/seed.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/seed.sql), copy all text, paste it into the editor, and click **Run** (this loads your initial product catalog).
- [ ] **Save Your Keys for the Developer:**
  - In the left sidebar, click **Project Settings** (gear icon) > **API**.
  - Copy the **Project URL** (e.g., `https://abcdefgh.supabase.co`).
  - Copy the **anon / public** key.
  - Copy the **service_role** key (keep this strictly private — only share with your lead developer).

---

### Step 2: Complete Razorpay KYC & Generate Live Keys
Razorpay processes UPI, Credit/Debit cards, and NetBanking payments.

- [ ] **Complete Business Verification (KYC):**
  - Log in to your dashboard at [dashboard.razorpay.com](https://dashboard.razorpay.com).
  - Submit your business registration documents, PAN, GSTIN (if applicable), and bank account details.
  - Wait for Razorpay's approval email confirming "Live Payments Activated".
- [ ] **Enable Payment Methods:**
  - In the Razorpay dashboard, navigate to **Account & Settings > Payment Methods**.
  - Ensure **UPI** (Google Pay, PhonePe, Paytm, BHIM), **Cards** (Visa, Mastercard, RuPay), and **NetBanking** are all toggled ON.
- [ ] **Generate Live API Keys:**
  - Go to **Account & Settings > API Keys**.
  - Click **Generate Live Key** (ensure your toggle at top is on "Live Mode", not "Test Mode").
  - Copy the **Key ID** (starts with `rzp_live_...`).
  - Copy the **Key Secret** (only shown once — save it in a secure password manager).
- [ ] **Set Up Webhook for Instant Order Reconciliation:**
  - Go to **Account & Settings > Webhooks**.
  - Click **Add New Webhook**.
  - Webhook URL: Enter your live backend webhook URL (e.g., `https://api.himroots.in/api/webhooks/razorpay` or your hosting URL like `https://himroots-api.onrender.com/api/webhooks/razorpay`).
  - Secret: Create a strong random password (e.g., `HimrootsSecret_2026_Live`) and save it as your `RAZORPAY_WEBHOOK_SECRET`.
  - Active Events: Check the boxes for `payment.captured` and `order.paid`.
  - Click **Save Webhook**.

---

### Step 3: Transactional Email Setup (Resend or Brevo)
Sends automated order receipts to customers and alerts your warehouse team when an order is placed.

- [ ] **Create an Account:** Sign up at [resend.com](https://resend.com) (recommended) or [brevo.com](https://brevo.com).
- [ ] **Add Your Website Domain:**
  - In the dashboard, click **Domains > Add Domain**.
  - Enter: `himroots.in`.
- [ ] **Add DNS Records (Domain Verification):**
  - The email service will provide 3 DNS records: **DKIM**, **SPF**, and **DMARC**.
  - Add these records into your domain management panel (GoDaddy, Namecheap, Hostinger, Cloudflare, etc.).
  - Wait 10–30 minutes until the domain status shows green: **"Verified"**.
- [ ] **Generate API Key:**
  - Go to **API Keys > Create API Key**.
  - Name it `Himroots Production` with "Full Access".
  - Copy the secret key (starts with `re_...`).
- [ ] **Confirm Official Email Inboxes:**
  - Ensure your email accounts are active and monitored:
    - **Order Alerts:** `orders@himroots.in` (receives new customer delivery addresses).
    - **Customer Support:** `support@himroots.in` (receives inquiries from the Contact form).

---

### Step 4: Confirm Domain DNS Management
- [ ] **Identify Your DNS Host:** Confirm who owns access to your domain's DNS manager (e.g. GoDaddy, Hostinger, Cloudflare).
- [ ] **Prepare Subdomain (if applicable):** If the backend is hosted at `api.himroots.in`, create a CNAME record in your DNS pointing `api` to your backend host (e.g. Render/Railway).

---

### Step 5: End-to-End Live Launch Smoke Test
Perform this test once the site is deployed, before announcing it publicly.

- [ ] **Create a ₹1 Test Formulation or Order:**
  - Visit the live website at `https://himroots.in`.
  - Add a product to your cart and proceed to Checkout.
  - Enter real shipping information.
- [ ] **Pay with Real Money:**
  - Open the Razorpay popup and complete payment using your personal UPI app (Google Pay / PhonePe) or debit card.
- [ ] **Verify 4 Things Immediately:**
  - [ ] You are redirected to the order confirmation screen displaying your order number (e.g. `HM-20260926-XXXXX`).
  - [ ] Customer confirmation email arrives in your personal inbox.
  - [ ] Delivery notification email arrives at `orders@himroots.in` with your full shipping address and phone number.
  - [ ] The order appears marked as `paid` in your Supabase Orders table.
- [ ] **Test the Refund:**
  - Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com).
  - Find the transaction and click **Issue Refund**.
  - Confirm the money returns to your bank account within the standard bank turnaround time.
