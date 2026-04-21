const fs = require('fs');
const path = require('path');

// Define FREE and PREMIUM deals
const FREE_DEALS = new Set([
  'google-cloud', 'aws', 'microsoft-azure', 'digitalocean', 'vercel',
  'openai', 'anthropic', 'elevenlabs', 'perplexity-ai',
  'mongodb', 'supabase',
  'github', 'posthog', 'mixpanel',
  'notion', 'canva', 'miro', 'linear',
  'sentry', 'datadog', 'new-relic',
  'stripe-atlas'
]);

const PREMIUM_DEALS = new Set([
  'cloudflare', 'ovhcloud', 'render', 'scaleway', 'backblaze', 'cleura', 'oracle',
  'deepinfra', 'fireworks-ai', 'inworld-ai', 'anam-ai',
  'couchbase', 'planetscale',
  'twilio-segment', 'amplitude', 'statsig',
  'retool', 'algolia', 'circleci', 'gitlab',
  'bastion',
  'intercom', 'hubspot', 'zendesk', 'salesforce',
  'brex', 'ramp', 'revolut-business', 'gusto', 'revsh',
  'zoho', 'typeform', 'lightfield-crm', 'deel',
  'box-ai', 'siemens',
  'alchemy', 'infura', 'snowflake', 'atlassian', 'whimsical', 'miro', 'meetgeek',
  'tog' // Mercury/TOG included here
]);

const dealsPath = path.join(__dirname, '../src/data/deals.ts');
let content = fs.readFileSync(dealsPath, 'utf-8');

// Find all deals and add type field
const dealRegex = /(\{[\s\S]*?"id":\s*"([^"]+)"[\s\S]*?)(}(?=\s*,\s*\{)|}(?=\s*\]))/g;
let match;
let updatedContent = content;
let dealsUpdated = 0;

while ((match = dealRegex.exec(content)) !== null) {
  const dealStr = match[1];
  const dealId = match[2];
  const closingBrace = match[3];
  
  // Check if deal already has type field
  if (dealStr.includes('"type":')) {
    console.log(`✓ ${dealId} already has type field`);
    continue;
  }

  // Determine type
  let type = 'free'; // Default to free
  if (PREMIUM_DEALS.has(dealId)) {
    type = 'premium';
  } else if (!FREE_DEALS.has(dealId)) {
    console.log(`⚠️ ${dealId} not in either list - defaulting to FREE`);
  }

  // Add type field before closing brace
  const typeField = `\n  "type": "${type}",`;
  const beforeLastComma = dealStr.replace(/,\s*$/, '');
  const newDeal = beforeLastComma + typeField + ',\n  ';
  
  updatedContent = updatedContent.replace(dealStr + closingBrace, newDeal + closingBrace);
  dealsSame++;
  
  if (dealId && type) {
    console.log(`✅ ${dealId}: ${type.toUpperCase()}`);
  }
}

fs.writeFileSync(dealsPath, updatedContent, 'utf-8');
console.log(`\n✨ Updated ${dealsList.length} deals with type field`);
console.log(`📄 File: ${dealsPath}`);
