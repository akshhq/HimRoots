# Himroots Wellness — High-Himalayan Sea Buckthorn Platform

A luxury, responsive, high-performance e-commerce and botanical archive web platform built for **Himroots Wellness**, celebrating the sacred vitality of wild-foraged Himalayan Sea Buckthorn (*Hippophae rhamnoides*).

---

## Table of Contents

- [Architecture & E-Commerce Integration Overview](#architecture--e-commerce-integration-overview)
- [Brand Overview & Ethos](#brand-overview--ethos)
- [Flagship Formulations](#flagship-formulations)
- [Botanical Archive ("About Sea Buckthorn")](#botanical-archive-about-sea-buckthorn)
- [Key Features & Architecture](#key-features--architecture)
  - [1. Single Dynamic Logo Presentation](#1-single-dynamic-logo-presentation)
  - [2. Comprehensive Mobile & Desktop Responsiveness](#2-comprehensive-mobile--desktop-responsiveness)
  - [3. Full-Featured Product Discovery & Detail Pages](#3-full-featured-product-discovery--detail-pages)
  - [4. Persistent Shopping Cart & Checkout Flow](#4-persistent-shopping-cart--checkout-flow)
  - [5. Official Social Integration](#5-official-social-integration)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
- [Tech Stack & Libraries](#tech-stack--libraries)
- [Design System & Aesthetics](#design-system--aesthetics)
- [Getting Started Locally](#getting-started-locally)
- [Building & Deployment](#building--deployment)
- [Product Data Schema](#product-data-schema)
- [Roadmap & Integrations](#roadmap--integrations)

---

## Architecture & E-Commerce Integration Overview

This platform is structured for a lean, production-grade e-commerce model where the frontend delivers an ultra-fast, premium client-side shopping experience, backed by a serverless/cloud backend for payment security, data persistence, and manual fulfillment workflows.

### 1. Current Architecture
* **Client-Side SPA:** Built using **React 19, TypeScript, and Vite 8**.
* **Zero Legacy Server Overhead:** The entire frontend is rendered client-side with lightning-fast route transitions via React Router v7.
* **Decoupled State Management:** Cart items and single-logo visibility states are managed independently via Zustand stores, with cart persistence backed by browser `localStorage`.

### 2. Existing Frontend
* **Fully Built & Production-Styled:** Includes all user-facing landing, storytelling, catalog, product details, cart, checkout, success, and contact views.
* **Component Reusability:** Every page is composed of modular layout and UI primitives (`RootLayout`, `Navbar`, `Footer`, `BrandLogo`, `Button`, `InstagramIcon`) following Tailwind CSS v4 design tokens.
* **Static Product Layer:** The catalog currently references a typed in-memory array (`src/data/products.ts`) containing full nutritional, percentage, pricing, and packaging metadata for both flagship products.

### 3. Backend / API Architecture (Node.js + Express)
* **Dedicated Trusted Execution Layer:** A secure, modular **Node.js + Express** server located in [`server/`](file:///d:/Clg/Client%20Work/HimRoots/server):
  * Entrypoint: [`server/index.ts`](file:///d:/Clg/Client%20Work/HimRoots/server/index.ts)
  * Port: `5000` (development default, proxied seamlessly by Vite via [`vite.config.ts`](file:///d:/Clg/Client%20Work/HimRoots/vite.config.ts)).
  * Secret Protection: Strict segregation of client variables (`VITE_*`) from private server secrets (`RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`).
* **Core Responsibilities:**
  1. **Product Retrieval:** Serves verified catalog items via `/api/products` (Supabase query with fallback to static catalog).
  2. **Order Validation & Price Verification:** Recomputes product line totals from database values, computes subtotals, applies zero shipping fee (complimentary shipping across India), and generates a human-readable order number (`HM-YYYYMMDD-XXXX`).
  3. **Razorpay Payment Preparation:** Creates official Razorpay order instances in paise via Razorpay Node SDK.
  4. **Payment Signature Verification:** Cryptographically verifies incoming `razorpay_signature` using HMAC SHA256 before updating order status to `paid`.
  5. **Contact Inquiries:** Persists form submissions directly to the `contact_inquiries` table.
* **API Endpoints:**
  * `GET /api/health` — Integration status check (Supabase & Razorpay connection states).
  * `GET /api/products` — Retrieve all active products.
  * `GET /api/products/:identifier` — Retrieve single product by slug or ID.
  * `POST /api/orders/create` — Validates cart items, verifies prices, creates Razorpay order, persists order to Supabase.
  * `POST /api/orders/verify` — Validates HMAC SHA256 payment signature and marks order as paid.
  * `GET /api/orders/:identifier` — Safe order receipt lookup for the order-success screen.
  * `POST /api/contact` — Receives and stores customer inquiries.

### 4. Database Layer (Supabase PostgreSQL)
* **Storage Engine:** Managed PostgreSQL on [Supabase](https://supabase.com) (recommended region: South Asia / Mumbai `ap-south-1`).
* **Migration & Seed Files:**
  * Schema Migration: [`supabase/schema.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/schema.sql)
  * Catalog Seed Data: [`supabase/seed.sql`](file:///d:/Clg/Client%20Work/HimRoots/supabase/seed.sql)
  * TypeScript Types: [`src/types/database.types.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/types/database.types.ts)
  * Supabase Client Helper: [`src/lib/supabase.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/lib/supabase.ts) (with static fallback)
* **Core Schemas:**
  1. **`products`**:
     * Fields: `id`, `name`, `slug`, `tagline`, `script_quote`, `description`, `price`, `original_price`, `volume`, `images`, `category`, `ingredients`, `detailed_ingredients` (JSONB), `benefits`, `certifications`, `directions`, `packaging_feature`, `stock_status` (`in_stock`, `low_stock`, `out_of_stock`), `stock_quantity`, `rating`, `reviews_count`, `is_featured`, `created_at`, `updated_at`.
     * Seeded with Himroots' 2 flagship formulations.
  2. **`orders`**:
     * Fields: `id` (UUID), `order_number` (Unique human-readable, e.g. `HM-20260924-0001`), `customer_name`, `email`, `phone`, `shipping_address`, `city`, `state`, `pincode`, `country` (India), `subtotal`, `shipping_fee`, `discount`, `total`, `payment_status` (`pending`, `paid`, `failed`, `refunded`), `order_status` (`received`, `processing`, `packed`, `shipped`, `delivered`, `cancelled`), `razorpay_order_id`, `razorpay_payment_id`, `notes`, `paid_at`, `created_at`, `updated_at`.
  3. **`order_items`**:
     * Fields: `id` (UUID), `order_id` (FK -> `orders.id` ON DELETE CASCADE), `product_id` (FK -> `products.id`), `product_name` (immutable name snapshot), `quantity`, `price` (immutable price snapshot), `subtotal`, `created_at`.
  4. **`contact_inquiries`**:
     * Fields: `id` (UUID), `name`, `email`, `phone`, `subject`, `message`, `status` (`unread`, `read`, `responded`, `archived`), `created_at`.
* **Human-Readable Order Number Generator:**
  * Implemented via a PostgreSQL PL/pgSQL function `public.generate_order_number()`.
  * Generates format `HM-YYYYMMDD-XXXX` based on current UTC date and daily sequence.
* **Row Level Security (RLS) Policies:**
  * `products`: Public can read (`SELECT USING (true)`). Mutations restricted strictly to `service_role`.
  * `orders`: Public read and write are completely denied (`USING (false)`). Strictly managed server-side via `service_role`. Customers cannot read other orders or tamper with payment states.
  * `order_items`: Direct public read/write denied. Access restricted to `service_role`.
  * `contact_inquiries`: Public can insert new inquiries (`WITH CHECK (true)`). Reading or modifying messages is restricted to `service_role`.
* **Manual Setup Steps:**
  1. Create a Supabase project at [supabase.com](https://supabase.com).
  2. Open the **SQL Editor** tab.
  3. Paste the contents of `supabase/schema.sql` and run.
  4. Paste the contents of `supabase/seed.sql` and run.
  5. Copy the Project URL, Anon Key, and Service Role Key into your `.env` configuration.

### 5. Payment System (Implemented: Razorpay Secure Flow)
* **Gateway:** **Razorpay Standard Checkout** (INR / Indian Rupee transactions).
* **Payment Methods:** Full coverage of UPI (GPay, PhonePe, Paytm), Credit & Debit Cards (RuPay, Visa, Mastercard), and NetBanking.
* **Security & Architectural Rules:**
  1. **Zero Secret Exposure:** `RAZORPAY_KEY_SECRET` resides strictly on the backend and is NEVER bundled into client JavaScript. Frontend only interacts with public `key_id`.
  2. **Server-Side Price Authority:** Frontend prices are NEVER trusted. The backend queries product prices from the database/catalog, computes the real subtotal, applies shipping logic (free above ₹2000, else ₹150), and creates the Razorpay order in paise.
  3. **Backend Cryptographic Verification:** Orders are NEVER marked as paid based on client callbacks alone. The backend cryptographically verifies the payment signature using HMAC SHA256 with timing-safe comparison.
  4. **Strict Idempotency:** Duplicate payment callbacks or retried requests are safely recognized (`alreadyProcessed: true`), preventing multiple paid records or corrupted order states.
  5. **Separate Payment & Email Lifecycles:** Payment status updates and email notification triggers are fully decoupled so an email delivery issue never affects verified payment records.
* **Execution Flow:**
  1. Customer reviews cart and completes shipping details at `/checkout`.
  2. Frontend sends cart items and customer/shipping information to `POST /api/orders/create`.
  3. Backend validates products, calculates authentic totals, generates `HM-YYYYMMDD-XXXX` order number, creates a Razorpay order, persists the pending order, and returns public order metadata.
  4. Frontend opens the Razorpay modal (`new window.Razorpay(options)`).
  5. Customer completes payment via UPI, Card, or NetBanking.
  6. Frontend receives `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` and posts it to `POST /api/orders/verify`.
  7. Backend verifies HMAC SHA256 signature, updates order to `payment_status: 'paid'`, and records the payment timestamp.
  8. Frontend clears the cart store and smoothly transitions to `/order-success` displaying the order reference, paid status, and customer support contacts.
  9. If customer cancels or dismisses the modal, frontend gracefully preserves all entered form values and cart state.

### 6. Email System & Contact/Support Portal (Implemented)
* **Provider Support:** Seamless transactional delivery via **Resend** (default) or **Brevo** via native REST APIs with zero SDK bloat.
* **Security & Architectural Rules:**
  1. **Strict Decoupling from Payments:** Payment verification and email dispatch are segregated. If the email provider encounters an API rate limit, downtime, or invalid credentials, the order **remains paid** and the failure is recorded in server logs and stored under `email_status = 'failed'` in the database.
  2. **Client Order Notification:** Dispatches `New Order - {Order Number}` to `CLIENT_ORDER_EMAIL` (`orders@himroots.com`) containing complete customer info, shipping destination, itemized product breakdown, unit prices, subtotal, shipping fee, total paid, and Razorpay Order/Payment IDs.
  3. **Customer Confirmation Receipt:** Dispatches clean order confirmation to `customer.email` with order reference, items purchased, and customer care contact details.
  4. **Direct Contact / Support Portal:**
     * Connects `/contact` to `POST /api/contact`.
     * Supports categories: `Order Support`, `Payment Issue`, `Delivery Issue`, `Return/Refund`, `Product Query`, `General Enquiry`, `Other`.
     * Accepts optional Order Reference ID (`orderId`).
     * Persists inquiry in Supabase `contact_inquiries` table.
     * Forwards inquiry to `CLIENT_SUPPORT_EMAIL` (`support@himroots.com`) with customer's email set as `reply_to` for one-click manual replies.
     * Protected by sliding-window rate limiting (max 5 requests / 15 min per IP/email), honeypot bot trap (`website_source_ref`), and strict server validation.
* **Manual Setup & Domain Verification:**
  1. Create account on [Resend](https://resend.com) or [Brevo](https://brevo.com).
  2. Add sending domain (e.g. `himroots.com`) and add DNS records (DKIM, SPF, MX/TXT) at your domain registrar.
  3. Generate API Key and set `EMAIL_API_KEY=re_...` in `.env`.
  4. Configure `EMAIL_FROM=Himroots Wellness <orders@himroots.com>`.
  5. Configure `CLIENT_ORDER_EMAIL=orders@himroots.com` and `CLIENT_SUPPORT_EMAIL=support@himroots.com`.

### 7. Required Client Accounts
* **Supabase:** Managed PostgreSQL database (`orders`, `order_items`, `products`, `contact_inquiries`).
* **Razorpay:** Merchant payment gateway (with completed KYC for live settlements).
* **Resend or Brevo:** API key and verified sending domain for transactional order alerts and customer inquiries.
* **Repository Access:** GitHub repository access for automated deployment pipelines.
*(Note: Domain and website hosting are already managed by the client).*

---

## Brand Overview & Ethos

**Himroots Wellness** bridges ancient Himalayan Ayurvedic healing with modern botanical purity standards:

* **Terroir & Origin:** Wild-foraged from the trans-Himalayan cold deserts of **Ladakh, Spiti, and Kinnaur** at altitudes exceeding **12,000+ feet**.
* **Uncompromising Purity:** 100% wild-sourced, zero chemical monoculture agriculture, zero added sugar, and zero artificial preservatives.
* **Tagline:** *"Nature's Goodness in Every Sip"*
* **High-Altitude Adaptation:** Thriving through brutal -40°C glacial winters and intense high-altitude UV radiation, the Sea Buckthorn shrub naturally supercharges its golden berries with **190+ bioactive nutrients**, unmatched concentrations of **Vitamins C & E**, and the rarest essential fatty acid: **Omega-7 (Palmitoleic acid)**.
* **Community Empowerment:** Ethically harvested in partnership with local Himalayan tribal self-help collectives and forager cooperatives.
* **Official Instagram:** [@himroots.wellness](https://www.instagram.com/himroots.wellness/)

---

## Flagship Formulations

Himroots focuses exclusively on two specialized, lab-verified formulations:

| Formulation | Category | Net Volume | Price | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Himroots Pure Sea Buckthorn Pulp** | Liquid Elixir | 500 ml | ₹999 <del>₹1,299</del> | 90% wild Himalayan raw berry pulp + 5 synergistic Ayurvedic herbs (*Bhoomi Amla, Ashwagandha, Makoy, Punarva, Safed Musli*). Formulated for morning vitality, liver detox, digestive balance, and immune defense. |
| **Himroots Pure Sea Buckthorn Capsules** | Omega Softgels | 60 Softgels | ₹1,199 <del>₹1,499</del> | 100% pure cold-pressed seed & berry oil encapsulated in vegetarian softgels. Peak concentration of rare Omega-7, Omegas 3, 6, 9, and natural Vitamin E for deep cellular hydration, dry eye relief, and radiant skin glow. |

---

## Botanical Archive ("About Sea Buckthorn")

The application houses a dedicated, multi-chapter illustrated botanical monograph accessible via `/about-sea-buckthorn` and `/sea-buckthorn`:

1. **The Ancient Survival Plant:**
   * Clarifies that Sea Buckthorn (*Hippophae rhamnoides*) is a cold-desert mountain shrub, not an ocean plant.
   * Explores altitude adaptations at 12,000+ ft in Ladakh and extreme thermal endurance (-40°C to +35°C).
2. **The "Shining Horse" of Antiquity:**
   * Classical etymology: *Hippophae* = *hippos* (horse) + *phaos* (shining light).
   * The Pegasus mythology: Wild sea buckthorn berries as the celestial diet of the winged horse.
   * Alexander the Great’s 4th-century BCE campaigns feeding wild berries to horses and war troops for stamina.
   * Historic marathon messengers (Pheidippides) consuming berries to delay muscle fatigue.
3. **Fueling Empires & Ancient Traditions:**
   * 8th-century CE codification in the Tibetan *rGyud Bzi* (The Four Books of Pharmacopoeia) and Himalayan Ayurveda.
   * 13th-century Mongol Empire: Genghis Khan ordering sea buckthorn cavalry rations for stamina across sub-zero steppes.
4. **Modern Marvels (Space & Sports):**
   * Soviet Cosmonaut Space Race program utilizing Sea Buckthorn oil for cosmic radiation shielding.
   * Dermal recovery applications post-Chernobyl.
   * 1992 Olympic Games official endurance beverage for international athletes.
   * Sustenance for Mount Everest and high-altitude Himalayan mountaineering expeditions.
5. **Biochemical Powerhouse Matrix:**
   * Rare **Omega-7 (Palmitoleic acid)**: Restores mucous membranes, cell hydration, and elasticity.
   * **Vitamin C**: Up to 12x vs. oranges and 100x vs. lemons.
   * **190+ Bioactives**: Complete Omega spectrum (3, 6, 9, 7), carotenoids, flavonoids, super-oxide dismutase.
   * **Ecological Pioneer**: Nitrogen-fixing symbiosis preventing soil erosion across trans-Himalayan valleys.
6. **The Harvest — Earning the Golden Berry:**
   * Foraging through vicious defensive thorns.
   * Traditional sub-zero **"Winter Shake"** harvesting at -20°C to harvest frozen berries without puncturing skin.
   * Flash-freezing and cold-milling rituals.
7. **Interactive Cross-Links:**
   * Direct access from product-specific pages, navigation headers, search banners, and footer archives.

---

## Key Features & Architecture

### 1. Single Dynamic Logo Presentation
Per brand requirements, the website **never displays the logo twice simultaneously**:
* **Home Page Hero Section:** The primary logo emblem is centered prominently in the hero section with a warm botanical aura.
* **Sticky Navbar:** Using an `IntersectionObserver` paired with Zustand (`src/store/logoStore.ts`), the top navigation logo remains hidden while the hero logo is on screen. The moment the user scrolls past the hero emblem, the navbar logo smoothly animates into view.
* **Internal Pages:** Automatically reveals the navbar logo on all secondary pages (`/shop`, `/products/:slug`, `/about-sea-buckthorn`, `/about`, `/contact`, `/cart`).

### 2. Comprehensive Mobile & Desktop Responsiveness
* Optimized for mobile devices (390px, 412px, 768px, 1024px, 1440px+).
* Zero dead whitespace above the hero (tightened < 1cm / 12–16px vertical gap between sticky navbar and emblem).
* Slide-out mobile navigation drawer with active route indicators and quick links to Instagram.
* Responsive product gallery with smooth thumbnail scrolling and touch-friendly controls.

### 3. Full-Featured Product Discovery & Detail Pages
* **Product Catalog (`/shop`):** Real-time text search, category filters (*All*, *Liquid Elixirs*, *Omega Softgels*), price strike-throughs, and free shipping assurances.
* **Product Details (`/products/:slug`):**
  * Dynamic routing backed by [`src/data/products.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/data/products.ts).
  * High-resolution image gallery with thumbnail selectors.
  * Direct breadcrumb and featured callout links to the botanical guide.
  * Tabbed information layout:
    1. *Key Ingredients & Ratios* (with exact formulation breakdown and guide callout).
    2. *Targeted Wellness Outcomes* (verified benefit points).
    3. *Directions & Recommended Dosage* (numbered step-by-step usage guide).
    4. *Eco-Luxury Canister Construction* (details on UV protection and golden foil stamping).

### 4. Persistent Shopping Cart & Checkout Flow
* State managed via **Zustand** with `persist` middleware (data saved in browser `localStorage`).
* Slide-over cart preview and full `/cart` page with quantity counters, unit prices, subtotal calculations, and item removal.
* Simulated `/checkout` flow with address inputs, payment selection (Card, UPI, NetBanking, COD), order summary, and Razorpay-ready integration structure.

### 5. Official Social Integration
* Consistent usage of the official Instagram asset (`/images/instagram.png`) wrapped in a reusable [`InstagramIcon`](file:///d:/Clg/Client%20Work/HimRoots/src/components/ui/InstagramIcon.tsx) component.
* Integrated across the desktop navbar, mobile drawer, footer, contact channel cards, and narrative community banners linking to `https://www.instagram.com/himroots.wellness/`.

---

## Project Architecture & Directory Structure

```
HimRoots/
├── public/
│   ├── about_sea_buckthorn.md       # Botanical & historical research monograph
│   ├── images/
│   │   ├── instagram.png            # Official brand Instagram icon
│   │   ├── himroots-logo.png        # Primary brand logo
│   │   ├── himroots-sea-buckthorn-pulp.jpg     # Pulp bottle product render
│   │   ├── himroots-sea-buckthorn-capsules.jpg # Capsules jar product render
│   │   ├── himroots-harvest-berries.jpg        # Fresh Himalayan berries in bowl
│   │   ├── himalayan-hero-peaks.jpg            # Ladakh high mountain peaks
│   │   ├── himalayan-harvest.jpg               # Local Himalayan wild foraging
│   │   ├── sea-buckthorn-frost-harvest.jpg     # Sub-zero frost winter harvest
│   │   └── hippophae-pegasus-mythology.jpg     # Pegasus & Shining Horse artwork
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Sticky nav with single-logo logic & mobile drawer
│   │   │   ├── Footer.tsx           # 4-column footer with guarantees & quick links
│   │   │   └── RootLayout.tsx       # App shell wrapper with scroll-to-top handler
│   │   └── ui/
│   │       ├── BrandLogo.tsx        # Responsive logo component with size variants
│   │       ├── Button.tsx           # CVA-styled accessible button
│   │       └── InstagramIcon.tsx    # Reusable Instagram brand icon
│   ├── data/
│   │   └── products.ts              # Centralized product catalog & helper functions
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page with hero, pillars, & showcases
│   │   ├── Shop.tsx                 # Filterable product catalog & monograph banner
│   │   ├── ProductDetails.tsx       # Detail view with gallery, tabs, & guide links
│   │   ├── SeaBuckthorn.tsx         # Comprehensive 7-chapter botanical masterclass
│   │   ├── About.tsx                # Brand heritage, terroir & sustainability ethos
│   │   ├── Contact.tsx              # Contact channels, offices & inquiry form
│   │   ├── Cart.tsx                 # Shopping cart view with itemized summary
│   │   └── Checkout.tsx             # Delivery address & payment simulation
│   ├── store/
│   │   ├── cartStore.ts             # Zustand cart store with localStorage persistence
│   │   └── logoStore.ts             # Zustand store coordinating hero vs navbar logo
│   ├── App.tsx                      # Route declarations
│   ├── index.css                    # Tailwind CSS v4 & custom design tokens
│   └── main.tsx                     # React application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Tech Stack & Libraries

* **Frontend:** React 19, TypeScript, Vite 8, React Router v7, Zustand 5, Tailwind CSS v4, Lucide React
* **Backend:** Node.js, Express, CORS, Dotenv, TSX
* **Database & Auth:** Supabase PostgreSQL (`@supabase/supabase-js`)
* **Payments:** Razorpay Node SDK (`razorpay`)
* **Styling & Components:** Radix UI Slot, Class Variance Authority, Tailwind Merge

---

## Design System & Aesthetics

The visual language reflects **Himalayan Eco-Luxury**:

* **Palette:**
  * Background: Obsidian Coal (`#0f0b08`)
  * Card Surfaces: Warm Deep Espresso (`#18110d`, `#1b130f`)
  * Secondary Surfaces: Mountain Earth (`#221812`)
  * Borders: Subtle Gold Foil (`rgba(230, 184, 92, 0.28)`)
  * Accents: Metallic Warm Gold Gradient (`linear-gradient(135deg, #f3d489 0%, #e6b85c 50%, #c49538 100%)`)
  * Botanical Ember: Deep Warm Orange & Cranberry (`#ea580c`, `#e11d48`)
* **Typography:**
  * Headings: Elegant High-Contrast Serif (`Playfair Display` / `Cinzel` / `Merriweather`)
  * Body: Clear, high-legibility geometric sans (`Inter` / `Outfit`)
  * Badges & Micro-Copy: High-tracking uppercase (`tracking-[0.2em]`)

---

## Getting Started Locally

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation
1. Clone or download the repository to your local machine.
2. In the project root directory, install all required dependencies:
   ```bash
   npm install
   ```
3. Prepare the environment variables file:
   ```bash
   cp .env.example .env
   ```

### Running the Development Environment
You can run both frontend and backend concurrently:
```bash
npm run dev:all
```
Or start them individually in separate terminals:
* **Backend API Server (Port 5000):**
  ```bash
  npm run server
  ```
  *(or `npm run server:dev` for auto-reloading watch mode)*
* **Frontend Vite Dev Server (Port 5173):**
  ```bash
  npm run dev
  ```

Frontend requests to `/api/*` are automatically proxied to `http://localhost:5000` via [`vite.config.ts`](file:///d:/Clg/Client%20Work/HimRoots/vite.config.ts).

---

## Building & Deployment

### Production Build
To validate TypeScript types and compile an optimized production bundle:
```bash
npm run build
```
This performs `tsc -b` and builds optimized JavaScript, CSS, and HTML into the `dist/` directory.

### Previewing the Production Build
To preview the compiled production distribution locally:
```bash
npm run preview
```

### Apache / cPanel / `public_html/` SPA Routing Configuration
For Apache shared hosting or VPS environments serving static files out of `/public_html/`:
* The application uses **HTML5 History API (`BrowserRouter`)**. When a visitor directly navigates to or refreshes a client-side route (e.g. `/cart`, `/shop`, `/products`, `/about`, `/contact`, `/checkout`), Apache must rewrite the request internally to `/index.html` rather than returning a 404.
* An optimized `.htaccess` configuration is maintained in [`public/.htaccess`](public/.htaccess) and automatically copied to `dist/.htaccess` upon running `npm run build`.
* **Important Deployment Note:** Because files starting with `.` are considered hidden files, ensure your FTP client or cPanel File Manager displays hidden files, and upload `.htaccess` directly into `/public_html/` alongside `index.html` and the `assets/` directory.

---

## Product Data Schema

To add or modify products, edit [`src/data/products.ts`](file:///d:/Clg/Client%20Work/HimRoots/src/data/products.ts). No UI refactoring is required. Each product follows the TypeScript interface:

```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviews: number;
  volume: string;
  scriptQuote?: string;
  description: string;
  benefits: string[];
  certifications: string[];
  images: string[];
  detailedIngredients: {
    name: string;
    percentage: string;
    benefits: string[];
  }[];
  directions: string[];
  packagingFeature: string;
}
```

---

## Completed Integrations & Future Roadmap

### ✅ Completed Integrations (Milestone 1 — Full-Stack E-Commerce Core)
- [x] **Relational Database Layer:** Supabase PostgreSQL with 4 tables (`products`, `orders`, `order_items`, `contact_inquiries`), RLS security policies, and daily order numbering.
- [x] **Trusted Backend Execution:** Node.js + Express server with server-side price validation, sanitizing error handlers, and proxy integration.
- [x] **Payment Gateway:** Razorpay Standard Checkout with timing-safe HMAC SHA256 signature verification and idempotent callback handling.
- [x] **Transactional Email Service:** Instant client order alerts (`New Order - {Order Number}`) and customer confirmation receipts via Resend / Brevo with payment decoupling.
- [x] **Contact & Support Portal:** Direct support form with 7 categories, order reference tracking, anti-spam honeypot, and rate limiting.
- [x] **Automated Test Suites:** 12/12 passing integration tests covering all payment edge cases and email workflows.

### 🔮 Future Recommendations (Explicitly Out of Current Scope)
The current lean model operates on: **Customer buys & pays online → Client receives instant email alert with full shipping details → Client manually packs & ships**. The following features are reserved for future scaling phases:
- [ ] **Logistics & Courier API:** Automated AWB creation, pickup scheduling, and shipping label generation via Shiprocket or Delhivery.
- [ ] **Automated Delivery Tracking:** Real-time customer tracking page via courier tracking number webhooks.
- [ ] **Automated Returns & Refunds:** Self-service customer return requests and automated Razorpay refund API triggers.
- [ ] **Customer Accounts & Auth:** User signup, OTP login, profile management, and saved shipping addresses.
- [ ] **Admin Dashboard:** Web-based dashboard for sales charts, order state transitions, and inventory stock adjustments.
- [ ] **Automated CRM & Marketing:** Klaviyo / WhatsApp Business integration for abandoned cart recovery and refill reminders.

---

&copy; Himroots Wellness. All rights reserved. Sourced from the Indian Himalayas.
