# Himroots Wellness — TODO

Last updated: September 2026

---

## COMPLETED

### Website & UI
- [x] Full responsive website — Home, Shop, ProductDetails, About, SeaBuckthorn, Contact
- [x] Dark luxury design with animations (Framer Motion)
- [x] Dynamic navbar with scroll-based logo transition
- [x] Mobile-optimised navbar and hero section
- [x] Cart system (Zustand, persistent)
- [x] Checkout page with form validation
- [x] OrderSuccess confirmation page
- [x] 404 fallback route
- [x] favicon, apple-touch-icon, Open Graph, Twitter Card, canonical URL
- [x] robots.txt and sitemap.xml

### Backend (Express / Node.js)
- [x] Clean Express API server (server/)
- [x] Products route: GET /api/products, GET /api/products/:identifier
- [x] Orders route: POST /api/orders, POST /api/orders/verify, GET /api/orders/:id
- [x] Contact route: POST /api/contact
- [x] Rate limiting (per-route)
- [x] Input validation middleware
- [x] Centralised error handler (safe, no stack traces exposed)
- [x] Security headers middleware
- [x] Health endpoint: GET /api/health

### Payment
- [x] Razorpay order creation (server-side)
- [x] Razorpay HMAC SHA256 signature verification (server-side, timing-safe)
- [x] Duplicate payment protection (in-memory + Supabase)
- [x] Production test-mode bypass blocked

### Database (Supabase)
- [x] Schema: products, orders, order_items, contact_inquiries
- [x] RLS policies: orders/items deny public; service_role only
- [x] Product seed data (supabase/seed.sql)
- [x] Static product fallback when Supabase is not connected

### Email
- [x] Resend and Brevo support
- [x] Order notification email to Himroots (on payment verified)
- [x] Customer order confirmation email
- [x] Support inquiry email (contact form)
- [x] Non-blocking: email failure never invalidates payment

### Security
- [x] All secrets server-side only
- [x] .gitignore covers all .env files
- [x] No real secrets in git history
- [x] CORS restricted to himroots.in in production
- [x] Prices never trusted from client

### SEO
- [x] Title tag
- [x] Meta description
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card meta tags
- [x] Canonical URL
- [x] robots.txt
- [x] sitemap.xml

### Documentation
- [x] PRODUCTION_AUDIT.md
- [x] PRODUCTION_SETUP.md
- [x] DEPLOYMENT.md
- [x] SECURITY_AUDIT.md
- [x] FINAL_PRODUCTION_REPORT.md
- [x] README.md

---

## CLIENT MUST CONFIGURE (Before Launch)

- [ ] SSL certificate installed on himroots.in (cPanel > Let's Encrypt)
- [ ] HTTP → HTTPS redirect enabled in hosting panel
- [ ] Razorpay KYC completed (business verification for live payments)
- [ ] Razorpay live keys activated (rzp_live_...)
- [ ] Email domain verified (SPF + DKIM DNS records added for himroots.in)
- [ ] orders@himroots.in email inbox set up and monitored
- [ ] support@himroots.in email inbox set up and monitored

---

## DEVELOPER MUST CONFIGURE (Before Launch)

- [ ] Create Supabase project and run supabase/schema.sql
- [ ] Seed products in Supabase (supabase/seed.sql or manual entry)
- [ ] Deploy backend to Render / Railway / Fly.io
- [ ] Set all environment variables on backend hosting platform
- [ ] Build frontend with VITE_API_BASE_URL pointing to live backend
- [ ] Upload dist/ to /public_html/ (not the whole project)
- [ ] Verify .htaccess present in /public_html/
- [ ] Verify /api/health returns 200 on live backend URL

---

## PRODUCTION TESTING REQUIRED

- [ ] Full checkout end-to-end with live Razorpay key and real card
- [ ] Verify Himroots receives order email on payment
- [ ] Verify customer receives confirmation email
- [ ] Verify support email received on contact form submit
- [ ] Test all routes directly in browser: /, /shop, /products, /about, /contact, /cart, /checkout, /order-success
- [ ] Check no 404s on direct URL access (SPA routing)
- [ ] Test with mobile viewport

---

## FUTURE / OUT OF SCOPE

> These are not implemented and are explicitly out of scope for the current build.

- [ ] Customer login / account system
- [ ] Admin dashboard for order management
- [ ] Inventory management system
- [ ] Automated courier API integration
- [ ] Delivery / shipment tracking
- [ ] Automated refund processing
- [ ] Automated return management
- [ ] CRM / customer management
- [ ] Discount codes / coupon system
- [ ] Razorpay webhook (additional reliability layer, not a blocker)
- [ ] Redis-backed rate limiting (only needed for multi-instance deployments)
- [ ] Unit / integration test suite

---

### Current Fulfillment Workflow (Manual)

```
Customer pays → Order stored in Supabase → Himroots receives email
→ Himroots manually packs and ships the order
→ Himroots manually updates customer via support@himroots.in
```
