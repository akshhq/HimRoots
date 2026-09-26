import { Router } from 'express';
import { submitContactInquiry } from '../controllers/contactController';
import { validateContactInquiry } from '../middleware/validation';
import { contactLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/contact
 * Validates, records in Supabase, and dispatches customer inquiry.
 */
router.post('/', contactLimiter, validateContactInquiry, submitContactInquiry);

export default router;
