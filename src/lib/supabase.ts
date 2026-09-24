import { createClient } from '@supabase/supabase-js';
import type { Database, ProductRow } from '@/types/database.types';
import { products as staticProducts, type Product } from '@/data/products';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-public-anon-key')
);

// Initialize client only with safe public anon key
export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Resolves product image paths supporting relative local paths (/images/...),
 * full CDN URLs, or Supabase Storage public bucket files ('products/xyz.webp').
 */
export function getProductImageUrl(imagePath: string): string {
  if (!imagePath) return '/images/himroots-harvest-berries.jpg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }
  if (supabaseUrl) {
    return `${supabaseUrl.replace(/\/+$/, '')}/storage/v1/object/public/products/${imagePath}`;
  }
  return `/images/${imagePath}`;
}

function mapProductRowToProduct(row: ProductRow): Product {
  const rawImages = row.images && row.images.length > 0 ? row.images : ['/images/himroots-harvest-berries.jpg'];
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
    images: rawImages.map(getProductImageUrl),
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

/**
 * Fetch products from Supabase with graceful fallback to the existing static dataset.
 * This guarantees the storefront remains fully functional even before Supabase is connected.
 */
export async function getStoreProducts(): Promise<Product[]> {
  if (!supabase || !isSupabaseConfigured) {
    return staticProducts;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase query returned error or empty list, falling back to static products:', error);
      return staticProducts;
    }

    return (data as unknown as ProductRow[]).map(mapProductRowToProduct);
  } catch (err) {
    console.error('Unexpected error fetching from Supabase, using static products:', err);
    return staticProducts;
  }
}

/**
 * Fetch a single product by its slug with fallback to static dataset.
 */
export async function getStoreProductBySlug(slug: string): Promise<Product | undefined> {
  const normalizedSlug = slug === 'sea-buckthorn-juice' ? 'sea-buckthorn-pulp' : slug;
  
  if (!supabase || !isSupabaseConfigured) {
    return staticProducts.find((p) => p.slug === normalizedSlug);
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', normalizedSlug)
      .single();

    if (error || !data) {
      return staticProducts.find((p) => p.slug === normalizedSlug);
    }

    return mapProductRowToProduct(data as unknown as ProductRow);
  } catch {
    return staticProducts.find((p) => p.slug === normalizedSlug);
  }
}
