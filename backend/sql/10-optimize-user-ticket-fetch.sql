-- Migration: Speed up customer ticket list queries

CREATE INDEX IF NOT EXISTS idx_tickets_user_updated
ON perksnest.tickets(user_id, updated_at DESC);
