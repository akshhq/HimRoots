import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  },
  
  // Razorpay Configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
  },
  
  // Email Configuration (Resend or Brevo)
  email: {
    apiKey: process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY || process.env.BREVO_API_KEY || '',
    from: process.env.EMAIL_FROM || process.env.SENDER_EMAIL || 'Himroots Wellness <orders@himroots.in>',
    clientOrderEmail: process.env.CLIENT_ORDER_EMAIL || process.env.CLIENT_NOTIFICATION_EMAIL || 'orders@himroots.in',
    clientSupportEmail: process.env.CLIENT_SUPPORT_EMAIL || 'support@himroots.in',
    provider: (process.env.EMAIL_PROVIDER || 'resend').toLowerCase() as 'resend' | 'brevo',
  },
};

export const isSupabaseAdminConfigured = Boolean(
  config.supabase.url &&
  config.supabase.serviceRoleKey &&
  !config.supabase.url.includes('your-project-id') &&
  !config.supabase.serviceRoleKey.includes('your-supabase-service-role-secret-key-here')
);

export const isRazorpayConfigured = Boolean(
  config.razorpay.keyId &&
  config.razorpay.keySecret &&
  !config.razorpay.keyId.includes('yourkeyidhere') &&
  !config.razorpay.keySecret.includes('your_razorpay_key_secret_here')
);

export const isEmailConfigured = Boolean(
  config.email.apiKey &&
  !config.email.apiKey.includes('your_') &&
  !config.email.apiKey.includes('re_your_')
);
