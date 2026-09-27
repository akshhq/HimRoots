/**
 * Razorpay Checkout SDK Integration Utility & Type Definitions
 */

export interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

export interface RazorpayTheme {
  color?: string;
  backdrop_color?: string;
  hide_topbar?: boolean;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise (e.g. 50000 = ₹500.00)
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler?: (response: RazorpaySuccessResponse) => void;
  prefill?: RazorpayPrefill;
  notes?: Record<string, string>;
  theme?: RazorpayTheme;
  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
    escape?: boolean;
    animation?: boolean;
  };
}

export interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: any) => void) => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

/**
 * Ensures the Razorpay checkout.js script is loaded and returns true once ready.
 */
export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return true;
  }

  return new Promise((resolve) => {
    // If window.Razorpay is already present
    if (typeof window !== 'undefined' && window.Razorpay) {
      return resolve(true);
    }

    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]') as HTMLScriptElement | null;
    if (existingScript) {
      if (window.Razorpay) return resolve(true);

      existingScript.addEventListener('load', () => resolve(Boolean(window.Razorpay)));
      existingScript.addEventListener('error', () => resolve(false));

      // Check again after short tick in case load already fired
      setTimeout(() => {
        if (window.Razorpay) resolve(true);
      }, 500);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
