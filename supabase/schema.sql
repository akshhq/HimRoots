-- =============================================================================
-- HIMROOTS WELLNESS — DATABASE SCHEMA MIGRATION
-- Database: PostgreSQL (Supabase)
-- Description: Complete schema for Products, Orders, and Order Items with
--              automated human-readable order numbers, RLS security policies,
--              and index optimizations.
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. PRODUCTS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod_' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    script_quote TEXT,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= price),
    volume TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL,
    ingredients TEXT[] DEFAULT '{}',
    detailed_ingredients JSONB DEFAULT '[]'::jsonb,
    benefits TEXT[] DEFAULT '{}',
    certifications TEXT[] DEFAULT '{}',
    directions TEXT[] DEFAULT '{}',
    packaging_feature TEXT,
    stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'low_stock', 'out_of_stock')),
    stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comments on products table
COMMENT ON TABLE public.products IS 'Himroots high-altitude Himalayan wellness product catalog';
COMMENT ON COLUMN public.products.id IS 'Unique identifier (supports legacy prod_XXX IDs and generated IDs)';
COMMENT ON COLUMN public.products.slug IS 'URL-friendly unique slug for product routing';
COMMENT ON COLUMN public.products.detailed_ingredients IS 'JSONB array with {name, percentage, benefits[]} breakdown';

-- Indexes for products
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON public.products(stock_status);

-- =============================================================================
-- 2. ORDER NUMBER GENERATOR FUNCTION
-- Format: HM-YYYYMMDD-XXXX (e.g., HM-20260924-0001)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    v_date TEXT;
    v_seq_val INTEGER;
    v_order_num TEXT;
BEGIN
    -- Current date formatted as YYYYMMDD in UTC
    v_date := to_char(timezone('utc'::text, now()), 'YYYYMMDD');
    
    -- Count existing orders created today to compute the 4-digit sequential index
    SELECT COUNT(*) + 1 INTO v_seq_val 
    FROM public.orders 
    WHERE created_at >= date_trunc('day', timezone('utc'::text, now()));
    
    -- Build human-readable order number: HM-20260924-0001
    v_order_num := 'HM-' || v_date || '-' || lpad(v_seq_val::text, 4, '0');
    
    RETURN v_order_num;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- =============================================================================
-- 3. ORDERS TABLE
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL DEFAULT public.generate_order_number(),
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    order_status TEXT NOT NULL DEFAULT 'received' CHECK (order_status IN ('received', 'processing', 'packed', 'shipped', 'delivered', 'cancelled')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    email_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'failed')),
    email_error TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comments on orders table
COMMENT ON TABLE public.orders IS 'Master transaction and customer shipping records for manual client fulfillment';
COMMENT ON COLUMN public.orders.order_number IS 'Human-readable sequential order reference number (e.g. HM-20260924-0001)';
COMMENT ON COLUMN public.orders.payment_status IS 'Razorpay payment lifecycle state';
COMMENT ON COLUMN public.orders.order_status IS 'Manual fulfillment tracking state for the Himroots operations team';

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders(razorpay_payment_id);

-- =============================================================================
-- 4. ORDER ITEMS TABLE
-- Stores historical snapshot of item name, quantity, price, and line subtotal.
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comments on order_items table
COMMENT ON TABLE public.order_items IS 'Line item records capturing immutable name & price at time of purchase';

-- Indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- =============================================================================
-- 5. CONTACT INQUIRIES TABLE
-- Supporting the existing /contact form discovered in previous audit
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    order_id TEXT,
    category TEXT NOT NULL DEFAULT 'General Enquiry',
    subject TEXT NOT NULL DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'responded', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for contact_inquiries
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);

-- =============================================================================
-- 6. AUTOMATED UPDATED_AT TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Products RLS
-- Public can READ active products.
-- Only authenticated service role can INSERT, UPDATE, or DELETE.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
    ON public.products
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Service role manages products" ON public.products;
CREATE POLICY "Service role manages products"
    ON public.products
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Orders RLS
-- Strict Security: Orders must NOT be publicly readable or writable.
-- Customers cannot inspect other orders or tamper with payment_status.
-- All order operations are handled through the backend via service_role.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Deny direct public read access to orders" ON public.orders;
CREATE POLICY "Deny direct public read access to orders"
    ON public.orders
    FOR SELECT
    TO anon, authenticated
    USING (false);

DROP POLICY IF EXISTS "Deny direct public write access to orders" ON public.orders;
CREATE POLICY "Deny direct public write access to orders"
    ON public.orders
    FOR ALL
    TO anon, authenticated
    USING (false);

DROP POLICY IF EXISTS "Service role has full access to orders" ON public.orders;
CREATE POLICY "Service role has full access to orders"
    ON public.orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Order Items RLS
-- Strict Security: Follows orders security. No direct public access.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Deny direct public access to order items" ON public.order_items;
CREATE POLICY "Deny direct public access to order items"
    ON public.order_items
    FOR ALL
    TO anon, authenticated
    USING (false);

DROP POLICY IF EXISTS "Service role has full access to order items" ON public.order_items;
CREATE POLICY "Service role has full access to order items"
    ON public.order_items
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- Contact Inquiries RLS
-- Public can submit inquiries via the website contact form.
-- Reading, updating, or deleting inquiries is restricted to service_role.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can submit contact inquiries"
    ON public.contact_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Deny public read on contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Deny public read on contact inquiries"
    ON public.contact_inquiries
    FOR SELECT
    TO anon, authenticated
    USING (false);

DROP POLICY IF EXISTS "Service role has full access to contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Service role has full access to contact inquiries"
    ON public.contact_inquiries
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
