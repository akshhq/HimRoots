# DEPLOYMENT GUIDE — Himroots Wellness
> Last updated: September 2026

This document covers the complete deployment architecture for the Himroots Wellness website.

---

## ARCHITECTURE OVERVIEW

```
Browser (himroots.in)
        |
        | HTTPS
        v
Apache / cPanel Hosting  <-- Frontend SPA (dist/)
        |
        | VITE_API_BASE_URL (HTTPS)
        v
Backend API Server  <-- Node.js / Express (server/)
        |
        | Service Role Key
        v
Supabase (PostgreSQL + Storage)
        |
        | Razorpay SDK + HMAC Secret
        v
Razorpay Payment Gateway
        |
        | Email API Key
        v
Resend / Brevo (Transactional Email)
```

---

## PART 1: FRONTEND DEPLOYMENT (Apache / cPanel)

### What to upload to /public_html/

After running `npm run build`, upload only the contents of the `dist/` folder:

```
public_html/
├── index.html         <-- SPA entry point
├── .htaccess          <-- Apache SPA routing rules
├── assets/            <-- Hashed JS and CSS bundles
│   ├── index-XXXXXX.js
│   └── index-XXXXXX.css
├── images/            <-- All product and site images
├── favicon.png
├── favicon.svg
├── icons.svg
├── robots.txt
└── sitemap.xml
```

**DO NOT upload:**
- src/
- node_modules/
- server/
- supabase/
- .git/
- .env
- package.json
- tsconfig files

### Build steps

Before building, you must know the backend API URL:

```bash
# Set environment for production build
VITE_API_BASE_URL=https://your-backend.onrender.com npm run build

# Or create a .env.production file:
# VITE_API_BASE_URL=https://your-backend.onrender.com
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJ...
# VITE_RAZORPAY_KEY_ID=rzp_live_...

npm run build
```

### SPA Routing (.htaccess)

The `.htaccess` in `public/` (and copied to `dist/`) handles SPA routing:
- All routes (/cart, /shop, /checkout, etc.) rewrite to index.html
- Static files (images, assets) are served directly
- /api/ requests are NOT rewritten (reserved for reverse proxy or cross-origin API)

This file must be present in /public_html/ for React Router (BrowserRouter) to work.

---

## PART 2: BACKEND DEPLOYMENT (Separate Node.js Platform)

### Why the backend cannot run on Apache/cPanel

Standard cPanel / FTP shared hosting is Apache-only. Apache cannot execute Node.js processes.
The Express backend (`server/`) MUST be deployed to a Node.js platform.

### Recommended Platforms (Free Tier Available)

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| Render | Yes | Spins down after 15min inactivity on free tier |
| Railway | Yes | $5 credit/month free |
| Fly.io | Yes | 3 free VMs |
| DigitalOcean App Platform | No | $5/month minimum |

### Render Deployment (Recommended for simplicity)

1. Push code to GitHub (already done).
2. Create a new Render account at render.com.
3. Click "New Web Service" > Connect GitHub > Select the HimRoots repo.
4. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (runs `tsx server/index.ts`)
   - **Root Directory**: (leave blank — uses project root)
5. Add all environment variables from `.env.example` in the Render dashboard.
6. Deploy. Render will give you a URL like: `https://himroots-api.onrender.com`

### Required environment variables on the backend platform

```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://himroots.in,https://www.himroots.in

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...

RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

EMAIL_PROVIDER=resend
EMAIL_API_KEY=re_...
EMAIL_FROM=Himroots Wellness <orders@himroots.in>
CLIENT_ORDER_EMAIL=orders@himroots.in
CLIENT_SUPPORT_EMAIL=support@himroots.in
```

---

## PART 3: DATABASE (Supabase)

### Setup steps

1. Create a free Supabase project at supabase.com.
2. Go to SQL Editor and run `supabase/schema.sql` to create all tables and RLS policies.
3. Optionally run `supabase/seed.sql` to seed product data.
4. Go to Project Settings > API and copy:
   - **Project URL** → `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (backend only, never expose to frontend)

### Database tables

| Table | Purpose |
|-------|---------|
| products | Product catalog |
| orders | Customer orders |
| order_items | Line items per order |
| contact_inquiries | Contact form submissions |

### Backup recommendations

- Enable Supabase Point-in-Time Recovery (PITR) on paid plans for automated backups.
- On the free plan, export orders periodically from the Supabase Table Editor.
- Never rely solely on the in-memory fallback for production orders.

---

## PART 4: PAYMENT (Razorpay)

### Live key activation

1. Log in to dashboard.razorpay.com.
2. Complete KYC (business verification — required for live payments).
3. Go to Settings > API Keys > Generate Live Keys.
4. Replace all `rzp_test_` keys with `rzp_live_` keys in both:
   - Backend environment: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - Frontend build env: `VITE_RAZORPAY_KEY_ID`
5. Test a real small payment end-to-end before public launch.

---

## PART 5: EMAIL

### Resend (Recommended)

1. Sign up at resend.com.
2. Add and verify domain `himroots.in` (adds DNS records: SPF, DKIM).
3. Create API key > copy to `EMAIL_API_KEY` and `RESEND_API_KEY` on backend.
4. Set `EMAIL_FROM=Himroots Wellness <orders@himroots.in>`.

### Brevo (Alternative)

1. Sign up at brevo.com.
2. Go to Settings > Senders and Domains > Add and verify domain.
3. Generate SMTP/API key > copy to `EMAIL_API_KEY`.
4. Set `EMAIL_PROVIDER=brevo` on backend.

---

## PART 6: DOMAIN & SSL (himroots.in)

### SSL Certificate

1. Log into your hosting control panel (cPanel).
2. Navigate to SSL/TLS > Let's Encrypt SSL.
3. Install certificate for himroots.in and www.himroots.in.
4. Enable HTTP to HTTPS redirect (usually one checkbox in cPanel).

### DNS Records required

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | Your hosting IP | Website |
| CNAME | www | himroots.in | www redirect |
| TXT | @ | SPF record from email provider | Email anti-spam |
| CNAME | em._domainkey | DKIM from email provider | Email signing |

---

## LAUNCH CHECKLIST

### Developer

- [ ] Supabase project created and schema.sql executed
- [ ] Products seeded in Supabase (seed.sql or manual entry)
- [ ] Backend deployed to Render/Railway with all environment variables set
- [ ] Frontend built with VITE_API_BASE_URL pointing to live backend
- [ ] dist/ uploaded to /public_html/ via FTP
- [ ] .htaccess present in /public_html/
- [ ] Test all SPA routes: /, /shop, /products/:slug, /about, /about-sea-buckthorn, /contact, /cart, /checkout, /order-success, /payment-failed

### Client

- [ ] SSL certificate installed and HTTPS forced
- [ ] Domain DNS pointing to hosting IP
- [ ] Razorpay KYC completed and live keys activated
- [ ] Email domain verified (SPF + DKIM records added to DNS)
- [ ] Placed a real test order with live Razorpay to verify end-to-end

### Production Testing Required

- [ ] Complete checkout flow with live Razorpay key
- [ ] Verify email received at orders@himroots.in on new order
- [ ] Verify email received at support@himroots.in on contact submission
- [ ] Test all routes with direct browser URL (no 404s)
- [ ] Verify /api/health returns 200 on live backend
