# Himroots Wellness — Project Checklist & Roadmap

**Status:** Code Complete & Production-Ready  
**Last Updated:** September 2026

---

## 1. Completed Implementations

### Frontend & Brand Experience (React + Vite)
- [x] **Universal Responsive Layouts:** All 9 primary pages audited and optimized for Mobile (360px–502px) and Laptop (1024px–1536px) with zero horizontal overflow (`scrollWidth <= window.innerWidth`).
- [x] **Standardized Container Gutters:** Unified `px-4 sm:px-8 lg:px-12` across all views for balanced margin rhythm.
- [x] **Brand Styling & Editorial Purity:** Luxury dark theme, high-contrast serif typography (Marcellus, Cinzel, Plus Jakarta Sans), pure static editorial presentation (unnecessary animations removed for calm, grounded luxury).
- [x] **Prominent Navbar Logo:** Emblem sized to ~1.5× (`h-[68px] sm:h-[74px] md:h-[80px] lg:h-[84px]`), sitting close to navbar borders without expanding navbar height; separate hero top logo and "Wild Harvested" top badge removed.
- [x] **Hero Content Hierarchy:** Primary "Seabuckthorn Goldenberry", secondary "The Elixir of the Himalayas" in clean two-tier typography.
- [x] **Side-by-Side Formulations:** Available Formulations displayed side-by-side in responsive grid.
- [x] **Touch-Friendly Overflow Wrappers:** The scientific Omega fatty-acid profile table in `/about-sea-buckthorn` and the 18-slide thumbnail gallery in `/products/:slug` utilize smooth horizontal touch-scrolling (`overflow-x-auto`) to protect outer page layout.
- [x] **Mobile Drawer Navigation:** Full slide-out mobile drawer with dynamic viewport height clamping (`max-h-[calc(100dvh-80px)] overflow-y-auto`) and immediate access to social profiles and cart count.
- [x] **Brand Watermark:** Subtle site-wide brand watermark integrated across pages.
- [x] **Cart Architecture:** Persistent Zustand state store, responsive mobile cards, and dedicated `/cart` route.
- [x] **Checkout Flow:** Responsive form cards (`p-4 sm:p-6 md:p-8`), form validation, and live order summary calculation.
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

### Legal & Razorpay Merchant Compliance
- [x] **Standard Placeholder Policy Pages:** Created dedicated, responsive pages for:
  - `/refund-policy` (and `/cancellation-and-refund`) — Cancellation & Refund Policy
  - `/terms-and-conditions` (and `/terms`) — Terms & Conditions
  - `/privacy-policy` (and `/privacy`) — Privacy Policy
  - `/contact` (and `/contact-us`) — Contact Us
- [x] **Compliance Navigation & Footer Links:** Integrated policy links into the desktop & mobile Footer grid, Footer bottom copyright bar, and the Checkout purchase confirmation line.
- [x] **XML Sitemap Indexing:** Added all policy endpoints to `public/sitemap.xml`.

### SEO & Performance
- [x] **Search Metadata:** Dynamic title and description tags across all key views.
- [x] **Social Sharing:** Open Graph and Twitter Card tags configured with brand imagery.
- [x] **Search Crawlers:** Production `robots.txt` and canonical `sitemap.xml` with all core routes.

---

## 2. Launch Action Items

### Client Actions (Before Live Launch)
- [ ] **Update Placeholder Policies with Real Legal Content (High Priority for Razorpay):**
  - [ ] **Cancellation & Refund Policy (`src/pages/RefundPolicy.tsx`):** Review and update return window (currently 7 days placeholder), replacement rules, and fulfillment policy.
  - [ ] **Terms & Conditions (`src/pages/TermsAndConditions.tsx`):** Add official registered legal business/proprietorship entity name, GSTIN, registered corporate address, and Grievance Officer contact details.
  - [ ] **Privacy Policy (`src/pages/PrivacyPolicy.tsx`):** Review user data collection policies and ensure alignment with official business practices.
  - [ ] **Contact Us (`src/pages/Contact.tsx`):** Verify official customer care phone number, email inboxes, and physical sourcing/dispatch address.
- [ ] **Razorpay Live Activation:** Submit the website (`https://himroots.in`) with active policy links to Razorpay compliance team, complete business KYC, and activate live API keys (`rzp_live_...`).
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

## ⚠️ TEMPORARY CREDENTIALS — Must Replace Before Handover

> The `.env` file currently uses the **developer's personal Supabase account** as a temporary database.  
> These credentials **must be replaced** with the client's own accounts before final deployment and handover.

| Credential | Current State | Action Required |
|---|---|---|
| **Supabase URL & Keys** | Developer's temp project (`grcpnlnjpgecdssedwxn`) | Client creates their own Supabase project → replace all `SUPABASE_*` and `VITE_SUPABASE_*` env vars |
| **Postgres Password** | Developer's DB password in `.env` | Rotate after client Supabase project is set up |
| **Razorpay Keys** | Placeholder test values | Client provides live Razorpay keys after KYC |
| **Resend API Key** | Developer's personal key (`re_GzAzHrtt_...`) | Client creates their own Resend account → replaces `RESEND_API_KEY` and `EMAIL_API_KEY` |
| **Email From Address** | `orders@himroots.in` (not verified yet) | Client must complete Resend domain verification for `himroots.in` |

### What's Needed for Resend to Work Fully

Before transactional emails will actually send in production, the client must complete all of the following on their own Resend account:

- [ ] **Create Resend account** at [resend.com](https://resend.com) using a business email
- [ ] **Add domain** `himroots.in` in Resend Dashboard → Domains → Add Domain
- [ ] **Add DNS records** that Resend provides — paste these into Hostinger DNS panel:
  - `TXT` record for **SPF** (authorises Resend to send from `himroots.in`)
  - `CNAME` records for **DKIM** (cryptographically signs outgoing emails — prevents spam flagging)
  - `TXT` record for **DMARC** (tells receiving servers what to do with unauthenticated mail)
- [ ] **Wait for DNS propagation** (5 minutes to 48 hours)
- [ ] **Verify domain status** turns green in Resend dashboard
- [ ] **Get API Key** from Resend Dashboard → API Keys → Create Key
- [ ] Replace `RESEND_API_KEY` and `EMAIL_API_KEY` in Vercel environment variables with client's key
- [ ] Replace `EMAIL_FROM` with `Himroots Wellness <orders@himroots.in>` using client's verified domain
- [ ] Send a test email via the Resend dashboard to confirm delivery

> ⚠️ **Until the domain is verified on the client's Resend account**, emails either won't send at all or will be sent from a Resend fallback address (e.g. `onboarding@resend.dev`), not from `orders@himroots.in`.

> ✅ The `.env` file is gitignored — no secrets are committed to the repository.  
> ❌ Do NOT push `.env` to GitHub. Do NOT share it over chat or email.  
> ✅ When deploying to Vercel, set each variable directly in the Vercel dashboard → Environment Variables.


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

---

## 4. Accounts & Services Required from Client

To launch the Himroots Wellness store with real online payments, order storage, and automated emails, the client must provide access or credentials for the following platforms:

| # | Service / Platform | Purpose | Required Credentials / Details Needed | Setup Status |
|---|---|---|---|---|
| **1** | **Domain Registrar & DNS** <br>*(e.g., GoDaddy, Namecheap, Hostinger, Cloudflare)* | Connect `himroots.in` & `www.himroots.in` to frontend and backend | • DNS management access (or client adds provided A/CNAME/TXT records)<br>• SSL certificate enabled | [ ] Pending |
| **2** | **Razorpay** <br>*(Payment Gateway)* | Process live customer payments (Cards, UPI, Netbanking) | • Business KYC completed & activated for Live Mode<br>• `Key ID` (`rzp_live_...`)<br>• `Key Secret` | [ ] Pending |
| **3** | **Supabase** <br>*(Database BaaS)* | Store products, orders, customer details, and contact inquiries | • Supabase project invited as admin or:<br>• `Project URL`<br>• `anon` public key<br>• `service_role` secret key | [ ] Pending |
| **4** | **Transactional Email** <br>*(Resend or Brevo)* | Send order confirmation emails to customers and new-order alerts to store team | • Account login or API Key (`re_...` or `xkeysib-...`)<br>• Domain verification (SPF, DKIM, DMARC added to DNS) | [ ] Pending |
| **5** | **Business Email Inboxes** <br>*(e.g., Google Workspace, Zoho Mail, cPanel)* | Operational mailboxes for fulfillment and customer support | • `orders@himroots.in` (receives paid order notices)<br>• `support@himroots.in` (receives contact form submissions) | [ ] Pending |
| **6** | **Cloud Backend Hosting** <br>*(e.g., Render, Railway, Fly.io)* | Run the Node.js / Express production API | • Account access or team invite to deploy the backend server | [ ] Pending |
| **7** | **Frontend Hosting** <br>*(Vercel)* | Host the React + Vite static single-page application | • Client Vercel account / team invite (if transferring from developer Vercel) | [ ] Pending |
| **8** | **Courier / Shipping Partner** <br>*(e.g., Shiprocket, Delhivery, India Post, Blue Dart)* | Physical packaging and dispatching of juice bottles | • Operational business shipping account to generate waybills and ship bottles | [ ] Pending |

> **Security Note:** Sensitive credentials (such as `Razorpay Key Secret` and `Supabase Service Role Key`) should only be configured inside the encrypted environment variables of the production backend hosting dashboard (e.g. Render/Railway), and never shared over unencrypted channels or committed to Git.

---

## 5. Required Email IDs — Create Before Launch

All three email inboxes below must exist on the client's email hosting (Hostinger Web Mail, Google Workspace, or Zoho Mail) **before** going live. Each serves a distinct technical role in the application.

| # | Email Address | Role | Used Where | Must-Have? |
|---|---|---|---|---|
| **1** | `orders@himroots.in` | **Order notification inbox** — receives a new-order alert every time a customer places a paid order | `CLIENT_ORDER_EMAIL` env var → `emailService.ts` sends order details here automatically | ✅ Critical |
| **2** | `support@himroots.in` | **Customer support inbox** — receives all contact form submissions from the website's Contact Us page; `Reply-To` is set to the customer's email for one-click replies | `CLIENT_SUPPORT_EMAIL` env var → `emailService.ts` routes contact form here | ✅ Critical |
| **3** | `orders@himroots.in` *(as sender)* | **Transactional sender address** — the "From" address shown to customers on their order confirmation emails. Must be verified on Resend for `himroots.in` | `EMAIL_FROM` env var = `Himroots Wellness <orders@himroots.in>` | ✅ Critical (needs Resend DNS verification) |

> **Note:** Inboxes #1 and #3 use the **same address** (`orders@himroots.in`) — it's both the sender of customer confirmations *and* the recipient of internal order alerts. Only **one** mailbox to create, but it needs to be set up in *both* the email host (to receive) and verified in Resend (to send).

### Email IDs Checklist

- [ ] Create `orders@himroots.in` mailbox on Hostinger (Panel → Emails → Create Mailbox)
- [ ] Create `support@himroots.in` mailbox on Hostinger
- [ ] Verify `himroots.in` domain on Resend (add SPF / DKIM / DMARC DNS records in Hostinger DNS)
- [ ] Add `orders@himroots.in` as a verified sender in Resend dashboard
- [ ] Set `EMAIL_FROM=Himroots Wellness <orders@himroots.in>` in Vercel env vars
- [ ] Set `CLIENT_ORDER_EMAIL=orders@himroots.in` in Vercel env vars
- [ ] Set `CLIENT_SUPPORT_EMAIL=support@himroots.in` in Vercel env vars
- [ ] Send a test order and confirm receipt at `orders@himroots.in`
- [ ] Submit contact form and confirm receipt at `support@himroots.in`

> ⚠️ **Hostinger Note:** Hostinger includes free business email with domains — use it to *receive* mail. For *sending* transactional emails from the app, you still need **Resend** (Hostinger webmail alone cannot be used as an API sender).
