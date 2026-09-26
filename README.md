# Himroots Wellness

The storefront is now a plain HTML, CSS, and JavaScript application. It uses no frontend framework or build step.

## Structure

```
index.html       # Page shell
styles.css       # Responsive storefront styling
app.js           # Client-side routes, cart, forms, and Razorpay handoff
data.js          # Shared product catalogue
assets/          # Images, favicons, SEO files, and static assets
backend/         # Express API and database SQL
```

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:5000](http://localhost:5000). The same Express process serves the browser app and its API, so no Vite proxy or second terminal is needed.

## API

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:identifier`
- `POST /api/contact`
- `POST /api/orders` (or `/api/orders/create`)
- `GET /api/orders/:identifier`
- `POST /api/orders/verify`

The order endpoint recalculates all prices and shipping on the server. Razorpay uses live signing when `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are configured; local development uses a safe simulated payment flow.

## Environment

Copy `.env.example` to `.env` and set production values as needed. `PORT` defaults to `5000`, and `CORS_ORIGIN` can contain a comma-separated allowlist.
