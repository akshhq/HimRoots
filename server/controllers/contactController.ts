import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { sendClientSupportInquiryEmail } from '../services/emailService';
import { sanitizeText } from '../middleware/validation';

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

/**
 * Controller for Customer Contact Inquiries
 * Handles POST /api/contact
 */
export async function submitContactInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email, phone, orderId, category, message, honeypot } = req.body;

    // 1. Anti-spam bot trap (honeypot field)
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn('🤖 Spam bot detected via honeypot field. Dropping silently.');
      res.status(200).json({
        success: true,
        message: 'Your inquiry has been received. Our team will get back to you promptly.',
      });
      return;
    }

    // 2. Resolve Category
    let resolvedCategory: string = 'General Enquiry';
    if (category && typeof category === 'string') {
      const match = VALID_CATEGORIES.find(
        (c) => c.toLowerCase() === category.trim().toLowerCase()
      );
      if (match) {
        resolvedCategory = match;
      } else {
        res.status(400).json({
          success: false,
          error: `Invalid category '${category}'. Valid categories: ${VALID_CATEGORIES.join(', ')}`,
        });
        return;
      }
    }

    const cleanName = sanitizeText(name);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? sanitizeText(phone) : null;
    const cleanOrderId = orderId ? sanitizeText(orderId).toUpperCase() : null;
    const cleanMessage = sanitizeText(message);
    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // 3. Record inquiry in Supabase database
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

    // 4. Best-effort dispatch email notification
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
      } else {
        console.log(`✅ [SUPPORT INQUIRY DISPATCHED] Category: ${resolvedCategory} from ${cleanName}`);
      }
    } catch (emailErr: any) {
      console.error('🔥 Exception during support email dispatch:', emailErr.message);
    }

    // 5. Return success response to user
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. Our team will review your message and reply promptly.',
    });
  } catch (error) {
    next(error);
  }
}
