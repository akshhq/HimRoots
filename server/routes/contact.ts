import { Router, Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { sendClientSupportInquiryEmail } from '../services/emailService';

const router = Router();

export const VALID_CATEGORIES = [
  'Order Support',
  'Payment Issue',
  'Delivery Issue',
  'Return/Refund',
  'Product Query',
  'General Enquiry',
  'Other',
] as const;

export type InquiryCategory = typeof VALID_CATEGORIES[number];

// In-memory rate limiting map: ip/email -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(identifier) || [];
  
  // Filter out timestamps outside the active window
  const activeTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(identifier, activeTimestamps);
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(identifier, activeTimestamps);
  return false;
}

/**
 * POST /api/contact
 * Validates, records in Supabase, and emails customer support inquiries
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, orderId, category, message, honeypot } = req.body;

    // 1. Anti-spam bot trap (honeypot field)
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn('🤖 Spam bot detected via honeypot field. Dropping silently.');
      return res.status(200).json({
        success: true,
        message: 'Your inquiry has been received. Our team will get back to you promptly.',
      });
    }

    // 2. Client IP / Email Rate Limiting
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateLimitKey = `${clientIp}_${email ? String(email).trim().toLowerCase() : ''}`;
    if (isRateLimited(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a few minutes before submitting another inquiry.',
      });
    }

    // 3. Server-side Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid full name (at least 2 characters)',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address so we can reply to you',
      });
    }

    // Category validation
    let resolvedCategory: string = 'General Enquiry';
    if (category && typeof category === 'string') {
      const match = VALID_CATEGORIES.find(
        c => c.toLowerCase() === category.trim().toLowerCase()
      );
      if (match) {
        resolvedCategory = match;
      } else {
        return res.status(400).json({
          success: false,
          error: `Invalid category '${category}'. Valid categories: ${VALID_CATEGORIES.join(', ')}`,
        });
      }
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 5 characters long',
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? String(phone).trim() : null;
    const cleanOrderId = orderId ? String(orderId).trim().toUpperCase() : null;
    const cleanMessage = message.trim();
    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // 4. Record inquiry in Supabase database
    if (supabaseAdmin) {
      try {
        const { error: dbError } = await (supabaseAdmin as any)
          .from('contact_inquiries')
          .insert({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            order_id: cleanOrderId,
            category: resolvedCategory,
            subject: resolvedCategory,
            message: cleanMessage,
            status: 'unread',
          });

        if (dbError) {
          console.error('Error inserting contact inquiry into Supabase:', dbError);
        }
      } catch (dbErr) {
        console.warn('Supabase contact persistence error:', dbErr);
      }
    }

    // 5. Dispatch email notification to Himroots Support Inbox
    try {
      const emailResult = await sendClientSupportInquiryEmail({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        orderId: cleanOrderId,
        category: resolvedCategory,
        message: cleanMessage,
        submittedAt,
      });

      if (!emailResult.success) {
        console.error('⚠️ Could not dispatch support email notification:', emailResult.error);
        // Note: Do NOT fail customer request if inquiry is recorded in database
      } else {
        console.log(`✅ [SUPPORT INQUIRY DISPATCHED] Category: ${resolvedCategory} from ${cleanName}`);
      }
    } catch (emailErr: any) {
      console.error('🔥 Exception during support email dispatch:', emailErr.message);
    }

    // 6. Return friendly response to customer
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our team will review your message and reply promptly.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
