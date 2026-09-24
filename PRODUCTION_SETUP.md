# Himroots Wellness — Production Deployment & Setup Guide

This guide provides complete, step-by-step instructions for deploying the **Himroots Wellness** e-commerce platform into commercial production.

---

## 1. Architecture & Deployment Overview

The platform uses a decoupled production model:

```
[Customer Browser] 
       │
       ├─► (1) Static SPA Requests (HTML/CSS/JS/Assets) ──► Apache /public_html/ (himroots.in)
       │                                                    (.htaccess handles HTML5 pushState)
       │
       └─► (2) REST API Calls (/api/orders, /api/contact) ──► Node.js / Express API (api.himroots.in or local proxy)
                                                            ├─► Supabase PostgreSQL (Database & RLS)
                                                            ├─► Razorpay (Live Payments)
                                                            └─► Resend / Brevo (Transactional Email)
```

---

## 2. Environment Variables Specification

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
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret for automated capture | 🔴 **HIGH (Critical)** |
| `EMAIL_PROVIDER` | Transactional email provider (`resend` or `brevo`) | Low |
| `EMAIL_API_KEY` | Resend/Brevo API token | 🔴 **HIGH (Critical)** |
| `EMAIL_FROM` | Verified sender address (e.g. `Himroots <orders@himroots.in>`) | Medium |
| `CLIENT_ORDER_EMAIL` | Fulfillment notifications inbox (e.g. `orders@himroots.in`) | Medium |
| `CLIENT_SUPPORT_EMAIL` | Support inquiries inbox (e.g. `support@himroots.in`) | Medium |

---

## 3. Database Setup (Supabase PostgreSQL)

### Step 1: Create Supabase Project
1. Log in to [supabase.com](https://supabase.com).
2. Click **New project**.
3. Set Name to `Himroots Wellness`.
4. Choose Region: **Mumbai, India (`ap-south-1`)** for minimal latency.
5. Set a secure database password and save it in a password manager.

### Step 2: Apply Database Schema
1. Open the Supabase dashboard and navigate to **SQL Editor**.
2. Open [`supabase/schema.sql`](supabase/schema.sql) from the repository.
3. Paste the entire content and click **Run**.
4. This creates:
   - `public.products` (Product catalog with stock and specifications)
   - `public.orders` (Master orders table with `HM-YYYYMMDD-XXXX` order numbers)
   - `public.order_items` (Historical snapshot of purchased products and prices)
   - `public.contact_inquiries` (Customer support messages and status)
   - Row Level Security (RLS) policies on all tables
   - Auto-updating `updated_at` triggers and indexes

### Step 3: Seed Initial Products
1. In **SQL Editor**, open [`supabase/seed.sql`](supabase/seed.sql).
2. Paste and click **Run**.
3. Verify both formulations appear in the **Table Editor > products**:
   - `prod_001`: *Himroots Pure Sea Buckthorn Pulp* (₹999.00)
   - `prod_002`: *Himroots Sea Buckthorn Capsules* (₹1199.00)

### Step 4: Retrieve API Keys
Navigate to **Project Settings > API**:
- Copy **Project URL**
- Copy **anon / public** key
- Copy **service_role** key

---

## 4. Frontend Production Build & Deployment

The frontend is a pure static Single-Page Application (SPA).

### Step 1: Build the Static Bundle
On your build machine or CI pipeline:
```bash
# Install dependencies
npm ci

# Build the client bundle (generates dist/)
npm run build
```

The resulting `dist/` folder contains only:
- `index.html` (entry point)
- `assets/` (bundled JS & CSS)
- `images/` (optimized photography)
- `favicon.*`, `icons.svg`
- `.htaccess` (Apache configuration)

### Step 2: Upload to Web Host (`/public_html/`)
1. Connect via SFTP or cPanel File Manager to your hosting provider.
2. Upload all contents of `dist/` directly into `/public_html/`.
3. **Important:** Ensure hidden files are enabled so `.htaccess` is uploaded.

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
This guarantees direct access to virtual routes (e.g. `https://himroots.in/cart`) loads `index.html` without returning 404 errors.

---

## 5. Backend API Deployment

The backend is an Express Node.js application (`server/index.ts`).

### Deployment Options

#### Option A: Dedicated Cloud Service (Recommended: Render / Railway)
1. Create a new **Web Service** pointing to the repository.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables (see Section 2).
5. Add custom domain: `api.himroots.in`.

#### Option B: Self-Hosted VPS or CloudLinux Node.js Passenger (cPanel)
1. Transfer `server/`, `package.json`, `package-lock.json`, `tsconfig*.json` to the server.
2. Run `npm install --omit=dev`.
3. Start with PM2:
   ```bash
   pm2 start "npm start" --name "himroots-api"
   pm2 save
   ```
4. If hosting frontend and backend on the same Apache server, configure reverse proxy in `.htaccess`:
   ```apache
   RewriteRule ^api/(.*)$ http://127.0.0.1:5000/api/$1 [P,L]
   ```

---

## 6. Client-Owned Third-Party Services Setup

### Razorpay Setup (Payments)
1. Complete company KYC at [razorpay.com](https://razorpay.com).
2. Go to **Account & Settings > API Keys**:
   - Generate **Live Keys** (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
3. Under **Payment Methods**:
   - Verify **UPI** (Google Pay, PhonePe, Paytm, BHIM) is enabled.
   - Verify **Cards** (Visa, Mastercard, RuPay) and **NetBanking** are enabled.
4. Go to **Account & Settings > Webhooks**:
   - URL: `https://api.himroots.in/api/webhooks/razorpay` (or `https://himroots.in/api/webhooks/razorpay`)
   - Secret: Set random secret in `RAZORPAY_WEBHOOK_SECRET`.
   - Events: `payment.captured`, `order.paid`.

### Transactional Email Setup (Resend / Brevo)
1. Sign up at [resend.com](https://resend.com).
2. Click **Domains > Add Domain**: Enter `himroots.in` (or `himroots.com`).
3. Add DNS records at domain registrar:
   - DKIM (CNAME / TXT)
   - SPF (TXT)
   - DMARC (TXT)
4. Once verified, create API Key (`re_...`) and set in `EMAIL_API_KEY`.
5. Set `EMAIL_FROM` to `Himroots Wellness <orders@himroots.in>`.

---

## 7. Verification & Production Smoke Test Checklist

Once deployed, perform this complete smoke test:

- [ ] **Catalog Page**: Visit `https://himroots.in/shop` and verify both formulations display with correct prices (₹999 and ₹1199).
- [ ] **Direct Navigation**: Refresh `https://himroots.in/cart` directly in the browser address bar to verify no 404 occurs.
- [ ] **Health Endpoint**: Open `https://api.himroots.in/api/health` and verify status is `ok` with integrations showing `configured`.
- [ ] **Checkout Submission**: Fill in test address details and click "Proceed to Payment".
- [ ] **Razorpay Modal**: Verify the Razorpay payment modal opens with the gold Himroots theme and accurate amount in ₹.
- [ ] **Live Test Payment**: Complete a test payment (or ₹1 live transaction).
- [ ] **Order Confirmation**: Verify automatic redirect to `/order-success` with human-readable order number (`HM-...`).
- [ ] **Database Inspection**: In Supabase `orders` table, verify order status is `paid` and line items appear in `order_items`.
- [ ] **Email Dispatch**: Verify fulfillment email arrives at `CLIENT_ORDER_EMAIL` and receipt arrives at customer email.
- [ ] **Contact Form**: Submit a message on `https://himroots.in/contact` and verify email arrives at `CLIENT_SUPPORT_EMAIL`.
