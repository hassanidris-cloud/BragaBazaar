-- Use this if orders still don't appear. It creates orders + order_items from scratch
-- with the exact columns the app uses. Run in Supabase → SQL Editor.
-- WARNING: This DROPS existing orders and order_items (and their data). Back up first if needed.

DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  client_order_id BIGINT,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  postal TEXT,
  city TEXT,
  location TEXT,
  country TEXT,
  payment TEXT,
  payment_method TEXT,
  instructions TEXT,
  total NUMERIC(10,2),
  total_price NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending',
  fulfillment TEXT DEFAULT 'delivery',
  delivery_date DATE,
  time_slot TEXT
);

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT,
  price NUMERIC(10,2),
  qty INTEGER,
  quantity INTEGER
);

-- RLS: allow anon to insert and select (for checkout and order history)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT TO anon USING (true);
