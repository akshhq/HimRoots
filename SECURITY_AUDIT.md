# SECURITY AUDIT — Himroots Wellness
> Performed: September 2026 | Updated: October 2026
> Scope: Full-stack (Frontend React 19/Vite + Node/Express backend + Supabase PostgreSQL & Auth)

---

## OVERALL RATING: SECURE & PRODUCTION READY

The codebase implements comprehensive server-side security safeguards. Price calculation, payment verification, rate limiting, and database access are strictly controlled on trusted infrastructure.

---

## FINDINGS: SECURE

| Area | Status | Notes |
| :--- | :--- | :--- |
| **Razorpay secret key** | SECURE | Server-side only (`server/config/env.ts`). Never bundled into frontend code. |
| **Supabase service role key** | SECURE | Kept strictly server-side for backend order management. |
| **Price authority** | SECURE | Frontend totals are strictly presentation. Express backend computes line totals from database. |
| **Payment signature verification** | SECURE | HMAC SHA256 server-side with `crypto.timingSafeEqual` (timing-attack immune). |
| **Payment simulation bypass** | SECURE | Zero bypass in production; requires valid live Razorpay signature. |
| **Supabase Auth & RLS** | SECURE | RLS enforced across `profiles`, `addresses`, `user_carts`, `orders`, and `order_items`. |
| **User IDOR Protection** | SECURE | Patrons can only view/mutate their own addresses, cart items, and profiles via `auth.uid()`. |
| **Order IDOR Protection** | SECURE | `GET /api/orders/:identifier` requires SHA256 cryptographic `orderToken` or matching patron session. |
| **Distributed Rate Limiting** | SECURE | Sliding-window limiter backed by Supabase `rate_limits` table: API (120/min), Orders (15/10min), Contact (8/10min). |
| **Payment Idempotency** | SECURE | Distributed deduplication in Supabase `payment_idempotency` table prevents duplicate captures. |
| **Razorpay Webhooks** | SECURE | Direct webhook endpoint at `POST /api/webhooks/razorpay` verifies raw signatures. |
| **CORS Policy** | SECURE | Strict domain allowlist (`https://himroots.in,https://www.himroots.in`). Wildcards denied in production. |
| **Defensive HTTP Headers** | SECURE | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and XSS filters via Express and `.htaccess`. |
| **Safe Error Masking** | SECURE | `errorHandler.ts` masks database connection strings and Postgres error codes; zero stack traces leaked. |
| **Honeypot Anti-Spam** | SECURE | Hidden form field `website_source_ref` silently detects and discards bot submissions. |
| **Email Failure Isolation** | SECURE | Email API downtimes are safely logged without invalidating successful payment transactions. |

---

## FINDINGS: OPERATOR ENVIRONMENT ACTIONS

### 1. CORS Configuration
Ensure `CORS_ORIGIN=https://himroots.in,https://www.himroots.in` is configured in production environment variables on the backend hosting platform.

### 2. HTTPS Enforcement & HSTS
Configure Apache / cPanel or hosting reverse proxy to automatically redirect all HTTP traffic to HTTPS.

### 3. Backend Hosting Separation
Shared cPanel / FTP hosting cannot execute Node.js background services. Backend must run on Render, Railway, Fly.io, or a Node VPS.

### 4. Razorpay Live Mode
Ensure API keys are switched from `rzp_test_...` to `rzp_live_...` upon commercial go-live.

### 5. Email Domain Verification
Verify DNS records (SPF, DKIM, DMARC) for `himroots.in` in Resend / Brevo dashboard to guarantee 100% email deliverability.

---

## AUTHENTICATION & ROW LEVEL SECURITY (RLS) MATRIX

| Database Table | Public Anonymous (`anon`) | Authenticated Patron (`authenticated`) | Backend Server (`service_role`) |
| :--- | :--- | :--- | :--- |
| `products` | SELECT (Read-only) | SELECT (Read-only) | FULL (ALL operations) |
| `orders` | DENY (No direct access) | DENY (Accessed via backend API with token) | FULL (ALL operations) |
| `order_items` | DENY (No direct access) | DENY (Accessed via backend API with token) | FULL (ALL operations) |
| `contact_inquiries` | INSERT (Submit form) | INSERT (Submit form) | FULL (ALL operations) |
| `profiles` | DENY | SELECT, UPDATE (where `id = auth.uid()`) | FULL (ALL operations) |
| `addresses` | DENY | SELECT, INSERT, UPDATE, DELETE (where `user_id = auth.uid()`) | FULL (ALL operations) |
| `user_carts` | DENY | SELECT, INSERT, UPDATE, DELETE (where `user_id = auth.uid()`) | FULL (ALL operations) |
| `payment_idempotency` | DENY | DENY | FULL (ALL operations) |
| `rate_limits` | DENY | DENY | FULL (ALL operations) |

---

## AUTOMATED SECURITY VERIFICATION

Run the diagnostic verification script at any time to validate database security and authentication health:
```bash
node scripts/verify-auth.js
```

---

## SECURITY CONTACT CHANNELS

For responsible security disclosure or emergency incident reporting:
- **Security & Support Email:** `support@himroots.in`
- **Emergency Telephone:** `+91 98715 20888` / `9871520888`
