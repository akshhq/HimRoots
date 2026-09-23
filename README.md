# Himroots Wellness E-Commerce Platform

A premium, modern, responsive e-commerce frontend foundation built for Himroots Wellness, focusing on Sea Buckthorn wellness products.

## Tech Stack
- **Framework:** React + Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand (with LocalStorage persistence for Cart)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **UI Components:** Shadcn UI patterns (class-variance-authority, tailwind-merge)

## Features
- **Scalable Product Data:** Centralized product layer at `src/data/products.ts`. Adding new products requires no UI changes.
- **Dynamic Routing:** Beautiful product detail pages `/products/:slug`.
- **Persistent Cart:** Cart state survives page reloads.
- **Checkout Ready:** Checkout form captures all required customer data and simulates a secure payment flow (ready for Razorpay backend integration).
- **Luxury Aesthetic:** Premium Black + Warm Gold color scheme.

## How to Run Locally

Follow these steps to run the development server on your machine:

1. **Install Dependencies**
   Make sure you have Node.js installed. In the project root directory, run:
   ```bash
   npm install
   ```

2. **Start the Development Server**
   Run the following command to start Vite:
   ```bash
   npm run dev
   ```

3. **View in Browser**
   Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

## Building for Production

To build the app for production, run:
```bash
npm run build
```
This will generate optimized static files in the `dist` directory.

To preview the production build locally, run:
```bash
npm run preview
```
