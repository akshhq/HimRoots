# SECURITY AUDIT — Himroots Wellness
> Performed: September 2026
> Scope: Full-stack (Frontend React/Vite + Node/Express backend + Supabase)

---

## OVERALL RATING: GOOD — CONDITIONAL ON CORRECT DEPLOYMENT

The codebase implements correct security foundations. All critical server-side safeguards are in place.
However, several items require the client to configure their hosting environment correctly before go-live.

---

## FINDINGS: SECURE

| Area | Status | Notes |
|------|--------|-------|
| Razorpay secret key | SECURE | Server-side only. Never sent to frontend. |
| Supabase service role key | SECURE | Not referenced in any VITE_ variable. |
| Price calculation | SECURE | Frontend totals are visual only; backend recalculates from DB prices. |
| Payment signature verification | SECURE | HMAC SHA256 server-side with crypto.timingSafeEqual (timing-safe). |
| Production test-mode bypass | FIXED (this audit) | pay_sim_ bypass now explicitly blocked when NODE_ENV=production. |
| .gitignore | SECURE | All .env* files excluded except .env.example. |
| .env.example | SECURE | Placeholder values only. No real credentials committed. |
| CORS | SECURE | Strict allowlist. Production allows only himroots.in. |
| Rate limiting | SECURE | API: 120/min, Orders: 15/10min, Contact: 8/10min. |
| Input validation | SECURE | Two-layer: middleware format check + service DB validation. |
| SQL injection | N/A | Supabase SDK uses parameterized queries internally. |
| XSS | SECURE | React-rendered. No dangerouslySetInnerHTML used. |
| Stack traces to client | SECURE | errorHandler.ts strips all DB/Postgres details from responses. |
| Security headers (backend) | SECURE | X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, HSTS in production. |
| Security headers (frontend) | SECURE | In .htaccess: nosniff, SAMEORIGIN, strict-origin-when-cross-origin. |
| Client-side payment verification | SECURE | Frontend only calls /api/orders/verify. Never verifies signature itself. |
| Honeypot anti-spam | SECURE | Contact form: bot submissions silently accepted and discarded. |
| Payment duplicate protection | SECURE | Two-layer: in-memory cache + Supabase razorpay_payment_id uniqueness check. |
| Supabase RLS | SECURE | Orders/order_items: deny ALL anon/authenticated. Only service_role allowed. |
| Git history | CLEAN | No real secrets found in any commit. |
| File uploads | N/A | No file upload endpoints exist. |
| Email failure safety | SECURE | Email failures logged but never invalidate payment status. |

---

## FINDINGS: REQUIRES CLIENT / OPERATOR ACTION

### 1. CORS — localhost origins in production (Medium)

server/middleware/security.ts default CORS list includes localhost origins.
These are bypassed IF CORS_ORIGIN environment variable is set correctly on the backend.

Required: Set CORS_ORIGIN=https://himroots.in,https://www.himroots.in in backend environment variables.

### 2. HTTPS enforcement (High)

HSTS header is set by the backend, but HTTP-to-HTTPS redirect must be configured at the Apache/hosting level.

Required (Client): Enable SSL via hosting control panel (cPanel > SSL/TLS > Let's Encrypt).

### 3. Backend cannot run on Apache/FTP hosting (Critical)

FTP/cPanel shared hosting CANNOT execute Node.js. The Express backend must be deployed separately.
If only the frontend is deployed, the checkout will fail silently.

Required: Deploy backend to Render, Railway, or Fly.io. Set VITE_API_BASE_URL before building frontend.

### 4. Razorpay test keys in production (High)

If RAZORPAY_KEY_ID=rzp_test_... is used in production, payments will not charge real money.

Required (Client): Switch to live keys (rzp_live_...) from Razorpay Dashboard > Settings > API Keys.

### 5. Email sender domain not verified (Medium)

Transactional emails from orders@himroots.in will be rejected or marked spam until DNS records
(SPF, DKIM, DMARC) are verified on the email provider (Resend or Brevo) dashboard.

Required (Client): Complete domain verification in email provider dashboard before launch.

---

## FINDINGS: RESOLVED IN PRIOR ARCHITECTURAL PASSES

### 6. Distributed Rate Limiter (RESOLVED)
Rate limiter upgraded from purely in-memory to distributed storage backed by Supabase `rate_limits` table with sliding window and automatic background cleanup, safe across server restarts and multi-instance deployments.

### 7. Distributed Payment Idempotency (RESOLVED)
Payment duplicate protection upgraded from local process cache to distributed Supabase `payment_idempotency` table, preventing concurrent duplicate captures or double stock deductions.

### 8. Order Lookup IDOR Protection (RESOLVED)
`GET /api/orders/:identifier` now requires a SHA256 cryptographic `orderToken` (or active authenticated patron session matching `user_id`). Guessing or scanning sequential order numbers alone is strictly rejected with 403 Forbidden.

### 9. Razorpay Webhook Verification (RESOLVED)
Dedicated webhook endpoint implemented at `POST /api/webhooks/razorpay` with timing-safe HMAC SHA256 verification of `X-Razorpay-Signature`, handling `payment.captured` and `order.paid` events directly from Razorpay servers.

### 10. Cash on Delivery (COD) Policy (RESOLVED)
By explicit client business confirmation, Cash on Delivery is disabled. All transactions are 100% prepaid online via Razorpay (UPI, Cards, NetBanking), eliminating fraudulent orders and high-altitude logistics courier refusal liabilities.

---

## DEPENDENCY SUMMARY

| Package | Version | Status |
|---------|---------|--------|
| express | 5.2.1 | Current stable |
| @supabase/supabase-js | 2.117.1 | Current stable |
| razorpay | 2.9.8 | Current |
| react | 19.2.8 | Current stable |
| react-router-dom | 7.18.4 | Current |
| vite | 8.3.0 | Current |
| typescript | 6.0.2 | Current |

No known high-severity CVEs found in installed direct dependencies.

---

## CHANGES MADE DURING THIS AUDIT

| File | Change |
|------|--------|
| server/services/orderService.ts | FIXED: Test-mode payment bypass blocked in production |
| index.html | FIXED: Razorpay SDK script uses defer (no longer blocks HTML parsing) |
| index.html | ADDED: Open Graph, Twitter Card, and canonical link meta tags |
| vite.config.ts | FIXED: Replaced deprecated __dirname with import.meta.dirname |
| public/robots.txt | ADDED: Disallows indexing of /checkout, /order-success, /cart |
| public/sitemap.xml | ADDED: XML sitemap for all public routes |

---
Last reviewed: September 2026 — Development Team
