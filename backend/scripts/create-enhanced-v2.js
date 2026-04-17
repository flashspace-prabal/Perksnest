const fs = require('fs');
const path = require('path');

// Import enhancements
const { enhancements } = require('./enhance-deals.js');

// Read the deals file
const dealsPath = path.join(__dirname, '../../frontend/src/data/deals.ts');
let dealsContent = fs.readFileSync(dealsPath, 'utf-8');

console.log('📖 Reading deals.ts...');
console.log('📍 File size:', (dealsContent.length / 1024).toFixed(2), 'KB');

// Find all deal IDs in the file
const idMatches = dealsContent.match(/id:\s*"([^"]+)"/g);
const dealIds = idMatches ? idMatches.map(m => m.replace(/id:\s*"/, '').replace(/"/, '')) : [];
console.log(`✅ Found ${dealIds.length} deals`);

// Build the enhanced data structure
const dealEnhancements = {};
dealIds.forEach(id => {
  if (enhancements[id]) {
    dealEnhancements[id] = enhancements[id];
  }
});

console.log(`✅ Have enhancements for ${Object.keys(dealEnhancements).length} deals`);

// Generate TypeScript file with enhanced data
let enhancedTS = dealsContent;

// Add new interface properties
let interfaceMatch = enhancedTS.match(/export interface Deal \{[^}]+\}/s);
if (interfaceMatch) {
  const oldInterface = interfaceMatch[0];
  const newInterface = oldInterface.replace(
    /expiresIn\?: string;   \/\/ Expiration timeframe\n\}/,
    `expiresIn?: string;   // Expiration timeframe
  features?: string[];  // New: Features list
  reviews?: Array<{author: string; rating: number; text: string}>; // New: Customer reviews
}`
  );
  enhancedTS = enhancedTS.replace(oldInterface, newInterface);
}

// Now update each deal object with enhanced data
Object.keys(dealEnhancements).forEach(dealId => {
  const enhancement = dealEnhancements[dealId];
  
  // Find this deal's entry
  const dealPattern = new RegExp(`\\{\\s*id:\\s*"${dealId}"[^}]+\\}`, 's');
  const dealMatch = enhancedTS.match(dealPattern);
  
  if (dealMatch) {
    const oldDeal = dealMatch[0];
    
    // Parse the existing deal to get all properties
    let newDeal = oldDeal;
    
    // Update description
    const descPattern = /description:\s*"([^"]*)",/;
    newDeal = newDeal.replace(descPattern, `description: "${enhancement.description.replace(/"/g, '\\"').replace(/\n/g, ' ')}",`);
    
    // Add features before the closing brace (before any final comment)
    const featuresStr = '[' + enhancement.features.map(f => `"${f.replace(/"/g, '\\"')}"`).join(', ') + ']';
    const reviewsStr = '[' + enhancement.reviews.map(r => `{author: "${r.author.replace(/"/g, '\\"')}", rating: ${r.rating}, text: "${r.text.replace(/"/g, '\\"')}"}`).join(', ') + ']';
    
    // Insert before the closing brace
    newDeal = newDeal.replace(/\n  \}/s, `,\n    features: ${featuresStr},\n    reviews: ${reviewsStr}\n  }`);
    
    enhancedTS = enhancedTS.replace(oldDeal, newDeal);
  }
});

// Write enhanced TypeScript
const enhancedTsPath = path.join(__dirname, '../../frontend/src/data/deals-enhanced.ts');
fs.writeFileSync(enhancedTsPath, enhancedTS, 'utf-8');
console.log(`✅ Enhanced TypeScript written: ${enhancedTsPath}`);
console.log(`   Size: ${(enhancedTS.length / 1024).toFixed(2)} KB`);

// Generate SQL
let sqlContent = `-- Supabase SQL Update Script for Enhanced Deals
-- This script updates only the specific fields that were enhanced
-- Generated on ${new Date().toISOString()}
-- Updates: description, features (JSON array), reviews (JSON array)
-- Total deals to update: ${Object.keys(dealEnhancements).length}

BEGIN;

`;

Object.keys(dealEnhancements).forEach((dealId, idx) => {
  const enhancement = dealEnhancements[dealId];
  const descEscaped = enhancement.description.replace(/'/g, "''");
  const featuresJson = JSON.stringify(enhancement.features).replace(/'/g, "''");
  const reviewsJson = JSON.stringify(enhancement.reviews).replace(/'/g, "''");
  
  sqlContent += `-- ${idx + 1}. Update ${dealId}
UPDATE public.deals SET
  description = '${descEscaped}',
  features = '${featuresJson}'::jsonb,
  reviews = '${reviewsJson}'::jsonb
WHERE id = '${dealId}';

`;
});

sqlContent += `COMMIT;

-- Verification query
-- SELECT id, name, 
--        LENGTH(description) as desc_length,
--        jsonb_array_length(COALESCE(features, '[]'::jsonb)) as features_count,
--        jsonb_array_length(COALESCE(reviews, '[]'::jsonb)) as reviews_count
-- FROM public.deals
-- WHERE id IN (${Object.keys(dealEnhancements).map(id => `'${id}'`).join(', ')})
-- ORDER BY id;
`;

const sqlPath = path.join(__dirname, './update-deals-supabase.sql');
fs.writeFileSync(sqlPath, sqlContent, 'utf-8');
console.log(`✅ SQL file written: ${sqlPath}`);
console.log(`   Size: ${(sqlContent.length / 1024).toFixed(2)} KB`);

console.log('\n📊 Summary:');
console.log(`   ✅ Total deals enhanced: ${Object.keys(dealEnhancements).length}`);
const totalWords = Object.values(dealEnhancements).reduce((sum, e) => 
  sum + (e.description ? e.description.split(' ').length : 0), 0);
console.log(`   ✅ Total content words added: ${totalWords.toLocaleString()}`);
console.log(`   ✅ Average features per deal: ${(Object.values(dealEnhancements).reduce((sum, e) => sum + (e.features ? e.features.length : 0), 0) / Object.keys(dealEnhancements).length).toFixed(1)}`);

console.log('\n🎯 Next Steps:');
console.log('1️⃣  Replace deals.ts with deals-enhanced.ts');
console.log('2️⃣  Copy & execute update-deals-supabase.sql in Supabase');
console.log('3️⃣  Test the frontend to verify enhanced content displays');
