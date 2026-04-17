const fs = require('fs');
const path = require('path');

// Real resource links for all 69 deals
const realLinks = {
  "google-cloud": "https://cloud.google.com/startup",
  "cloudflare": "https://www.cloudflare.com/forstartups",
  "microsoft-azure": "https://foundershub.startups.microsoft.com",
  "aws": "https://aws.amazon.com/startups",
  "digitalocean": "https://www.digitalocean.com/startup-program",
  "ovhcloud": "https://startup.ovhcloud.com",
  "vercel": "https://vercel.com/startups",
  "render": "https://render.com/startups",
  "anthropic": "https://www.anthropic.com",
  "perplexity-ai": "https://www.perplexity.ai",
  "elevenlabs": "https://elevenlabs.io/startup-grants",
  "openai": "https://platform.openai.com/startup-program",
  "anam-ai": "https://lab.anam.ai",
  "meetgeek": "https://meetgeek.ai",
  "deepinfra": "https://deepinfra.com",
  "mongodb": "https://mongodb.com/startups",
  "couchbase": "https://www.couchbase.com/startups",
  "supabase": "https://supabase.com/startups",
  "planetscale": "https://planetscale.com/startups",
  "mixpanel": "https://mixpanel.com/startups",
  "posthog": "https://posthog.com/startups",
  "twilio-segment": "https://www.twilio.com/segment",
  "amplitude": "https://amplitude.com/startups",
  "datadog": "https://www.datadoghq.com/startups",
  "sentry": "https://sentry.io/startups",
  "retool": "https://retool.com/startups",
  "algolia": "https://www.algolia.com/startups",
  "github": "https://github.com/enterprise/startups",
  "bastion": "https://www.bastion.tech",
  "notion": "https://www.notion.so/startups",
  "miro": "https://miro.com/startups",
  "linear": "https://linear.app/startups",
  "atlassian": "https://www.atlassian.com/software/startups",
  "whimsical": "https://whimsical.com/startups",
  "lightfield-crm": "https://crm.lightfield.app",
  "canva": "https://www.canva.com/startups",
  "intercom": "https://www.intercom.com/early-stage",
  "hubspot": "https://www.hubspot.com/startups",
  "zendesk": "https://www.zendesk.com/startups",
  "salesforce": "https://www.salesforce.com/startups",
  "stripe-atlas": "https://stripe.com/atlas",
  "brex": "https://brex.com/startups",
  "ramp": "https://ramp.com/startups",
  "revolut-business": "https://revolut.com/en-US/business/",
  "gusto": "https://gusto.com/startups",
  "revsh": "https://revsh.com",
  "backblaze": "https://www.backblaze.com/startups",
  "zoho": "https://zoho.com/startups",
  "typeform": "https://www.typeform.com/startups",
  "deel": "https://deel.com/startups",
  "box-ai": "https://community.box.com/t5/Startups/ct-p/startups",
  "statsig": "https://statsig.com",
  "circleci": "https://circleci.com/open-source",
  "scaleway": "https://www.scaleway.com/startup-program",
  "gitlab": "https://about.gitlab.com/solutions/startups",
  "alchemy": "https://www.alchemy.com",
  "snowflake": "https://www.snowflake.com/startup-program",
  "new-relic": "https://newrelic.com",
  "cleura": "https://cleura.com/startup-program",
  "fireworks-ai": "https://fireworks.ai",
  "infura": "https://www.infura.io",
  "inworld-ai": "https://inworld.ai",
  "oracle": "https://www.oracle.com/cloud/oracle-for-startups",
  "siemens": "https://www.siemens.com/innovation/startups",
  "together-ai": "https://www.together.ai",
  "wiz": "https://wiz.io/startups",
  "0x": "https://0x.org",
  "browserbase": "https://www.browserbase.com/startups",
  "mercury": "https://mercury.com"
};

function getAvatarUrl(name) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

const enhancedPath = path.join(__dirname, '../../frontend/src/data/deals-enhanced.ts');
let content = fs.readFileSync(enhancedPath, 'utf-8');

console.log('🔧 Applying real avatars and real links...\n');

// Update each deal's links
Object.entries(realLinks).forEach(([dealId, url]) => {
  const pattern = new RegExp(`(id: "${dealId}"[\\s\\S]*?redeemUrl: )"[^"]*"`, );
  content = content.replace(pattern, `$1"${url}"`);
  
  const websitePattern = new RegExp(`(id: "${dealId}"[\\s\\S]*?website: )"[^"]*"`, );
  content = content.replace(websitePattern, `$1"${url}"`);
});

// Add avatars to reviews by parsing reviews objects
content = content.replace(/\{author:\s*"([^"]+)",\s*rating:\s*(\d+),\s*text:\s*"([^"]*?)"\}/gs, (match, author, rating, text) => {
  const avatarUrl = getAvatarUrl(author);
  return `{author: "${author}", rating: ${rating}, avatar: "${avatarUrl}", text: "${text}"}`;
});

const outputPath = path.join(__dirname, '../../frontend/src/data/deals.ts');
fs.writeFileSync(outputPath, content, 'utf-8');

console.log('✅ Updated deals.ts with:');
console.log('   ✓ Real resource links for all 69 deals');
console.log('   ✓ DiceBear avatars for all reviewers\n');

const stats = fs.statSync(outputPath);
console.log(`📊 Output: ${outputPath}`);
console.log(`📦 Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
console.log('✨ Ready to use!');
