-- Add SKU, variants (e.g. Size/Color), and low-stock threshold for inventory control.
-- Run in Supabase → SQL Editor.

ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER;

COMMENT ON COLUMN products.sku IS 'Stock keeping unit / product code';
COMMENT ON COLUMN products.variants IS 'Optional variants e.g. "Size: S, M, L" or "Flavor: Natural, Honey"';
COMMENT ON COLUMN products.low_stock_threshold IS 'Alert when stock_level falls below this (default 5 if null)';
