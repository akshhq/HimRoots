# FINAL PRODUCTION REPORT — Himroots Wellness
> Generated: September 2026
> Build: v1.0.0

This report reflects the state of the Himroots Wellness application after the final production-readiness,
security, and deployment pass. It is NOT a claim of 100% production readiness — several items remain
contingent on client configuration and live infrastructure testing.

---

## 1. FINAL ARCHITECTURE

```
FRONTEND (SPA)                    BACKEND (API)                 THIRD-PARTY
React 19 + Vite 8                 Express 5 + Node.js           Supabase (Postgres)
react-router-dom v7               TypeScript / tsx              Razorpay (Payments)
Zustand (cart)                    server/                       Resend / Brevo (Email)
Framer Motion
Tailwind CSS v4

Hosted on:                        Hosted on:                    Hosted on:
Apache / cPanel                   Render / Railway              Supabase Cloud
/public_html/                     (separate Node host)          Razorpay Cloud
```

---

## 2. FILES CHANGED IN THIS AUDIT PASS

| File | Change |
|------|--------|
| server/services/orderService.ts | SECURITY FIX: Test-mode payment bypass blocked in production |
| index.html | FIX: Razorpay SDK script uses defer (non-blocking) |
| index.html | ADD: Open Graph, Twitter Card, canonical URL meta tags |
| vite.config.ts | FIX: Replaced deprecated __dirname with import.meta.dirname |
| public/robots.txt | ADD: SEO robot rules |
| public/sitemap.xml | ADD: XML sitemap for all public routes |
| SECURITY_AUDIT.md | ADD: Full security audit report |
| DEPLOYMENT.md | ADD: Deployment guide |
| TODO.md | UPDATE: Final status of all completed / pending items |

---

## 3. DATABASE

**Platform:** Supabase (PostgreSQL)

| Table | Purpose | RLS |
|-------|---------|-----|
| products | Product catalog | Public SELECT, service_role WRITE |
| orders | Customer orders | DENY all public, service_role only |
| order_items | Line items | DENY all public, service_role only |
| contact_inquiries | Support form | Public INSERT only, service_role full |

**Status:** Schema written and ready (supabase/schema.sql).
**Not verified:** Cannot be verified until client creates a real Supabase project and applies schema.

---

## 4. BACKEND

**Stack:** Express 5 / Node.js / TypeScript (tsx)

| Route | Method | Purpose |
|-------|--------|---------|
| /api/health | GET | Health check |
| /api/products | GET | List all active products |
| /api/products/:id | GET | Single product by slug or ID |
| /api/orders | POST | Create order (validates, calculates, persists) |
| /api/orders/:id | GET | Order lookup (for success screen) |
| /api/orders/verify | POST | Razorpay HMAC signature verification |
| /api/contact | POST | Contact form submission |

**Security:**
- All prices calculated server-side from database
- All secrets (Razorpay, Supabase service role, email) are environment variables
- CORS restricted to himroots.in in production
- Rate limiting on all routes
- Production test-mode bypass blocked

**Not verified:** Cannot test end-to-end until deployed to a live Node.js host with real credentials.

---

## 5. PAYMENT (Razorpay)

**Flow:**
1. Customer submits checkout form
2. Frontend sends product IDs + customer info to POST /api/orders
3. Backend fetches prices from Supabase, calculates real total, creates Razorpay order
4. Backend returns Razorpay order ID + amount to frontend
5. Frontend opens Razorpay checkout modal
6. Customer pays
7. Razorpay returns payment_id + signature to frontend handler
8. Frontend sends to POST /api/orders/verify
9. Backend verifies HMAC SHA256 signature with Razorpay secret
10. Backend marks order as paid in Supabase
11. Backend sends email notifications

**Status:**
- Flow is complete and implemented
- Signature verification uses crypto.timingSafeEqual (timing-safe)
- Test-mode bypass blocked in production
- Cannot verify payment works until live Razorpay credentials are configured

---

## 6. EMAIL

**Providers supported:** Resend and Brevo (configured via EMAIL_PROVIDER env var)

| Email | Trigger | Recipient |
|-------|---------|-----------|
| Order notification | Payment verified | orders@himroots.in |
| Customer confirmation | Payment verified | Customer email |
| Support inquiry | Contact form submit | support@himroots.in |

**Safety design:**
- Email failures never invalidate payment status
- Payment status is set before email attempt
- Email status tracked in database (email_status column)
- Failures logged server-side for investigation

**Not verified:** Cannot verify email delivery until domain DNS is verified with the email provider.

---

## 7. SECURITY

**Implemented and verified:**
- Secrets management: all keys in environment variables, not in code
- Git history: no real credentials found in any commit
- CORS: strict production allowlist
- Rate limiting: per-route sliding window
- Input validation: two-layer (middleware + service)
- Payment verification: server-side HMAC SHA256
- Supabase RLS: orders fully protected from public access
- Error handling: no stack traces or database errors exposed to client
- XSS: React rendering, no dangerouslySetInnerHTML

**Requires client action:**
- HTTPS must be enabled at hosting level
- CORS_ORIGIN must be set on backend
- Live Razorpay keys must be activated
- Email domain must be verified

See SECURITY_AUDIT.md for the complete audit report.

---

## 8. DEPLOYMENT

**Frontend:**
- Build: npm run build (confirmed clean, no warnings)
- Output: dist/ (ready to upload to /public_html/)
- .htaccess: included — handles SPA routing on Apache
- robots.txt, sitemap.xml: included in build output

**Backend:**
- Cannot run on Apache/cPanel hosting
- Must be deployed to separate Node.js platform (Render recommended)
- All config via environment variables

See DEPLOYMENT.md for the full step-by-step deployment guide.

---

## 9. TESTING STATUS

| Test | Status |
|------|--------|
| npm run build | PASS — clean, no warnings or errors |
| TypeScript compilation | PASS |
| SPA routing (.htaccess) | CONFIGURED — cannot verify without live Apache |
| Payment flow end-to-end | NOT TESTED — requires live Razorpay credentials |
| Email delivery | NOT TESTED — requires live email credentials + domain |
| Supabase integration | NOT TESTED — requires live Supabase project |
| Direct URL navigation | NOT TESTED — requires live Apache deployment |
| Mobile viewport | DESIGNED AND BUILT — visual testing on localhost confirmed |

---

## 10. KNOWN LIMITATIONS

1. **In-memory rate limiter** resets on process restart — acceptable for single-instance, not for multi-instance.
2. **In-memory order cache** is a dev fallback — orders only persist reliably when Supabase is connected.
3. **No Razorpay webhooks** — payment verification relies on client-side callback. This is standard but adds one step of client-side trust; webhooks are the more robust approach.
4. **Order lookup is unauthenticated** — any UUID can retrieve order details. Acceptable now; add auth in future.
5. **No email queue** — email dispatch is synchronous on verify. Large traffic spikes could slow the verify response.
6. **No admin interface** — Himroots team must use Supabase Table Editor to view orders.

---

## 11. CLIENT SETUP (Must Complete Before Launch)

| Action | Where |
|--------|-------|
| Enable SSL/HTTPS | cPanel > SSL/TLS > Let's Encrypt |
| Force HTTPS redirect | cPanel > .htaccess or SSL settings |
| Complete Razorpay KYC | dashboard.razorpay.com > Settings > Business |
| Activate live Razorpay keys | dashboard.razorpay.com > Settings > API Keys |
| Verify email domain (DNS) | resend.com or brevo.com > Domains |
| Set up orders@himroots.in inbox | Email hosting provider |
| Set up support@himroots.in inbox | Email hosting provider |

---

## 12. DEVELOPER SETUP (Must Complete Before Launch)

| Action | Notes |
|--------|-------|
| Create Supabase project | supabase.com |
| Run supabase/schema.sql | SQL Editor in Supabase dashboard |
| Run supabase/seed.sql | Seeds initial product data |
| Deploy backend | Render / Railway — set all environment variables |
| Build frontend | Set VITE_API_BASE_URL before npm run build |
| Upload dist/ to /public_html/ | Via FTP / hosting file manager |
| Confirm /api/health works | GET https://your-api.onrender.com/api/health |

---

## 13. LAUNCH CHECKLIST

### Infrastructure
- [ ] Supabase project live, schema applied
- [ ] Backend deployed with all production environment variables
- [ ] Frontend dist/ uploaded to /public_html/
- [ ] .htaccess present in /public_html/
- [ ] SSL certificate installed on himroots.in
- [ ] HTTP → HTTPS redirect active

### Integrations
- [ ] Razorpay live keys configured in backend and frontend build
- [ ] Email provider API key set
- [ ] Email domain verified (SPF + DKIM)
- [ ] CORS_ORIGIN set on backend (himroots.in,www.himroots.in)

### End-to-End Testing
- [ ] Real purchase completed with live Razorpay
- [ ] Order notification email received at orders@himroots.in
- [ ] Customer confirmation email received
- [ ] Support form email received at support@himroots.in
- [ ] All routes accessible by direct URL in browser
- [ ] No broken images or console errors in production
- [ ] Mobile checkout tested

---

## WHAT THIS REPORT CANNOT CONFIRM

The following require live infrastructure and cannot be verified from the codebase alone:

- That Supabase project exists and schema is applied
- That Razorpay credentials are live and KYC is approved
- That email domain DNS records are verified
- That Apache server is correctly serving .htaccess SPA rewrites
- That HTTPS is correctly configured
- That end-to-end payment flow works with real money

---

*Report generated by development team — September 2026*
*This is not a guarantee of production readiness. All infrastructure items above must be verified before accepting real payments.*
