import Razorpay from 'razorpay';
import { config, isRazorpayConfigured } from '../config/env';

export let razorpayInstance: Razorpay | null = null;

if (isRazorpayConfigured) {
  try {
    razorpayInstance = new Razorpay({
      key_id: config.razorpay.keyId,
      key_secret: config.razorpay.keySecret,
    });
    console.log('✅ Razorpay SDK initialized successfully with Key ID:', config.razorpay.keyId);
  } catch (error) {
    console.error('❌ Failed to initialize Razorpay SDK:', error);
    razorpayInstance = null;
  }
} else {
  console.warn(
    '⚠️ Razorpay credentials not configured in .env. Server will operate in simulated test order preparation mode.'
  );
}
