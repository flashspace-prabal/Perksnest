const fs = require("fs");
const path = require("path");
const vm = require("vm");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || "perksnest";
const STARTUP_DEALS_FILE = path.resolve(__dirname, "../../frontend/src/data/startupDeals.ts");
const DEALS_SCHEMA_FILE = path.resolve(__dirname, "./deals-schema.sql");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY/SUPABASE_ANON_KEY environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: { schema: SUPABASE_DB_SCHEMA },
  auth: { persistSession: false, autoRefreshToken: false },
});

function loadStartupDealsSource() {
  if (!fs.existsSync(STARTUP_DEALS_FILE)) {
    throw new Error(`Startup deals file not found: ${STARTUP_DEALS_FILE}`);
  }

  return fs.readFileSync(STARTUP_DEALS_FILE, "utf8");
}

function parseStartupDealsLiteral(source) {
  const match = source.match(/export const startupDeals: StartupDeal\[] = (\[[\s\S]*?\n\]);/);

  if (!match || !match[1]) {
    throw new Error("Unable to parse startupDeals array from frontend/src/data/startupDeals.ts");
  }

  try {
    return vm.runInNewContext(match[1]);
  } catch (error) {
    throw new Error(
      `Failed to evaluate startupDeals array. Ensure startupDeals.ts contains valid plain object literals.\n${error.message}`
    );
  }
}

function loadStartupDeals() {
  const deals = parseStartupDealsLiteral(loadStartupDealsSource());

  if (!Array.isArray(deals)) {
    throw new Error("Parsed startupDeals is not an array");
  }

  return deals;
}

function assertNoDuplicates(startupDeals) {
  const seenSlugs = new Set();
  const seenIndexes = new Set();

  for (const deal of startupDeals) {
    if (seenSlugs.has(deal.slug)) {
      throw new Error(`Duplicate slug detected: ${deal.slug}`);
    }
    if (seenIndexes.has(deal.index)) {
      throw new Error(`Duplicate index detected: ${deal.index}`);
    }

    seenSlugs.add(deal.slug);
    seenIndexes.add(deal.index);
  }
}

function assertValidDeals(startupDeals) {
  if (startupDeals.length === 0) {
    throw new Error("No startup deals found to seed");
  }

  for (const deal of startupDeals) {
    if (!Number.isInteger(deal.index) || deal.index <= 0) {
      throw new Error(`Invalid deal index for slug "${deal.slug || "unknown"}": ${deal.index}`);
    }
    if (!deal.title || typeof deal.title !== "string") {
      throw new Error(`Missing or invalid title for deal index ${deal.index}`);
    }
    if (!deal.slug || typeof deal.slug !== "string") {
      throw new Error(`Missing or invalid slug for deal "${deal.title}"`);
    }
    if (!deal.category || typeof deal.category !== "string") {
      throw new Error(`Missing or invalid category for deal "${deal.slug}"`);
    }
    if (!deal.description || typeof deal.description !== "string") {
      throw new Error(`Missing or invalid description for deal "${deal.slug}"`);
    }
    if (!deal.perks || typeof deal.perks !== "string") {
      throw new Error(`Missing or invalid perks for deal "${deal.slug}"`);
    }
    if (!Array.isArray(deal.steps)) {
      throw new Error(`Steps must be an array for deal "${deal.slug}"`);
    }
    if (deal.steps.some((step) => typeof step !== "string" || !step.trim())) {
      throw new Error(`All steps must be non-empty strings for deal "${deal.slug}"`);
    }
    if (typeof deal.website_url !== "string") {
      throw new Error(`Invalid website_url for deal "${deal.slug}"`);
    }
  }
}

function buildCreatedAt(index) {
  return new Date(Date.UTC(2026, 0, index, 0, 0, 0)).toISOString();
}

function normalizeDealForInsert(deal) {
  return {
    title: deal.title.trim(),
    slug: deal.slug.trim(),
    category: deal.category.trim(),
    description: deal.description.trim(),
    perks: deal.perks.trim(),
    steps: deal.steps,
    website_url: deal.website_url.trim(),
    created_at: deal.created_at || buildCreatedAt(deal.index),
  };
}

function formatSupabaseSeedError(error) {
  const message = error?.message || String(error);

  if (error?.code === "PGRST204") {
    return [
      "Supabase deals table schema does not match the seed payload.",
      `Current API error: ${message}`,
      `Run the schema in ${DEALS_SCHEMA_FILE} against the "${SUPABASE_DB_SCHEMA}" schema, then re-run this script.`,
    ].join("\n");
  }

  return message;
}

async function seedDeals() {
  const startupDeals = loadStartupDeals();

  assertNoDuplicates(startupDeals);
  assertValidDeals(startupDeals);

  const payload = startupDeals.map(normalizeDealForInsert);

  const { data, error } = await supabase
    .from("deals")
    .upsert(payload, { onConflict: "slug" })
    .select("slug");

  if (error) {
    throw new Error(formatSupabaseSeedError(error));
  }

  console.log(`Seeded ${data?.length ?? payload.length} startup deals into ${SUPABASE_DB_SCHEMA}.deals`);
}

seedDeals().catch((error) => {
  console.error("Failed to seed startup deals:", error.message || error);
  process.exit(1);
});
