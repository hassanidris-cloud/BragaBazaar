-- Add subcategory column for nested categories (e.g. drinks → waters, juices_softdrinks)
-- Run in Supabase Dashboard → SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;

COMMENT ON COLUMN products.subcategory IS 'Subcategory within parent category, e.g. waters, juices_softdrinks under drinks';
