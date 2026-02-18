-- Run this in Supabase Dashboard → SQL Editor if order status updates fail.
-- It allows logged-in (authenticated) users to UPDATE the orders table (e.g. admin setting Shipped/Delivered).

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_update_orders" ON orders;
CREATE POLICY "authenticated_update_orders" ON orders
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

-- After running: log in as admin (bragabazaar@gmail.com) and open admin-orders.html. Status changes should persist and show for customers in "As minhas encomendas".
