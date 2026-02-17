-- Fix: "new row violates row-level security policy for table orders"
-- Run this in Supabase Dashboard → SQL Editor. This ensures anon can INSERT into orders.

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies that might conflict (either naming style)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "Allow anon insert orders" ON orders;

-- Allow anonymous (checkout) to insert orders
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon WITH CHECK (true);

-- Also ensure anon can select (for order history)
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
DROP POLICY IF EXISTS "Allow anon select orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon USING (true);

-- order_items: anon must be able to insert (checkout inserts line items)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "Allow anon insert order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
DROP POLICY IF EXISTS "Allow anon select order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT TO anon USING (true);
