-- =============================================================================
-- Braga Bazaar: Products table + RLS — run this in Supabase SQL Editor
-- =============================================================================
-- This fixes "cannot add products". Run the whole script once.
-- If you already have products you want to keep, export them first or skip step 1.
-- =============================================================================

-- Step 1: Replace the products table with the correct structure
-- (If your table had id as SERIAL/integer, the admin sends UUID — so we need UUID table.)
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  price numeric(10, 2) NOT NULL,
  stock_level integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  image_url text,
  description text,
  unit text DEFAULT 'unit',
  price_per_kg numeric(10, 2),
  nutritional_info jsonb NOT NULL DEFAULT '{}',
  on_sale boolean DEFAULT false,
  old_price numeric(10, 2),
  member_points_earned integer DEFAULT 5
);

-- Step 2: Row Level Security (RLS) — required for insert/update to work
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can read products — required so users see products on the homepage
CREATE POLICY "products_select"
  ON products FOR SELECT
  USING (true);

-- Authenticated users (logged in) can insert products (admin add product)
CREATE POLICY "products_insert"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update products (admin edit product)
CREATE POLICY "products_update"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Optional: allow delete for authenticated (admin delete product)
CREATE POLICY "products_delete"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- =============================================================================
-- Done. In the Supabase Dashboard:
-- 1. Authentication > Users: make sure you have a user and are logged in on the site.
-- 2. Table Editor > products: table should exist; try adding a row from the app.
-- =============================================================================
