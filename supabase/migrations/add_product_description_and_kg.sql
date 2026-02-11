-- Run this in Supabase SQL Editor if your products table already exists.
-- Adds: description, unit (e.g. 'unit' or 'kg'), price_per_kg for fruits/vegetables.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'unit',
  ADD COLUMN IF NOT EXISTS price_per_kg NUMERIC(10, 2);

-- Optional: allow authenticated users to insert/update products (fix "add product not working").
-- If you use RLS, create policies like below (adjust role/email as needed).
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow read products" ON products FOR SELECT USING (true);
-- CREATE POLICY "Allow insert for authenticated" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Allow update for authenticated" ON products FOR UPDATE USING (auth.role() = 'authenticated');
