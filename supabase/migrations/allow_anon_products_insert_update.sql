-- Allow admin page (using anon key) to add, edit, and remove products.
-- Run in Supabase → SQL Editor if you get "row-level security" errors when adding/removing products.

DROP POLICY IF EXISTS "products_insert_anon" ON products;
CREATE POLICY "products_insert_anon" ON products FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "products_update_anon" ON products;
CREATE POLICY "products_update_anon" ON products FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "products_delete_anon" ON products;
CREATE POLICY "products_delete_anon" ON products FOR DELETE TO anon USING (true);
