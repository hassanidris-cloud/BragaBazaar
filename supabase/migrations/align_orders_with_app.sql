-- Align orders and order_items with what the app (checkout) sends and order history expects.
-- Run this in Supabase Dashboard → SQL Editor → New query, paste and run.

-- 1) orders: if id is UUID and has no default, set default so insert works (omit if your orders.id is SERIAL/integer)
ALTER TABLE orders ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2) orders: add columns the checkout sends (if your table was created from schema with only total_price, etc.)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_order_id BIGINT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS postal TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total NUMERIC(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- Backfill total from total_price if total is null (for existing rows)
UPDATE orders SET total = total_price WHERE total IS NULL AND total_price IS NOT NULL;

-- 3) order_items: add name, price, qty if missing (app sends these)
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS qty INTEGER;

-- Backfill qty from quantity for existing rows
UPDATE order_items SET qty = quantity WHERE qty IS NULL AND quantity IS NOT NULL;

-- 4) RLS: allow anonymous insert/select so checkout and order history work without auth
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon insert orders" ON orders;
CREATE POLICY "Allow anon insert orders" ON orders FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select orders" ON orders;
CREATE POLICY "Allow anon select orders" ON orders FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Allow anon update orders" ON orders;
CREATE POLICY "Allow anon update orders" ON orders FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert order_items" ON order_items;
CREATE POLICY "Allow anon insert order_items" ON order_items FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select order_items" ON order_items;
CREATE POLICY "Allow anon select order_items" ON order_items FOR SELECT TO anon USING (true);
