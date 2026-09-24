# Himroots Wellness — Setup & Deployment Roadmap

---

## ✅ Completed Architecture & Production Readiness

- [x] **Frontend Core**: React 19 + Vite 8 SPA with responsive luxury aesthetics and Tailwind CSS v4
- [x] **Client Routing**: HTML5 pushState `BrowserRouter` with `.htaccess` rewrite rules in `public/`
- [x] **API Base URL Support**: Centralized `src/lib/api.ts` wired to `Checkout.tsx`, `Contact.tsx`, and `OrderSuccess.tsx` supporting `VITE_API_BASE_URL`
- [x] **Dynamic Catalog Preparation**: `Shop.tsx`, `ProductDetails.tsx`, and `Home.tsx` wired to query Supabase with graceful fallback to static product catalog
- [x] **Backend API**: Express 5 on Node.js with price recalculation, order creation, HMAC signature verification, health checks, and sanitized error handling
- [x] **Database Schema**: Supabase PostgreSQL DDL (`supabase/schema.sql`) for products, orders, order items, and contact inquiries with RLS and automated `HM-YYYYMMDD-XXXX` order numbers
- [x] **Production Server Readiness**: `tsx` moved to runtime dependencies in `package.json` with universal `npm start` command
- [x] **Security Hardening**: Disabled test simulation fallback in production, CORS origin configurability, and Row Level Security on all Supabase tables
- [x] **Environment Separation**: Cleaned `.env.example` with strict segregation of public `VITE_` variables vs private server secrets
- [x] **Documentation**: Created [PRODUCTION_AUDIT.md](PRODUCTION_AUDIT.md) and [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md)

---

## 📋 Client Setup Required (One-Time)

### A. Supabase PostgreSQL
1. Create project at [supabase.com](https://supabase.com) in region **Mumbai (ap-south-1)**.
2. In SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql).
3. In SQL Editor, run [`supabase/seed.sql`](supabase/seed.sql).
4. Retrieve from **Project Settings > API**:
   - `SUPABASE_URL` / `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep private)

### B. Razorpay Live Gateway
1. Complete KYC at [razorpay.com](https://razorpay.com).
2. Generate Live API Keys from **Settings > API Keys**:
   - `RAZORPAY_KEY_ID` / `VITE_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET` (server only)
3. Ensure UPI, Cards, and NetBanking are active.
4. Optional: Configure Webhook URL (`https://api.himroots.in/api/webhooks/razorpay`) with `payment.captured`.

### C. Transactional Email (Resend or Brevo)
1. Sign up at [resend.com](https://resend.com).
2. Add and verify your custom domain (DKIM, SPF, DMARC DNS records).
3. Generate API Key → `EMAIL_API_KEY`.
4. Configure `EMAIL_FROM`, `CLIENT_ORDER_EMAIL`, `CLIENT_SUPPORT_EMAIL`.

---

## 🛠️ Developer Setup Required

1. Populate production environment variables on backend host (use `.env.example` as guide).
2. Set `VITE_API_BASE_URL` in `.env.production` if API is hosted on a separate subdomain (`https://api.himroots.in`).
3. Run `npm run build` to generate `dist/`.
4. Upload all files from `dist/` (including `.htaccess`) to `/public_html/`.
5. Deploy backend service using `npm start` (with PM2, Docker, or Render/Railway).
6. Verify HTTPS SSL certificate is active on both frontend and backend.

---

## 🧪 Production Verification Checklist

- [ ] Verify `https://himroots.in/shop` displays formulations with live/fallback prices
- [ ] Test direct navigation to `https://himroots.in/cart` (verify no 404)
- [ ] Verify `GET /api/health` returns `status: ok`
- [ ] Execute test transaction with live or test keys
- [ ] Verify order record appears in Supabase with `payment_status = 'paid'`
- [ ] Verify client notification email arrives at `CLIENT_ORDER_EMAIL`
- [ ] Verify customer receipt arrives at customer email address
- [ ] Verify contact form inquiry is saved to `contact_inquiries` table

---

## 🔮 Future Enhancements (Post-Launch)

- [ ] Courier API integration (Shiprocket / Delhivery)
- [ ] Dedicated customer order tracking page
- [ ] Customer account authentication & order history
- [ ] Custom administrative management portal
- [ ] SMS / WhatsApp order status notifications
