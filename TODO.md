# Implementation & Setup Roadmap — Himroots Wellness E-Commerce Platform

This document serves as the master tracking guide for the Himroots Wellness e-commerce platform. It clearly delineates what has been **completed automatically**, what the **client must configure manually**, what the **developer must configure manually**, what must be **tested in production**, and **future recommendations** outside the current project scope.

---

## 1. What Has Been Completed Automatically

The entire full-stack e-commerce architecture has been integrated, audited, and verified across frontend, backend, database schemas, payment processing, email notifications, and customer support.

### Frontend Integration (Existing UI Preserved & Wired)
- [x] **Catalog & Product Details (`src/pages/Shop.tsx`, `src/pages/ProductDetail.tsx`)**: Wired to use centralized catalog data with dynamic image previews, benefit badges, ingredient percentage breakdowns, and stock availability indicators.
- [x] **Persistent Shopping Cart (`src/store/cartStore.ts`, `src/pages/Cart.tsx`)**: Client-side state managed via Zustand and backed by `localStorage` persistence. Real-time subtotal calculations, item quantity controls, and free shipping progress meter.
- [x] **Checkout System (`src/pages/Checkout.tsx`)**: Form validation for customer details (name, email, phone, 6-digit Indian PIN code, full address), order notes support, dynamic Razorpay modal launch, and simulated mock fallback for offline development.
- [x] **Order Success Screen (`src/pages/OrderSuccess.tsx`)**: Displays confirmed order number (`HM-YYYYMMDD-XXXX`), line-item breakdown, shipping destination, payment method, and direct support links.
- [x] **Contact & Support Portal (`src/pages/Contact.tsx`)**: Comprehensive inquiry form supporting 7 support categories, optional order reference ID, honeypot anti-spam trap, and submission status feedback.
- [x] **Navigation Bar**: Pure black theme applied with seamless mobile drawer and desktop navigation links.
- [x] **Static Fallbacks**: Graceful degradation throughout all UI components if backend or database services are temporarily offline.
- [x] **Apache `.htaccess` SPA Routing (`public/.htaccess`)**: Configured `mod_rewrite` for Apache `/public_html/` deployments to rewrite direct client route requests (e.g. `/cart`, `/products`, `/about`, `/contact`, `/checkout`) to `/index.html` without changing the browser URL, while continuing to serve real static assets directly. Automatically copied to `dist/.htaccess` during `npm run build`.

### Backend / API Layer (`server/`)
- [x] **Express Application Architecture (`server/index.ts`)**: Structured Node.js + Express backend with JSON body parsing, CORS middleware, request logging, and unified error handling.
- [x] **Environment Configuration (`server/config/env.ts`)**: Segregation of public frontend variables from private server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `EMAIL_API_KEY`).
- [x] **Products API (`server/routes/products.ts`, `server/services/productService.ts`)**:
  - `GET /api/products`: Retrieves all active products from Supabase with static catalog fallback.
  - `GET /api/products/:identifier`: Retrieves individual product by slug or ID.
- [x] **Orders & Payments API (`server/routes/orders.ts`, `server/services/orderService.ts`)**:
  - `POST /api/orders/create`: Server-side price authority (ignores client-sent prices, queries authentic catalog prices, computes subtotals in paise, applies free shipping logic for orders ≥ ₹2,000, generates unique `HM-YYYYMMDD-XXXX` order number, initializes Razorpay order, persists pending order in Supabase).
  - `POST /api/orders/verify`: Cryptographic verification of Razorpay payment signature using timing-safe HMAC SHA256 comparison. Updates order to `payment_status: 'paid'`.
  - `GET /api/orders/:identifier`: Secure order receipt retrieval by UUID or order number.
  - **Idempotency Protection**: Duplicate payment webhooks/callbacks are safely deduplicated without state corruption (`alreadyProcessed: true`).
  - **In-Memory Store Fallback**: Offline/local development store (`localOrdersStore`) when database credentials are not present.
- [x] **Contact & Support API (`server/routes/contact.ts`)**:
  - `POST /api/contact`: Form input validation, 7 category classifications, honeypot bot trap validation, IP/email rate limiting (max 5 submissions per 15 minutes), Supabase persistence to `contact_inquiries`, and email alert dispatch to client support.
- [x] **Health Check Endpoint (`server/index.ts`)**:
  - `GET /api/health`: Real-time diagnostic reporting on Supabase and Razorpay integration statuses.

### Database Layer (`supabase/`)
- [x] **Relational Schema (`supabase/schema.sql`)**: 4 fully normalized tables:
  - `products`: Product catalog, pricing, nutritional details, image arrays, stock status.
  - `orders`: Order header, customer contact, delivery address, financial totals, payment status, Razorpay tracking IDs.
  - `order_items`: Immutable line-item snapshots (price and name recorded at time of purchase).
  - `contact_inquiries`: Customer support messages with category, order reference, and resolution status.
- [x] **Seed Data (`supabase/seed.sql`)**: Production seed dataset for Himroots' 2 flagship formulations with idempotency (`ON CONFLICT (id) DO UPDATE`).
- [x] **Automated Order Number Generation**: PostgreSQL PL/pgSQL function `public.generate_order_number()` generating daily sequenced identifiers (`HM-YYYYMMDD-XXXX`).
- [x] **Row Level Security (RLS)**:
  - `products`: Public read-only (`SELECT`), restricted write.
  - `orders`: Public read/write completely blocked (`USING (false)`). Managed exclusively via server `service_role`.
  - `order_items`: Public read/write completely blocked. Managed exclusively via server `service_role`.
  - `contact_inquiries`: Public insert enabled (`WITH CHECK (true)`), public read completely blocked.
- [x] **Database Performance**: B-tree indexes on `products(slug)`, `orders(order_number)`, `orders(email)`, `orders(razorpay_order_id)`, `order_items(order_id)`, and `contact_inquiries(status)`.

### Transactional Email System (`server/services/emailService.ts`)
- [x] **Multi-Provider Support**: Pluggable provider architecture supporting **Resend** (default) and **Brevo** via native REST APIs without heavy SDK bloat.
- [x] **Simulation Mode**: Automatic console mock logger when API keys are absent, allowing frictionless local development.
- [x] **Client Order Notification Email**: Dispatched to `CLIENT_ORDER_EMAIL` (`orders@himroots.com`) with subject `New Order - {Order Number}`, containing customer details, shipping address, line items, totals, and Razorpay transaction IDs.
- [x] **Customer Order Confirmation Email**: Dispatched to customer email with itemized receipt, order reference, and customer care details.
- [x] **Payment-Email Decoupling**: Order `payment_status: 'paid'` is committed BEFORE email dispatch. Email failures are logged and recorded (`email_status: 'failed'`), ensuring customer payments are never voided or reversed due to email provider rate limits or downtime.
- [x] **Client Support Email**: Forwards contact inquiries to `CLIENT_SUPPORT_EMAIL` (`support@himroots.com`) with customer email as `reply_to` for 1-click replies.

### Automated Test Coverage (12/12 Passing)
- [x] **Razorpay Payment Flow Suite (`server/scripts/test_razorpay_flow.ts`)**: 7/7 passing tests:
  1. Valid end-to-end payment creation and verification.
  2. Modal cancellation handling (order remains safely pending).
  3. Failed payment rejection (HTTP 400).
  4. Forged/invalid cryptographic signature rejection (HTTP 400).
  5. Idempotent duplicate verification handling (`alreadyProcessed: true`).
  6. Tampered frontend price rejection (authentic catalog price strictly enforced).
  7. Non-existent product ID rejection (HTTP 400).
- [x] **Email & Contact Portal Suite (`server/scripts/test_email_and_contact.ts`)**: 5/5 passing tests:
  1. Complete order email template dispatch.
  2. Valid contact form submission with order reference.
  3. Invalid form validation rejection (missing name, bad email, short message, bad category).
  4. Email provider error simulation and graceful error recovery.
  5. Decoupling verification: payment remains `paid` when email fails.

---

## 2. What the Client Must Configure Manually

The client or business owner must provision external accounts and obtain production credentials. *(Note: Domain and website hosting are already managed by the client).*

### A. Supabase Project Setup
1. **Create Supabase Account & Project**:
   - Navigate to [supabase.com](https://supabase.com) and create or log in to your account.
   - Click **New Project** and name it `himroots-wellness`.
   - Set a secure database password and choose region **South Asia (Mumbai - ap-south-1)** for lowest latency in India.
2. **Execute Database Migrations**:
   - Open the **SQL Editor** from the left navigation bar.
   - Open [`supabase/schema.sql`](supabase/schema.sql) from the repository, copy all contents, paste into the SQL Editor, and click **Run**.
   - In a new query tab, open [`supabase/seed.sql`](supabase/seed.sql), paste all contents, and click **Run**.
3. **Verify Tables**:
   - In **Table Editor**, confirm that `products`, `orders`, `order_items`, and `contact_inquiries` are visible, and `products` contains 2 initial rows.
4. **Copy API Credentials**:
   - Navigate to **Project Settings > API**.
   - Copy:
     - `Project URL` → Set as `SUPABASE_URL` and `VITE_SUPABASE_URL`
     - `anon / public key` → Set as `VITE_SUPABASE_ANON_KEY`
     - `service_role secret key` → Set as `SUPABASE_SERVICE_ROLE_KEY` *(Keep secret! Do not share publicly).*

### B. Razorpay Merchant Account Setup
1. **Sign Up & KYC**:
   - Create an account at [razorpay.com](https://razorpay.com) and complete business KYC verification to enable live INR transactions.
2. **Generate API Keys**:
   - Log into the [Razorpay Dashboard](https://dashboard.razorpay.com).
   - In the left sidebar, navigate to **Account & Settings > API Keys**.
   - Generate API Keys (start with **Test Mode** keys `rzp_test_...`, switch to **Live Mode** `rzp_live_...` when KYC is approved).
   - Copy:
     - `Key ID` → Set as `RAZORPAY_KEY_ID` (backend) and `VITE_RAZORPAY_KEY_ID` (frontend).
     - `Key Secret` → Set as `RAZORPAY_KEY_SECRET` (backend only — never expose to frontend).
3. **Configure Payment Methods**:
   - Under **Account & Settings > Payment Methods**, ensure UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards (RuPay, Visa, Mastercard), and NetBanking are enabled.

### C. Transactional Email Provider (Resend or Brevo)
1. **Account Creation**:
   - Sign up at [resend.com](https://resend.com) (recommended) or [brevo.com](https://brevo.com).
2. **Domain Registration**:
   - In the Resend Dashboard, go to **Domains** and click **Add Domain**.
   - Enter your domain (e.g., `himroots.com` or `mail.himroots.com`).
3. **API Key Generation**:
   - In **API Keys**, create an API key with full sending permissions.
   - Copy the key (`re_...`) → Set as `EMAIL_API_KEY` and `RESEND_API_KEY`.
4. **Define Mailboxes**:
   - Designate client internal email for order alerts: `CLIENT_ORDER_EMAIL=orders@himroots.com`.
   - Designate client support email for customer inquiries: `CLIENT_SUPPORT_EMAIL=support@himroots.com`.
   - Set verified sender address: `EMAIL_FROM=Himroots Wellness <orders@himroots.com>`.

### D. DNS Verification
1. **Add DNS Records at Domain Registrar**:
   - Open your domain registrar / DNS provider (e.g., GoDaddy, Cloudflare, Namecheap, BigRock).
   - Add the DNS records provided by Resend / Brevo:
     - **DKIM record** (TXT / CNAME) for email authentication.
     - **SPF record** (TXT) authorizing the provider to send from your domain.
     - **DMARC record** (TXT) for deliverability protection.
   - Return to the email provider dashboard and click **Verify Domain**. Status must show **Verified** before sending live emails to customers.

---

## 3. What the Developer Must Configure Manually

The developer or DevOps engineer must configure the deployment environment and production runtime settings:

1. **Production Environment Variables Deployment**:
   - Provision production environment variables in the hosting dashboard (e.g., Render, Railway, Vercel, VPS) using `.env.example` as a template.
   - Ensure `NODE_ENV=production` is set.
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_KEY_SECRET` are stored strictly as server-side environment secrets.
2. **CORS Origin Restriction**:
   - In [`server/index.ts`](server/index.ts), update CORS configuration for production:
     ```typescript
     const allowedOrigins = [
       process.env.CLIENT_ORIGIN || 'https://himroots.com',
       'https://www.himroots.com'
     ];
     app.use(cors({
       origin: (origin, callback) => {
         if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
         return callback(new Error('Blocked by CORS policy'));
       },
       credentials: true
     }));
     ```
3. **Backend Server Hosting / Process Manager**:
   - If deploying on a Node.js VPS (e.g. Ubuntu + Nginx): Configure PM2 or Systemd process supervisor (`pm2 start server/index.ts --name himroots-api`).
   - If deploying on containerized cloud (Render, Railway, Fly.io): Set build command `npm run build` and start command `npm run server`.
   - If deploying on Serverless (e.g. Vercel): Configure `/api` rewrite rules to route Express handlers through Vercel Serverless Functions.
4. **Static Frontend CDN & Proxy / Apache `.htaccess` Upload**:
   - Point production frontend API requests to the production backend URL (`VITE_API_BASE_URL=https://api.himroots.com` or use relative `/api` with reverse proxy).
   - Ensure the `.htaccess` file generated in `dist/` is uploaded to `/public_html/`. (Note: Since dotfiles are hidden by default in FTP and cPanel, verify that "Show Hidden Files" is enabled so `.htaccess` is not omitted).
5. **HTTPS Enforcement**:
   - Ensure SSL/TLS certificate is active on both frontend and backend domains. Razorpay Checkout modal requires HTTPS in production.

---

## 4. What Must Be Tested in Production

Before officially launching the website to public customers, conduct the following live tests:

1. **End-to-End Test Transaction with Razorpay Test Mode**:
   - Add products to cart.
   - Proceed to checkout with real test customer details.
   - In Razorpay modal, select UPI or Test Card (`4111 1111 1111 1111`).
   - Verify payment succeeds and frontend redirects to `/order-success`.
   - Verify order details match what was purchased.
2. **Database Verification in Supabase Table Editor**:
   - Confirm order record exists in `orders` table with:
     - `payment_status = 'paid'`
     - `order_status = 'received'`
     - Valid `razorpay_order_id` and `razorpay_payment_id`
     - Valid `paid_at` timestamp
   - Confirm line items exist in `order_items` table with correct quantities, unit prices, and subtotals.
3. **Real Transactional Email Delivery**:
   - Verify `CLIENT_ORDER_EMAIL` received `New Order - HM-YYYYMMDD-XXXX` with complete order details.
   - Verify customer email received the order confirmation receipt.
   - Verify emails arrive in primary inbox (not Spam/Junk) indicating proper SPF/DKIM verification.
4. **Live Contact Form Test**:
   - Submit an inquiry from `/contact` with category `Product Query`.
   - Confirm new row appears in `contact_inquiries` table with `status = 'unread'`.
   - Confirm notification email is received at `CLIENT_SUPPORT_EMAIL`.
   - Test clicking **Reply** in email client to confirm reply address is the customer's email.
5. **Live Payment (₹1 Real Transaction)**:
   - Switch Razorpay keys to Live Mode.
   - Perform 1 actual purchase (e.g., single bottle or temporary ₹1 test item).
   - Verify actual money debit from UPI/card and appearance in Razorpay dashboard under **Payments Captured**.
   - Verify immediate delivery of order alert email to Himroots team.
   - Initiate test refund from Razorpay dashboard to verify refund processing.

---

## 5. Future Recommendations (NOT Part of Current Scope)

The current business workflow operates on a lean, high-touch model:
> **Customer places order & pays → Verified order stored in Supabase → Client receives instant email alert with full shipping details → Client manually packs and dispatches with their existing courier.**

The following capabilities are **explicitly out of scope** for the current milestone and should be considered for future phases as order volume scales:

* [ ] **Courier API / Shiprocket Integration**: Automated AWB generation, courier pickup scheduling, label printing, and tracking number assignment via logistics APIs (Shiprocket, Delhivery, Bluedart).
* [ ] **Automated Delivery Tracking**: Public tracking page allowing customers to track live courier status via tracking number.
* [ ] **Automated Returns / Refunds Engine**: Customer portal for return authorization requests, reverse pickup scheduling, and automatic Razorpay refund API triggers.
* [ ] **Customer Account / Login System**: User registration, passwordless OTP login, profile management, and saved address book.
* [ ] **Admin Dashboard**: Web-based graphical interface for viewing order metrics, managing inventory levels, updating fulfillment statuses (`packed`, `shipped`, `delivered`), and viewing sales graphs.
* [ ] **Real-Time Inventory Management & Reservation**: Automated decrementing of stock on purchase, low-stock webhook alerts, and temporary cart reservations.
* [ ] **Automated CRM & Marketing**: Integration with Klaviyo, Mailchimp, or WhatsApp Business API for post-purchase review requests, replenishment reminders, and cart abandonment sequences.
* [ ] **Automated Multi-Warehouse Fulfillment**: Multi-location warehouse routing and 3PL fulfillment synchronization.
