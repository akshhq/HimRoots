import { supabaseAdmin } from '../lib/supabase';
import { products as fallbackProducts, type Product } from '../../src/data/products';
import type { ProductRow } from '../../src/types/database.types';

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline || '',
    scriptQuote: row.script_quote || undefined,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    volume: row.volume || '',
    images: row.images && row.images.length > 0 ? row.images : ['/images/himroots-harvest-berries.jpg'],
    category: row.category,
    ingredients: row.ingredients || [],
    detailedIngredients: (row.detailed_ingredients as any) || [],
    benefits: row.benefits || [],
    certifications: row.certifications || [],
    directions: row.directions || [],
    packagingFeature: row.packaging_feature || '',
    stock: row.stock_quantity,
    rating: Number(row.rating),
    reviews: row.reviews_count,
    featured: row.is_featured,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('is_featured', { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as unknown as ProductRow[]).map(mapRowToProduct);
      }
    } catch (err) {
      console.error('Error fetching products from Supabase:', err);
    }
  }

  // Graceful fallback to static product catalog
  return fallbackProducts;
}

export async function getProductBySlugOrId(identifier: string): Promise<Product | undefined> {
  const normalized = identifier === 'sea-buckthorn-juice' ? 'sea-buckthorn-pulp' : identifier;

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .or(`slug.eq.${normalized},id.eq.${identifier}`)
        .maybeSingle();

      if (!error && data) {
        return mapRowToProduct(data as unknown as ProductRow);
      }
    } catch (err) {
      console.error(`Error querying product [${identifier}] from Supabase:`, err);
    }
  }

  return fallbackProducts.find(
    (p) => p.slug === normalized || p.id === identifier
  );
}

export async function getVerifiedProductsByIds(
  ids: string[]
): Promise<Map<string, Product>> {
  const productMap = new Map<string, Product>();

  if (supabaseAdmin && ids.length > 0) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .in('id', ids);

      if (!error && data && data.length > 0) {
        for (const row of data as unknown as ProductRow[]) {
          productMap.set(row.id, mapRowToProduct(row));
        }
      }
    } catch (err) {
      console.error('Error batch fetching verified products from Supabase:', err);
    }
  }

  // Fill any remaining from fallback
  for (const id of ids) {
    if (!productMap.has(id)) {
      const normalizedId = id === 'sea-buckthorn-juice' ? 'sea-buckthorn-pulp' : id;
      const fallback = fallbackProducts.find(
        (p) =>
          p.id === normalizedId ||
          p.slug === normalizedId ||
          (normalizedId === 'prod_sea_buckthorn_pulp' && (p.id === 'prod_001' || p.slug === 'sea-buckthorn-pulp')) ||
          (normalizedId === 'prod_sea_buckthorn_oil_capsules' && (p.id === 'prod_002' || p.slug === 'sea-buckthorn-capsules'))
      );
      if (fallback) {
        productMap.set(id, fallback);
      }
    }
  }

  return productMap;
}

/**
 * Decrement inventory stock atomically for purchased items when an order is paid.
 */
export async function decrementProductStock(
  items: { productId?: string; quantity: number }[]
): Promise<void> {
  for (const item of items) {
    if (!item.productId || item.quantity <= 0) continue;
    const targetId = item.productId === 'sea-buckthorn-juice' ? 'sea-buckthorn-pulp' : item.productId;

    // 1. Decrement in Supabase if configured
    if (supabaseAdmin) {
      try {
        const { data: prod } = await (supabaseAdmin as any)
          .from('products')
          .select('id, stock_quantity')
          .or(`id.eq.${targetId},slug.eq.${targetId}`)
          .maybeSingle();

        if (prod) {
          const currentStock = typeof prod.stock_quantity === 'number' ? prod.stock_quantity : 50;
          const newStock = Math.max(0, currentStock - item.quantity);
          const newStatus = newStock === 0 ? 'out_of_stock' : newStock <= 10 ? 'low_stock' : 'in_stock';

          await (supabaseAdmin as any)
            .from('products')
            .update({
              stock_quantity: newStock,
              stock_status: newStatus,
            })
            .eq('id', prod.id);
        }
      } catch (err) {
        console.error(`Error decrementing stock for product [${targetId}] in Supabase:`, err);
      }
    }

    // 2. Decrement in fallback memory catalog
    const fallback = fallbackProducts.find(
      (p) =>
        p.id === targetId ||
        p.slug === targetId ||
        (targetId === 'prod_sea_buckthorn_pulp' && p.id === 'prod_001') ||
        (targetId === 'prod_sea_buckthorn_oil_capsules' && p.id === 'prod_002')
    );
    if (fallback && typeof fallback.stock === 'number') {
      fallback.stock = Math.max(0, fallback.stock - item.quantity);
    }
  }
}
