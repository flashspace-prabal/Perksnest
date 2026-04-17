const fs = require('fs');
const path = require('path');
const enhancements = require('./enhance-deals.js').enhancements;

// Real resource links
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

// Metadata for each deal (for the ones that have enhancements)
const basicDeals = {
  "google-cloud": {
    name: "Google Cloud Startup Program",
    logo: "https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128",
    category: "cloud",
    dealText: "Up to $350,000 in credits",
    savings: "$350,000"
  },
  "cloudflare": {
    name: "Cloudflare",
    logo: "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=128",
    category: "infrastructure",
    dealText: "Up to $250,000 in credits",
    savings: "$250,000"
  },
  "microsoft-azure": {
    name: "Microsoft Azure",
    logo: "https://www.google.com/s2/favicons?domain=azure.microsoft.com&sz=128",
    category: "cloud",
    dealText: "Up to $150,000 in credits",
    savings: "$150,000"
  },
  "aws": {
    name: "AWS",
    logo: "https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128",
    category: "cloud",
    dealText: "Up to $100,000 in credits",
    savings: "$100,000"
  },
  "digitalocean": {
    name: "DigitalOcean",
    logo: "https://www.google.com/s2/favicons?domain=digitalocean.com&sz=128",
    category: "cloud",
    dealText: "Up to $100,000 in credits",
    savings: "$100,000"
  },
  "ovhcloud": {
    name: "OVHCloud",
    logo: "https://www.google.com/s2/favicons?domain=ovhcloud.com&sz=128",
    category: "cloud",
    dealText: "€100,000 in credits",
    savings: "€100,000"
  },
  "vercel": {
    name: "Vercel",
    logo: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
    category: "deployment",
    dealText: "Pro plan free for 12 months",
    savings: "$200/month"
  },
  "render": {
    name: "Render",
    logo: "https://www.google.com/s2/favicons?domain=render.com&sz=128",
    category: "deployment",
    dealText: "Up to $10,000 in credits",
    savings: "$10,000"
  },
  "anthropic": {
    name: "Anthropic",
    logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    category: "ai",
    dealText: "API credits for startups",
    savings: "$5,000"
  },
  "perplexity-ai": {
    name: "Perplexity AI",
    logo: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
    category: "ai",
    dealText: "Free API access",
    savings: "Free"
  },
  "elevenlabs": {
    name: "ElevenLabs",
    logo: "https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128",
    category: "ai",
    dealText: "Startup grants available",
    savings: "Up to $10,000"
  },
  "openai": {
    name: "OpenAI",
    logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    category: "ai",
    dealText: "API credits for startups",
    savings: "$5,000"
  },
  "anam-ai": {
    name: "Anam AI",
    logo: "https://www.google.com/s2/favicons?domain=anam.ai&sz=128",
    category: "ai",
    dealText: "AI platform access",
    savings: "Variable"
  },
  "meetgeek": {
    name: "MeetGeek",
    logo: "https://www.google.com/s2/favicons?domain=meetgeek.ai&sz=128",
    category: "productivity",
    dealText: "Pro features free",
    savings: "Up to $300/month"
  },
  "deepinfra": {
    name: "DeepInfra",
    logo: "https://www.google.com/s2/favicons?domain=deepinfra.com&sz=128",
    category: "ai",
    dealText: "Credits for startups",
    savings: "Up to $5,000"
  },
  "mongodb": {
    name: "MongoDB",
    logo: "https://www.google.com/s2/favicons?domain=mongodb.com&sz=128",
    category: "database",
    dealText: "Startup program benefits",
    savings: "Variable"
  },
  "couchbase": {
    name: "Couchbase",
    logo: "https://www.google.com/s2/favicons?domain=couchbase.com&sz=128",
    category: "database",
    dealText: "Startup program access",
    savings: "Variable"
  },
  "supabase": {
    name: "Supabase",
    logo: "https://www.google.com/s2/favicons?domain=supabase.com&sz=128",
    category: "database",
    dealText: "Startup program credits",
    savings: "$5,000"
  },
  "planetscale": {
    name: "PlanetScale",
    logo: "https://www.google.com/s2/favicons?domain=planetscale.com&sz=128",
    category: "database",
    dealText: "Startup benefits",
    savings: "$5,000"
  },
  "mixpanel": {
    name: "Mixpanel",
    logo: "https://www.google.com/s2/favicons?domain=mixpanel.com&sz=128",
    category: "analytics",
    dealText: "Free plan upgrade",
    savings: "$900/month"
  },
  "posthog": {
    name: "PostHog",
    logo: "https://www.google.com/s2/favicons?domain=posthog.com&sz=128",
    category: "analytics",
    dealText: "Free tier + startup credits",
    savings: "Up to $5,000"
  },
  "twilio-segment": {
    name: "Twilio Segment",
    logo: "https://www.google.com/s2/favicons?domain=twilio.com&sz=128",
    category: "analytics",
    dealText: "Startup program access",
    savings: "Variable"
  },
  "amplitude": {
    name: "Amplitude",
    logo: "https://www.google.com/s2/favicons?domain=amplitude.com&sz=128",
    category: "analytics",
    dealText: "Startup plan",
    savings: "Up to $5,000"
  },
  "datadog": {
    name: "Datadog",
    logo: "https://www.google.com/s2/favicons?domain=datadoghq.com&sz=128",
    category: "monitoring",
    dealText: "Startup program benefits",
    savings: "Up to $5,000"
  },
  "sentry": {
    name: "Sentry",
    logo: "https://www.google.com/s2/favicons?domain=sentry.io&sz=128",
    category: "monitoring",
    dealText: "Team plan free for year 1",
    savings: "$29/month"
  },
  "retool": {
    name: "Retool",
    logo: "https://www.google.com/s2/favicons?domain=retool.com&sz=128",
    category: "tools",
    dealText: "Startup program access",
    savings: "Up to $5,000"
  },
  "algolia": {
    name: "Algolia",
    logo: "https://www.google.com/s2/favicons?domain=algolia.com&sz=128",
    category: "tools",
    dealText: "Startup program credits",
    savings: "Up to $5,000"
  },
  "github": {
    name: "GitHub",
    logo: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    category: "tools",
    dealText: "Enterprise for free",
    savings: "$250/month"
  },
  "bastion": {
    name: "Bastion",
    logo: "https://www.google.com/s2/favicons?domain=bastion.tech&sz=128",
    category: "security",
    dealText: "Security platform access",
    savings: "Variable"
  },
  "notion": {
    name: "Notion",
    logo: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
    category: "productivity",
    dealText: "Notion for Startups",
    savings: "Free team access"
  },
  "miro": {
    name: "Miro",
    logo: "https://www.google.com/s2/favicons?domain=miro.com&sz=128",
    category: "productivity",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "linear": {
    name: "Linear",
    logo: "https://www.google.com/s2/favicons?domain=linear.app&sz=128",
    category: "tools",
    dealText: "Startup plan",
    savings: "Free for teams"
  },
  "atlassian": {
    name: "Atlassian",
    logo: "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
    category: "tools",
    dealText: "Community license free",
    savings: "$600/month"
  },
  "whimsical": {
    name: "Whimsical",
    logo: "https://www.google.com/s2/favicons?domain=whimsical.com&sz=128",
    category: "design",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "lightfield-crm": {
    name: "Lightfield CRM",
    logo: "https://www.google.com/s2/favicons?domain=lightfield.app&sz=128",
    category: "crm",
    dealText: "Startup discount",
    savings: "50% off"
  },
  "canva": {
    name: "Canva",
    logo: "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
    category: "design",
    dealText: "Canva Teams free",
    savings: "$200/month"
  },
  "intercom": {
    name: "Intercom",
    logo: "https://www.google.com/s2/favicons?domain=intercom.com&sz=128",
    category: "communication",
    dealText: "Early stage plan",
    savings: "Up to $5,000"
  },
  "hubspot": {
    name: "HubSpot",
    logo: "https://www.google.com/s2/favicons?domain=hubspot.com&sz=128",
    category: "crm",
    dealText: "Startup program",
    savings: "$5,000"
  },
  "zendesk": {
    name: "Zendesk",
    logo: "https://www.google.com/s2/favicons?domain=zendesk.com&sz=128",
    category: "support",
    dealText: "Startup program benefits",
    savings: "Up to $5,000"
  },
  "salesforce": {
    name: "Salesforce",
    logo: "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128",
    category: "crm",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "stripe-atlas": {
    name: "Stripe Atlas",
    logo: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
    category: "payments",
    dealText: "Company formation + credits",
    savings: "$500+ value"
  },
  "brex": {
    name: "Brex",
    logo: "https://www.google.com/s2/favicons?domain=brex.com&sz=128",
    category: "finance",
    dealText: "Business card & banking",
    savings: "Up to $10,000"
  },
  "ramp": {
    name: "Ramp",
    logo: "https://www.google.com/s2/favicons?domain=ramp.com&sz=128",
    category: "finance",
    dealText: "Startup benefits",
    savings: "Up to $5,000"
  },
  "revolut-business": {
    name: "Revolut Business",
    logo: "https://www.google.com/s2/favicons?domain=revolut.com&sz=128",
    category: "finance",
    dealText: "Business account",
    savings: "Variable"
  },
  "gusto": {
    name: "Gusto",
    logo: "https://www.google.com/s2/favicons?domain=gusto.com&sz=128",
    category: "hr",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "revsh": {
    name: "RevSh",
    logo: "https://www.google.com/s2/favicons?domain=revsh.com&sz=128",
    category: "finance",
    dealText: "Revenue sharing",
    savings: "Variable"
  },
  "backblaze": {
    name: "Backblaze",
    logo: "https://www.google.com/s2/favicons?domain=backblaze.com&sz=128",
    category: "backup",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "zoho": {
    name: "Zoho",
    logo: "https://www.google.com/s2/favicons?domain=zoho.com&sz=128",
    category: "tools",
    dealText: "Startup program",
    savings: "Free suite"
  },
  "typeform": {
    name: "Typeform",
    logo: "https://www.google.com/s2/favicons?domain=typeform.com&sz=128",
    category: "forms",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "deel": {
    name: "Deel",
    logo: "https://www.google.com/s2/favicons?domain=deel.com&sz=128",
    category: "hr",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "box-ai": {
    name: "Box",
    logo: "https://www.google.com/s2/favicons?domain=box.com&sz=128",
    category: "storage",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "statsig": {
    name: "Statsig",
    logo: "https://www.google.com/s2/favicons?domain=statsig.com&sz=128",
    category: "analytics",
    dealText: "Free pro plan",
    savings: "$500/month"
  },
  "circleci": {
    name: "CircleCI",
    logo: "https://www.google.com/s2/favicons?domain=circleci.com&sz=128",
    category: "ci-cd",
    dealText: "Free tier + credits",
    savings: "Up to $5,000"
  },
  "scaleway": {
    name: "Scaleway",
    logo: "https://www.google.com/s2/favicons?domain=scaleway.com&sz=128",
    category: "cloud",
    dealText: "Startup program",
    savings: "Up to €5,000"
  },
  "gitlab": {
    name: "GitLab",
    logo: "https://www.google.com/s2/favicons?domain=gitlab.com&sz=128",
    category: "tools",
    dealText: "Ultimate plan free",
    savings: "$228/month"
  },
  "alchemy": {
    name: "Alchemy",
    logo: "https://www.google.com/s2/favicons?domain=alchemy.com&sz=128",
    category: "web3",
    dealText: "Startup credits",
    savings: "Up to $5,000"
  },
  "snowflake": {
    name: "Snowflake",
    logo: "https://www.google.com/s2/favicons?domain=snowflake.com&sz=128",
    category: "database",
    dealText: "Startup program",
    savings: "Up to $10,000"
  },
  "new-relic": {
    name: "New Relic",
    logo: "https://www.google.com/s2/favicons?domain=newrelic.com&sz=128",
    category: "monitoring",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "cleura": {
    name: "Cleura",
    logo: "https://www.google.com/s2/favicons?domain=cleura.com&sz=128",
    category: "cloud",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "fireworks-ai": {
    name: "Fireworks AI",
    logo: "https://www.google.com/s2/favicons?domain=fireworks.ai&sz=128",
    category: "ai",
    dealText: "API credits",
    savings: "Up to $5,000"
  },
  "infura": {
    name: "Infura",
    logo: "https://www.google.com/s2/favicons?domain=infura.io&sz=128",
    category: "web3",
    dealText: "Startup access",
    savings: "Variable"
  },
  "inworld-ai": {
    name: "Inworld AI",
    logo: "https://www.google.com/s2/favicons?domain=inworld.ai&sz=128",
    category: "ai",
    dealText: "Platform access",
    savings: "Variable"
  },
  "oracle": {
    name: "Oracle",
    logo: "https://www.google.com/s2/favicons?domain=oracle.com&sz=128",
    category: "cloud",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "siemens": {
    name: "Siemens",
    logo: "https://www.google.com/s2/favicons?domain=siemens.com&sz=128",
    category: "tools",
    dealText: "Startup program",
    savings: "Variable"
  },
  "together-ai": {
    name: "Together AI",
    logo: "https://www.google.com/s2/favicons?domain=together.ai&sz=128",
    category: "ai",
    dealText: "API credits",
    savings: "Up to $5,000"
  },
  "wiz": {
    name: "Wiz",
    logo: "https://www.google.com/s2/favicons?domain=wiz.io&sz=128",
    category: "security",
    dealText: "Startup program",
    savings: "Up to $5,000"
  },
  "0x": {
    name: "0x Protocol",
    logo: "https://www.google.com/s2/favicons?domain=0x.org&sz=128",
    category: "web3",
    dealText: "DeFi credits",
    savings: "$5,000"
  },
  "browserbase": {
    name: "Browserbase",
    logo: "https://www.google.com/s2/favicons?domain=browserbase.com&sz=128",
    category: "automation",
    dealText: "Startup program",
    savings: "Up to $3,000"
  },
  "mercury": {
    name: "Mercury",
    logo: "https://www.google.com/s2/favicons?domain=mercury.com&sz=128",
    category: "finance",
    dealText: "Banking + perks",
    savings: "Up to $5,000"
  }
};

console.log('🔨 Generating fresh deals.ts from enhancement data...\n');

// Build the deals array from enhancements + metadata
let dealsArray = [];
Object.keys(enhancements).forEach(dealId => {
  const enhancement = enhancements[dealId];
  const basicInfo = basicDeals[dealId];
  
  if (!basicInfo) {
    console.log(`⚠️  Missing basic info for ${dealId}, skipping...`);
    return;
  }
  
  const deal = {
    id: dealId,
    name: basicInfo.name,
    logo: basicInfo.logo,
    description: enhancement.description,
    dealText: basicInfo.dealText,
    redeemUrl: realLinks[dealId] || "https://example.com",
    website: realLinks[dealId] || "https://example.com",
    savings: basicInfo.savings,
    category: basicInfo.category,
    features: enhancement.features,
    reviews: enhancement.reviews.map(review => ({
      ...review,
      avatar: getAvatarUrl(review.author)
    }))
  };
  
  dealsArray.push(deal);
});

// Generate TypeScript file
const tsContent = `// Generated Deals Data with Real Links and Avatars
// Generated on ${new Date().toISOString()}

export interface Deal {
  id: string;
  name: string;
  logo: string;
  description: string;
  dealText: string;
  redeemUrl: string;
  website: string;
  savings: string;
  category: string;
  features?: string[];
  reviews?: Array<{
    author: string;
    rating: number;
    avatar?: string;
    text: string;
  }>;
}

export const deals: Deal[] = ${JSON.stringify(dealsArray, null, 2)};

export const getMostPopularDeals = () => deals.slice(0, 6);
export const getFreeDeals = () => deals.filter(d => d.savings === "Free");
export const getDealsByCategory = (category: string) => deals.filter(d => d.category === category);
export default deals;
`;

const outputPath = path.join(__dirname, '../../frontend/src/data/deals.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log('✅ Generated fresh deals.ts');
console.log(`✅ Total deals: ${dealsArray.length}`);
console.log(`✅ All deals have real links and reviewer avatars`);
console.log(`\n📄 File: ${outputPath}`);
const stats = fs.statSync(outputPath);
console.log(`📦 Size: ${(stats.size / 1024).toFixed(2)} KB\n`);
console.log('✨ Ready to use!');
