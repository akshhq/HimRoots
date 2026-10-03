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
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // Razorpay Configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  
  // Secret for signing order access tokens (IDOR protection)
  orderSecret: process.env.RAZORPAY_KEY_SECRET || 'himroots_order_access_secret_salt',

  // Email Configuration (Resend or Brevo)
  email: {
    apiKey: process.env.EMAIL_API_KEY || '',
    from: process.env.EMAIL_FROM || 'Himroots Wellness <orders@himroots.in>',
    clientOrderEmail: process.env.CLIENT_ORDER_EMAIL || 'orders@himroots.in',
    clientSupportEmail: process.env.CLIENT_SUPPORT_EMAIL || 'support@himroots.in',
    clientCustomercareEmail: process.env.CLIENT_CUSTOMERCARE_EMAIL || 'customercare@himroots.in',
    clientSalesEmail: process.env.CLIENT_SALES_EMAIL || 'sales@himroots.in',
    clientInfoEmail: process.env.CLIENT_INFO_EMAIL || 'info@himroots.in',
    bccEmail: process.env.EMAIL_BCC || 'anshalini@gmail.com',
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

export const isRazorpayLiveConfigured = Boolean(
  isRazorpayConfigured &&
  config.razorpay.keyId.startsWith('rzp_live_')
);

export const isRazorpayWebhookConfigured = Boolean(
  config.razorpay.webhookSecret &&
  !config.razorpay.webhookSecret.includes('your_razorpay_webhook_secret_here')
);

export const isEmailConfigured = Boolean(
  config.email.apiKey &&
  !config.email.apiKey.includes('your_') &&
  !config.email.apiKey.includes('re_your_')
);

