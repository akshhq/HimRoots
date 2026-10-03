# MANUAL SETUP & GO-LIVE GUIDE — Himroots Wellness
> Single authoritative manual setup guide for developers and non-technical business owners.
> Supersedes all prior manual setup notes.

---

# SECTION A: For the Developer (Technical Setup Checklist)

Follow this numbered checklist step-by-step to bring the application from fresh repository clone to production go-live.

---

### 1. Clone the Repository & Install Dependencies
Clone the repository and install dependencies using clean lockfile installation:
```bash
git clone https://github.com/akshhq/HimRoots.git
cd HimRoots
npm ci
```

---

### 2. Configure Environment Variables (`.env`)
Create a local `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Fill out each variable as described below:

| Variable | Scope | Description & Where to Obtain |
| :--- | :--- | :--- |
| `NODE_ENV` | Backend | Set to `development` locally; `production` on live hosting. |
| `PORT` | Backend | Port for Express server (default `5000`). |
| `CORS_ORIGIN` | Backend | Allowed frontend origins: `https://himroots.in,https://www.himroots.in` (comma-separated). |
| `VITE_API_BASE_URL` | Frontend | Public URL of your deployed backend (e.g. `https://api.himroots.in` or `https://himroots-api.onrender.com`). |
| `VITE_SUPABASE_URL` | Frontend/Backend | Supabase Project URL (`https://xyz.supabase.co`). Found in Supabase Dashboard > Project Settings > API. |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase public anonymous key (`anon`). Found in Project Settings > API. |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend Only | Supabase private administrative key (`service_role`). Strictly kept server-side. |
| `VITE_RAZORPAY_KEY_ID` | Frontend/Backend | Razorpay public Key ID (`rzp_live_...` or `rzp_test_...`). Found in Razorpay Dashboard > Settings > API Keys. |
| `RAZORPAY_KEY_SECRET` | Backend Only | Razorpay private Key Secret. Generated once when creating the API key in Razorpay. |
| `RAZORPAY_WEBHOOK_SECRET` | Backend Only | Secret string you create when configuring the Razorpay webhook endpoint. |
| `EMAIL_PROVIDER` | Backend | `resend` (recommended) or `brevo`. |
| `EMAIL_API_KEY` | Backend Only | API key from Resend (`re_...`) or Brevo. Generated in your email provider dashboard. |
| `EMAIL_FROM` | Backend | Verified sender: `Himroots Wellness <orders@himroots.in>`. |
| `CLIENT_ORDER_EMAIL` | Backend | Operations email receiving new orders (`orders@himroots.in`). |
| `CLIENT_SUPPORT_EMAIL` | Backend | Support email receiving contact inquiries (`support@himroots.in`). |
| `ALERT_WEBHOOK_URL` | Backend Only | Slack or Discord Incoming Webhook URL to receive immediate alerts for payment or webhook failures. |

---

### 3. Initialize Supabase Database & Auth (Consolidated Script)
We provide a single, fully consolidated idempotent SQL script: [`supabase/00_complete_setup.sql`](supabase/00_complete_setup.sql).

1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql) in your project.
2. Open [`supabase/00_complete_setup.sql`](supabase/00_complete_setup.sql), copy all contents, paste into the SQL Editor, and click **Run**.
3. *(Alternative for existing databases: apply [`supabase/migrations/20260930_user_accounts_and_cart.sql`](supabase/migrations/20260930_user_accounts_and_cart.sql)).*
4. **Automated Verification:**
   Run the project diagnostic script in your terminal to verify database connectivity, RLS, and auth configuration:
   ```bash
   node scripts/verify-auth.js
   ```
   Confirm all checks pass (tables exist, RLS enabled, products populated, auth triggers active).
5. **Supabase Auth Dashboard Settings:**
   - Under **Authentication > URL Configuration**:
     - Set **Site URL** to: `https://himroots.in`
     - Add **Redirect URLs**:
       - `https://himroots.in/reset-password`
       - `https://www.himroots.in/reset-password`
       - `http://localhost:5173/reset-password` (for local development)

---

### 4. Build & Preview Production Bundles Locally
Run the dual-build compiler to ensure both the Vite client bundle and the Esbuild server bundle compile cleanly:
```bash
npm run build
```
Verify the build succeeded with exit code 0:
- Client files generated in `dist/` (`index.html`, `assets/*.js`, `assets/*.css`, `images/*`, `.htaccess`).
- Server file generated in `dist-server/index.js`.

Locally preview the production client bundle:
```bash
npm run preview
```
Visit `http://localhost:4173/` in your browser. Confirm:
- Home page hero banner and product showcases render without console errors.
- Navigation links (`/shop`, `/about-sea-buckthorn`, `/contact`, `/account`, `/auth`) load cleanly.
- Product detail pages display the 15 visual detail cards.

---

### 5. Deploy Frontend to Vercel or Apache
#### Option A: Vercel (Recommended for Edge Performance)
1. Log in to [vercel.com](https://vercel.com) and click **Add New > Project**.
2. Select the `HimRoots` repository.
3. In **Project Settings**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build:client`
   - Output Directory: `dist`
4. Expand **Environment Variables** and paste:
   - `VITE_API_BASE_URL` = `https://your-backend-api.onrender.com` (or your backend domain)
   - `VITE_SUPABASE_URL` = `https://xyz.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJ...`
   - `VITE_RAZORPAY_KEY_ID` = `rzp_live_...`
5. Click **Deploy**.
6. Under **Settings > Domains**, add `himroots.in` and `www.himroots.in`.

#### Option B: Apache / cPanel (`public_html/`)
1. Run `npm run build:client`.
2. Upload the entire contents of `dist/` into `/public_html/`.
3. Verify `dist/.htaccess` is uploaded (ensure hidden files are visible in cPanel File Manager). This enables HTML5 history routing (`react-router-dom`).

---

### 6. Deploy Backend to Node.js Host (Render / Railway / VPS)
*Note: Shared Apache/cPanel hosting cannot execute Node.js background processes. Deploy the backend to Render, Railway, or a Node VPS.*

1. Create a new **Web Service** on [Render.com](https://render.com) pointing to the `HimRoots` repository.
2. Configure build settings:
   - Environment: **Node**
   - Build Command: `npm install && npm run build:server`
   - Start Command: `node dist-server/index.js`
3. Add all backend environment variables (`NODE_ENV=production`, `PORT=5000`, `CORS_ORIGIN=https://himroots.in,https://www.himroots.in`, Supabase keys, Razorpay keys, Email keys, `ALERT_WEBHOOK_URL`).
4. Once deployed, verify `GET https://your-backend-api.onrender.com/api/health` returns HTTP 200:
   ```json
   { "status": "ok", "service": "Himroots Wellness API", "integrations": { "supabase": "configured" } }
   ```

---

### 7. Configure Razorpay Webhooks
1. Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com) in **Live Mode**.
2. Navigate to **Account & Settings > Webhooks**.
3. Click **Add New Webhook**.
4. Set Webhook URL: `https://your-backend-api.onrender.com/api/webhooks/razorpay` (or `https://api.himroots.in/api/webhooks/razorpay`).
5. Generate a secret string and enter it in **Secret**.
6. Check **Active Events**:
   - `payment.captured`
   - `order.paid`
7. Click **Save Webhook**.
8. Paste the exact secret into the backend host's `RAZORPAY_WEBHOOK_SECRET` environment variable and restart the backend.

---

### 8. Set Up External Uptime Monitoring
1. Create a free account at [uptimerobot.com](https://uptimerobot.com).
2. Click **Add New Monitor**:
   - Type: `HTTP(s)`
   - Friendly Name: `Himroots Backend API`
   - URL: `https://your-backend-api.onrender.com/api/health`
   - Interval: `5 minutes`
3. Add your email address to receive immediate alerts if the backend ever goes down.
4. Add a second monitor for the frontend storefront: `https://himroots.in/`.

---

### 9. Configure Error & Incident Alerting Channel
1. Create a dedicated private channel in your team's Slack or Discord: `#himroots-alerts`.
2. Generate an Incoming Webhook URL:
   - **Slack:** Go to Slack API > Apps > Incoming Webhooks > Add New Webhook to Workspace.
   - **Discord:** Go to Channel Settings > Integrations > Webhooks > New Webhook > Copy Webhook URL.
3. Paste the URL into `ALERT_WEBHOOK_URL` in the backend host's environment settings.
4. Test by verifying that payment or webhook anomalies trigger an immediate notification in the channel.

---

### 10. Run CI Safety Net & Live Smoke Test
1. Confirm local verification passes:
   - TypeScript checks pass: `npm run build`
   - OxLint passes: `npm run lint` (0 errors, 0 warnings)
   - Integration tests pass: `npm run test:backend`
   - Auth verification passes: `node scripts/verify-auth.js`
2. **Execute Real End-to-End Live Transaction:**
   - Temporarily lower product price or create a ₹1 test item in the Supabase Table Editor.
   - Visit `https://himroots.in/checkout`, fill out real shipping information, and pay ₹1 using your UPI app (Google Pay / PhonePe).
   - Confirm you are redirected to `/order-success` with an authentic order number (`HM-YYYYMMDD-XXXX`).
   - Confirm the client email arrives at `orders@himroots.in`.
   - Confirm the customer confirmation email arrives in your inbox.
   - Confirm the order is marked `paid` in the Supabase `orders` table.
3. **Issue Test Refund:**
   - In the Razorpay Dashboard under **Payments**, click the ₹1 transaction.
   - Click **Issue Full Refund**. The ₹1 will return to your account within 1-2 business days.
   - Reset the product price back to its commercial value in Supabase.

---

# SECTION B: For the Client (Non-Technical / Business Owner Guide)

Welcome to your new Himroots online store! This section is written in plain language to guide you through setting up your business accounts, managing daily customer orders, and operating your store with confidence.

---

### 1. Creating Your Database Account (Supabase)
Supabase is the secure cloud database that stores your customer orders, product details, delivery addresses, and contact messages.

1. Go to [supabase.com](https://supabase.com) in your web browser.
2. Click the green button in the top-right corner that says **Start your project** (or **Sign in** with your Google or GitHub account).
3. Once logged in, click the green button that says **+ New project**.
4. In the setup window:
   - **Name:** Type `Himroots-Production`.
   - **Database Password:** Click **Generate a password** (or type a strong password) and **copy it down in a safe password manager**.
   - **Region:** Click the dropdown menu and select **ap-south-1 (Mumbai)**. This ensures your store loads as fast as possible for customers in India.
   - **Pricing Plan:** Select the **Free** tier (this is plenty for starting your store).
5. Click **Create new project** and wait 2 minutes while Supabase prepares your database.
6. Once ready, find your developer keys to send to your technical lead:
   - In the left sidebar, click the gear icon labeled **Project Settings**.
   - Click **API** in the sub-menu.
   - Copy the **Project URL** (starts with `https://...supabase.co`).
   - Copy the **anon / public** key.
   - Copy the **service_role (secret)** key (keep this secret — only share with your lead developer).

---

### 2. Completing Razorpay Business Verification (KYC)
Razorpay is the payment gateway that lets your customers pay you using Google Pay, PhonePe, Paytm, credit cards, debit cards, and net banking.

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com) and log in.
2. In the top bar, you will see a banner saying **Complete KYC to accept payments**. Click **Complete KYC**.
3. Have the following documents ready to upload:
   - Business Registration Document (MSME Udyam certificate, Partnership Deed, or GST certificate).
   - Business PAN card.
   - Authorized Signatory PAN and Aadhaar.
   - Cancelled cheque or bank statement showing your business account name, account number, and IFSC code (this is where Razorpay deposits your sales money).
4. Submit the verification form. Razorpay typically approves accounts within **24 to 72 business hours**.
5. **What "Test Mode" vs "Live Mode" Means:**
   - Look at the very top of your Razorpay dashboard. You will see a toggle switch that says **Test Mode** or **Live Mode**.
   - **Test Mode:** Used only by developers during building. No real money is charged.
   - **Live Mode:** Used for real sales. Real money is deducted from customer bank accounts and deposited into your business account.
   - Once your KYC is approved, toggle this switch to **Live Mode**.

---

### 3. Payment Policy: Prepaid Only (No Cash on Delivery)
Your store is intentionally configured for **100% Prepaid Orders** via Razorpay.

**Why this decision protects your business:**
In e-commerce, offering Cash on Delivery (COD) carries severe risks — especially for premium natural formulations shipped from high-altitude Himalayan regions. With COD, 20% to 35% of customers routinely refuse packages at the doorstep, leading to costly Return to Origin (RTO) courier fees, trapped inventory, and product spoilage. Requiring prepaid payments ensures every order is genuine, paid upfront, and ready for immediate packing and dispatch.

---

### 4. Setting Up Your Business Email (Resend or Brevo)
When a customer places an order, your website automatically sends them an email receipt and alerts your warehouse team. We use **Resend** (recommended) or **Brevo** to send these emails.

1. Go to [resend.com](https://resend.com) and click **Sign Up**.
2. Once inside your dashboard, click **Domains** in the left menu.
3. Click the black button: **+ Add Domain**.
4. Type in: `himroots.in` and click **Add**.
5. **What "Domain Verification" Means:**
   - Resend will show you 3 rows of technical text with labels like `TXT`, `MX`, and `CNAME`.
   - These are proof codes called **DNS records** (Domain Name System records). Adding them tells email providers (like Gmail and Yahoo) that emails sent from `orders@himroots.in` are genuine and not spam.
   - **Do not worry if this looks complicated:** Simply take a screenshot of this page or copy the values, and forward them to your developer or your domain provider's support team (GoDaddy, Namecheap, or Hostinger). Ask them: *"Please add these DNS records to my domain so my transactional emails can send."*
6. Once added, wait 15 minutes and click **Verify DNS Records** in Resend until all rows show a green **Verified** status.
7. Click **API Keys** in the left menu > Click **Create API Key** > Name it `Himroots Production` > Copy the key (`re_...`) and send it to your developer.

---

### 5. Managing Your Domain Name (`himroots.in`)
Your domain name is your store's internet address.

- **Keep Your Login Safe:** Make sure you know which registrar holds `himroots.in` (e.g. GoDaddy, Hostinger, BigRock). Store your master username, password, and two-factor authentication in a secure place.
- **Set Up Domain Auto-Renewal:** Ensure your domain registration is set to **Auto-Renew** with an active credit card so your website never accidentally expires or goes offline.

---

### 6. Daily & Weekly Routines (What to Check Once Live)

1. **Check `orders@himroots.in` (Daily):**
   - Every time a customer pays, an email titled `New Order - HM-YYYYMMDD-XXXX` will arrive.
   - This email contains the customer's full name, phone number, delivery address, items ordered, and total amount paid.
   - Print or forward this email to your fulfillment team to pack the bottles and schedule courier pickup.
2. **Check `support@himroots.in` (Daily):**
   - Customer questions submitted through your website's `/contact` form will arrive here.
   - Support phone hotline for escalated assistance is `9871520888`.
   - Click "Reply" to answer the customer directly.
3. **Check Your Alert Channel (Weekly):**
   - If an error ever occurs during payment or email delivery, your developer's alert channel (`#himroots-alerts`) will notify the team so issues are fixed before customers notice.

---

### 7. Customer Triage Script (If a Customer Asks About Payment)
If a customer calls or emails saying: *"I paid money on your site, but I haven't received my confirmation email yet!"* — follow these 3 simple steps:

1. **Step 1 — Check Razorpay:**
   - Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com).
   - In the left menu, click **Transactions > Payments**.
   - Look for the customer's name, email, or payment amount.
   - If the status says **Captured**, the payment went through successfully!
2. **Step 2 — Check Supabase:**
   - Log in to your Supabase project.
   - Click **Table Editor** > Click the **`orders`** table.
   - Search for the customer's email or name.
   - You will see their order row with their order number (e.g. `HM-20260925-1002`).
3. **Step 3 — Reassure the Customer:**
   - Reply to the customer:
     > *"Hello [Customer Name], thank you for reaching out! We have confirmed your payment in our system under Order Number [Order Number]. Your order is confirmed and our packaging team is preparing your authentic Himalayan Sea Buckthorn formulations for dispatch. You will receive courier tracking details as soon as it ships."*
   - If the payment was captured in Razorpay but does NOT show up in Supabase, notify your developer immediately with the Razorpay Payment ID.

---

### 8. How to Update Order Status (No Admin Dashboard Needed)
In this launch version, you do not need a complicated admin portal. You can view all orders and update their delivery status directly inside your Supabase Table Editor.

**Here is the exact step-by-step walkthrough:**
1. Open your browser and go to [supabase.com/dashboard](https://supabase.com/dashboard).
2. Click your project name: **`Himroots-Production`**.
3. Look at the dark grey navigation bar on the left side of your screen.
4. Click the icon that looks like a spreadsheet table — this is the **Table Editor**.
5. Under the **public** list, click on the table named **`orders`**.
6. You will see a spreadsheet showing every order placed on your website.
7. Scroll right to the column named **`order_status`**.
8. Double-click the cell for the order you want to update (it will currently say `processing`).
9. Delete `processing`, type `shipped`, and press **Enter** (or click away).
10. The cell will save instantly! When the courier confirms delivery, double-click again and change it to `delivered`.

---

### 9. Official Go-Live Checklist

Before announcing your store launch on Instagram or running marketing campaigns, confirm all 5 items below:

- [ ] **1. Business Accounts Approved:** Supabase project created, Razorpay KYC approved in Live Mode, and Resend/Brevo domain verified.
- [ ] **2. Developer Test Order Completed:** Your developer has run a real ₹1 live transaction and confirmed order creation, email receipt, and Supabase order logging.
- [ ] **3. Razorpay Switched to Live Mode:** The toggle in your Razorpay dashboard is set to **Live Mode**.
- [ ] **4. Official Inboxes Monitored:** Someone on your team has login access to `orders@himroots.in` and `support@himroots.in`, and phone `9871520888` is operational.
- [ ] **5. Product Catalog & Inventory Verified:** Double-check your product prices (₹899 for Juice/Pulp Pack of 1, ₹1,699 Pack of 2; ₹999 for Capsules Pack of 1, ₹1,899 Pack of 2) and inventory counts in the Supabase `products` table.

Once all 5 checkboxes are complete, your store is officially **READY FOR BUSINESS**!
