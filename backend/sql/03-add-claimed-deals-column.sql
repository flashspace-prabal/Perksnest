-- Migration: Add claimed_deals column to users table
-- This column stores an array of deal IDs that the user has claimed
-- Date: 2026-04-21

-- Check if column exists, if not add it
ALTER TABLE perksnest.users
ADD COLUMN IF NOT EXISTS claimed_deals TEXT[] DEFAULT '{}';

-- Ensure it's not null and has proper default
ALTER TABLE perksnest.users
ALTER COLUMN claimed_deals SET NOT NULL,
ALTER COLUMN claimed_deals SET DEFAULT '{}';

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_claimed_deals 
ON perksnest.users USING gin(claimed_deals);

-- Verify the column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'perksnest' 
  AND table_name = 'users' 
  AND column_name = 'claimed_deals';
