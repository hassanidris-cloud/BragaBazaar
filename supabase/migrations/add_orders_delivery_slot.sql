-- Add delivery date and time slot to orders (for Phase 2/3 fulfillment)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS time_slot TEXT;
-- Allow substitution_pending status for Phase 3
-- (status column already exists as TEXT; no change needed)
