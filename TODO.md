# Himroots Wellness — Setup & Deployment TODO

---

## ✅ Completed

- [x] Frontend (catalog, cart, checkout, order success, contact form, SPA routing)
- [x] Backend API (products, orders, payments, contact, health check)
- [x] Database schema, seed data, RLS policies, indexes
- [x] Razorpay payment flow with server-side signature verification
- [x] Transactional email (Resend / Brevo) with payment-email decoupling
- [x] Apache `.htaccess` SPA routing for `/public_html/` deployments
- [x] Automated test suites (12/12 passing)

---

## 📋 Client Setup Required

### A. Supabase

1. Create project at [supabase.com](https://supabase.com) → region **Mumbai (ap-south-1)**
2. Run [`supabase/schema.sql`](supabase/schema.sql) in SQL Editor
3. Run [`supabase/seed.sql`](supabase/seed.sql) in SQL Editor
4. Copy from **Project Settings > API**:
   - Project URL → `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - Anon key → `VITE_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

### B. Razorpay

1. Create account at [razorpay.com](https://razorpay.com), complete KYC
2. Generate API keys from **Settings > API Keys**
   - Key ID → `RAZORPAY_KEY_ID` / `VITE_RAZORPAY_KEY_ID`
   - Key Secret → `RAZORPAY_KEY_SECRET` (server only)
3. Enable UPI, Cards, and NetBanking under **Payment Methods**

### C. Email Provider (Resend or Brevo)

1. Sign up at [resend.com](https://resend.com)
2. Add sending domain (e.g. `himroots.com`)
3. Generate API key → `EMAIL_API_KEY` / `RESEND_API_KEY`
4. Set `EMAIL_FROM`, `CLIENT_ORDER_EMAIL`, `CLIENT_SUPPORT_EMAIL`

### D. DNS Verification

1. Add DKIM, SPF, DMARC records at your domain registrar
2. Verify domain status in email provider dashboard

---

## 🛠️ Developer Setup Required

1. Set all production env vars on hosting platform (use `.env.example` as template)
2. Restrict CORS origins in `server/index.ts` to production domains
3. Configure backend process manager (PM2 / container / serverless)
4. Upload `.htaccess` from `dist/` to `/public_html/` (enable "Show Hidden Files" in FTP/cPanel)
5. Ensure HTTPS is active (required by Razorpay)

---

## 🧪 Production Testing Checklist

- [ ] Test transaction with Razorpay test keys (card `4111 1111 1111 1111`)
- [ ] Verify order appears in Supabase with `payment_status = 'paid'`
- [ ] Verify client receives order email, customer receives confirmation
- [ ] Test contact form → check `contact_inquiries` table + support email
- [ ] Live ₹1 transaction with real Razorpay keys → verify → test refund

---

## 🔮 Future (Out of Scope)

- [ ] Courier API (Shiprocket / Delhivery)
- [ ] Delivery tracking page
- [ ] Automated returns & refunds
- [ ] Customer accounts & login
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] CRM & marketing automation
