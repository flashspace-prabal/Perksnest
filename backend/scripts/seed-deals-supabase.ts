#!/usr/bin/env node

/**
 * Seed file for Supabase deals table
 * Loads all deals from frontend/src/data/deals.ts and inserts into Supabase
 * Run: node backend/scripts/seed-deals-supabase.ts
 */

const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

process.stdout.write("🔄 Initializing seed script...\n");
process.stdout.write(`   ENV file: ${path.resolve(__dirname, "../.env")}\n`);

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const SUPABASE_DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || "perksnest";
const DEALS_FILE = path.resolve(__dirname, "../../frontend/src/data/deals.ts");

process.stdout.write(`   SUPABASE_URL: ${SUPABASE_URL ? "✅ Set" : "❌ Missing"}\n`);
process.stdout.write(`   SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY ? "✅ Set" : "❌ Missing"}\n`);
process.stdout.write(`   Schema: ${SUPABASE_DB_SCHEMA}\n`);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  process.stderr.write("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY\n");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: SUPABASE_DB_SCHEMA },
  auth: { persistSession: false, autoRefreshToken: false },
});

interface Deal {
  id: string;
  slug?: string;
  name: string;
  company?: string;
  logo: string;
  description: string;
  dealText: string;
  savings: string;
  memberCount: number;
  isPremium?: boolean;
  isFree?: boolean;
  isPick?: boolean;
  featured?: boolean;
  category: string;
  subcategory?: string;
  lastAdded?: string;
  expiresAt?: string;
  collection?: string;
  redeemUrl?: string;
  promoCode?: string;
  steps?: string[];
  website?: string;
  eligibility?: string[];
  expiresIn?: string;
}

function loadDealsSource(): string {
  if (!fs.existsSync(DEALS_FILE)) {
    throw new Error(`Deals file not found: ${DEALS_FILE}`);
  }
  return fs.readFileSync(DEALS_FILE, "utf8");
}

function parseDealsArray(source: string): Deal[] {
  // Extract the dealsData array from the TypeScript file
  const match = source.match(/export const dealsData: Deal\[\] = (\[[\s\S]*?\n\];)/);

  if (!match || !match[1]) {
    throw new Error("Unable to parse dealsData array from deals.ts");
  }

  try {
    return vm.runInNewContext(match[1]);
  } catch (error: any) {
    throw new Error(
      `Failed to evaluate dealsData array. Ensure deals.ts contains valid plain object literals.\n${error.message}`
    );
  }
}

function loadDeals(): Deal[] {
  const deals = parseDealsArray(loadDealsSource());

  if (!Array.isArray(deals)) {
    throw new Error("Parsed dealsData is not an array");
  }

  return deals;
}

function validateDeals(deals: Deal[]): void {
  if (deals.length === 0) {
    throw new Error("No deals found to seed");
  }

  process.stdout.write(`📋 Validating ${deals.length} deals...\n`);

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  deals.forEach((deal, index) => {
    // Check required fields
    if (!deal.id || typeof deal.id !== "string") {
      throw new Error(`Deal ${index}: Missing or invalid id`);
    }
    if (!deal.name || typeof deal.name !== "string") {
      throw new Error(`Deal ${deal.id}: Missing or invalid name`);
    }
    if (!deal.logo || typeof deal.logo !== "string") {
      throw new Error(`Deal ${deal.id}: Missing or invalid logo`);
    }
    if (!deal.description || typeof deal.description !== "string") {
      throw new Error(`Deal ${deal.id}: Missing or invalid description`);
    }
    if (!deal.dealText || typeof deal.dealText !== "string") {
      throw new Error(`Deal ${deal.id}: Missing or invalid dealText`);
    }
    if (!deal.savings || typeof deal.savings !== "string") {
      throw new Error(`Deal ${deal.id}: Missing or invalid savings`);
    }
    if (typeof deal.memberCount !== "number" || deal.memberCount < 0) {
      throw new Error(`Deal ${deal.id}: Missing or invalid memberCount`);
    }
    if (!deal.category || typeof deal.category !== "string") {
      throw new Error(`Deal ${deal.id}: Missing or invalid category`);
    }

    // Check for duplicate IDs
    if (seenIds.has(deal.id)) {
      throw new Error(`Duplicate deal id: ${deal.id}`);
    }
    seenIds.add(deal.id);

    // Check for duplicate slugs (if slug exists)
    if (deal.slug) {
      if (seenSlugs.has(deal.slug)) {
        throw new Error(`Duplicate slug: ${deal.slug}`);
      }
      seenSlugs.add(deal.slug);
    }

    // Validate arrays
    if (deal.steps && !Array.isArray(deal.steps)) {
      throw new Error(`Deal ${deal.id}: steps must be an array`);
    }
    if (deal.eligibility && !Array.isArray(deal.eligibility)) {
      throw new Error(`Deal ${deal.id}: eligibility must be an array`);
    }
  });

  process.stdout.write(`✅ All ${deals.length} deals validated successfully\n`);
}

async function clearTable(): Promise<void> {
  process.stdout.write("🗑️  Clearing existing deals...\n");
  const { data, error } = await supabase.from("deals").delete().neq("id", "");

  if (error) {
    throw new Error(`Failed to clear deals table: ${error.message}`);
  }

  process.stdout.write(`✅ Cleared existing deals\n`);
}

async function seedDeals(deals: Deal[]): Promise<void> {
  process.stdout.write(`🌱 Seeding ${deals.length} deals to Supabase...\n`);

  // Transform deals to match database schema (snake_case)
  const dealsToInsert = deals.map((deal) => ({
    id: deal.id,
    slug: deal.slug || deal.id,
    name: deal.name,
    company: deal.company,
    logo: deal.logo,
    description: deal.description,
    deal_text: deal.dealText,
    savings: deal.savings,
    member_count: deal.memberCount,
    is_premium: deal.isPremium || false,
    is_free: deal.isFree || false,
    is_pick: deal.isPick || false,
    featured: deal.featured || false,
    category: deal.category,
    subcategory: deal.subcategory,
    last_added: deal.lastAdded,
    expires_at: deal.expiresAt,
    collection: deal.collection,
    redeem_url: deal.redeemUrl,
    promo_code: deal.promoCode,
    steps: deal.steps ? deal.steps : [],
    website: deal.website || deal.redeemUrl || null,
    eligibility: deal.eligibility ? deal.eligibility : [],
    expires_in: deal.expiresIn,
  }));

  // Insert in batches (Supabase has limits on single requests)
  const BATCH_SIZE = 100;
  let inserted = 0;

  for (let i = 0; i < dealsToInsert.length; i += BATCH_SIZE) {
    const batch = dealsToInsert.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("deals").insert(batch);

    if (error) {
      throw new Error(`Failed to insert batch at index ${i}: ${error.message}`);
    }

    inserted += batch.length;
    process.stdout.write(`  ✓ Inserted ${inserted}/${dealsToInsert.length} deals\n`);
  }

  process.stdout.write(`✅ Successfully seeded ${inserted} deals\n`);
}

async function main(): Promise<void> {
  try {
    process.stdout.write("🚀 Starting Supabase deals seeding...\n");

    // Load deals from TypeScript file
    process.stdout.write("📂 Loading deals from deals.ts...\n");
    process.stdout.write(`   Path: ${DEALS_FILE}\n`);
    process.stdout.write(`   Exists: ${fs.existsSync(DEALS_FILE)}\n`);
    
    const deals = loadDeals();
    process.stdout.write(`✅ Loaded ${deals.length} deals\n\n`);

    // Validate deals
    validateDeals(deals);
    process.stdout.write("\n");

    // Clear existing data
    await clearTable();
    process.stdout.write("\n");

    // Seed new data
    await seedDeals(deals);
    process.stdout.write("\n");

    process.stdout.write("✨ Seeding complete! All deals are now in Supabase.\n");
    process.stdout.write(`📊 Summary: ${deals.length} deals seeded successfully\n`);
    process.exit(0);
  } catch (error: any) {
    process.stderr.write(`❌ Error during seeding: ${error.message}\n`);
    process.stderr.write(`${error.stack}\n`);
    process.exit(1);
  }
}

main();

main();
