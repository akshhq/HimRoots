import { Request, Response, NextFunction } from 'express';
import { getAllProducts, getProductBySlugOrId } from '../services/productService';

/**
 * Controller for Product endpoints
 */
export async function getProducts(_req: Request, res: Response, next: NextFunction): Promise<void> {
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
}

export async function getProductByIdentifier(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { identifier } = req.params;
    const product = await getProductBySlugOrId(identifier);

    if (!product) {
      res.status(404).json({
        success: false,
        error: `Product with identifier '${identifier}' not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
