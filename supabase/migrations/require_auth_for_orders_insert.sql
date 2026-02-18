-- Require login to place orders: remove anon INSERT so only authenticated users can create orders.
-- Run this in Supabase Dashboard → SQL Editor after applying fix_orders_rls_anon_insert.sql.

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;

-- Anon can still SELECT (e.g. for public order confirmation if needed); only INSERT is restricted to authenticated.
