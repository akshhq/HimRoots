import { Router, Request, Response, NextFunction } from 'express';
import { getAllProducts, getProductBySlugOrId } from '../services/productService';

const router = Router();

/**
 * GET /api/products
 * Returns all active products
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getAllProducts();
    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:identifier
 * Returns a single product by slug or id
 */
router.get('/:identifier', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier } = req.params;
    const product = await getProductBySlugOrId(identifier);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product with identifier '${identifier}' not found`,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
