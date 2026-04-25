#!/usr/bin/env node

const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { createClient } = require("@supabase/supabase-js");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const SUPABASE_DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || "perksnest";
const DEALS_FILE = path.resolve(__dirname, "../../frontend/src/data/deals.ts");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("[sync-static-deals] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: SUPABASE_DB_SCHEMA },
  auth: { persistSession: false, autoRefreshToken: false },
});

let dealColumns = new Set();

async function loadDealColumns() {
  const candidates = [
    "short_description",
    "full_description",
    "deal_highlight",
    "social_proof",
    "deals",
    "general",
    "faq",
    "pricing",
    "features",
    "reviews",
    "alternatives",
    "related_deals",
    "resources",
  ];
  for (const column of candidates) {
    const { error } = await db.from("deals").select(column).limit(1);
    if (!error) dealColumns.add(column);
  }
  const missingColumns = candidates.filter((column) => !dealColumns.has(column));
  if (missingColumns.length > 0) {
    console.warn(`[sync-static-deals] missing optional deal columns: ${missingColumns.join(", ")}`);
    console.warn("[sync-static-deals] run backend/sql/07-sync-static-deal-content.sql in Supabase SQL editor to persist rich detail content.");
  }
}

function loadStaticDeals() {
  const source = fs.readFileSync(DEALS_FILE, "utf8");
  const match =
    source.match(/export const dealsData: Deal\[\] = (\[[\s\S]*?\n\];)/) ||
    source.match(/export const deals: Deal\[\] = (\[[\s\S]*?\n\];)/);
  if (!match?.[1]) {
    throw new Error(`Unable to parse dealsData from ${DEALS_FILE}`);
  }
  const deals = vm.runInNewContext(match[1]);
  if (!Array.isArray(deals)) {
    throw new Error("dealsData did not evaluate to an array");
  }
  return deals;
}

function stableCount(seed) {
  const text = String(seed || "perksnest-deal");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return 500 + (hash % 4500);
}

function splitSentences(text, limit = 2) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function normalizeFeature(feature, index, dealName) {
  if (typeof feature === "string") {
    return {
      id: `feature-${index + 1}`,
      icon: index % 3 === 0 ? "Zap" : index % 3 === 1 ? "ShieldCheck" : "Sparkles",
      title: feature,
      description: `${dealName} includes ${feature.toLowerCase()} to help startup teams move faster.`,
    };
  }

  if (feature && typeof feature === "object") {
    const title = String(feature.title || feature.name || feature.description || `Feature ${index + 1}`).trim();
    return {
      id: String(feature.id || `feature-${index + 1}`),
      icon: String(feature.icon || "Sparkles"),
      title,
      description: String(feature.description || `${dealName} includes ${title.toLowerCase()}.`),
    };
  }

  return null;
}

const specificPricing = {
  "cloudflare": [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Basic CDN, DNS, SSL, and DDoS protection for personal sites.", features: ["Free SSL", "Global CDN", "Basic DDoS protection"] },
    { name: "Pro", price: "$20", billingPeriod: "month", description: "Performance and security features for professional websites.", features: ["WAF rules", "Image optimization", "More page rules"] },
    { name: "Business", price: "$200", billingPeriod: "month", description: "Advanced security, performance, and support for production businesses.", features: ["Advanced DDoS protection", "Prioritized support", "PCI compliance features"] },
  ],
  "digitalocean": [
    { name: "Basic Droplets", price: "From $4", billingPeriod: "month", description: "Simple virtual machines for apps, APIs, and staging environments.", features: ["SSD storage", "Bandwidth included", "Predictable monthly pricing"] },
    { name: "App Platform", price: "From $5", billingPeriod: "month", description: "Managed app hosting with builds, deploys, and scaling.", features: ["Managed deployments", "HTTPS included", "Horizontal scaling"] },
    { name: "Managed Databases", price: "From $15", billingPeriod: "month", description: "Managed PostgreSQL, MySQL, Redis, MongoDB, and Kafka options.", features: ["Automated backups", "High availability options", "Monitoring"] },
  ],
  "vercel": [
    { name: "Hobby", price: "$0", billingPeriod: "month", description: "Free personal projects and prototypes.", features: ["Preview deployments", "Global CDN", "Serverless functions"] },
    { name: "Pro", price: "$20", billingPeriod: "user/month", description: "Team projects with higher limits and collaboration.", features: ["Team seats", "More bandwidth", "Advanced analytics"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Advanced security, governance, and scale for larger teams.", features: ["SAML/SSO", "Enterprise support", "Custom limits"] },
  ],
  "render": [
    { name: "Static Sites", price: "$0", billingPeriod: "month", description: "Free static site hosting with automatic deploys.", features: ["Global CDN", "HTTPS", "Git deploys"] },
    { name: "Web Services", price: "From $7", billingPeriod: "month", description: "Managed web services for production apps.", features: ["Autoscaling options", "Private services", "Zero-downtime deploys"] },
    { name: "Databases", price: "From $7", billingPeriod: "month", description: "Managed PostgreSQL instances for application data.", features: ["Backups", "Monitoring", "Persistent disks"] },
  ],
  "openai": [
    { name: "API", price: "Usage-based", billingPeriod: "tokens", description: "Pay per model input, output, and tool usage.", features: ["Text and vision models", "Embeddings", "Realtime and batch options"] },
    { name: "ChatGPT Plus", price: "$20", billingPeriod: "month", description: "Individual ChatGPT plan with higher limits.", features: ["Advanced models", "File analysis", "Image generation"] },
    { name: "ChatGPT Team", price: "From $25", billingPeriod: "user/month", description: "Workspace plan for teams billed annually.", features: ["Shared workspace", "Admin controls", "Higher message limits"] },
  ],
  "anthropic": [
    { name: "Claude API", price: "Usage-based", billingPeriod: "tokens", description: "Model API pricing based on input and output tokens.", features: ["Claude models", "Prompt caching", "Batch processing"] },
    { name: "Claude Pro", price: "$20", billingPeriod: "month", description: "Individual Claude subscription with higher usage.", features: ["More usage", "Priority access", "Projects"] },
    { name: "Claude Team", price: "$30", billingPeriod: "user/month", description: "Team workspace with admin and collaboration controls.", features: ["Team management", "Shared projects", "Central billing"] },
  ],
  "notion": [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Personal workspace and basic collaboration.", features: ["Pages and blocks", "Basic integrations", "Templates"] },
    { name: "Plus", price: "$10", billingPeriod: "user/month", description: "Small-team workspace with more file uploads and history.", features: ["Unlimited blocks for teams", "30-day page history", "Guest collaboration"] },
    { name: "Business", price: "$20", billingPeriod: "user/month", description: "Advanced permissions, security, and workspace controls.", features: ["SAML SSO", "Private teamspaces", "Advanced analytics"] },
  ],
  "github": [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Public and private repos for individuals and small teams.", features: ["GitHub Actions minutes", "Issues and projects", "Community support"] },
    { name: "Team", price: "$4", billingPeriod: "user/month", description: "Team collaboration with protected branches and code owners.", features: ["Pull request reviews", "Code owners", "Required reviewers"] },
    { name: "Enterprise", price: "$21", billingPeriod: "user/month", description: "Enterprise security, compliance, and administration.", features: ["SAML SSO", "Advanced security", "Audit logs"] },
  ],
  "supabase": [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Hosted Postgres and backend services for prototypes.", features: ["Postgres database", "Auth", "Storage"] },
    { name: "Pro", price: "$25", billingPeriod: "project/month", description: "Production projects with more compute and no pause.", features: ["Daily backups", "Higher limits", "Email support"] },
    { name: "Team", price: "$599", billingPeriod: "month", description: "Organization controls and advanced support for teams.", features: ["SSO", "SOC2 documents", "Priority support"] },
  ],
  "mongodb": [
    { name: "M0 Free", price: "$0", billingPeriod: "month", description: "Free shared Atlas cluster for learning and prototypes.", features: ["512 MB storage", "Shared RAM", "Atlas UI"] },
    { name: "Dedicated", price: "From $57", billingPeriod: "month", description: "Dedicated Atlas clusters for production workloads.", features: ["Backups", "Autoscaling", "Global clusters"] },
    { name: "Serverless", price: "Usage-based", billingPeriod: "reads/writes/storage", description: "Scale-to-zero database option for variable traffic.", features: ["Pay per operation", "Automatic scaling", "No capacity planning"] },
  ],
  "hubspot": [
    { name: "Free Tools", price: "$0", billingPeriod: "month", description: "Free CRM, marketing, sales, and service tools.", features: ["CRM contacts", "Forms", "Email marketing basics"] },
    { name: "Starter", price: "From $20", billingPeriod: "month", description: "Starter hubs for small teams needing automation and branding control.", features: ["Remove HubSpot branding", "Simple automation", "Email support"] },
    { name: "Professional", price: "From $800", billingPeriod: "month", description: "Advanced automation, reporting, and scale across hubs.", features: ["Workflows", "Custom reporting", "Campaign tools"] },
  ],
  "slack": [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Basic workspace for small teams.", features: ["Recent message history", "1:1 huddles", "Limited apps"] },
    { name: "Pro", price: "$8.75", billingPeriod: "user/month", description: "Full message history and more collaboration features.", features: ["Unlimited history", "Group huddles", "Unlimited apps"] },
    { name: "Business+", price: "$15", billingPeriod: "user/month", description: "Advanced identity, compliance, and support.", features: ["SAML SSO", "User provisioning", "99.99% uptime SLA"] },
  ],
  "stripe-atlas": [
    { name: "Atlas setup", price: "$500", billingPeriod: "one-time", description: "Company formation package for Delaware C-Corps.", features: ["Incorporation", "EIN filing support", "Founder stock docs"] },
    { name: "Stripe Payments", price: "2.9% + 30¢", billingPeriod: "card transaction", description: "Standard online card payment processing.", features: ["Cards and wallets", "Disputes", "Fraud tools"] },
    { name: "Custom pricing", price: "Custom", billingPeriod: "volume", description: "Volume pricing for larger payment businesses.", features: ["Volume discounts", "Custom rates", "Dedicated support"] },
  ],
  "salesforce": [
    { name: "Starter Suite", price: "$25", billingPeriod: "user/month", description: "Starter CRM suite for sales, service, and marketing.", features: ["Lead management", "Email tools", "Dashboards"] },
    { name: "Pro Suite", price: "$100", billingPeriod: "user/month", description: "More automation and customization for growing teams.", features: ["Forecasting", "Automation", "Custom apps"] },
    { name: "Enterprise", price: "$165", billingPeriod: "user/month", description: "Advanced CRM customization and platform features.", features: ["Workflow automation", "Advanced permissions", "API access"] },
  ],
  "intercom": [
    { name: "Essential", price: "$39", billingPeriod: "seat/month", description: "Starter customer support inbox and messenger.", features: ["Shared inbox", "Messenger", "Basic automation"] },
    { name: "Advanced", price: "$99", billingPeriod: "seat/month", description: "Automation and AI features for scaling support teams.", features: ["Workflows", "Advanced reporting", "Multiple team inboxes"] },
    { name: "Expert", price: "$139", billingPeriod: "seat/month", description: "Advanced support operations and governance.", features: ["Workload management", "Service levels", "Custom roles"] },
  ],
  "zendesk": [
    { name: "Support Team", price: "$25", billingPeriod: "agent/month", description: "Ticketing for small support teams.", features: ["Email and social support", "Business rules", "Analytics"] },
    { name: "Suite Team", price: "$69", billingPeriod: "agent/month", description: "Omnichannel support suite with messaging.", features: ["Help center", "Messaging", "Voice"] },
    { name: "Suite Professional", price: "$149", billingPeriod: "agent/month", description: "Advanced routing, analytics, and automation.", features: ["Custom dashboards", "Advanced AI add-ons", "Skills routing"] },
  ],
  "linear": [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Issue tracking for small teams.", features: ["Issues", "Cycles", "Roadmaps"] },
    { name: "Basic", price: "$10", billingPeriod: "user/month", description: "More team workflows and workspace history.", features: ["Unlimited issues", "Admin controls", "Integrations"] },
    { name: "Business", price: "$16", billingPeriod: "user/month", description: "Advanced security and reporting for growing teams.", features: ["SAML SSO", "Triage responsibility", "Advanced reports"] },
  ],
};

const categoryPricing = {
  cloud: [
    { name: "Free tier", price: "$0", billingPeriod: "month", description: "Entry-level free usage for trials, prototypes, or always-free services.", features: ["Free usage limits", "Basic monitoring", "Self-serve docs"] },
    { name: "Pay-as-you-go", price: "Usage-based", billingPeriod: "resources used", description: "Standard cloud pricing based on compute, storage, bandwidth, and managed services.", features: ["No upfront commitment", "Scale up/down", "Metered billing"] },
    { name: "Enterprise / committed use", price: "Custom", billingPeriod: "contract", description: "Discounted committed usage, support, or enterprise agreements.", features: ["Volume discounts", "Support plans", "Governance controls"] },
  ],
  infrastructure: [
    { name: "Free / developer", price: "$0", billingPeriod: "month", description: "Developer tier for testing and small projects.", features: ["Basic usage", "Community support", "Self-serve setup"] },
    { name: "Team / pro", price: "From $20", billingPeriod: "month", description: "Production tier for teams and live apps.", features: ["Higher limits", "Team controls", "Better performance"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Advanced reliability, security, compliance, and support.", features: ["SLA", "SSO", "Dedicated support"] },
  ],
  ai: [
    { name: "Free / trial", price: "$0", billingPeriod: "limited usage", description: "Starter access for evaluation and experiments.", features: ["Limited usage", "Basic models", "Self-serve docs"] },
    { name: "API / Pro", price: "Usage-based", billingPeriod: "usage", description: "Paid usage based on API calls, tokens, minutes, or generated media.", features: ["Production API", "Higher limits", "Usage billing"] },
    { name: "Business / Enterprise", price: "Custom", billingPeriod: "contract", description: "Higher limits, security, and support for business deployments.", features: ["Custom limits", "Priority support", "Security reviews"] },
  ],
  database: [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Free hosted database tier for prototypes and development.", features: ["Shared resources", "Basic backups", "Limited storage"] },
    { name: "Production", price: "From $25", billingPeriod: "month", description: "Managed production database with backups and higher limits.", features: ["Backups", "Monitoring", "Higher compute"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Advanced scale, security, compliance, and dedicated support.", features: ["SLA", "Private networking", "Dedicated support"] },
  ],
  analytics: [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Free analytics tier for early usage and evaluation.", features: ["Limited events", "Dashboards", "Basic retention"] },
    { name: "Growth", price: "Usage-based", billingPeriod: "events/month", description: "Paid analytics based on event volume or monthly tracked users.", features: ["More events", "Longer retention", "Team dashboards"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Advanced governance, security, and support.", features: ["SSO", "Data pipelines", "Dedicated success"] },
  ],
};

function buildRealPricing(deal) {
  const id = deal.id || deal.slug || "";
  const name = deal.name || "This product";
  const category = String(deal.category || "").toLowerCase();
  const existingPricing = deal.pricing;

  if (existingPricing && Array.isArray(existingPricing.plans) && existingPricing.plans.length > 0) {
    return existingPricing;
  }
  if (Array.isArray(existingPricing) && existingPricing.length > 0) {
    return {
      description: `${name} pricing plans from the product page.`,
      plans: existingPricing.map((plan, index) => ({
        name: plan.name || plan.title || `Plan ${index + 1}`,
        price: plan.price || "Custom",
        billingPeriod: plan.billingPeriod || plan.period || undefined,
        description: plan.description || "Pricing details available on the official website.",
        features: Array.isArray(plan.features) ? plan.features : [],
        highlighted: Boolean(plan.highlighted) || index === 1,
      })),
    };
  }

  const plans = specificPricing[id] || categoryPricing[category] || [
    { name: "Free / trial", price: "$0", billingPeriod: "limited access", description: "Starter access for evaluation.", features: ["Self-serve setup", "Basic features", "Community resources"] },
    { name: "Team", price: "Custom", billingPeriod: "month", description: "Standard paid plan for teams.", features: ["Team workspace", "Higher limits", "Support"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Enterprise plan with advanced security and support.", features: ["SSO", "Admin controls", "Dedicated support"] },
  ];

  return {
    description: `${name} standard pricing shown separately from the PerksNest startup offer. Confirm current rates on the partner website before purchase.`,
    plans: plans.map((plan, index) => ({
      ...plan,
      highlighted: index === 1 || (plans.length === 1 && index === 0),
    })),
  };
}

function buildRichContent(deal) {
  const name = deal.name || "This deal";
  const savings = deal.savings || "Special offer";
  const dealText = deal.dealText || "Exclusive startup deal";
  const description = deal.description || `${name} helps startups access useful tools and credits.`;
  const featureSource = Array.isArray(deal.features) && deal.features.length > 0
    ? deal.features
    : [
        dealText,
        "Startup-friendly onboarding",
        "Founder-focused savings",
        "Useful resources for growing teams",
      ];
  const features = featureSource
    .map((feature, index) => normalizeFeature(feature, index, name))
    .filter(Boolean)
    .slice(0, 8);
  const requirements = Array.isArray(deal.eligibility) && deal.eligibility.length > 0
    ? deal.eligibility
    : [
        "Startup or early-stage business profile",
        "Valid company email or founder account",
        "One redemption per eligible company unless stated otherwise",
      ];
  const steps = Array.isArray(deal.steps) && deal.steps.length > 0
    ? deal.steps
    : [
        "Open the partner offer from PerksNest.",
        "Create or sign in to your partner account.",
        "Complete the partner application or checkout flow.",
        "Wait for approval or automatic credit activation.",
      ];
  const shortDescription = splitSentences(description, 1)[0] || description;

  return {
    shortDescription,
    fullDescription: description,
    dealHighlight: {
      savings,
      headline: dealText,
    },
    socialProof: {
      redeemedCount: Number(deal.memberCount || 0) || stableCount(deal.id || deal.slug || name),
    },
    deals: {
      title: `${name} startup offer`,
      explanation: description,
      howCanBenefit: `${name} can help startups reduce software spend while testing production-ready workflows.`,
      howCanIBenefit: steps,
      whyChooseThis: features.slice(0, 5).map((feature) => feature.title),
    },
    general: {
      overview: description,
      useCases: features.slice(0, 4).map((feature) => feature.title),
      features,
      website: deal.website || deal.redeemUrl || undefined,
    },
    faq: [
      {
        id: "faq-1",
        question: `How do I claim the ${name} deal?`,
        answer: `Click the claim button on PerksNest, follow the partner flow, and complete any required startup verification. Typical steps: ${steps.slice(0, 3).join(" ")}`,
      },
      {
        id: "faq-2",
        question: `Who is eligible for the ${name} offer?`,
        answer: requirements.join(" "),
      },
      {
        id: "faq-3",
        question: "Is this offer free to access?",
        answer: deal.isPremium
          ? "This is a premium PerksNest deal and requires an eligible premium account before redemption."
          : "This deal is available to claim from PerksNest. Partner approval or eligibility checks may still apply.",
      },
      {
        id: "faq-4",
        question: "What happens after I apply?",
        answer: "The partner may activate credits automatically or review your application manually. Keep an eye on your email for approval and next steps.",
      },
    ],
    pricing: buildRealPricing(deal),
    resources: [
      deal.website || deal.redeemUrl
        ? {
            id: "resource-1",
            type: "get-started",
            title: `${name} official startup page`,
            description: `Open the official ${name} page to review terms, eligibility, and activation details.`,
            link: deal.website || deal.redeemUrl,
            url: deal.website || deal.redeemUrl,
            ctaLabel: "Open Partner Page",
          }
        : null,
    ].filter(Boolean),
  };
}

function toDbDeal(deal) {
  const rich = buildRichContent(deal);
  const row = {
    id: deal.id,
    slug: deal.slug || deal.id,
    name: deal.name,
    company: deal.company || deal.name,
    logo: deal.logo,
    description: deal.description,
    deal_text: deal.dealText,
    savings: deal.savings,
    member_count: Number(deal.memberCount || 0),
    is_premium: Boolean(deal.isPremium),
    is_free: Boolean(deal.isFree),
    is_pick: Boolean(deal.isPick),
    featured: Boolean(deal.featured),
    category: deal.category,
    subcategory: deal.subcategory || null,
    last_added: deal.lastAdded || null,
    expires_at: deal.expiresAt || null,
    collection: deal.collection || null,
    redeem_url: deal.redeemUrl || deal.website || null,
    promo_code: deal.promoCode || null,
    steps: Array.isArray(deal.steps) ? deal.steps : [],
    website: deal.website || deal.redeemUrl || null,
    eligibility: Array.isArray(deal.eligibility) ? deal.eligibility : [],
    expires_in: deal.expiresIn || null,
    updated_at: new Date().toISOString(),
  };

  if (dealColumns.has("features")) {
    row.features = rich.general.features;
  }
  if (dealColumns.has("reviews")) {
    row.reviews = Array.isArray(deal.reviews) ? deal.reviews : [];
  }
  if (dealColumns.has("short_description")) row.short_description = rich.shortDescription;
  if (dealColumns.has("full_description")) row.full_description = rich.fullDescription;
  if (dealColumns.has("deal_highlight")) row.deal_highlight = rich.dealHighlight;
  if (dealColumns.has("social_proof")) row.social_proof = rich.socialProof;
  if (dealColumns.has("deals")) row.deals = rich.deals;
  if (dealColumns.has("general")) row.general = rich.general;
  if (dealColumns.has("faq")) row.faq = rich.faq;
  if (dealColumns.has("pricing")) row.pricing = rich.pricing;
  if (dealColumns.has("alternatives")) row.alternatives = [];
  if (dealColumns.has("related_deals")) row.related_deals = [];
  if (dealColumns.has("resources")) row.resources = rich.resources;

  return row;
}

function fromDbDeal(row) {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    company: row.company,
    logo: row.logo,
    description: row.description || row.short_description || row.full_description,
    dealText: row.deal_text || row.discounted_value,
    savings: row.savings || row.savings_amount,
    memberCount: row.member_count,
    isPremium: row.is_premium,
    isFree: row.is_free,
    isPick: row.is_pick,
    featured: row.featured,
    category: row.category,
    subcategory: row.subcategory,
    redeemUrl: row.redeem_url,
    promoCode: row.promo_code,
    steps: Array.isArray(row.steps) ? row.steps : [],
    website: row.website || row.redeem_url,
    eligibility: Array.isArray(row.eligibility) ? row.eligibility : [],
    expiresIn: row.expires_in,
    features: Array.isArray(row.features) ? row.features : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
  };
}

function toRichOnlyDbPatch(row) {
  const deal = fromDbDeal(row);
  const rich = buildRichContent(deal);
  const patch = {
    updated_at: new Date().toISOString(),
  };

  if (dealColumns.has("features")) patch.features = rich.general.features;
  if (dealColumns.has("reviews") && (!Array.isArray(row.reviews) || row.reviews.length === 0)) patch.reviews = Array.isArray(deal.reviews) ? deal.reviews : [];
  if (dealColumns.has("short_description")) patch.short_description = rich.shortDescription;
  if (dealColumns.has("full_description")) patch.full_description = rich.fullDescription;
  if (dealColumns.has("deal_highlight")) patch.deal_highlight = rich.dealHighlight;
  if (dealColumns.has("social_proof")) patch.social_proof = rich.socialProof;
  if (dealColumns.has("deals")) patch.deals = rich.deals;
  if (dealColumns.has("general")) patch.general = rich.general;
  if (dealColumns.has("faq")) patch.faq = rich.faq;
  if (dealColumns.has("pricing")) patch.pricing = rich.pricing;
  if (dealColumns.has("resources")) patch.resources = rich.resources;

  return patch;
}

async function main() {
  await loadDealColumns();
  const deals = loadStaticDeals();
  console.log(`[sync-static-deals] loaded ${deals.length} static deals`);

  const rows = deals.map(toDbDeal);
  const batchSize = 100;
  let upserted = 0;

  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    const { error } = await db.from("deals").upsert(batch, { onConflict: "id" });
    if (error) throw error;
    upserted += batch.length;
    console.log(`[sync-static-deals] upserted ${upserted}/${rows.length}`);
  }

  const { data: existingDeals, error: existingError } = await db.from("deals").select("*");
  if (existingError) throw existingError;

  let backfilled = 0;
  for (const deal of existingDeals || []) {
    const patch = toRichOnlyDbPatch(deal);
    const { error } = await db.from("deals").update(patch).eq("id", deal.id);
    if (error) throw error;
    backfilled += 1;
  }

  console.log(`[sync-static-deals] backfilled rich content for ${backfilled} existing backend deals`);
  console.log(`[sync-static-deals] done: ${upserted} static deals synced into ${SUPABASE_DB_SCHEMA}.deals`);
}

main().catch((error) => {
  console.error("[sync-static-deals] failed:", error.message || error);
  process.exit(1);
});
