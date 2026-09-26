# Himroots Wellness — Project Checklist & Roadmap

**Status:** Code Complete & Production-Ready  
**Last Updated:** September 2026

---

## 1. Completed Implementations

### Frontend & Brand Experience (React + Vite)
- [x] **Full Responsive Design:** Home, Shop / Products, ProductDetails, About Sea Buckthorn, Contact, Cart, Checkout, OrderSuccess.
- [x] **Brand Styling:** Luxury dark theme, typography (Marcellus, Cinzel, Plus Jakarta Sans), Framer Motion micro-animations.
- [x] **Header & Navigation:** Responsive Navbar with scroll-based logo scaling and dynamic backdrop.
- [x] **Brand Watermark:** Subtle site-wide brand watermark integrated across pages.
- [x] **Cart Architecture:** Persistent Zustand state store, responsive slide-out cart drawer, and dedicated `/cart` route.
- [x] **Checkout Flow:** Form validation (shipping info, pin code, phone), live order summary calculation.
- [x] **Sea Buckthorn Content:** Updated copy aligned with `HIMROOTS_Seabuckthorn_Juice_Website_Content.md`.
- [x] **Favicon & Web App Manifest:** Authentic Himroots brand logo exported to `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `apple-touch-icon.png` (180x180), Android Chrome icons (192x192, 512x512), vector `favicon.svg`, and `site.webmanifest`.

### Routing, Error Handling & Deployments
- [x] **Clean SPA Routing:** HTML5 History API via `BrowserRouter` without hash fragments (`/#/`).
- [x] **Vercel Generic SPA Fallback:** `vercel.json` configured with generic rewrite (`/(.*) -> /index.html`) so direct visits and refreshes never 404.
- [x] **Static Asset Protection:** Immutable caching for bundle assets, `favicon.*`, `robots.txt`, and `sitemap.xml` preserved from rewrites.
- [x] **Dedicated 404 Page:** Custom branded `NotFound` page with navigation back to Home, Shop, and Contact, plus `noindex` SEO tag.
- [x] **Payment Recovery Route:** Dedicated `/payment-failed` page with retry options and direct support links.
- [x] **React Error Boundary:** Top-level `ErrorBoundary` preventing uncaught runtime component crashes.
- [x] **cPanel / Apache Fallback:** `.htaccess` configured with `mod_rewrite` for traditional web hosts.

### Backend API (Node.js & Express)
- [x] **Clean Server Architecture:** Modular `server/` with controllers, services, middleware, and routes.
- [x] **Product Endpoints:** `GET /api/products`, `GET /api/products/:identifier` (slug / ID).
- [x] **Order Endpoints:** `POST /api/orders`, `POST /api/orders/verify`, `GET /api/orders/:id`.
- [x] **Contact Endpoint:** `POST /api/contact` for customer support inquiries.
- [x] **Health Endpoint:** `GET /api/health` for monitoring and deployment uptime checks.
- [x] **Security Middleware:** CORS whitelist, rate limiting (per-route), input validation, helmet security headers, sanitized error responses (no stack trace leakage).

### Payment Integration (Razorpay)
- [x] **Server-Side Order Creation:** Orders created via Razorpay SDK with server-validated prices.
- [x] **Cryptographic Verification:** HMAC SHA-256 signature verification in constant time (timing-safe).
- [x] **Duplicate Payment Guard:** In-memory check and Supabase database status guard.
- [x] **Secret Isolation:** Key Secret strictly server-side; public Key ID only exposed to client.

### Database Layer (Supabase)
- [x] **PostgreSQL Schema:** `products`, `orders`, `order_items`, `contact_inquiries`.
- [x] **Row-Level Security (RLS):** Strict policies preventing public read/write on sensitive order records; `service_role` backend access only.
- [x] **Seed Data & Fallback:** Complete product catalog seeded in `supabase/seed.sql` with graceful in-memory fallback.

### Email Notification System
- [x] **Multi-Provider Support:** Plug-and-play integrations for Resend and Brevo.
- [x] **Internal Order Alert:** Automated notification to Himroots operations team on verified payment.
- [x] **Customer Order Confirmation:** Automated email receipt with itemized breakdown and delivery details.
- [x] **Contact Inquiries:** Automated forwarding of customer contact submissions.
- [x] **Non-Blocking Resilience:** Email dispatch failures never block or invalidate payment verification.

### SEO & Performance
- [x] **Search Metadata:** Dynamic title and description tags across all key views.
- [x] **Social Sharing:** Open Graph and Twitter Card tags configured with brand imagery.
- [x] **Search Crawlers:** Production `robots.txt` and canonical `sitemap.xml` with all core routes.

---

## 2. Launch Action Items

### Client Actions (Before Live Launch)
- [ ] **Razorpay Live Activation:** Complete business KYC and activate live API keys (`rzp_live_...`).
- [ ] **Email Domain Authentication:** Configure SPF, DKIM, and DMARC DNS records for `himroots.in` via Resend or Brevo.
- [ ] **Mailbox Setup:** Verify incoming and outgoing inboxes for `orders@himroots.in` and `support@himroots.in`.
- [ ] **Domain Binding:** Attach production domain `himroots.in` (and `www.himroots.in`) in the hosting panel.
- [ ] **SSL / HTTPS:** Ensure active SSL certificate and enforce HTTPS redirect.

### Developer Deployment Actions
- [ ] **Supabase Setup:** Create live Supabase project and execute `supabase/schema.sql` and `supabase/seed.sql`.
- [ ] **Backend Hosting:** Deploy `server/` to Render, Railway, or Fly.io with production environment variables set.
- [ ] **Frontend Environment:** Configure `VITE_API_BASE_URL` and `VITE_RAZORPAY_KEY_ID` in Vercel or target frontend environment.
- [ ] **Production Health Check:** Confirm `GET https://<api-domain>/api/health` returns status `200 OK`.

### Live Verification Checklist
- [ ] **End-to-End Live Transaction:** Run a real ₹10+ checkout with a live card to test payment capture, Supabase order status update, and email dispatch.
- [ ] **Email Receipt Delivery:** Verify receipt arrival in both customer and store inboxes.
- [ ] **Direct URL Navigation:** Validate direct browser access to `/about-sea-buckthorn`, `/products`, `/cart`, `/checkout`, and `/contact`.
- [ ] **404 Routing:** Confirm invalid URLs properly display the Himroots 404 page.

---

## 3. Post-Launch Roadmap (Out of Scope for Initial Launch)

> The initial launch utilizes an agile, streamlined operational model. The following enhancements are planned for future phases:

- [ ] **Customer Accounts:** Order history and saved address management.
- [ ] **Merchant Admin Portal:** Web UI for order status updates, fulfillment notes, and stock levels.
- [ ] **Courier API Integration:** Automated pickup scheduling and AWB generation (e.g., Shiprocket / Delhivery).
- [ ] **Shipment Tracking:** Live tracking page for customers.
- [ ] **Promotions Engine:** Discount coupon codes and referral links.
- [ ] **Automated Returns & Refunds:** In-app return initiation and automated refund processing.
- [ ] **Razorpay Webhooks:** Secondary asynchronous payment reconciliation hook.
- [ ] **Distributed Cache:** Redis layer for multi-region rate-limiting and session scaling.

---

### Fulfillment Workflow (Phase 1)

```
Customer pays on website
       ↓
Order recorded in Supabase (status: paid)
       ↓
Instant email alert sent to orders@himroots.in & Customer confirmation sent
       ↓
Himroots operations team packs & ships via designated courier
       ↓
Tracking details shared with customer via support@himroots.in
```
