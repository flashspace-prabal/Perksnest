#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// FREE DEALS (as specified by user)
const FREE_DEALS = {
  'google-cloud': true, 'aws': true, 'microsoft-azure': true, 'digitalocean': true, 'vercel': true,
  'openai': true, 'anthropic': true, 'elevenlabs': true, 'perplexity-ai': true,
  'mongodb': true, 'supabase': true,
  'github': true, 'posthog': true, 'mixpanel': true,
  'notion': true, 'canva': true, 'miro': true, 'linear': true,
  'sentry': true, 'datadog': true, 'new-relic': true,
  'stripe-atlas': true
};

// PREMIUM DEALS (as specified by user)
const PREMIUM_DEALS = {
  'cloudflare': true, 'ovhcloud': true, 'render': true, 'scaleway': true, 'backblaze': true, 'cleura': true, 'oracle': true,
  'deepinfra': true, 'fireworks-ai': true, 'inworld-ai': true, 'anam-ai': true,
  'couchbase': true, 'planetscale': true,
  'twilio-segment': true, 'amplitude': true, 'statsig': true,
  'retool': true, 'algolia': true, 'circleci': true, 'gitlab': true,
  'bastion': true,
  'intercom': true, 'hubspot': true, 'zendesk': true, 'salesforce': true,
  'brex': true, 'ramp': true, 'revolut-business': true, 'gusto': true, 'revsh': true,
  'zoho': true, 'typeform': true, 'lightfield-crm': true, 'deel': true,
  'box-ai': true, 'siemens': true,
  'alchemy': true, 'infura': true, 'snowflake': true, 'atlassian': true, 'whimsical': true, 'tog': true, 'meetgeek': true
};

const dealsPath = path.join(__dirname, '../src/data/deals.ts');
let content = fs.readFileSync(dealsPath, 'utf-8');

// Extract deal ID from a deal string
function extractDealId(dealStr) {
  const match = dealStr.match(/"id":\s*"([^"]+)"/);
  return match ? match[1] : null;
}

// Determine type for deal
function getDealType(dealId) {
  if (FREE_DEALS[dealId]) return 'free';
  if (PREMIUM_DEALS[dealId]) return 'premium';
  console.warn(`⚠️  ${dealId} not classified - using FREE as default`);
  return 'free';
}

// Find and replace each deal to add type field
const dealMatches = Array.from(content.matchAll(/(\{\s*"id":\s*"[^"]+",[\s\S]*?)(\n\s*\})/g));

let replaced = 0;
dealMatches.forEach((match, idx) => {
  const dealWithoutClosing = match[1];
  const closingBrace = match[2];
  const dealId = extractDealId(dealWithoutClosing);
  
  if (!dealId) return;
  
  // Skip if already has type field
  if (dealWithoutClosing.includes('"type"')) {
    console.log(`✓ ${dealId} - already has type`);
    return;
  }
  
  const type = getDealType(dealId);
  const typeField = `\n    "type": "${type}",`;
  
  const newDeal = dealWithoutClosing + typeField + closingBrace;
  const oldDeal = match[0];
  
  content = content.replace(oldDeal, newDeal);
  replaced++;
  console.log(`✅ ${dealId}: ${type.toUpperCase()}`);
});

// Write back
fs.writeFileSync(dealsPath, content, 'utf-8');

console.log(`\n✨ Complete! Updated ${replaced} deals`);
console.log(`📄 File: ${dealsPath}`);
