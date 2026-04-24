require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const seedPath = path.resolve(__dirname, "data/reviews.seed.json");
const db = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_KEY || "", {
  db: { schema: process.env.SUPABASE_DB_SCHEMA || "perksnest" },
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  }

  const seedRows = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  const dealIds = [...new Set(seedRows.map((row) => row.deal_id))];

  const { error: deleteError } = await db.from("reviews").delete().in("deal_id", dealIds);
  if (deleteError) throw deleteError;

  const chunkSize = 100;
  for (let index = 0; index < seedRows.length; index += chunkSize) {
    const batch = seedRows.slice(index, index + chunkSize);
    const { error } = await db.from("reviews").insert(batch);
    if (error) throw error;
  }

  console.log(`[seed-reviews] inserted ${seedRows.length} reviews across ${dealIds.length} deals into ${(process.env.SUPABASE_DB_SCHEMA || "perksnest")}.reviews`);
}

main().catch((error) => {
  if (String(error.message || "").includes("invalid input syntax for type uuid")) {
    console.error("[seed-reviews] failed because perksnest.reviews.deal_id is still typed as uuid.");
    console.error("[seed-reviews] Run backend/scripts/03-seed-deal-reviews.sql in the Supabase SQL editor first so deal_id is migrated to text before seeding.");
    process.exit(1);
  }

  console.error("[seed-reviews] failed:", error.message || error);
  process.exit(1);
});
