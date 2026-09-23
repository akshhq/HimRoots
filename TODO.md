# Implementation & Setup TODO — Himroots Wellness Backend & E-Commerce Integration

This document outlines all required external accounts, manual configurations, environment variables, database schemas, backend API endpoints, and actionable steps needed to integrate the Supabase database, Express backend, Razorpay payments, order storage, and client email notifications into the existing Himroots Wellness website.

---

## Client Accounts Required

The following third-party accounts must be created and configured by the client or project owner. *(Note: Domain and hosting are already managed and not listed as pending).*

1. **Supabase Account**
   - Plan: Free tier is sufficient for launch.
   - Purpose: PostgreSQL database for storing products, orders, order items, and contact inquiries.
   - Deliverables required from client: Project URL, Public Anon Key, Service Role Key (secret).

2. **Razorpay Account**
   - Plan: Standard Merchant Account (activated with KYC for Indian Rupee / INR transactions).
   - Purpose: Payment gateway handling UPI, Credit/Debit cards, and NetBanking.
   - Deliverables required from client: Key ID (`rzp_test_...` or `rzp_live_...`) and Key Secret.

3. **Transactional Email Provider (Resend or Brevo)**
   - Recommendation: **Resend** (clean REST API, generous free tier) or **Brevo** (formerly Sendinblue).
   - Purpose: Dispatching immediate order alerts and customer inquiry emails to the Himroots fulfillment email address.
   - Deliverables required from client: API Key, verified sender domain or verified sender email address.

4. **GitHub / Repository Access** (If deploying via Git-based CI/CD)
   - Purpose: Connecting the codebase to deployment platforms (e.g., Vercel, Netlify, or VPS).

---

## Backend / API Layer Architecture & Status (Implemented)

A dedicated, lightweight **Node.js + Express** trusted backend layer has been built in [`server/`](file:///d:/Clg/Client%20Work/HimRoots/server):

* Entrypoint: [`server/index.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/index.ts)
* Environment Config: [`server/config/env.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/config/env.ts)
* Supabase Admin Client: [`server/lib/supabase.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/lib/supabase.ts) (Using `service_role` key, strictly server-side)
* Razorpay SDK Client: [`server/lib/razorpay.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/lib/razorpay.ts)
* Services:
  * [`server/services/productService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/productService.ts) — Database catalog fetching with static fallback
  * [`server/services/orderService.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/services/orderService.ts) — Request validation, DB price resolution, order number generation, Razorpay order creation, Supabase persistence, signature verification
* Routes:
  * [`server/routes/products.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/routes/products.ts)
  * [`server/routes/orders.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/routes/orders.ts)
  * [`server/routes/contact.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/routes/contact.ts)
* Error Handling: [`server/middleware/errorHandler.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/middleware/errorHandler.ts) — Sanitizes error messages, protects database secrets, standardizes `{ success: false, error: string }`.

### Available API Endpoints

| Method | Endpoint | Description | Security / Logic |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health & integration status check | Public. Reports Supabase & Razorpay states. |
| `GET` | `/api/products` | Retrieve all active products | Public. Fetches from Supabase with static fallback. |
| `GET` | `/api/products/:identifier` | Retrieve single product by slug or ID | Public. Returns product or 404. |
| `POST` | `/api/orders/create` | Validate cart, calculate price, create Razorpay order & persist in DB | **Trusted Server Logic**. Resolves price from DB, computes totals in paise, generates `HM-YYYYMMDD-XXXX`. |
| `POST` | `/api/orders/verify` | Verify Razorpay payment signature | Cryptographically verifies HMAC SHA256 signature with `RAZORPAY_KEY_SECRET`. Updates order to `paid`. |
| `GET` | `/api/orders/:identifier` | Order lookup for order-success receipt | Safe receipt lookup by UUID or `order_number`. |
| `POST` | `/api/contact` | Receive customer contact inquiry | Validates fields and stores inquiry into `contact_inquiries` table. |

---

## Database Architecture & Status (Implemented)

The database schema and seed files have been prepared:
* Schema file: [`supabase/schema.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/schema.sql)
* Seed data file: [`supabase/seed.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/seed.sql)
* Client library: [`src/lib/supabase.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/lib/supabase.ts)
* Database types: [`src/types/database.types.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/types/database.types.ts)

### 1. `products` Table
- `id` (TEXT PRIMARY KEY, e.g., `prod_001`, `prod_002`, or UUIDs)
- `name` (TEXT NOT NULL)
- `slug` (TEXT UNIQUE NOT NULL)
- `tagline` (TEXT)
- `script_quote` (TEXT)
- `description` (TEXT NOT NULL)
- `price` (NUMERIC(10, 2) NOT NULL)
- `original_price` (NUMERIC(10, 2))
- `volume` (TEXT)
- `images` (TEXT[] NOT NULL DEFAULT '{}')
- `category` (TEXT NOT NULL)
- `ingredients` (TEXT[] DEFAULT '{}')
- `detailed_ingredients` (JSONB DEFAULT '[]')
- `benefits` (TEXT[] DEFAULT '{}')
- `certifications` (TEXT[] DEFAULT '{}')
- `directions` (TEXT[] DEFAULT '{}')
- `packaging_feature` (TEXT)
- `stock_status` (TEXT CHECK IN `'in_stock'`, `'low_stock'`, `'out_of_stock'`)
- `stock_quantity` (INTEGER DEFAULT 50)
- `rating` (NUMERIC(3, 2) DEFAULT 5.0)
- `reviews_count` (INTEGER DEFAULT 0)
- `is_featured` (BOOLEAN DEFAULT false)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 2. `orders` Table
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `order_number` (TEXT UNIQUE NOT NULL, auto-generated e.g. `HM-20260924-0001`)
- `customer_name` (TEXT NOT NULL)
- `email` (TEXT NOT NULL)
- `phone` (TEXT NOT NULL)
- `shipping_address` (TEXT NOT NULL)
- `city` (TEXT NOT NULL)
- `state` (TEXT NOT NULL)
- `pincode` (TEXT NOT NULL)
- `country` (TEXT NOT NULL DEFAULT 'India')
- `subtotal` (NUMERIC(10, 2) NOT NULL)
- `shipping_fee` (NUMERIC(10, 2) DEFAULT 0.00)
- `discount` (NUMERIC(10, 2) DEFAULT 0.00)
- `total` (NUMERIC(10, 2) NOT NULL)
- `payment_status` (TEXT CHECK IN `'pending'`, `'paid'`, `'failed'`, `'refunded'`)
- `order_status` (TEXT CHECK IN `'received'`, `'processing'`, `'packed'`, `'shipped'`, `'delivered'`, `'cancelled'`)
- `razorpay_order_id` (TEXT)
- `razorpay_payment_id` (TEXT)
- `notes` (TEXT)
- `paid_at` (TIMESTAMPTZ)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### 3. `order_items` Table
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `order_id` (UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE)
- `product_id` (TEXT REFERENCES products(id) ON DELETE SET NULL)
- `product_name` (TEXT NOT NULL) — Immutable historical record
- `quantity` (INTEGER NOT NULL CHECK quantity > 0)
- `price` (NUMERIC(10, 2) NOT NULL) — Immutable price snapshot at purchase
- `subtotal` (NUMERIC(10, 2) NOT NULL)
- `created_at` (TIMESTAMPTZ)

### 4. `contact_inquiries` Table
- `id` (UUID PRIMARY KEY DEFAULT gen_random_uuid())
- `name` (TEXT NOT NULL)
- `email` (TEXT NOT NULL)
- `phone` (TEXT)
- `subject` (TEXT DEFAULT 'General Inquiry')
- `message` (TEXT NOT NULL)
- `status` (TEXT CHECK IN `'unread'`, `'read'`, `'responded'`, `'archived'`)
- `created_at` (TIMESTAMPTZ)

---

## Row Level Security (RLS) Policies

All 4 tables have RLS enabled:
1. **`products`**:
   - `anon` and `authenticated` can `SELECT` (Public read-only).
   - Only `service_role` can `INSERT`, `UPDATE`, `DELETE`.
2. **`orders`**:
   - Direct public access (`anon`, `authenticated`) is **denied** (`USING (false)`).
   - Only `service_role` (backend) can create, inspect, and update orders.
   - Customers cannot query other customers' orders or manipulate `payment_status`.
3. **`order_items`**:
   - Direct public access (`anon`, `authenticated`) is **denied** (`USING (false)`).
   - Only `service_role` has full read/write access.
4. **`contact_inquiries`**:
   - `anon` and `authenticated` can `INSERT` (submit message).
   - Public read access is **denied**.
   - Only `service_role` can view and manage inquiries.

---

## Manual Setup Required

The following setup tasks require manual action in the respective dashboards:

### 1. Local Development
1. Start the backend server:
   ```bash
   npm run server
   ```
   *(or `npm run server:dev` for live watch mode).*
2. In another terminal, start the frontend Vite server:
   ```bash
   npm run dev
   ```
   *(or run both concurrently with `npm run dev:all`).*
3. Frontend requests to `/api/*` are automatically proxied to `http://localhost:5000` via `vite.config.ts`.

### 2. Supabase Project Creation & SQL Migration
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, name it `himroots-wellness`, set a database password, and choose region **South Asia (Mumbai - ap-south-1)**.
3. Once provisioned, open **SQL Editor** from the left navigation menu.
4. Open [`supabase/schema.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/schema.sql), copy its content, paste it into the SQL Editor, and click **Run**.
5. In a new query tab, open [`supabase/seed.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/seed.sql), paste its content, and click **Run**.
6. Verify in **Table Editor** that `products` has 2 rows and `orders`, `order_items`, and `contact_inquiries` are created with RLS enabled.
7. Go to **Project Settings > API** and copy:
   - **Project URL**
   - **anon / public key**
   - **service_role secret key** (Keep secret!)

### 3. Razorpay Payment Integration (Implemented — Merchant Setup Required for Live Keys)
- [x] Backend order preparation endpoint `POST /api/orders/create` with server-side price validation.
- [x] Razorpay Order instance creation (in paise).
- [x] Frontend Razorpay Checkout SDK integration in `src/pages/Checkout.tsx`.
- [x] Backend HMAC SHA256 payment signature verification (`POST /api/orders/verify`) with timing-safe comparison.
- [x] Order update to `payment_status: 'paid'` and immutable line items recording.
- [x] Idempotent duplicate callback protection (`alreadyProcessed: true`).
- [x] Dedicated Order Success page `src/pages/OrderSuccess.tsx` showing order reference, verified payment status, and customer care options.
- [x] 7-scenario automated test suite in `server/scripts/test_razorpay_flow.ts` passing 100%.

**Manual Merchant Account Setup for Client:**
- [ ] Sign in to [dashboard.razorpay.com](https://dashboard.razorpay.com).
- [ ] Complete business KYC for live payments, or toggle to **Test Mode**.
- [ ] Navigate to **Settings > API Keys** and generate Key ID and Key Secret.
- [ ] Put `VITE_RAZORPAY_KEY_ID` (public) into client variables, and `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` into server environment.
- [ ] Enable UPI, Cards, and NetBanking under **Payment Methods**.

### 4. Email Provider & Contact/Support Form Integration (Implemented — Domain Setup Required)
- [x] Universal email service `server/services/emailService.ts` supporting Resend and Brevo with simulation fallback.
- [x] Client order notification email (`New Order - {Order Number}`) with complete customer, shipping, line items, and payment IDs.
- [x] Customer confirmation receipt email with order reference and support contacts.
- [x] Strict payment-email decoupling: Email failure logs in DB (`email_status = 'failed'`) but never reverses `payment_status = 'paid'`.
- [x] Contact/support form connected at `src/pages/Contact.tsx` and `POST /api/contact`.
- [x] Support categories implemented: `Order Support`, `Payment Issue`, `Delivery Issue`, `Return/Refund`, `Product Query`, `General Enquiry`, `Other`.
- [x] Security: Server-side validation, IP/email rate limiting (5 req/15 min), and honeypot anti-spam.
- [x] Database persistence into `contact_inquiries` table with `order_id` and `category`.
- [x] 5-scenario automated test suite in `server/scripts/test_email_and_contact.ts` passing 100%.

**Manual Email Provider Setup for Client:**
- [ ] Sign up at [resend.com](https://resend.com) (or Brevo).
- [ ] Add sending domain (e.g. `himroots.com`) under **Domains**.
- [ ] Add DNS records (DKIM, SPF, TXT) at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
- [ ] Generate API Key and set `EMAIL_API_KEY=re_...` in `.env`.
- [ ] Set `EMAIL_FROM=Himroots Wellness <orders@himroots.com>`.
- [ ] Verify `CLIENT_ORDER_EMAIL=orders@himroots.com` and `CLIENT_SUPPORT_EMAIL=support@himroots.com`.

### 5. Environment Variables Configuration
Create a `.env` file in the project root based on `.env.example`:

```env
# Server Port & Mode
PORT=5000
NODE_ENV=development

# Client-side (bundled with Vite)
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here
VITE_RAZORPAY_KEY_ID=rzp_test_yourkeyidhere

# Server-side only (never commit to git)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret_key_here
RAZORPAY_KEY_ID=rzp_test_yourkeyidhere
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Transactional Email (Resend or Brevo)
EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_your_api_key_here
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Himroots Wellness <orders@himroots.com>
CLIENT_ORDER_EMAIL=orders@himroots.com
CLIENT_SUPPORT_EMAIL=support@himroots.com
```

### 6. Production Deployment Checklist
- [ ] Deploy the Express backend to a Node.js hosting platform (e.g. Render, Railway, AWS ECS, or DigitalOcean VPS) or adapt routes to Serverless Functions (e.g., Vercel `/api` or Supabase Edge Functions).
- [ ] Set all server environment variables in the hosting provider settings.
- [ ] Build the frontend with `npm run build` and deploy the static assets.
- [ ] Ensure HTTPS is active on the production domain (mandatory for Razorpay).

---

## Items That Cannot Be Completed Automatically by the Coding Agent

1. Creating the Supabase project and copying the private **Service Role Key**.
2. Pasting and executing `supabase/schema.sql` and `supabase/seed.sql` in the Supabase SQL Editor.
3. Registering the merchant account on **Razorpay** and completing KYC.
4. Adding DNS TXT/CNAME records to the domain registrar for **Email Domain Verification**.
5. Entering private secrets into the production hosting environment settings.
