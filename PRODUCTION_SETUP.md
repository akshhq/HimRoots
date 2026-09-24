# Himroots Wellness — Production Deployment & Setup Guide

This guide provides complete, step-by-step instructions for deploying the **Himroots Wellness** e-commerce platform into commercial production.

---

## 1. Architecture & Deployment Overview

The platform uses a decoupled, production-grade architecture:

```
[Customer Browser] 
       │
       ├─► (1) Static SPA Requests (HTML/CSS/JS/Assets) ──► Apache /public_html/ (himroots.in)
       │                                                    (.htaccess handles HTML5 pushState)
       │
       └─► (2) REST API Calls (/api/orders, /api/contact) ──► Node.js / Express API (api.himroots.in)
                                                            ├─► Supabase PostgreSQL (Database & RLS)
                                                            ├─► Razorpay (Live Payments)
                                                            └─► Resend / Brevo (Transactional Email)
```

---

## 2. Backend API Architecture & Organization

The backend is organized into clean, single-responsibility layers located in [`server/`](server/):

```
server/
├── config/
│   └── env.ts               # Environment configuration & secret validation
├── controllers/
│   ├── contactController.ts # Customer inquiries & support handling
│   ├── orderController.ts   # Order placement, price verification, retrieval
│   └── productController.ts # Catalog querying with fallback
├── lib/
│   ├── razorpay.ts          # Razorpay SDK initialization
│   └── supabase.ts          # Supabase client with service_role privileges
├── middleware/
│   ├── errorHandler.ts      # Safe error masking (never leaks credentials/stacks)
│   ├── rateLimiter.ts       # Sliding-window IP rate limiters
│   ├── security.ts          # Defensive HTTP headers & CORS origin validation
│   └── validation.ts        # Server-side input validation for orders & contact
├── routes/
│   ├── contact.ts           # /api/contact endpoints
│   ├── orders.ts            # /api/orders endpoints
│   └── products.ts          # /api/products endpoints
├── scripts/
│   └── testBackend.ts       # 31-point automated verification test suite
└── index.ts                 # Express entrypoint & middleware assembly
```

---

## 3. API Endpoints Reference

### Health & Monitoring
* `GET /api/health`
  * Checks server status, uptime timestamp, and Supabase integration mode.

### Products Catalog
* `GET /api/products`
  * Returns list of all active products directly from Supabase (or fallback catalog).
* `GET /api/products/:identifier`
  * Returns single product by UUID, `prod_00X` ID, or URL slug (e.g. `sea-buckthorn-pulp`).

### Orders & Checkout
* `POST /api/orders` (and `POST /api/orders/create`)
  * **Payload:**
    ```json
    {
      "items": [{ "productId": "prod_001", "quantity": 2 }],
      "customer": { "name": "Aarav Sharma", "email": "aarav@example.com", "phone": "9816012345" },
      "shipping": { "address": "123 Mall Road", "city": "Shimla", "state": "Himachal Pradesh", "pincode": "171001", "country": "India" },
      "notes": "Optional delivery notes"
    }
    ```
  * **Security & Business Rules:**
    * Zero trust of client-submitted prices or totals.
    * Server fetches authentic product prices from Supabase.
    * Calculates authentic subtotal.
    * Enforces shipping policy: Free delivery for subtotal > ₹2000, else ₹150 flat shipping fee.
    * Generates human-readable order number: `HM-YYYYMMDD-XXXX`.
    * Creates order in Supabase with `payment_status: 'pending'` and `order_status: 'pending'`.
    * Inserts immutable line items in `order_items`.
* `GET /api/orders/:identifier`
  * Safe lookup by internal UUID or order number (e.g. `HM-20260925-1234`).
  * Returns non-sensitive customer and line item data for the order-success confirmation screen.
* `POST /api/orders/verify`
  * Payment verification endpoint for future Razorpay integration stage.

### Contact & Customer Support
* `POST /api/contact`
  * Validates and records inquiries into `contact_inquiries` table with anti-spam honeypot detection.

---

## 4. Security & Defensive Controls

1. **Security Headers (`server/middleware/security.ts`):**
   * `X-Content-Type-Options: nosniff`
   * `X-Frame-Options: SAMEORIGIN`
   * `X-XSS-Protection: 1; mode=block`
   * `Referrer-Policy: strict-origin-when-cross-origin`
   * `Strict-Transport-Security` (automatically set in production)
   * `X-Powered-By` header stripped.
2. **CORS Whitelisting:**
   * In production, strictly allows origins defined in `CORS_ORIGIN` (defaults to `https://himroots.in` and `https://www.himroots.in`). Wildcard `*` is denied in production.
3. **Sliding-Window IP Rate Limiting (`server/middleware/rateLimiter.ts`):**
   * General API: 120 requests / minute per IP.
   * Order Creation: 15 orders / 10 minutes per IP.
   * Contact Submissions: 8 inquiries / 10 minutes per IP.
4. **Payload Limiting:**
   * JSON body parsing capped at `50kb` to protect server memory against payload exhaustion attacks.
5. **Safe Error Handling (`server/middleware/errorHandler.ts`):**
   * Database credentials, Postgres error strings, and stack traces are masked into clean client errors.

---

## 5. Environment Variables Specification

Environment variables are strictly segregated into **public frontend variables** and **server-side secrets**.

### Public / Frontend Variables (Bundled into Client Build)
*Must be present during `npm run build`.*

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase project REST URL | `https://xyzproject.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public anonymous client API key | `eyJhbGciOi...` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Live Public Key ID | `rzp_live_abc123` |
| `VITE_API_BASE_URL` | Base URL of backend API server | `https://api.himroots.in` (or empty if using same-domain reverse proxy) |

### Server-Side Secrets (Node.js API Server Only)
*Must NEVER be prefixed with `VITE_` or exposed to browser code.*

| Variable | Description | Confidentiality |
| :--- | :--- | :--- |
| `PORT` | Listening port for Express API (default: 5000) | Low |
| `NODE_ENV` | Environment identifier (`production`) | Low |
| `CORS_ORIGIN` | Allowed web origins (`https://himroots.in,https://www.himroots.in`) | Medium |
| `SUPABASE_URL` | Server connection URL to Supabase | Medium |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role secret key (bypasses RLS for orders) | 🔴 **HIGH (Critical)** |
| `RAZORPAY_KEY_ID` | Razorpay Live Key ID | Medium |
| `RAZORPAY_KEY_SECRET` | Razorpay Live Key Secret (used for HMAC verification) | 🔴 **HIGH (Critical)** |
| `EMAIL_PROVIDER` | Transactional email provider (`resend` or `brevo`) | Low |
| `EMAIL_API_KEY` | Resend/Brevo API token | 🔴 **HIGH (Critical)** |
| `EMAIL_FROM` | Verified sender address (e.g. `Himroots <orders@himroots.in>`) | Medium |
| `CLIENT_ORDER_EMAIL` | Fulfillment notifications inbox (e.g. `orders@himroots.in`) | Medium |
| `CLIENT_SUPPORT_EMAIL` | Support inquiries inbox (e.g. `support@himroots.in`) | Medium |

---

## 6. Local Development & Testing

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Run frontend Vite server (port 5173)
npm run dev

# 3. Run backend Express server with auto-restart (port 5000)
npm run server:dev

# 4. Run both concurrently
npm run dev:all

# 5. Run automated backend test suite (35 tests covering payments, idempotency, email, and support)
npx tsx server/scripts/testBackend.ts

# 6. Build frontend production bundle (generates dist/)
npm run build

# 7. Start production backend server
npm start
```

---

## 7. Database Setup (Supabase PostgreSQL)

### Step 1: Create Supabase Project
1. Log in to [supabase.com](https://supabase.com).
2. Click **New project** with Name `Himroots Wellness`.
3. Choose Region: **Mumbai, India (`ap-south-1`)** for lowest latency.
4. Save the generated database password securely.

### Step 2: Apply Database Schema
1. Open the Supabase dashboard and navigate to **SQL Editor**.
2. Open [`supabase/schema.sql`](supabase/schema.sql).
3. Paste the entire content and click **Run**.
4. This creates:
   - `public.products` (Product catalog with stock and specifications)
   - `public.orders` (Master orders table with `HM-YYYYMMDD-XXXX` order numbers and order states)
   - `public.order_items` (Historical snapshot of purchased products and prices)
   - `public.contact_inquiries` (Customer support messages and status)
   - Row Level Security (RLS) policies on all tables
   - Auto-updating `updated_at` triggers and indexes

### Step 3: Seed Initial Products
1. In **SQL Editor**, open [`supabase/seed.sql`](supabase/seed.sql).
2. Paste and click **Run**.
3. Verify both formulations appear in **Table Editor > products**:
   - `prod_001`: *Himroots Pure Sea Buckthorn Pulp* (₹999.00)
   - `prod_002`: *Himroots Sea Buckthorn Capsules* (₹1199.00)

### Step 4: Retrieve API Keys
Navigate to **Project Settings > API**:
- Copy **Project URL**
- Copy **anon / public** key
- Copy **service_role** key (server only)

---

## 8. Frontend Production Deployment

### Step 1: Build the Static Bundle
```bash
npm run build
```

The resulting `dist/` directory contains:
- `index.html` (SPA entry point)
- `assets/` (bundled JS & CSS)
- `images/` (optimized photography)
- `favicon.*`, `icons.svg`
- `.htaccess` (Apache rewrite configuration)

### Step 2: Upload to Web Host (`/public_html/`)
1. Connect via SFTP or cPanel File Manager to your hosting provider.
2. Upload all contents of `dist/` directly into `/public_html/`.
3. **Important:** Ensure hidden files are visible so `.htaccess` is uploaded.

### Step 3: Verify Apache `.htaccess`
Verify `.htaccess` exists in `/public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  Options -MultiViews
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_URI} ^/api(/.*)?$ [NC]
  RewriteRule ^ - [L]
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>
```

---

## 9. Backend Production Deployment

The backend runs on Node.js (`server/index.ts` via `tsx`).

### Option A: Cloud Web Service (Render / Railway)
1. Create a new **Web Service** connected to the GitHub repository.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables in service settings.
5. Set custom domain: `api.himroots.in`.

### Option B: Self-Hosted VPS or cPanel Node.js Application
1. Upload project files (`server/`, `src/types/`, `src/data/`, `package.json`, `tsconfig*.json`).
2. Run `npm install --omit=dev`.
3. Run with PM2 process manager:
   ```bash
   pm2 start "npm start" --name "himroots-api"
   pm2 save
   ```

---

## 10. Smoke Test & Verification Checklist

- [x] **Frontend Build**: Verified `npm run build` finishes with 0 errors.
- [x] **Backend Test Suite**: Verified `npx tsx server/scripts/testBackend.ts` runs 31/31 passing assertions.
- [ ] **Catalog Page**: Visit `https://himroots.in/shop` and verify formulation pricing.
- [ ] **Direct Navigation**: Refresh `https://himroots.in/cart` directly in the browser address bar (verify no 404).
- [ ] **Health Endpoint**: Visit `https://api.himroots.in/api/health` and verify `status: "ok"`.
- [ ] **Checkout Validation**: Test invalid email or missing fields on checkout to verify client/server validation stops the order and preserves cart.
- [ ] **Order Placement**: Place test order, verify cart clears only upon success, and user is routed to `/order-success`.
- [ ] **Database Inspection**: In Supabase `orders` table, verify order status is `pending` and line items appear in `order_items`.
