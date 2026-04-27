-- Migration: Add deal association to support tickets
-- Date: 2026-04-27

ALTER TABLE perksnest.tickets
ADD COLUMN IF NOT EXISTS deal_id TEXT;

CREATE INDEX IF NOT EXISTS idx_tickets_deal_id
ON perksnest.tickets(deal_id);
