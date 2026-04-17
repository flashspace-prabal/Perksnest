-- Migration Script: Add features and reviews columns to deals table
-- Run this FIRST before running update-deals-supabase.sql
-- This adds the missing features and reviews columns to the public.deals table

BEGIN;

-- Check if features column exists, if not add it
ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;

-- Check if reviews column exists, if not add it
ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS reviews jsonb DEFAULT '[]'::jsonb;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deals_features ON public.deals USING GIN (features);
CREATE INDEX IF NOT EXISTS idx_deals_reviews ON public.deals USING GIN (reviews);

COMMIT;

-- Verify columns were added
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'deals' AND column_name IN ('features', 'reviews');
