# Himroots Wellness — High-Himalayan Sea Buckthorn Platform

A luxury, responsive, high-performance e-commerce and botanical archive web platform built for **Himroots Wellness**, celebrating the sacred vitality of wild-foraged Himalayan Sea Buckthorn (*Hippophae rhamnoides*).

---

## Table of Contents

- [Architecture & Platform Overview](#architecture--platform-overview)
- [Flagship Botanical Formulations](#flagship-botanical-formulations)
  - [1. Himalayan Sea Buckthorn Juice (Pulp) with Curcumin](#1-himalayan-sea-buckthorn-juice-pulp-with-curcumin)
  - [2. Himalayan Sea Buckthorn Softgel Oil Capsules](#2-himalayan-sea-buckthorn-softgel-oil-capsules)
- [Visual Product Detail Cards (15 High-Resolution Assets)](#visual-product-detail-cards-15-high-resolution-assets)
- [Botanical Archive ("About Sea Buckthorn")](#botanical-archive-about-sea-buckthorn)
- [Key Features & System Design](#key-features--system-design)
  - [1. Single Dynamic Logo Presentation](#1-single-dynamic-logo-presentation)
  - [2. Full Responsiveness & Static Luxury Editorial Design](#2-full-responsiveness--static-luxury-editorial-design)
  - [3. Dynamic Product Detail Pages & Variant Bundles](#3-dynamic-product-detail-pages--variant-bundles)
  - [4. Customer Accounts, Supabase Auth & Cloud Cart Sync](#4-customer-accounts-supabase-auth--cloud-cart-sync)
  - [5. Secure Checkout & Cryptographic Razorpay Payments](#5-secure-checkout--cryptographic-razorpay-payments)
  - [6. Transactional Email System & Support Portal](#6-transactional-email-system--support-portal)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
- [Tech Stack & Libraries](#tech-stack--libraries)
- [Design Tokens & Aesthetics](#design-tokens--aesthetics)
- [Getting Started Locally](#getting-started-locally)
- [Building & Production Deployment](#building--production-deployment)
- [Authentication Verification Script](#authentication-verification-script)
- [Completed Roadmap & Features](#completed-roadmap--features)
- [Official Business & Support Contacts](#official-business--support-contacts)

---

## Architecture & Platform Overview

The platform uses a decoupled, production-grade e-commerce architecture designed for ultra-low latency, zero client secret leakage, strict cryptographic verification, and scalable data persistence:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / BROWSER                                │
│  React 19 + TypeScript + Vite 8 SPA (Tailwind CSS v4, Lucide, Zustand) │
│  Hosted statically: Apache /public_html/ (himroots.in) or Vercel Edge  │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │                               │
       Static Assets / PushState Rewrite           │ REST API Requests
       (Apache .htaccess / Vercel rewrite)         │ (/api/orders, /api/contact)
                   ▼                               ▼
       ┌────────────────────────┐      ┌───────────────────────────────────┐
       │   Static File Host     │      │        Express.js Backend         │
       │   Apache / Vercel Edge │      │   Node.js + TypeScript (Port 5000)│
       └────────────────────────┘      └─┬──────────────┬────────────────┬─┘
                                         │              │                │
                         Database Queries│       Payment│    Transactional│
                         (service_role)  │       Gateway│           Emails│
                                         ▼              ▼                ▼
                                   ┌──────────┐   ┌──────────┐     ┌───────────┐
                                   │ Supabase │   │ Razorpay │     │  Resend   │
                                   │ Postgres │   │ Standard │     │     or    │
                                   │  + Auth  │   │ Checkout │     │   Brevo   │
                                   └──────────┘   └──────────┘     └───────────┘
```

1. **Client-Side SPA:** Built using **React 19, TypeScript, and Vite 8**. Instantaneous route transitions via React Router v7, with cart and auth state managed via Zustand.
2. **Dedicated Trusted Backend API:** Secure Express 5 Node.js service running in `server/` that holds authoritative control over product pricing, order creation, Razorpay HMAC SHA256 cryptographic verification, webhook reconciliation, and transactional email dispatch.
3. **Database & Customer Accounts:** PostgreSQL hosted on Supabase with Row Level Security (RLS) policies, atomic order number generation (`HM-YYYYMMDD-XXXX`), user profiles, saved address book, and bidirectional cloud cart synchronization.

---

## Flagship Botanical Formulations

Himroots focuses exclusively on two lab-verified, wildcrafted Himalayan formulations:

### 1. Himalayan Sea Buckthorn Juice (Pulp) with Curcumin
* **Catalog ID:** `prod_001` | **Slug:** `sea-buckthorn-pulp`
* **Net Volume:** 500 ml glass bottle (unfiltered, cold-pressed liquid pulp)
* **Formulation:** 95.8% Wild Himalayan Sea Buckthorn Berry Pulp + 4.0% Standardized Curcumin Extract (95% curcuminoids) + 0.2% class II food-grade preservatives.
* **Nutritional Density:** 190+ bioactive nutrients, complete Omega 3, 6, 7, and 9 spectrum, up to 28× higher Vitamin C than oranges, and 82.8% measured clinical antioxidant increase over 12 weeks.
* **Pricing & Variants:**
  * **Pack of 1 (500 ml):** ₹899 *(MRP ₹1,199 — 25% OFF)*
  * **Pack of 2 (1000 ml Bundle):** ₹1,699 *(MRP ₹2,398 — 29% OFF)*

### 2. Himalayan Sea Buckthorn Softgel Oil Capsules
* **Catalog ID:** `prod_002` | **Slug:** `sea-buckthorn-capsules`
* **Quantity:** 60 softgels bottle (500mg supercritical cold-pressed oil per softgel)
* **Formulation:** 100% pure cold-pressed wild Himalayan berry and seed oil encapsulated in easy-to-swallow pharmaceutical-grade softgels with natural Vitamin E tocopherols.
* **Targeted Benefits:** Maximum botanical concentration of Palmitoleic Acid (Omega-7) for deep epidermal hydration, mucosal membrane nourishment (dry eyes, oral lining, internal membranes), and anti-aging elasticity.
* **Pricing & Variants:**
  * **Pack of 1 (60 Softgels):** ₹999 *(MRP ₹1,299 — 23% OFF)*
  * **Pack of 2 (120 Softgels Bundle):** ₹1,899 *(MRP ₹2,598 — 27% OFF)*

*All prices are inclusive of taxes. Free express shipping across India on orders over ₹2,000; flat ₹150 shipping fee otherwise.*

---

## Visual Product Detail Cards (15 High-Resolution Assets)

Both product detail pages display tailor-made high-resolution botanical and scientific breakdown image cards:

### Juice (Pulp) Visual Suite (8 Cards)
1. `pulp-omega-profile.jpg` — Rare complete Omega 3, 6, 7, and 9 botanical matrix.
2. `pulp-190-bioactives.jpg` — 190+ bioactive compounds (Vitamins, Flavonoids, SOD).
3. `pulp-vitaminc-comparison.jpg` — Vitamin C density comparison vs oranges and lemons.
4. `pulp-clinical-timeline.jpg` — 12-week clinical transformation timeline (+82.8% antioxidant activity).
5. `pulp-quality-standards.jpg` — Six-tier purity guarantee (Cold-Pressed, Zero Sugar, Heavy Metal Free, cGMP, FSSAI).
6. `pulp-daily-ritual-guide.jpg` — Step-by-step usage ritual (Shake, Dilute 20ml, Sip empty stomach).
7. `pulp-comparison-chart.jpg` — Wild Himalayan raw pulp vs conventional diluted juices.
8. `pulp-pack2-bundle.jpg` — Twin pack 1000ml synergy bundle with maximum value savings.

### Softgel Capsules Visual Suite (7 Cards)
1. `capsules-omega7-cellular.jpg` — Pure Omega-7 cellular hydration & membrane rejuvenation.
2. `capsules-skin-hydration.jpg` — Internal dermatological hydration & barrier restoration.
3. `capsules-mucosal-comfort.jpg` — Clinically recognized relief for dry eyes and delicate mucosal lining.
4. `capsules-clean-ingredients.jpg` — Supercritical CO2 cold-pressed oil, zero synthetic fillers.
5. `capsules-quality-certifications.jpg` — ISO 22000, cGMP, FSSAI certified, heavy metal tested.
6. `capsules-daily-ritual.jpg` — Daily protocol: 1–2 softgels with water post-meal.
7. `capsules-pack2-bundle.jpg` — 120 softgels two-month restorative twin pack bundle.

---

## Botanical Archive ("About Sea Buckthorn")

The application houses a dedicated, multi-chapter illustrated botanical monograph accessible via `/about-sea-buckthorn` and `/sea-buckthorn`:
1. **The Ancient Survival Plant:** Cold-desert adaptations at 12,000+ ft in Ladakh and sub-zero survival (-40°C).
2. **The "Shining Horse" of Antiquity:** Greek etymology (*Hippophae*), Pegasus mythology, and Alexander the Great’s cavalry rations.
3. **Fueling Empires & Ancient Traditions:** 8th-century *rGyud Bzi* Tibetan pharmacopoeia and Genghis Khan’s Mongolian cavalry diets.
4. **Modern Marvels (Space & Sports):** Soviet cosmonaut cosmic radiation shielding, post-Chernobyl dermal recovery, and Olympic endurance.
5. **Biochemical Powerhouse Matrix:** Rare Omega-7, Vitamin C density, and pioneer plant ecological nitrogen-fixing properties.
6. **The Harvest — Earning the Golden Berry:** Winter-shake harvesting at -20°C and supercritical cold processing.

---

## Key Features & System Design

### 1. Single Dynamic Logo Presentation
* The brand emblem is exclusively hosted in the sticky navbar (`BrandLogo.tsx`), scaled to a prominent ~1.5× (`h-[68px] sm:h-[84px]`).
* The separate hero logo and top floating badge have been removed to ensure a clean, authoritative Himalayan luxury aesthetic.

### 2. Full Responsiveness & Static Luxury Editorial Design
* Standardized container gutters (`px-4 sm:px-8 lg:px-12`) across all 11 pages guarantee comfortable viewing from mobile devices (360px) to ultra-wide displays (1536px+).
* Zero horizontal overflow (`scrollWidth <= innerWidth`).
* Scientific tables and gallery thumbnails use touch-scrolling wrappers (`overflow-x-auto`).
* Deliberate removal of distracting bouncy animations in favor of dignified, high-altitude editorial elegance.

### 3. Dynamic Product Detail Pages & Variant Bundles
* `/products/:slug` dynamically renders either product from [`src/data/products.ts`](src/data/products.ts).
* Dynamic thumbnail galleries display the exact corresponding visual cards for each product.
* Interactive variant selector toggles between **Pack of 1** and **Pack of 2 (Value Bundle)** with instant price calculations.

### 4. Customer Accounts, Supabase Auth & Cloud Cart Sync
* Complete patron account portal at `/account` and `/auth` (Login, Registration, Password Reset via `/reset-password`).
* **Profile Management:** Patrons can view and update their full name, phone number, and default delivery preferences.
* **Saved Address Book:** Add, edit, remove, and designate default shipping addresses.
* **Order History & Invoices:** View past orders with real-time fulfillment status badges, item breakdowns, tracking numbers, and printable browser-ready HTML tax invoices.
* **Bidirectional Cloud Cart Synchronization:** When patrons log in, local guest cart items are merged into their remote `user_carts` database record, persisting across devices.

### 5. Secure Checkout & Cryptographic Razorpay Payments
* **Zero Client Price Trust:** Frontend sends only `productId` and `quantity`. Express backend fetches live database prices, calculates subtotal, applies shipping logic, and creates a Razorpay order in paise.
* **Cryptographic Verification:** Webhook and frontend verification use timing-safe HMAC SHA256 (`crypto.timingSafeEqual`).
* **Zero Simulation / Bypasses:** Strict production enforcement. All payments must be verified via authentic Razorpay signatures.
* **Idempotency:** Protected against duplicate callbacks or network replay attacks.

### 6. Transactional Email System & Support Portal
* Automated order alerts dispatched to `orders@himroots.in` and branded customer confirmations sent via Resend or Brevo.
* Payment verification and email dispatch are decoupled: an email provider outage will never corrupt a valid paid order.
* `/contact` portal with honeypot bot trap, sliding-window rate limiting, and automated email forwarding with customer `reply_to`.

---

## Project Architecture & Directory Structure

```
HimRoots/
├── .env.example                     # Comprehensive environment variable template
├── .oxlintrc.json                   # Ultra-fast Oxlint linter configuration
├── index.html                       # SPA HTML5 entrypoint with Google Fonts
├── package.json                     # Monorepo dependencies & scripts
├── PRODUCTS_SPEC.md                 # Authoritative flagship product specifications
├── MANUAL_SETUP_GUIDE.md            # Step-by-step developer & client manual setup guide
├── DEPLOYMENT.md                    # Production build & deployment documentation
├── PRODUCTION_AUDIT.md              # Architectural & readiness audit report
├── SECURITY_AUDIT.md                # Security controls & vulnerability review
├── SECURITY_OPERATIONS.md           # Operational runbooks & incident response procedures
├── TODO.md                          # Comprehensive roadmap & completion status
├── vercel.json                      # Vercel SPA routing & security header rules
├── vite.config.ts                   # Vite bundler config with local /api reverse proxy
├── public/
│   ├── .htaccess                    # Apache mod_rewrite SPA routing configuration
│   ├── about_sea_buckthorn.md       # Botanical research copy
│   ├── favicon.svg / favicon.ico    # Brand favicons & web app manifest
│   ├── sitemap.xml / robots.txt     # Search engine indexing directives
│   └── images/                      # High-res photography & all 15 detail cards
│       ├── himroots-logo.png        # Official brand logo
│       ├── instagram.png            # Official Instagram glyph
│       ├── pulp-*.jpg               # 8 Juice detail cards
│       ├── capsules-*.jpg           # 7 Capsule detail cards
│       └── himalayan-*.jpg          # High-altitude landscape & harvest photos
├── scripts/
│   ├── verify-auth.js               # Diagnostic script for Supabase Auth & tables
│   ├── generate_capsule_cards.py    # Python card generator for capsule visual assets
│   ├── update-svg-and-manifest.js   # Favicon generator helper
│   └── generate-favicons.ps1        # Multi-resolution favicon builder
├── server/                          # Production Node.js + Express API
│   ├── index.ts                     # Express entrypoint & middleware assembly
│   ├── config/env.ts                # Environment variable parser & validator
│   ├── controllers/                 # Route controllers (orders, products, contact)
│   ├── lib/                         # Clients (Supabase service_role, Razorpay, Logger)
│   ├── middleware/                  # Rate limiter, defensive headers, error handler
│   ├── routes/                      # API routes (/api/orders, /api/products, /api/contact)
│   ├── services/                    # Business logic (orderService, emailService, alertService)
│   └── scripts/                     # Automated backend integration test suites
├── src/                             # React 19 Frontend Source
│   ├── main.tsx                     # React DOM entrypoint
│   ├── App.tsx                      # Route switchboard & layout wrapper
│   ├── index.css                    # Tailwind CSS v4 design tokens & fonts
│   ├── components/                  # Modular UI primitives (Navbar, Footer, SEO, Cart)
│   ├── data/products.ts             # Central typed product catalog
│   ├── lib/                         # API caller, Supabase client, Razorpay modal helper
│   ├── pages/                       # 11 Page views (Home, Shop, ProductDetails, Account, etc.)
│   ├── services/                    # User accounts & address book services
│   ├── store/                       # Zustand stores (cartStore with sync, authStore, logoStore)
│   └── types/database.types.ts      # Generated TypeScript database definitions
└── supabase/
    ├── 00_complete_setup.sql        # Single complete SQL script for fresh database setup
    ├── schema.sql                   # Base catalog & orders schema
    ├── seed.sql                     # Initial product seed data
    └── migrations/                  # User accounts, addresses & user_carts migration
```

---

## Tech Stack & Libraries

* **Frontend:** React 19 (`react`, `react-dom`), TypeScript 6, Vite 8, React Router v7 (`react-router-dom`), Zustand 5, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React.
* **Backend:** Node.js, Express 5, CORS, Dotenv, Esbuild, TSX.
* **Database & Auth:** Supabase PostgreSQL (`@supabase/supabase-js`) with Row Level Security.
* **Payments:** Razorpay Node SDK (`razorpay`) with client-side checkout modal.
* **Transactional Email:** Resend / Brevo via native REST API calls.
* **Code Quality & Build:** Oxlint (0 warnings, 0 errors), TypeScript compiler (`tsc -b`).

---

## Design Tokens & Aesthetics

The visual language embodies **Himalayan Eco-Luxury**:
* **Obsidian Coal (`#0f0b08`):** Deep volcanic dark background.
* **Espresso Surfaces (`#18110d`, `#1b130f`):** Card panels and elevated containers.
* **Gold Leaf Foil (`#e6b85c`, `#f3d489`):** Accent typography, borders, and badges.
* **Mountain Ember (`#ea580c`):** Vibrant sea buckthorn berry highlight color.
* **Typography:** Premium serif headings paired with clean, geometric sans-serif body typography.

---

## Getting Started Locally

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/akshhq/HimRoots.git
   cd HimRoots
   npm install
   ```
2. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your Supabase, Razorpay, and Email credentials.

### Development Commands
* **Run Both Frontend & Backend Concurrently:**
  ```bash
  npm run dev:all
  ```
* **Run Frontend Only (Port 5173):**
  ```bash
  npm run dev
  ```
* **Run Backend Only (Port 5000):**
  ```bash
  npm run server
  ```
* **Run Automated Backend Integration Tests:**
  ```bash
  npm run test:backend
  ```
* **Run Oxlint Linter:**
  ```bash
  npm run lint
  ```

---

## Building & Production Deployment

### 1. Dual Production Build
Compile both the optimized Vite client distribution and the bundled Express server:
```bash
npm run build
```
* **Client output:** `dist/` (contains `index.html`, minified JS/CSS, images, and `.htaccess`).
* **Server output:** `dist-server/index.js` (bundled standalone Node.js server).

### 2. Client Deployment (Apache / cPanel or Vercel)
* **Apache / cPanel:** Upload the contents of `dist/` into `/public_html/`. The included `.htaccess` automatically manages HTML5 client-side pushState rewrites to `index.html`.
* **Vercel:** Connect the repository, set build command to `npm run build:client`, and output directory to `dist`. The included `vercel.json` provides rewrite and security headers.

### 3. Server Deployment (Render / Railway / VPS)
* Set environment to Node.js 18+.
* Build command: `npm run build:server`
* Start command: `node dist-server/index.js`
* Set production environment variables (`NODE_ENV=production`, `PORT=5000`, `CORS_ORIGIN=https://himroots.in,https://www.himroots.in`, etc.).

---

## Authentication Verification Script

To verify that your Supabase credentials, auth services, and database tables are fully operational:
```bash
node scripts/verify-auth.js
```
The script performs automated end-to-end checks:
1. Validates connection to the Supabase URL.
2. Checks connectivity for `products`, `orders`, `profiles`, `addresses`, and `user_carts`.
3. Verifies RLS policies and service role administrative permissions.

---

## Completed Roadmap & Features

- [x] **High-Altitude Himalayan Editorial Aesthetic:** Unified sticky navbar logo, serene static luxury layouts, and zero visual clutter.
- [x] **Dual Flagship Catalog:** Himalayan Sea Buckthorn Juice (Pulp) and Pure Softgel Oil Capsules with Pack of 1 and Pack of 2 bundles.
- [x] **15 Tailor-Made Image Cards:** 8 detail cards for Juice, 7 detail cards for Capsules.
- [x] **Complete Botanical Archive:** Comprehensive 6-chapter historical and scientific monograph.
- [x] **Full Mobile & Desktop Responsiveness:** Standardized gutters (`px-4 sm:px-8 lg:px-12`) with zero horizontal overflow.
- [x] **Customer Accounts & Profiles:** Registration, login, password recovery, saved address book, and order history with printable invoices.
- [x] **Persistent & Cloud-Synced Cart:** Bidirectional synchronization between local browser storage and Supabase `user_carts`.
- [x] **Server-Side Price Authority:** Cart totals computed strictly by the Express backend; zero client pricing trusted.
- [x] **Cryptographic Razorpay Payments:** HMAC SHA256 signature verification, timing-safe equality, and zero simulation bypasses.
- [x] **Automated Order Alerts & Email Dispatch:** Branded emails to customer and merchant operations via Resend / Brevo.
- [x] **Contact & Support Portal:** Anti-spam honeypot defense, sliding-window rate limiting, and automated forwarding.

---

## Official Business & Support Contacts

* **Support Telephone:** `+91 98715 20888` / `9871520888`
* **Customer Support:** `support@himroots.in`
* **Order Processing:** `orders@himroots.in`
* **Sales Inquiries:** `Sales@himroots.in`
* **General Information:** `Info@himroots.in`
* **Customer Care:** `Customercare@himroots.in`
* **Official Website:** [himroots.in](https://himroots.in)
* **Official Instagram:** [@himroots.wellness](https://www.instagram.com/himroots.wellness/)

*(Note: In accordance with brand communication guidelines, only the About page lists all departmental emails together; specific touchpoints feature their dedicated contact channel).*

---

&copy; Himroots Wellness. All rights reserved. Sourced from the Indian Himalayas.
