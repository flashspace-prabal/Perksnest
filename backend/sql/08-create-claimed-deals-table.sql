-- Migration: Create normalized claimed_deals table for admin tracking
-- Date: 2026-04-25

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS perksnest.claimed_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES perksnest.users(id) ON DELETE CASCADE,
  deal_id TEXT NOT NULL,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, deal_id)
);

CREATE INDEX IF NOT EXISTS idx_claimed_deals_user_id
ON perksnest.claimed_deals(user_id);

CREATE INDEX IF NOT EXISTS idx_claimed_deals_deal_id
ON perksnest.claimed_deals(deal_id);

CREATE INDEX IF NOT EXISTS idx_claimed_deals_claimed_at
ON perksnest.claimed_deals(claimed_at DESC);

-- Backfill from the existing claim event stream when present.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'perksnest'
      AND table_name = 'claim_events'
  ) THEN
    INSERT INTO perksnest.claimed_deals (user_id, deal_id, claimed_at, status)
    SELECT user_id, deal_id, COALESCE(claimed_at, now()), 'active'
    FROM perksnest.claim_events
    ON CONFLICT (user_id, deal_id) DO UPDATE SET
      claimed_at = LEAST(perksnest.claimed_deals.claimed_at, EXCLUDED.claimed_at),
      updated_at = now();
  END IF;
END $$;

-- Backfill from the older users.claimed_deals array when present.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'perksnest'
      AND table_name = 'users'
      AND column_name = 'claimed_deals'
  ) THEN
    INSERT INTO perksnest.claimed_deals (user_id, deal_id, claimed_at, status)
    SELECT u.id, deal_id, COALESCE(u.created_at, now()), 'active'
    FROM perksnest.users u
    CROSS JOIN LATERAL unnest(u.claimed_deals) AS deal_id
    WHERE deal_id IS NOT NULL
      AND trim(deal_id) <> ''
    ON CONFLICT (user_id, deal_id) DO UPDATE SET
      claimed_at = LEAST(perksnest.claimed_deals.claimed_at, EXCLUDED.claimed_at),
      updated_at = now();
  END IF;
END $$;
