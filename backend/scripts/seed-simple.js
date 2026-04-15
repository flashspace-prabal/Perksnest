#!/usr/bin/env node

const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const { createClient } = require("@supabase/supabase-js");

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || "perksnest";
const DEALS_FILE = path.resolve(__dirname, "../../frontend/src/data/deals.ts");

console.log("🚀 Starting Supabase deals seeding...\n");

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing Supabase credentials in .env");
  process.exit(1);
}

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: DB_SCHEMA },
  auth: { persistSession: false, autoRefreshToken: false },
});

// Load deals
console.log("📂 Loading deals from deals.ts...");
let dealsData;

try {
  const source = fs.readFileSync(DEALS_FILE, "utf8");
  const dealsMatch = source.match(/export const dealsData[:\s][\s\S]*?= (\[[\s\S]*?\n\];)/);
  
  if (!dealsMatch || !dealsMatch[1]) {
    throw new Error("Could not find dealsData array");
  }
  
  dealsData = vm.runInNewContext(dealsMatch[1]);
  
  if (!Array.isArray(dealsData)) {
    throw new Error("dealsData is not an array");
  }
  
  console.log(`✅ Loaded ${dealsData.length} deals\n`);
} catch (error) {
  console.error(`❌ Failed to load deals: ${error.message}`);
  process.exit(1);
}

// Validate
console.log(`📋 Validating ${dealsData.length} deals...`);
const seenIds = new Set();
const seenSlugs = new Set();

for (const deal of dealsData) {
  if (!deal.id || !deal.name || !deal.logo || !deal.description || !deal.dealText || !deal.savings || deal.memberCount === undefined || !deal.category) {
    console.error(`❌ Deal missing required fields: ${deal.id}`);
    process.exit(1);
  }
  
  if (seenIds.has(deal.id)) {
    console.error(`❌ Duplicate ID: ${deal.id}`);
    process.exit(1);
  }
  seenIds.add(deal.id);
  
  if (deal.slug && seenSlugs.has(deal.slug)) {
    console.error(`❌ Duplicate slug: ${deal.slug}`);
    process.exit(1);
  }
  if (deal.slug) seenSlugs.add(deal.slug);
}

console.log(`✅ All ${dealsData.length} deals validated\n`);

// Seed database
(async () => {
  try {
    // Clear existing
    console.log("🗑️  Clearing existing deals...");
    await supabase.from("deals").delete().neq("id", "");
    console.log("✅ Cleared\n");

    // Transform and seed
    console.log(`🌱 Seeding ${dealsData.length} deals...`);
    
    const toInsert = dealsData.map(deal => ({
      id: deal.id,
      slug: deal.slug || deal.id,
      name: deal.name,
      company: deal.company || null,
      logo: deal.logo,
      description: deal.description,
      deal_text: deal.dealText,
      savings: deal.savings,
      member_count: deal.memberCount || 0,
      is_premium: deal.isPremium || false,
      is_free: deal.isFree || false,
      is_pick: deal.isPick || false,
      featured: deal.featured || false,
      category: deal.category,
      subcategory: deal.subcategory || null,
      last_added: deal.lastAdded || null,
      expires_at: deal.expiresAt || null,
      collection: deal.collection || null,
      redeem_url: deal.redeemUrl || null,
      promo_code: deal.promoCode || null,
      steps: deal.steps || [],
      website: deal.website || deal.redeemUrl || null,
      eligibility: deal.eligibility || [],
      expires_in: deal.expiresIn || null,
    }));

    // Batch insert
    const BATCH = 100;
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const batch = toInsert.slice(i, i + BATCH);
      const { error } = await supabase.from("deals").insert(batch);
      
      if (error) {
        console.error(`❌ Batch ${i} failed: ${error.message}`);
        process.exit(1);
      }
      
      console.log(`  ✓ Inserted ${Math.min(i + BATCH, toInsert.length)}/${toInsert.length}`);
    }

    console.log(`\n✅ Successfully seeded ${toInsert.length} deals to Supabase!`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
})();
