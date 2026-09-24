import { Router } from 'express';
import { getProducts, getProductByIdentifier } from '../controllers/productController';

const router = Router();

/**
 * GET /api/products
 * Returns all active products
 */
router.get('/', getProducts);

/**
 * GET /api/products/:identifier
 * Returns a single product by slug or id
 */
router.get('/:identifier', getProductByIdentifier);

export default router;
