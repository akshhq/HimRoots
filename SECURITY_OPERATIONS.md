# SECURITY OPERATIONS RUNBOOK — Himroots Wellness
> Operational procedures for secret rotation, database backup verification, incident alerting, and disaster recovery.

---

## 1. Secrets Rotation Runbook (Zero-Downtime Procedures)

If any credential or API secret is compromised, suspected of leaking, or subjected to routine compliance rotation, follow these step-by-step procedures.

---

### A. Razorpay API Keys (`RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`)

Razorpay supports zero-downtime key rotation through overlapping active key windows.

1. **Log in to Razorpay Dashboard:**
   - Navigate to **Account & Settings > API Keys** (ensure dashboard is set to **Live Mode**).
2. **Roll the API Key:**
   - Click **Regenerate Key**.
   - Razorpay will display a modal with the new **Key ID** (`rzp_live_...`) and **Key Secret**.
   - Select the checkbox: *"Keep previous key active for 24 hours"* (CRITICAL: this prevents checkout disruptions while deployments propagate).
   - Copy both the new Key ID and Key Secret into your secure team password manager.
3. **Update Hosting Environment Variables:**
   - **Backend Host (Render / Railway / VPS):**
     * Update `RAZORPAY_KEY_ID` with the new Key ID.
     * Update `RAZORPAY_KEY_SECRET` with the new Key Secret.
     * Trigger a redeployment/restart of the backend service.
   - **Frontend Host (Vercel / Cloudflare / cPanel):**
     * Update `VITE_RAZORPAY_KEY_ID` with the new Key ID.
     * Trigger a production frontend build (`npm run build`).
4. **Smoke Test:**
   - Visit `https://himroots.in/checkout`, add a formulation, open the checkout modal, and verify the modal launches with the new Key ID.
5. **Revoke Old Key:**
   - Return to the Razorpay dashboard after confirming successful orders. Click **Deactivate Previous Key Now** to terminate the expired credentials.

---

### B. Razorpay Webhook Secret (`RAZORPAY_WEBHOOK_SECRET`)

1. **Generate a New Secret:**
   - Generate a cryptographically strong 32-character random string:
     ```bash
     node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
     ```
2. **Update Razorpay Dashboard:**
   - Go to **Account & Settings > Webhooks**.
   - Select the active webhook URL (`https://api.himroots.in/api/webhooks/razorpay` or production host URL).
   - Click **Edit Webhook**.
   - Paste the new random string into the **Secret** field.
   - Ensure events `payment.captured` and `order.paid` remain checked.
   - Click **Save Webhook**.
3. **Update Backend Environment:**
   - On the backend hosting platform, update `RAZORPAY_WEBHOOK_SECRET` to the new secret string.
   - Restart the server.
4. **Verification:**
   - In Razorpay Dashboard under **Webhooks**, click **View Details > Deliveries**. Check the most recent webhook delivery to confirm HTTP `200 OK`.

---

### C. Supabase Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)

The `service_role` key bypasses PostgreSQL Row-Level Security (RLS) and is strictly used by the trusted Node.js backend.

1. **Log in to Supabase Dashboard:**
   - Navigate to **Project Settings (gear icon) > API**.
2. **Generate New JWT Secret:**
   - Scroll to **JWT Settings > JWT Secret**.
   - Click **Generate a new secret**.
   - *Caution:* Rotating the JWT Secret immediately invalidates all existing Anon and Service Role keys.
3. **Copy New Service Role Key:**
   - Scroll up to **Project API keys** and copy the new **`service_role` (secret)** key.
   - Also copy the new **`anon` (public)** key.
4. **Update Production Environment Variables Immediately:**
   - **Backend Host:** Set `SUPABASE_SERVICE_ROLE_KEY=<new_key>` and `SUPABASE_KEY=<new_key>`. Restart the backend immediately.
   - **Frontend Host:** Set `VITE_SUPABASE_ANON_KEY=<new_anon_key>`. Rebuild the frontend.
5. **Verify:**
   - Query `GET https://api.himroots.in/api/health`. Confirm response returns:
     ```json
     { "status": "ok", "integrations": { "supabase": "configured" } }
     ```
   - Run diagnostic test: `node scripts/verify-auth.js`

---

### D. Transactional Email API Key (`EMAIL_API_KEY`)

1. **Log in to Email Provider Dashboard:**
   - **Resend:** Go to [resend.com/api-keys](https://resend.com/api-keys) > Click **Create API Key** (`Himroots Live Rotated`).
   - **Brevo:** Go to **SMTP & API > API Keys** > Click **Generate a new API key**.
2. **Update Backend Host:**
   - Set `EMAIL_API_KEY=re_...` in backend environment variables.
   - Restart backend service.
3. **Test:**
   - Submit a test inquiry through `https://himroots.in/contact`. Confirm email arrives in operations inbox (`support@himroots.in`).
4. **Revoke Old Key:**
   - Return to Resend/Brevo dashboard and click **Delete** on the old compromised API key.

---

### E. Error Alerting Webhook (`ALERT_WEBHOOK_URL`)

1. If the Slack or Discord incident webhook URL is leaked, revoke it in Slack App settings or Discord Channel Integrations.
2. Create a new Incoming Webhook.
3. Update `ALERT_WEBHOOK_URL` in the backend host environment variables.

---

## 2. Database Backup & Disaster Recovery Policy

### Supabase Built-in Backup Tiers

| Supabase Plan | Backup Type | Frequency | Retention Window | Point-in-Time Recovery (PITR) |
| :--- | :--- | :--- | :--- | :--- |
| **Free Tier** | Automated Daily Snapshots | Every 24 hours | 7 days | No |
| **Pro Tier ($25/mo)** | Daily Snapshots + WAL Logs | Continuous | Up to 7 or 30 days | **Yes (down to the second)** |

### How to Verify Backups in the Supabase Dashboard
1. Log in to [supabase.com/dashboard](https://supabase.com/dashboard) and select the `Himroots-Production` project.
2. In the left sidebar, click **Project Settings** (gear icon) > **Database**.
3. Scroll down to the **Backups** section.
4. Confirm:
   - Status indicates **Enabled**.
   - The backup schedule shows daily snapshots completed without errors.
   - A list of recent daily backup timestamps is visible.

### Restoring from a Snapshot
1. In **Project Settings > Database > Backups**, locate the desired snapshot date.
2. Click **Restore**.
3. *Note:* Restoring creates a restored instance or overwrites existing database state. For high-volume e-commerce, **Pro Tier Point-in-Time Recovery (PITR)** is strongly recommended before peak campaign launches so orders placed minutes before an incident are never lost.

### Manual Offsite Backup (Recommended Before Major Schema Migrations)
To create an independent offline backup before running SQL migrations:
```bash
# Export schema and all data to encrypted SQL dump
npx supabase db dump --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > himroots_backup_$(date +%Y%m%d).sql
```

---

## 3. Real-Time Incident Alerting & Triage Protocol

The application includes automated monitoring through `server/services/alertService.ts`.

### Trigger Conditions for Critical Alerts:
1. **Payment Signature Forgery / HMAC Mismatch:** Triggers a `WARNING` or `ERROR` alert with IP and Order Number.
2. **Webhook Verification Failure:** Triggers an immediate `ERROR` alert if webhook secret is mismatched.
3. **Order Notification Email Failure:** Triggers an alert so the warehouse team knows an order was paid but the notification email failed to dispatch.
4. **Database Persistence Error:** Triggers a `CRITICAL` alert if Supabase connection drops during order creation.

### Incident Triage Checklist:
1. **Alert Received:** Check the alert details in your Slack/Discord `#himroots-alerts` channel.
2. **Correlate with Razorpay Dashboard:** Check whether the payment was captured in the Razorpay Payments tab.
3. **Correlate with Supabase Table Editor:** Open `orders` table in Supabase. Check if `payment_status` is `paid` or `pending`.
4. **Manual Order Recovery:** If Razorpay shows captured but Supabase order is missing, use the Razorpay payment notes (`orderNumber`, `orderId`) to locate the pending order and update `payment_status = 'paid'`.

---

## 4. Emergency Contacts & Response Team

| Role | Contact Channel | Priority |
| :--- | :--- | :--- |
| **Emergency Telephone** | `+91 98715 20888` / `9871520888` | Critical / P0 |
| **Technical & Security Alerts** | `support@himroots.in` | High / P1 |
| **Fulfillment & Order Operations** | `orders@himroots.in` | Medium / P2 |
| **Sales & Business Escalations** | `Sales@himroots.in` | Normal |
| **Customer Care Escalations** | `Customercare@himroots.in` | Normal |
