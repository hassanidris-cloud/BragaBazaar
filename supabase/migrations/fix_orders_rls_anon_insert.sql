-- Fix: "new row violates row-level security policy for table orders"
-- Run this in Supabase Dashboard → SQL Editor.
-- Allows both anon (guest) and authenticated (logged-in) users to insert orders.

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Orders: drop old policies
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "Allow anon insert orders" ON orders;
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
DROP POLICY IF EXISTS "Allow anon select orders" ON orders;
DROP POLICY IF EXISTS "authenticated_insert_orders" ON orders;
DROP POLICY IF EXISTS "authenticated_select_orders" ON orders;

-- Orders: anon (guest checkout)
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon USING (true);

-- Orders: authenticated (logged-in checkout + admin status updates)
CREATE POLICY "authenticated_insert_orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_select_orders" ON orders FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "authenticated_update_orders" ON orders;
CREATE POLICY "authenticated_update_orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "Allow anon insert order_items" ON order_items;
DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
DROP POLICY IF EXISTS "Allow anon select order_items" ON order_items;
DROP POLICY IF EXISTS "authenticated_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "authenticated_select_order_items" ON order_items;

CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT TO anon USING (true);
CREATE POLICY "authenticated_insert_order_items" ON order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_select_order_items" ON order_items FOR SELECT TO authenticated USING (true);
