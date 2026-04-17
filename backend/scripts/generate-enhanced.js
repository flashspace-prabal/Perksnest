const fs = require('fs');
const path = require('path');
const { enhancements } = require('./enhance-deals.js');

// Read the original deals.ts file
const dealsFilePath = path.join(__dirname, '../frontend/src/data/deals.ts');
const dealsContent = fs.readFileSync(dealsFilePath, 'utf-8');

// Extract just the deal objects from the TypeScript file
// We'll parse the existing dealsData array
const dealsStartIdx = dealsContent.indexOf('export const dealsData: Deal[] = [');
const dealsEndIdx = dealsContent.lastIndexOf('];');
const dealsArrayStr = dealsContent.substring(dealsStartIdx + 34, dealsEndIdx);

// Split deals by pattern - each deal starts with {
const dealMatches = dealsArrayStr.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);

// Parse deals
const deals = [];
if (dealMatches) {
  for (const dealStr of dealMatches) {
    try {
      const deal = eval('(' + dealStr + ')');
      deals.push(deal);
    } catch (e) {
      console.log('Error parsing deal:', e.message);
    }
  }
}

console.log(`Loaded ${deals.length} deals from deals.ts`);
console.log(`Available enhancements for ${Object.keys(enhancements).length} deals`);

// Enhanced deals array
const enhancedDeals = deals.map(deal => {
  const enhancement = enhancements[deal.id];
  
  if (enhancement) {
    return {
      ...deal,
      description: enhancement.description,
      features: enhancement.features,
      reviews: enhancement.reviews
    };
  }
  
  return deal;
});

// Generate TypeScript output
const tsOutput = `// Centralized deals data with reliable logo URLs - ENHANCED VERSION
export interface Deal {
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
  subcategory?: string; // More specific categorization within parent category
  lastAdded?: string;
  expiresAt?: string;  // ISO date string, undefined = no expiry
  collection?: string; // e.g. "yc-starter-kit", "free-tools", "growth-stack"
  redeemUrl?: string;  // URL to redeem the deal
  promoCode?: string;  // Promo code if applicable
  steps?: string[];    // Redemption steps
  website?: string;    // External website URL for redemption
  eligibility?: string[]; // Eligibility requirements
  expiresIn?: string;   // Expiration timeframe
  features?: string[];  // New: Features list
  reviews?: Array<{author: string; rating: number; text: string}>; // New: Customer reviews
}

// Startup deals have been merged into dealsData below

export const dealsData: Deal[] = [
${enhancedDeals.map(deal => {
  const reviews = deal.reviews ? JSON.stringify(deal.reviews).replace(/"/g, "'") : '[]';
  const features = deal.features ? JSON.stringify(deal.features).replace(/"/g, "'") : '[]';
  
  return `  {
    id: "${deal.id}",
    ${deal.slug ? `slug: "${deal.slug}",` : ''}
    name: "${deal.name}",
    ${deal.company ? `company: "${deal.company}",` : ''}
    logo: "${deal.logo}",
    description: "${deal.description.replace(/"/g, '\\\\"').replace(/\n/g, ' ')}",
    dealText: "${deal.dealText}",
    savings: "${deal.savings}",
    memberCount: ${deal.memberCount},
    ${deal.isPremium ? `isPremium: ${deal.isPremium},` : ''}
    ${deal.isFree ? `isFree: ${deal.isFree},` : ''}
    ${deal.isPick ? `isPick: ${deal.isPick},` : ''}
    ${deal.featured ? `featured: ${deal.featured},` : ''}
    category: "${deal.category}",
    ${deal.subcategory ? `subcategory: "${deal.subcategory}",` : ''}
    ${deal.lastAdded ? `lastAdded: "${deal.lastAdded}",` : ''}
    ${deal.expiresAt ? `expiresAt: "${deal.expiresAt}",` : ''}
    ${deal.collection ? `collection: "${deal.collection}",` : ''}
    redeemUrl: "${deal.redeemUrl || ''}",
    website: "${deal.website || ''}",
    ${deal.steps ? `steps: [${deal.steps.map(s => `"${s.replace(/"/g, '\\\\"')}"`).join(', ')}],` : ''}
    ${deal.eligibility ? `eligibility: [${deal.eligibility.map(e => `"${e.replace(/"/g, '\\\\"')}"`).join(', ')}],` : ''}
    features: [${deal.features.map(f => `"${f.replace(/"/g, '\\\\"')}"`).join(', ')}],
    reviews: [${deal.reviews.map(r => `{author: "${r.author}", rating: ${r.rating}, text: "${r.text.replace(/"/g, '\\\\"')}"}`).join(', ')}]
  }`;
}).join(',\n')}
];

// Helper functions to filter deals
export const getMostPopularDeals = () => 
  [...dealsData].sort((a, b) => b.memberCount - a.memberCount).slice(0, 12);

export const getFreeDeals = () => 
  dealsData.filter(deal => deal.isFree).slice(0, 12);

export const getPremiumDeals = () => 
  dealsData.filter(deal => deal.isPremium).slice(0, 12);

export const getRecentlyAddedDeals = () => 
  [...dealsData].reverse().slice(0, 12);

export const getDaysUntilExpiry = (expiresAt?: string): number | null => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getExpiryLabel = (expiresAt?: string): { label: string; urgent: boolean } | null => {
  const days = getDaysUntilExpiry(expiresAt);
  if (days === null) return null;
  if (days < 0) return { label: "Expired", urgent: true };
  if (days === 0) return { label: "Expires today!", urgent: true };
  if (days <= 3) return { label: \`Expires in \${days}d\`, urgent: true };
  if (days <= 14) return { label: \`\${days} days left\`, urgent: false };
  return { label: \`\${days} days left\`, urgent: false };
};

export const getDealsByCollection = (collection: string) =>
  dealsData.filter(d => d.collection === collection);

export const getCollections = () => {
  const map: Record<string, { id: string; name: string; description: string; icon: string; count: number }> = {
    "yc-starter-kit": { id: "yc-starter-kit", name: "YC Starter Kit", description: "Essential tools for YC & early-stage founders", icon: "ðŸš€", count: 0 },
    "growth-stack":   { id: "growth-stack",   name: "Growth Stack",   description: "Best deals for scaling marketing & sales",       icon: "ðŸ"ˆ", count: 0 },
    "free-tools":     { id: "free-tools",     name: "Free Tools",     description: "Zero cost â€" 100% free plans & trials",           icon: "ðŸŽ", count: 0 },
  };

  dealsData.forEach(deal => {
    if (deal.collection && map[deal.collection]) {
      map[deal.collection].count++;
    }
  });

  return Object.values(map);
};
`;

// Generate SQL output
const sqlOutput = `-- Supabase SQL Update Script for Enhanced Deals
-- This script updates only the specific fields that were enhanced
-- Generated on ${new Date().toISOString()}
-- Updates: description, features (JSON array), reviews (JSON array)
-- Total deals to update: ${enhancedDeals.length}

BEGIN;

${enhancedDeals.map(deal => {
  // Escape quotes in strings
  const descEscaped = deal.description.replace(/'/g, "''");
  const featuresJson = JSON.stringify(deal.features).replace(/'/g, "''");
  const reviewsJson = JSON.stringify(deal.reviews).replace(/'/g, "''");
  
  return `-- Update ${deal.name}
UPDATE public.deals SET
  description = '${descEscaped}',
  features = '${featuresJson}'::jsonb,
  reviews = '${reviewsJson}'::jsonb
WHERE id = '${deal.id}';`;
}).join('\n\n')}

COMMIT;

-- Verification query - uncomment to check updated deals
-- SELECT id, name, 
--        LENGTH(description) as desc_length,
--        jsonb_array_length(features) as features_count,
--        jsonb_array_length(reviews) as reviews_count
-- FROM public.deals
-- WHERE id IN (${enhancedDeals.map(d => `'${d.id}'`).join(', ')})
-- ORDER BY id;
`;

// Write TypeScript file
const tsOutputPath = path.join(__dirname, '../frontend/src/data/deals-enhanced.ts');
fs.writeFileSync(tsOutputPath, tsOutput, 'utf-8');
console.log(`✅ Enhanced deals TypeScript written to: ${tsOutputPath}`);
console.log(`   File size: ${(tsOutput.length / 1024).toFixed(2)} KB`);

// Write SQL file
const sqlOutputPath = path.join(__dirname, './update-deals-supabase.sql');
fs.writeFileSync(sqlOutputPath, sqlOutput, 'utf-8');
console.log(`✅ SQL update script written to: ${sqlOutputPath}`);
console.log(`   File size: ${(sqlOutput.length / 1024).toFixed(2)} KB`);

// Generate summary
console.log('\n📊 Summary:');
console.log(`   Total deals enhanced: ${enhancedDeals.length}`);
console.log(`   Deals with features: ${enhancedDeals.filter(d => d.features).length}`);
console.log(`   Deals with reviews: ${enhancedDeals.filter(d => d.reviews).length}`);

const totalWords = enhancedDeals.reduce((sum, d) => sum + d.description.split(' ').length, 0);
console.log(`   Total content words: ${totalWords.toLocaleString()}`);

console.log('\n✨ Next steps:');
console.log('1. Replace deals.ts with deals-enhanced.ts: mv deals-enhanced.ts deals.ts');
console.log('2. Execute SQL in Supabase SQL editor: copy contents of update-deals-supabase.sql');
console.log('3. Test locally to verify enhanced content displays correctly');
