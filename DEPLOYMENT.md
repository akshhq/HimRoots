# DEPLOYMENT GUIDE — Himroots Wellness
> Authoritative production deployment guide for frontend, backend, database, and payment gateways.

---

## ARCHITECTURE OVERVIEW

```
Browser (himroots.in)
        │
        │ HTTPS
        ▼
Static Hosting (Apache /public_html/ or Vercel Edge)  <-- Frontend SPA (dist/)
        │
        │ VITE_API_BASE_URL (HTTPS)
        ▼
Backend API Server (Render / Railway / VPS)           <-- Node.js / Express (server/)
        │
        ├─► Supabase Cloud (PostgreSQL + Auth + Storage)
        ├─► Razorpay Cloud (Standard Checkout + Webhook HMAC)
        └─► Resend / Brevo (Transactional Email Dispatch)
```

---

## PART 1: FRONTEND DEPLOYMENT

### Static Assets Manifest (`dist/`)
Upon running `npm run build`, the production bundle is compiled into `dist/`:

```
dist/
├── index.html                   <-- SPA entry point with Google Fonts & meta tags
├── .htaccess                    <-- Apache mod_rewrite SPA routing rules
├── assets/                      <-- Fingerprinted and minified JS & CSS bundles
│   ├── index-*.js
│   └── index-*.css
├── images/                      <-- All botanical, branding, and product card assets
│   ├── himroots-logo.png        <-- Unified brand logo
│   ├── instagram.png            <-- Official Instagram glyph
│   ├── pulp-*.jpg               <-- 8 Juice visual detail cards
│   ├── capsules-*.jpg           <-- 7 Capsule visual detail cards
│   └── himalayan-*.jpg          <-- Terroir & harvesting photography
├── android-chrome-*.png
├── apple-touch-icon.png
├── favicon.ico / favicon.svg
├── icons.svg
├── robots.txt
├── site.webmanifest
└── sitemap.xml
```

**DO NOT upload to webroot:**
- `src/`
- `node_modules/`
- `server/`
- `supabase/`
- `.git/`
- `.env`
- `package.json`
- `tsconfig.*`

### Frontend Build Execution
```bash
# Production client compilation
npm run build:client
```
Ensure client environment variables are set during build or present in `.env.production`:
- `VITE_API_BASE_URL=https://api.himroots.in` (or your Render URL)
- `VITE_SUPABASE_URL=https://your-project.supabase.co`
- `VITE_SUPABASE_ANON_KEY=eyJ...`
- `VITE_RAZORPAY_KEY_ID=rzp_live_...`

### Apache / cPanel / `public_html/` Deployment
1. Upload the entire contents of `dist/` into `/public_html/`.
2. Confirm `.htaccess` is present in `/public_html/` (enable "Show Hidden Files" in cPanel File Manager).
3. The `.htaccess` file ensures all client routes (`/shop`, `/products/:slug`, `/cart`, `/checkout`, `/account`, `/auth`, `/about-sea-buckthorn`) are rewritten to `index.html` without 404 errors.

---

## PART 2: BACKEND DEPLOYMENT (Node.js Platform)

*Standard cPanel shared hosting cannot execute Node.js background services. Deploy `server/` to Render, Railway, Fly.io, or an Ubuntu VPS.*

### Render Web Service Deployment (Recommended)
1. In Render, select **New Web Service** and link the `HimRoots` repository.
2. Configuration:
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build:server`
   - **Start Command:** `node dist-server/index.js`
   - **Plan:** Free or Starter
3. Supply all backend environment variables in the Render Dashboard.
4. Verify deployment health check:
   ```bash
   curl https://himroots-api.onrender.com/api/health
   # Response: {"status":"ok","service":"Himroots Wellness API","integrations":{"supabase":"configured"}}
   ```

### Backend Production Environment Variables

```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://himroots.in,https://www.himroots.in

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...

RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM=Himroots Wellness <orders@himroots.in>
CLIENT_ORDER_EMAIL=orders@himroots.in
CLIENT_SUPPORT_EMAIL=support@himroots.in

ALERT_WEBHOOK_URL=https://discord.com/api/webhooks/... (or Slack)
```

---

## PART 3: DATABASE & AUTHENTICATION (Supabase)

### Setup & Schema Initialization
1. Create a Supabase project at [supabase.com](https://supabase.com) in region **ap-south-1 (Mumbai)**.
2. Open the Supabase **SQL Editor**.
3. Execute [`supabase/00_complete_setup.sql`](supabase/00_complete_setup.sql) to create all 8 core tables, security policies, triggers, and seed data:

| Table | Purpose | Public RLS Policy |
| :--- | :--- | :--- |
| `products` | Product catalog & stock counts | Public SELECT only; service_role WRITE |
| `orders` | Customer order transactions | DENY all public access; service_role only |
| `order_items` | Itemized line items per order | DENY all public access; service_role only |
| `contact_inquiries` | Support form submissions | Public INSERT only; service_role manage |
| `profiles` | User profile data | Users SELECT/UPDATE own profile via `auth.uid()` |
| `addresses` | Saved customer shipping addresses | Users manage own addresses via `auth.uid()` |
| `user_carts` | Cross-device shopping cart | Users manage own cart via `auth.uid()` |
| `payment_idempotency` | Payment deduplication logs | service_role only |
| `rate_limits` | Distributed IP rate limiting | service_role only |

4. **Verify Database Configuration:**
   Execute the automated verification script:
   ```bash
   node scripts/verify-auth.js
   ```

5. **Supabase Auth URL Configuration:**
   - Under **Authentication > URL Configuration**:
     - Site URL: `https://himroots.in`
     - Additional Redirect URLs:
       - `https://himroots.in/reset-password`
       - `https://www.himroots.in/reset-password`
       - `http://localhost:5173/reset-password`

---

## PART 4: PAYMENT GATEWAY (Razorpay)

### Live Mode Activation
1. Complete Razorpay Business KYC at [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Toggle dashboard switch to **Live Mode**.
3. Generate Live API Keys under **Settings > API Keys**.
4. Populate `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.

### Webhook Configuration
1. Under **Settings > Webhooks > Add New Webhook**:
   - Webhook URL: `https://api.himroots.in/api/webhooks/razorpay` (or your Render URL)
   - Secret: Enter a strong random secret and copy to `RAZORPAY_WEBHOOK_SECRET`
   - Active Events: `payment.captured`, `order.paid`
2. Backend verifies HMAC SHA256 signatures with `crypto.timingSafeEqual`, updating order records and triggering inventory decrements even if the customer drops network connection.

---

## PART 5: TRANSACTIONAL EMAIL CONFIGURATION

### Resend Setup (Recommended)
1. Add domain `himroots.in` in [resend.com/domains](https://resend.com/domains).
2. Add DNS records (SPF, DKIM) at your domain registrar.
3. Once verified, generate an API key and set `EMAIL_API_KEY=re_...`.
4. Set `EMAIL_FROM=Himroots Wellness <orders@himroots.in>`.
5. Inquiries and order notifications will dispatch reliably without blocking payment confirmations.

---

## PART 6: DOMAIN, SSL & UPTIME MONITORING

### DNS & SSL Configuration
- Point domain `A` record to your hosting IP (or Vercel CNAME).
- Install Let's Encrypt SSL certificate and enforce HTTPS redirect.
- Configure UptimeRobot to ping:
  - `https://api.himroots.in/api/health` every 5 minutes.
  - `https://himroots.in/` every 5 minutes.

---

## FINAL PRE-LAUNCH CHECKLIST

### Developer Checks
- [ ] `supabase/00_complete_setup.sql` executed on live Supabase instance.
- [ ] `node scripts/verify-auth.js` passes with 100% green checks.
- [ ] Dual production build compiles cleanly: `npm run build`.
- [ ] Oxlint passes with 0 warnings, 0 errors: `npm run lint`.
- [ ] Backend test suite passes: `npm run test:backend`.
- [ ] Frontend deployed and `.htaccess` verified in `/public_html/`.
- [ ] Test all routes directly in browser:
  - `/` (Home)
  - `/shop` (Catalog)
  - `/products/sea-buckthorn-pulp` (Juice details + 8 cards)
  - `/products/sea-buckthorn-capsules` (Capsules details + 7 cards)
  - `/about-sea-buckthorn` (Botanical monograph)
  - `/about` (Brand heritage & contact directory)
  - `/contact` (Support portal)
  - `/cart` & `/checkout` (Shopping flow)
  - `/account` & `/auth` (Customer portal)
  - `/reset-password` (Password recovery)

### Client & Business Checks
- [ ] Razorpay KYC approved and switched to **Live Mode**.
- [ ] Domain DNS and SSL active on `himroots.in` and `www.himroots.in`.
- [ ] Email domain verified in Resend/Brevo (SPF + DKIM green).
- [ ] Support telephone active: `9871520888`.
- [ ] Official inboxes operational: `orders@himroots.in`, `support@himroots.in`.
- [ ] Live ₹1 test order placed, verified, and refunded via Razorpay.
