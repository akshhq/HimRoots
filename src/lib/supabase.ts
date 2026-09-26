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

import { apiFetch } from '@/lib/api';

/**
 * Primary product catalog loader:
 * Queries GET /api/products as the authoritative primary data source, ensuring price,
 * stock status, and descriptions displayed to the customer match the backend validator.
 * Retains Supabase client as secondary and src/data/products.ts strictly as an offline/error fallback.
 */
export async function getStoreProducts(): Promise<Product[]> {
  try {
    const res = await apiFetch('/api/products');
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API /api/products unreachable, attempting Supabase client fallback:', err);
  }

  // Secondary check: Direct Supabase client query
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('is_featured', { ascending: false });

      if (!error && data && data.length > 0) {
        return (data as unknown as ProductRow[]).map(mapProductRowToProduct);
      }
    } catch (err) {
      console.warn('Supabase client error, falling back to static products:', err);
    }
  }

  // OFFLINE / ERROR FALLBACK ONLY: src/data/products.ts
  return staticProducts;
}

/**
 * Primary product detail loader:
 * Queries GET /api/products/:slug as the authoritative primary data source.
 * Retains src/data/products.ts strictly as an offline/error fallback.
 */
export async function getStoreProductBySlug(slug: string): Promise<Product | undefined> {
  const normalizedSlug = slug === 'sea-buckthorn-juice' ? 'sea-buckthorn-pulp' : slug;

  try {
    const res = await apiFetch(`/api/products/${encodeURIComponent(normalizedSlug)}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn(`API /api/products/${normalizedSlug} unreachable, attempting Supabase fallback:`, err);
  }

  // Secondary check: Direct Supabase client query
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', normalizedSlug)
        .single();

      if (!error && data) {
        return mapProductRowToProduct(data as unknown as ProductRow);
      }
    } catch {
      // Fall through to offline fallback
    }
  }

  // OFFLINE / ERROR FALLBACK ONLY: src/data/products.ts
  return staticProducts.find((p) => p.slug === normalizedSlug);
}

