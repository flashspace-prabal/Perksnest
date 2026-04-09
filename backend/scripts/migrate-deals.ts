/**
 * Migration script to populate Supabase deals table from deals.ts
 *
 * Run with: npx tsx scripts/migrate-deals.ts
 *
 * Prerequisites:
 * 1. Supabase deals table schema should match Deal interface
 * 2. Environment variables for Supabase connection
 */

import { dealsData } from '../src/data/deals';

const SUPABASE_URL = 'https://auth.perksnest.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.flEXaRV1Ku-LEeKUiTTXvjlekdwZvGY8oOFiNDPMgkA';

async function migrateDeals() {
  console.log(`Starting migration of ${dealsData.length} deals...`);

  try {
    // Import Supabase client dynamically
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Transform deals to match database schema
    const dealsToInsert = dealsData.map(deal => ({
      id: deal.id,
      name: deal.name,
      company: deal.company || deal.name,
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
      last_added: deal.lastAdded || null,
      expires_at: deal.expiresAt || null,
      collection: deal.collection || null,
      active: true,
      created_at: new Date().toISOString(),
    }));

    // Insert in batches to avoid rate limits
    const batchSize = 50;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < dealsToInsert.length; i += batchSize) {
      const batch = dealsToInsert.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1} (${batch.length} deals)...`);

      const { data, error } = await supabase
        .from('deals')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`Error in batch ${Math.floor(i / batchSize) + 1}:`, error);
        errors += batch.length;
      } else {
        inserted += batch.length;
        console.log(`✓ Batch ${Math.floor(i / batchSize) + 1} completed`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total deals: ${dealsData.length}`);
    console.log(`Successfully inserted/updated: ${inserted}`);
    console.log(`Errors: ${errors}`);
    console.log('=========================\n');

    if (errors === 0) {
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️  Migration completed with errors. Check logs above.');
    }

  } catch (error) {
    console.error('Fatal error during migration:', error);
    process.exit(1);
  }
}

// Run migration
migrateDeals();
