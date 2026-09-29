# Himroots Wellness — Production Readiness & Architecture Audit

**Date:** September 2026  
**Audited Target:** Himroots Wellness E-Commerce Platform  
**Status:** Pre-Production Assessment for Commercial Deployment  

---

## 1. Current Architecture

The Himroots Wellness platform currently operates as a **hybrid monorepo** consisting of a React Single-Page Application (SPA) frontend and a lightweight Express.js API backend, backed by Supabase PostgreSQL and integrated with Razorpay and transactional email services.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / BROWSER                                │
│  React 19 + Vite 8 SPA (Tailwind CSS v4, Lucide Icons, Zustand)        │
│  Hosted statically in /public_html/ (Apache HTTP Server)               │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │                               │
       Static Assets / HTML5 PushState             │ REST API Calls
       (/public_html/.htaccess rewrite)            │ (/api/orders, /api/contact)
                   ▼                               ▼
       ┌────────────────────────┐      ┌───────────────────────────────────┐
       │   Apache Web Server    │      │        Express.js Backend         │
       │   (Shared / cPanel)    │      │   Node.js + TypeScript (tsx)      │
       └────────────────────────┘      └─┬──────────────┬────────────────┬─┘
                                         │              │                │
                         Database Queries│       Payment│    Transactional│
                         (Service Role)  │       Gateway│           Emails│
                                         ▼              ▼                ▼
                                   ┌──────────┐   ┌──────────┐     ┌───────────┐
                                   │ Supabase │   │ Razorpay │     │  Resend   │
                                   │ Postgres │   │ Standard │     │     or    │
                                   │  (RLS)   │   │ Checkout │     │   Brevo   │
                                   └──────────┘   └──────────┘     └───────────┘
```

### Core Architecture Components

| Layer | Technology | Current Implementation | Production Suitability |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`react` 19.2.8, `react-dom` 19.2.8) | Component-driven UI using modern hooks | ✅ Excellent performance & bundle size |
| **Styling & Design System** | Tailwind CSS v4 (`@tailwindcss/vite` 4.3.3) | Inline CSS variables in `src/index.css`, custom gold/bronze Himalayan palette | ✅ Premium aesthetics, no utility bloat |
| **Build Tooling** | Vite 8 (`vite` 8.3.0) + TypeScript (~6.0.2) | Client build target in `dist/` | ✅ Fast compile, standard static output |
| **Client Routing** | `react-router-dom` v7 (7.18.4) | `BrowserRouter` with HTML5 pushState & catch-all fallback | ⚠️ Requires server-side rewrite rules |
| **State Management** | Zustand 5 (`zustand` 5.0.15) | `cartStore.ts` with `localStorage` persistence | ✅ Ideal for guest checkout sessions |
| **Backend Runtime** | Express 5 (`express` 5.2.1) + Node.js | TypeScript executed via `tsx` dev runner | ⚠️ Needs standalone production build/process |
| **Database** | PostgreSQL 15+ via Supabase | Relational schema with RLS, foreign keys & indexes | ✅ Robust ACID compliance for transactions |
| **Payment Gateway** | Razorpay Standard Checkout SDK | Server-initiated orders with client checkout modal | ⚠️ Missing webhook handler for network drops |
| **Email Dispatch** | Transactional REST API (Resend / Brevo) | Native `fetch` with decoupled status tracking | ✅ Fast, no bloated SDK dependencies |

---

## 2. Current File Structure

```
d:\Clg\Client Work\HimRoots\
├── .env.example                     # Environment template (client + server variables)
├── .gitignore                       # Git exclusion rules (dist, env, node_modules)
├── .oxlintrc.json                   # Oxlint linting configuration
├── index.html                       # SPA entry point with Google Fonts & Razorpay SDK
├── package.json                     # Root manifest (dependencies for both FE and BE)
├── package-lock.json                # Locked dependency tree
├── TODO.md                          # Project roadmap & operational setup tasks
├── tsconfig.app.json                # Frontend TypeScript configuration
├── tsconfig.json                    # TypeScript project references
├── tsconfig.node.json               # Node/Vite build TypeScript configuration
├── vite.config.ts                   # Vite bundler configuration & local dev API proxy
├── public/                          # Static assets copied directly to dist/
│   ├── .htaccess                    # Apache mod_rewrite SPA routing configuration
│   ├── about_sea_buckthorn.md       # Botanical reference copy
│   ├── favicon.png / favicon.svg    # Brand browser icons
│   ├── icons.svg                    # SVG icon sprites
│   └── images/                      # Botanical, bottle, harvesting & packaging photography
├── server/                          # Express.js Backend API
│   ├── index.ts                     # Express server setup, CORS, health check, router mount
│   ├── config/
│   │   └── env.ts                   # Environment variable parser, validation & fallbacks
│   ├── lib/
│   │   ├── razorpay.ts              # Razorpay SDK initialization
│   │   └── supabase.ts              # Supabase Admin client initialization (service_role)
│   ├── middleware/
│   │   └── errorHandler.ts          # Central error handling & message sanitization
│   ├── routes/
│   │   ├── contact.ts               # POST /api/contact with rate limiting & honeypot
│   │   ├── orders.ts                # POST /api/orders/create, verify, GET /api/orders/:id
│   │   └── products.ts              # GET /api/products, GET /api/products/:identifier
│   ├── scripts/                     # Local test suites
│   │   ├── test_email_and_contact.ts# Automated verification for contact & email
│   │   └── test_razorpay_flow.ts    # Automated test suite for orders & payments
│   └── services/
│       ├── emailService.ts          # Resend & Brevo transactional dispatchers
│       ├── orderService.ts          # Price calculation, order persistence, verification
│       └── productService.ts        # Database product querying with fallback
├── src/                             # React SPA Frontend Source
│   ├── App.css                      # Legacy template styles
│   ├── App.tsx                      # App router layout & route definitions
│   ├── index.css                    # Tailwind v4 theme, fonts, custom drop-shadows
│   ├── main.tsx                     # React DOM entry point
│   ├── assets/                      # Bundled images & logos
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx           # Global footer with brand story, links, trust badges
│   │   │   ├── Navbar.tsx           # Sticky black luxury navigation & responsive mobile drawer
│   │   │   └── RootLayout.tsx       # Global layout shell with scroll-to-top behavior
│   │   └── ui/
│   │       ├── BrandLogo.tsx        # Central responsive SVG/PNG brand identity
│   │       ├── Button.tsx           # Reusable luxury gold/outline action button
│   │       └── InstagramIcon.tsx    # Branded Instagram icon component
│   ├── data/
│   │   └── products.ts              # Static product definitions (2 active formulations)
│   ├── lib/
│   │   ├── razorpay.ts              # Client Razorpay checkout.js script loader & types
│   │   ├── supabase.ts              # Supabase browser client (VITE_SUPABASE_ANON_KEY)
│   │   └── utils.ts                 # Utility helper (clsx/twMerge)
│   ├── pages/
│   │   ├── About.tsx                # Brand heritage & wild Himalayan terroir page
│   │   ├── Cart.tsx                 # Persistent shopping bag with free shipping progress
│   │   ├── Checkout.tsx             # 2-step single page guest checkout with Razorpay modal
│   │   ├── Contact.tsx              # Customer care form with category routing
│   │   ├── Home.tsx                 # Landing page with interactive hero, benefits, products
│   │   ├── OrderSuccess.tsx         # Verified confirmation screen with order summary
│   │   ├── ProductDetails.tsx       # Dynamic product page with ingredients & usage rituals
│   │   ├── SeaBuckthorn.tsx         # Comprehensive botanical guide & nutrient breakdown
│   │   └── Shop.tsx                 # Full collection catalog with category filters
│   ├── store/
│   │   ├── cartStore.ts             # Zustand cart store with localStorage synchronization
│   │   └── logoStore.ts             # Zustand logo visibility synchronization
│   └── types/
│       └── database.types.ts        # TypeScript interfaces for Supabase PostgreSQL schema
└── supabase/                        # Database Migrations & Seed
    ├── schema.sql                   # DDL: products, orders, order_items, contact_inquiries, RLS
    └── seed.sql                     # Initial product seed data for production catalog
```

---

## 3. Existing Functionality

1. **Storefront & Catalog Browsing**:
   - Customers can browse two hero formulations: *Himroots Pure Sea Buckthorn Pulp (500ml)* and *Himroots Sea Buckthorn Capsules (60 Softgels)*.
   - Rich product details: nutritional percentages, Ayurvedic botanical synergies, lab certifications, dosage rituals, and packaging specifications.
   - Dedicated educational landing page (`/about-sea-buckthorn`) detailing wild harvesting at 12,000+ feet in Ladakh and Spiti.
2. **Persistent Cart Management**:
   - Guest cart powered by Zustand and synced to browser `localStorage`.
   - Dynamic real-time calculation of subtotal and free shipping qualification bar (orders above ₹2,000 receive free shipping; otherwise ₹150 flat rate).
3. **Guest Checkout Flow**:
   - Streamlined single-page checkout requiring no account creation.
   - Captures first name, last name, email, phone number, and full shipping address with PIN code.
4. **Backend Price Validation & Order Creation**:
   - Backend `POST /api/orders/create` recalculates order amounts against trusted database prices, strictly ignoring any client-provided price tampering.
   - Generates sequential human-readable reference numbers (`HM-YYYYMMDD-XXXX`).
   - Registers a Razorpay order in INR (amounts in paise) and inserts pending order and line-item records into Supabase.
5. **Razorpay Modal Checkout**:
   - Dynamically loads `checkout.js` and launches the native Razorpay modal styled with the Himroots Himalayan gold brand theme (`#D4AF37`).
   - Prefills customer contact information for reduced checkout friction.
6. **Payment Signature Verification**:
   - Backend `POST /api/orders/verify` verifies HMAC SHA256 signature using `crypto.timingSafeEqual` and `RAZORPAY_KEY_SECRET`.
   - Sets order status to `paid` and `order_status` to `processing` in Supabase upon mathematical validation.
   - Implements in-memory and database-level idempotency to prevent duplicate verification requests.
7. **Transactional Order Notifications**:
   - Dispatches a formatted HTML client order notification to `CLIENT_ORDER_EMAIL` containing customer contact information, complete shipping address, line items, and transaction IDs.
   - Dispatches an automated confirmation receipt to the customer's email.
   - Decoupled from payment flow so an email provider timeout never rolls back or cancels a successful payment.
8. **Customer Support & Inquiry Routing**:
   - Contact form (`/contact`) records customer messages in `contact_inquiries` table with categories (Order Support, Payment Issue, Delivery, Returns, General Enquiry).
   - Rate-limited per IP/email and protected with a honeypot field to block automated spam.
   - Forwards inquiries directly to `CLIENT_SUPPORT_EMAIL` with `Reply-To` set to the customer.
9. **Single-Page Application (SPA) Apache Routing**:
   - `public/.htaccess` includes rules to rewrite virtual routes (`/cart`, `/checkout`, `/shop`, `/products/*`) to `index.html` on Apache/cPanel `/public_html/`.

---

## 4. What Can Be Reused

The existing codebase contains well-crafted components and architecture that should be **preserved without redesign**:

1. **Storefront UI & Design System**:
   - All page layouts (`Home.tsx`, `Shop.tsx`, `ProductDetails.tsx`, `About.tsx`, `SeaBuckthorn.tsx`) feature high aesthetic quality, custom typography (`Marcellus`, `Cinzel`, `Plus Jakarta Sans`), and cohesive color tokens.
2. **Cart & Checkout User Experience**:
   - `Cart.tsx` and `Checkout.tsx` components have complete validation, loading states, error messaging, and payment dismissal handling.
3. **Database Schema & Row-Level Security**:
   - `supabase/schema.sql` is well-structured with appropriate data types, constraints (`CHECK (price >= 0)`), indexes, foreign keys with cascade rules, and RLS policies separating public read from service-role write operations.
4. **Backend Security Engine**:
   - `orderService.ts` contains secure HMAC verification, timing-safe equality checks, price recalculation logic, and payload validation.
5. **Email Dispatcher & HTML Templates**:
   - `emailService.ts` contains clean, mobile-responsive HTML email templates styled with Himroots brand aesthetics, supporting both Resend and Brevo REST APIs natively without extra npm packages.
6. **Apache `.htaccess` Configuration**:
   - The `.htaccess` file correctly configures mod_rewrite, MultiViews prevention, and caching headers for SPA deployment.

---

## 5. Problems Found

### 1. Dual Product Catalog (Split-Brain Risk)
* **Location:** `src/data/products.ts`, `src/pages/Shop.tsx`, `src/pages/ProductDetails.tsx`, `server/services/orderService.ts`
* **Issue:** The frontend pages import and render products directly from the static hardcoded file `src/data/products.ts`. Meanwhile, the backend validates prices against the Supabase `products` table.
* **Impact:** If the store owner updates a price, changes stock, or updates a description in the Supabase dashboard, the customer will still see the hardcoded static price on the frontend. When clicking "Pay Now", the backend will calculate the new Supabase price, creating a price mismatch at checkout.
* **Why it must be fixed:** A commercial e-commerce store must have a single source of truth for products and pricing.

### 2. Hardcoded Relative API Paths in Frontend
* **Location:** `src/pages/Checkout.tsx` (lines 99, 141, 204), `src/pages/Contact.tsx` (line 52), `src/pages/OrderSuccess.tsx` (line 54)
* **Issue:** All frontend API calls use hardcoded relative paths: `fetch("/api/orders/create")`, `fetch("/api/orders/verify")`, `fetch("/api/contact")`, `fetch("/api/orders/...")`.
* **Impact:** `VITE_API_BASE_URL` is documented in `.env.example` but never used in the frontend code. If the frontend is hosted on Apache (`/public_html/`) and the backend API is deployed to a separate domain or port (such as Render, Railway, or a subdomain like `api.himroots.in`), all frontend API calls will hit Apache at `https://himroots.in/api/...`, resulting in Apache returning `index.html` (HTTP 200 HTML) instead of JSON, crashing the checkout with:
  `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`.
* **Why it must be fixed:** Production frontends and backends frequently run on separate services or subdomains, requiring a configurable API base URL.

### 3. Missing Standalone Backend Production Build & Scripts
* **Location:** `package.json`
* **Issue:** `package.json` contains `"build": "tsc -b && vite build"` which only compiles the frontend into `dist/`. The backend is run via `"server": "tsx server/index.ts"`. However, `tsx` is listed under `devDependencies`.
* **Impact:** When deployed to production platforms (Render, Railway, Heroku, VPS) with `NODE_ENV=production`, package managers skip `devDependencies`. The server start command will crash with `command not found: tsx`. Furthermore, running uncompiled TypeScript via tsx in production increases memory footprint and restart times.
* **Why it must be fixed:** Production Node.js services require either compiled JavaScript (`dist-server/index.js`) or `tsx` promoted to runtime dependencies.

### 4. Lack of Inventory Decrementing
* **Location:** `server/services/orderService.ts`
* **Issue:** While `product.stock` is checked during order calculation (`if (product.stock <= 0) throw new Error(...)`), `stock_quantity` in the Supabase `products` table is **never decremented** when an order is verified and paid.
* **Impact:** Inventory counts will remain unchanged in Supabase regardless of how many units are purchased, leading to potential overselling.
* **Why it must be fixed:** Commercial stores must maintain accurate physical stock counts upon verified payment.

---

## 6. Security Issues (Audit History & Resolutions)

| Severity | Security Concern | Affected File | Resolution Status | Description & Applied Fix |
| :--- | :--- | :--- | :--- | :--- |
| 🟢 **RESOLVED** | **Client-Side Payment Simulation Fallback** | `src/pages/Checkout.tsx` | **FIXED** | Client-side mock payment ID generation completely removed. There is strictly one path to `/order-success`, requiring successful `POST /api/orders/verify` response from the backend. |
| 🟢 **RESOLVED** | **Backend Test Payment Acceptance** | `server/services/orderService.ts` | **FIXED** | Production strictly rejects test signatures and requires live Razorpay credentials. In dev/test, only explicit deterministic tokens are accepted for headless test runners. |
| 🟢 **RESOLVED** | **IDOR PII Exposure on Order Lookup** | `server/routes/orders.ts` | **FIXED** | `GET /api/orders/:identifier` strictly requires a cryptographically random SHA256 `orderToken` query parameter or matching authenticated user session. |
| 🟢 **RESOLVED** | **Permissive Wildcard CORS** | `server/index.ts` | **FIXED** | Wildcard `*` disabled in production. Explicit whitelist applied allowing only configured production frontend origins and local development hosts. |
| 🟢 **RESOLVED** | **Concurrent Order Number Generation Collisions** | `supabase/schema.sql` | **FIXED** | Upgraded to PostgreSQL `order_number_seq` sequence combined with UTC date and collision retry loop, guaranteeing atomic uniqueness. |
| 🟢 **RESOLVED** | **Cash on Delivery (COD) Risks** | Full Stack | **CLOSED** | Business decision confirmed: 100% prepaid Razorpay only. No unverified COD orders allowed. |

---

## 7. Deployment Issues

### 1. The Dual-Host Routing Trap (Apache vs. Express)
The current setup assumes:
- Frontend static assets are deployed to `/public_html/` on an Apache server (e.g. cPanel shared hosting).
- Backend runs as an Express server on Node.js.

On standard cPanel shared hosting, Apache handles all requests to `https://himroots.in/`. Unless Apache is configured to reverse-proxy `/api` requests to a running Node.js process (via `mod_proxy` or CloudLinux Node.js Passenger), any request to `https://himroots.in/api/orders/create` will be handled by Apache's `.htaccess`, which rewrites it to `index.html`. The frontend will receive HTML instead of JSON.

### 2. Missing Reverse-Proxy Rules in `.htaccess`
If the Node.js backend is running locally on the same server (e.g., port 5000), `public/.htaccess` lacks the reverse-proxy directive:
```apache
# Missing: Forward /api requests to local Node server
RewriteRule ^api/(.*)$ http://127.0.0.1:5000/api/$1 [P,L]
```
*(Requires Apache `mod_proxy` and `mod_proxy_http` to be enabled).*

Alternatively, if the backend is hosted on a cloud platform (Render, Railway, etc.), the frontend must use an absolute URL (`VITE_API_BASE_URL=https://api.himroots.in`).

### 3. Ephemeral In-Memory State in Multi-Instance / Serverless Hosting
- `orderService.ts` maintains `localOrdersStore` and `verifiedPaymentsCache` in memory.
- `contact.ts` maintains `rateLimitMap` in memory.
If deployed to a serverless platform (Vercel, Netlify) or autoscaling container (Render with multiple instances), in-memory Maps are wiped on cold restarts and not shared across instances. All persistence must rely strictly on Supabase.

---

## 8. Database Issues

1. **Client Anon Key vs. Service Role Key**:
   - The frontend `src/lib/supabase.ts` uses `VITE_SUPABASE_ANON_KEY`.
   - The backend `server/lib/supabase.ts` uses `SUPABASE_SERVICE_ROLE_KEY`.
   - This distinction is properly maintained: the service role key is never exposed to the client.
2. **Missing Product Management Capability**:
   - There is no admin panel or mutation API for non-technical store managers to create or edit products. Product updates must currently be executed directly via the Supabase Table Editor or SQL queries.
3. **Database Migration Tooling**:
   - Schema and seed files are stored in `supabase/schema.sql` and `supabase/seed.sql` as raw SQL files. While suitable for initial manual execution in Supabase SQL Editor, future schema updates lack a versioned migration runner (e.g., Supabase CLI or Prisma/Drizzle).

---

## 9. Payment Issues

### 1. Missing Razorpay Webhook Handling (Critical for E-Commerce)
In the current flow, payment verification depends entirely on the customer's browser receiving the payment response from the Razorpay modal and submitting it via `fetch("/api/orders/verify")`.

**Real-world failure scenario:**
1. Customer authorizes payment in UPI (e.g. PhonePe / Google Pay).
2. Bank account is debited successfully.
3. Customer switches apps or closes the browser tab before the redirect completes.
4. The frontend verification call never fires.
5. Result: Customer is charged, but the order remains in `payment_status: 'pending'` in Supabase, no fulfillment email is sent, and customer receives no confirmation.

**Required Solution:**
Implement a server-side webhook endpoint `POST /api/webhooks/razorpay` listening for the `payment.captured` or `order.paid` event, verified using a `RAZORPAY_WEBHOOK_SECRET`.

### 2. Test Simulation Mode Must Be Strictly Disabled in Production
In `orderService.ts`, mock payment IDs are accepted when keys are not configured. A strict guard must enforce:
```ts
if (process.env.NODE_ENV === 'production' && !isRazorpayConfigured) {
  throw new Error("Razorpay live gateway is not configured on production server.");
}
```

---

## 10. Backend Issues

1. **Missing Request Payload Size & Security Headers**:
   - While `express.json({ limit: '1mb' })` is present, security headers via `helmet` (Content Security Policy, X-Frame-Options, X-Content-Type-Options) are missing.
2. **Missing Input Validation Sanitization**:
   - Basic validation exists in `validateOrderInput`, but deep sanitization against XSS/HTML injection in customer notes and address fields before insertion into PostgreSQL is recommended.
3. **Graceful Shutdown**:
   - The Express application does not catch `SIGTERM` or `SIGINT` signals to gracefully close active database connections and pending HTTP requests during deployment restarts.

---

## 11. Recommended Production Architecture

To deploy Himroots Wellness reliably for commercial use, the recommended target architecture is:

```
                            DNS: himroots.in
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
   [Frontend SPA]                                    [Backend API]
   Domain: himroots.in                               Domain: api.himroots.in
   Host: Apache /public_html/ (cPanel)                Host: Render / Railway / Node.js
   Static Vite build with .htaccess                  Express 5 with PM2 / Docker
         │                                                   │
         │ VITE_API_BASE_URL=https://api.himroots.in         │
         └───────────────────────────────────────────────────┤
                                                             ▼
                                              ┌─────────────────────────────┐
                                              │  Supabase PostgreSQL (Prod) │
                                              │  Razorpay Live Gateway      │
                                              │  Resend Verified Domain     │
                                              └─────────────────────────────┘
```

### Architecture Guarantees
1. **Separation of Concerns**: Static files served at high speed by Apache; dynamic APIs, signature verification, and email dispatch handled by Node.js.
2. **Guaranteed Delivery**: Razorpay Webhook captures 100% of successful payments even if the user drops connection.
3. **Data Integrity**: Storefront fetches dynamic prices from the backend/Supabase; zero price mismatch between UI and checkout.

---

## 12. Required Changes

The following prioritized changes are required to bring the system to commercial production standard:

### Priority 1: Critical (Must Fix Before Real Money Transactions)
1. **Disable Payment Simulation in Production**:
   - *Why:* Prevents malicious or accidental creation of "paid" orders without real money transfer.
   - *Action:* Remove mock payment fallback from `Checkout.tsx` and enforce strict signature rejection in `orderService.ts` when `NODE_ENV === 'production'`.
2. **Wire `VITE_API_BASE_URL` to Frontend API Calls**:
   - *Why:* Enables the frontend to communicate with the backend whether hosted on the same origin (via proxy) or on a dedicated API domain (`api.himroots.in`).
   - *Action:* Create a centralized API client utility (`src/lib/api.ts`) that prepends `import.meta.env.VITE_API_BASE_URL || ''` to all endpoints.
3. **Implement Razorpay Webhook Endpoint**:
   - *Why:* Captures payments when customer mobile browsers drop or close before the frontend callback fires.
   - *Action:* Add `POST /api/webhooks/razorpay` with raw body signature verification and order state reconciliation.
4. **Secure Order Success Lookup (IDOR Protection)**:
   - *Why:* Protects customer personal information (name, address, phone number) from unauthorized public access.
   - *Action:* Issue a signed HMAC access token or secure random token upon order creation, required to query `GET /api/orders/:identifier`.

### Priority 2: Operational Reliability
5. **Synchronize Frontend Catalog with Supabase**:
   - *Why:* Ensures changes to prices, stock, or product descriptions made by the client in Supabase immediately reflect on the website.
   - *Action:* Connect `Shop.tsx` and `ProductDetails.tsx` to `getStoreProducts()` / `GET /api/products` with fallback to static data.
6. **Implement Stock Decrementing on Verified Payment**:
   - *Why:* Prevents overselling when product inventory is depleted.
   - *Action:* Decrement `stock_quantity` in `products` table within the payment verification transaction.
7. **Production Server Build & Start Script**:
   - *Why:* Ensures Node.js production hosts can install dependencies and run the server without development tools.
   - *Action:* Add a build script for the server (or move `tsx` to runtime dependencies) and configure `"start": "node dist-server/index.js"`.
8. **Restrict CORS Origins**:
   - *Why:* Prevents unauthorized third-party websites from submitting requests to the backend.
   - *Action:* Configure CORS in `server/index.ts` to only permit `https://himroots.in`, `https://www.himroots.in`, and localhost in development.

---

## 13. Client Manual Setup

These tasks must be performed by the client/business owner:

### A. Supabase (Database)
1. Create a Supabase project at [supabase.com](https://supabase.com) in the **Mumbai, India (`ap-south-1`)** region for minimum latency.
2. In the **SQL Editor**, paste and run [`supabase/schema.sql`](supabase/schema.sql).
3. In the **SQL Editor**, paste and run [`supabase/seed.sql`](supabase/seed.sql).
4. Go to **Project Settings > API** and copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (keep confidential)

### B. Razorpay (Payments)
1. Complete business KYC verification at [razorpay.com](https://razorpay.com).
2. Navigate to **Account & Settings > API Keys** and generate **Live Mode** keys:
   - `RAZORPAY_KEY_ID` (starts with `rzp_live_...`)
   - `RAZORPAY_KEY_SECRET`
3. Under **Payment Methods**, activate:
   - UPI (Google Pay, PhonePe, Paytm, BHIM)
   - Credit & Debit Cards (Visa, MasterCard, RuPay)
   - NetBanking
4. Navigate to **Account & Settings > Webhooks**:
   - Add new webhook URL: `https://api.himroots.in/api/webhooks/razorpay` (or `https://himroots.in/api/webhooks/razorpay`)
   - Active Events: `payment.captured`, `order.paid`
   - Secret: Generate a strong random webhook secret (set as `RAZORPAY_WEBHOOK_SECRET`).

### C. Transactional Email (Resend or Brevo)
1. Register at [resend.com](https://resend.com) (recommended) or [brevo.com](https://brevo.com).
2. Add domain: `himroots.in`.
3. Add DNS records at domain registrar:
   - **DKIM** (TXT/CNAME)
   - **SPF** (TXT)
   - **DMARC** (TXT)
4. Once domain status shows **Verified**, generate a production API Key (`re_...`).
5. Designate internal inboxes:
   - Client order notification inbox (e.g. `orders@himroots.in`)
   - Customer support inbox (e.g. `support@himroots.in`)

---

## 14. Developer Manual Setup

These tasks must be performed by the developer during final production deployment:

1. **Environment Variables Configuration**:
   - Populate production environment variables on the backend hosting platform using `.env.example` as a template:
     ```env
     PORT=5000
     NODE_ENV=production
     SUPABASE_URL=https://[project-id].supabase.co
     SUPABASE_SERVICE_ROLE_KEY=[secret-key]
     RAZORPAY_KEY_ID=rzp_live_[id]
     RAZORPAY_KEY_SECRET=[secret]
     RAZORPAY_WEBHOOK_SECRET=[webhook-secret]
     EMAIL_PROVIDER=resend
     EMAIL_API_KEY=re_[key]
     EMAIL_FROM=Himroots Wellness <orders@himroots.in>
     CLIENT_ORDER_EMAIL=orders@himroots.in
     CLIENT_SUPPORT_EMAIL=support@himroots.in
     ```
2. **Frontend Production Build**:
   - In `.env.production`, set:
     ```env
     VITE_SUPABASE_URL=https://[project-id].supabase.co
     VITE_SUPABASE_ANON_KEY=[anon-key]
     VITE_RAZORPAY_KEY_ID=rzp_live_[id]
     VITE_API_BASE_URL=https://api.himroots.in
     ```
   - Execute: `npm run build`
   - Ensure the generated `.htaccess` in `dist/` is uploaded along with all assets to `/public_html/`.
3. **Server Deployment**:
   - Set up process manager (PM2 / Docker / Render Web Service) with automatic restart on crash (`pm2 start dist-server/index.js --name himroots-api`).
   - Configure HTTPS SSL certificate (mandatory for Razorpay Checkout SDK).
4. **End-to-End Live Smoke Test**:
   - Place a live ₹1 test order with a real UPI/card account.
   - Verify:
     - Payment succeeds on Razorpay dashboard.
     - Order status transitions to `paid` in Supabase.
     - Line items appear in `order_items`.
     - Client fulfillment email arrives with complete address details.
     - Customer confirmation email arrives.
     - Test refund executed via Razorpay dashboard.

---

## 15. Out-of-Scope Items

The following features are non-essential for initial commercial launch and are reserved for subsequent phases:

1. **Automated Courier API Integration** (Shiprocket / Delhivery / BlueDart):
   - Current design relies on manual courier dispatch using client email notifications containing full shipping addresses.
2. **Customer Accounts & Order History Portal**:
   - Guest checkout fully fulfills the current transactional need without requiring password management or authentication infrastructure.
3. **Admin Web Dashboard**:
   - Supabase Table Editor natively serves as the administrative interface for managing products, tracking orders, and viewing contact inquiries.
4. **Automated Return & Refund Workflow**:
   - Returns and refunds are managed via the contact form and processed manually inside the Razorpay dashboard.
5. **Multi-Currency Support**:
   - Indian Rupee (INR) is the sole active transactional currency.
6. **SMS / WhatsApp Order Notifications**:
   - Order notifications are currently handled via transactional email.
