import { Request, Response, NextFunction } from 'express';

export interface ValidationErrorDetails {
  [field: string]: string;
}

/**
 * Strips dangerous HTML tags, attributes, event handlers, and script/style/iframe blocks
 * to prevent Stored XSS attacks in databases and dashboards.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags and their content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Strip style tags and their content
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Strip iframe tags and their content
    .replace(/<[^>]*>?/gm, '') // Strip any remaining HTML tags
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '')
    .replace(/on\w+\s*=/gi, '') // Strip inline event handlers (e.g. onload=, onerror=)
    .replace(/\s+/g, ' ')       // Normalize spaces
    .trim();
}

/**
 * Validate customer and shipping address inputs for order creation
 */
export function validateCreateOrder(req: Request, res: Response, next: NextFunction): void {
  // Deep input sanitization against XSS/HTML injection on free-text inputs
  if (req.body.customer && typeof req.body.customer === 'object') {
    if (typeof req.body.customer.name === 'string') {
      req.body.customer.name = sanitizeText(req.body.customer.name);
    }
  }
  if (req.body.shipping && typeof req.body.shipping === 'object') {
    if (typeof req.body.shipping.address === 'string') {
      req.body.shipping.address = sanitizeText(req.body.shipping.address);
    }
    if (typeof req.body.shipping.city === 'string') {
      req.body.shipping.city = sanitizeText(req.body.shipping.city);
    }
    if (typeof req.body.shipping.state === 'string') {
      req.body.shipping.state = sanitizeText(req.body.shipping.state);
    }
    if (typeof req.body.shipping.pincode === 'string') {
      req.body.shipping.pincode = sanitizeText(req.body.shipping.pincode);
    }
  }
  if (req.body.notes && typeof req.body.notes === 'string') {
    req.body.notes = sanitizeText(req.body.notes);
  }

  const { items, customer, shipping } = req.body;
  const errors: ValidationErrorDetails = {};

  // 1. Validate Items
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.items = 'Your shopping cart is empty. Please add at least one product before placing an order.';
  } else {
    items.forEach((item, index) => {
      const pId = item?.productId || item?.id;
      if (!pId || typeof pId !== 'string' || pId.trim().length === 0) {
        errors[`items[${index}].productId`] = 'Invalid or missing product ID.';
      }
      const qty = item?.quantity;
      if (typeof qty !== 'number' || !Number.isInteger(qty) || qty <= 0) {
        errors[`items[${index}].quantity`] = 'Quantity must be a positive whole number.';
      } else if (qty > 50) {
        errors[`items[${index}].quantity`] = 'Quantity exceeds maximum purchase limit of 50 units per order.';
      }
    });
  }

  // 2. Validate Customer
  if (!customer || typeof customer !== 'object') {
    errors.customer = 'Customer contact information is required.';
  } else {
    const name = customer.name?.trim() || '';
    if (!name || name.length < 2) {
      errors['customer.name'] = 'Full name is required (at least 2 characters).';
    }

    const email = customer.email?.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors['customer.email'] = 'A valid email address is required for order confirmation and receipts.';
    }

    const rawPhone = customer.phone?.toString() || '';
    const cleanedPhone = rawPhone.replace(/[\s\-()+]/g, '');
    if (!cleanedPhone || cleanedPhone.length < 8 || !/^\d+$/.test(cleanedPhone)) {
      errors['customer.phone'] = 'A valid contact phone number is required (at least 8 digits).';
    }
  }

  // 3. Validate Shipping Destination
  if (!shipping || typeof shipping !== 'object') {
    errors.shipping = 'Shipping delivery address is required.';
  } else {
    const address = shipping.address?.trim() || '';
    if (!address || address.length < 5) {
      errors['shipping.address'] = 'Detailed street address is required (at least 5 characters).';
    }

    const city = shipping.city?.trim() || '';
    if (!city || city.length < 2) {
      errors['shipping.city'] = 'City or town name is required.';
    }

    const state = shipping.state?.trim() || '';
    if (!state || state.length < 2) {
      errors['shipping.state'] = 'State or region is required.';
    }

    const pincode = shipping.pincode?.toString().trim() || '';
    if (!pincode || pincode.length < 4 || !/^[0-9a-zA-Z\s-]+$/.test(pincode)) {
      errors['shipping.pincode'] = 'A valid postal PIN code is required.';
    }
  }

  // Return clean, structured validation errors if any field failed
  if (Object.keys(errors).length > 0) {
    const firstErrorMessage = Object.values(errors)[0];
    res.status(400).json({
      success: false,
      error: firstErrorMessage,
      details: errors,
    });
    return;
  }

  next();
}

/**
 * Validate contact inquiry form
 */
export function validateContactInquiry(req: Request, res: Response, next: NextFunction): void {
  // Deep input sanitization against XSS/HTML injection on contact form inputs
  if (typeof req.body.name === 'string') req.body.name = sanitizeText(req.body.name);
  if (typeof req.body.message === 'string') req.body.message = sanitizeText(req.body.message);
  if (typeof req.body.phone === 'string') req.body.phone = sanitizeText(req.body.phone);
  if (typeof req.body.orderId === 'string') req.body.orderId = sanitizeText(req.body.orderId);

  const { name, email, message } = req.body;
  const errors: ValidationErrorDetails = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Please provide your name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address so we can reply to you.';
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.message = 'Please enter your message (at least 5 characters).';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      error: Object.values(errors)[0],
      details: errors,
    });
    return;
  }

  next();
}

