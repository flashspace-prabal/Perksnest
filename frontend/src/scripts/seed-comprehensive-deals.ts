/**
 * Seed script for Supabase - Comprehensive Deals Data
 * 
 * Usage:
 * 1. Update SUPABASE_URL and SUPABASE_KEY below
 * 2. Run: npx ts-node src/scripts/seed-comprehensive-deals.ts
 * 
 * Or use in your backend initialization:
 * import { seedComprehensiveDeals } from '@/scripts/seed-comprehensive-deals'
 * await seedComprehensiveDeals()
 */

import { createClient } from "@supabase/supabase-js";
import { allComprehensiveDealDetails } from "@/data/comprehensive-deals-data";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://vxjhqiptbqzgqvhgause.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_XNeqevfyQefZp5KZKq4JUQ_2aQJS6WF";

async function seedComprehensiveDeals() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("🌱 Starting Comprehensive Deals Seed...");
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);

  try {
    // Get all deals from the data source
    const deals = Object.values(allComprehensiveDealDetails);
    console.log(`📦 Found ${deals.length} comprehensive deals to seed`);

    // Seed each deal
    for (const deal of deals) {
      try {
        // Check if deal already exists
        const { data: existing } = await supabase
          .from("comprehensive_deals")
          .select("id")
          .eq("id", deal.id)
          .single();

        if (existing) {
          // Update existing deal
          const { error: updateError } = await supabase
            .from("comprehensive_deals")
            .update(deal)
            .eq("id", deal.id);

          if (updateError) {
            console.error(`❌ Failed to update ${deal.name}:`, updateError);
          } else {
            console.log(`✏️ Updated: ${deal.name}`);
          }
        } else {
          // Insert new deal
          const { error: insertError } = await supabase
            .from("comprehensive_deals")
            .insert([deal]);

          if (insertError) {
            console.error(`❌ Failed to insert ${deal.name}:`, insertError);
          } else {
            console.log(`✅ Seeded: ${deal.name}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing ${deal.name}:`, error);
      }
    }

    console.log("✨ Seed completed!");
    console.log(`📊 Summary: ${deals.length} deals processed`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

// Run seed if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  seedComprehensiveDeals().then(() => {
    console.log("✅ Seed finished successfully");
    process.exit(0);
  });
}

export { seedComprehensiveDeals };
