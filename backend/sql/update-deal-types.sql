-- Supabase SQL Script: Update Deal Types (FREE vs PREMIUM)
-- Created: 2026-04-18
-- Purpose: Add deal_type classification to all deals in the deals table

-- Step 1: Add deal_type column if it doesn't exist
ALTER TABLE deals
ADD COLUMN IF NOT EXISTS deal_type VARCHAR(20) DEFAULT 'free' CHECK (deal_type IN ('free', 'premium'));

-- Step 2: Create index on deal_type for faster queries
CREATE INDEX IF NOT EXISTS idx_deals_deal_type ON deals(deal_type);

-- Step 3: Update FREE DEALS (22 deals)
UPDATE deals SET deal_type = 'free' WHERE id IN (
  'google-cloud',
  'aws',
  'microsoft-azure',
  'digitalocean',
  'vercel',
  'openai',
  'anthropic',
  'elevenlabs',
  'perplexity-ai',
  'mongodb',
  'supabase',
  'github',
  'posthog',
  'mixpanel',
  'notion',
  'canva',
  'miro',
  'linear',
  'sentry',
  'datadog',
  'new-relic',
  'stripe-atlas'
);

-- Step 4: Update PREMIUM DEALS (47 deals)
UPDATE deals SET deal_type = 'premium' WHERE id IN (
  'cloudflare',
  'ovhcloud',
  'render',
  'scaleway',
  'backblaze',
  'cleura',
  'oracle',
  'deepinfra',
  'fireworks-ai',
  'inworld-ai',
  'anam-ai',
  'couchbase',
  'planetscale',
  'twilio-segment',
  'amplitude',
  'statsig',
  'retool',
  'algolia',
  'circleci',
  'gitlab',
  'bastion',
  'intercom',
  'hubspot',
  'zendesk',
  'salesforce',
  'brex',
  'ramp',
  'revolut-business',
  'gusto',
  'revsh',
  'zoho',
  'typeform',
  'lightfield-crm',
  'deel',
  'box-ai',
  'siemens',
  'alchemy',
  'infura',
  'snowflake',
  'atlassian',
  'whimsical',
  'tog',
  'meetgeek',
  'wiz',
  '0x',
  'browserbase',
  'mercury'
);

-- Step 5: Verify the update
SELECT 
  deal_type,
  COUNT(*) as count
FROM deals
WHERE deal_type IS NOT NULL
GROUP BY deal_type
ORDER BY deal_type;

-- Step 6: Show deals that might be missing (unclassified)
SELECT id, name FROM deals WHERE deal_type IS NULL ORDER BY id;

-- Step 7: Create a view for easy filtering
CREATE OR REPLACE VIEW free_deals AS
SELECT * FROM deals WHERE deal_type = 'free' OR deal_type IS NULL;

CREATE OR REPLACE VIEW premium_deals AS
SELECT * FROM deals WHERE deal_type = 'premium';

-- Step 8: Summary queries
-- Get all free deals
-- SELECT * FROM free_deals;

-- Get all premium deals
-- SELECT * FROM premium_deals;

-- Count deals by type
-- SELECT deal_type, COUNT(*) FROM deals GROUP BY deal_type;
