-- Migration: Add customer ID fields to applications table
-- Date: 2025-10-24
-- Purpose: Enable quick customer identification and search without joins

-- Add customer identification fields
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS customer_id_type TEXT,
ADD COLUMN IF NOT EXISTS customer_id_number TEXT;

-- Add indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_applications_customer_id ON applications(customer_id_type, customer_id_number);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_cart_id ON applications(cart_id);

-- Comment the columns
COMMENT ON COLUMN applications.customer_id_type IS 'Type of customer ID (passport, national_id, drivers_license, etc.)';
COMMENT ON COLUMN applications.customer_id_number IS 'Customer unique ID number for searching';
