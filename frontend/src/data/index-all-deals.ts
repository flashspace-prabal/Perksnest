/**
 * Master comprehensive deals index
 * Combines all 21 comprehensive deals from all sources
 * Single import point for accessing all deal data
 */

import { allComprehensiveDealDetails } from "./comprehensive-deals-data";
import { remainingComprehensiveDealDetails } from "./remaining-deals";

// Merge all deals into one complete map
export const ALL_COMPREHENSIVE_DEALS = {
  ...allComprehensiveDealDetails,
  ...remainingComprehensiveDealDetails,
};

// Helper to get any deal by ID
export function getComprehensiveDealByIdFromMaster(dealId: string) {
  return ALL_COMPREHENSIVE_DEALS[dealId] || null;
}

// Get all deal IDs
export const ALL_DEAL_IDS = Object.keys(ALL_COMPREHENSIVE_DEALS);

// Get all deals as array
export const ALL_DEALS_ARRAY = Object.values(ALL_COMPREHENSIVE_DEALS);

// Export count
export const TOTAL_DEALS_COUNT = ALL_DEAL_IDS.length;

// Export by category for organization
export const DEALS_BY_CATEGORY = {
  productivity: ["notion", "slack"],
  payments: ["stripe"],
  marketing: ["brevo", "hubspot", "semrush"],
  communication: ["zoom", "intercom"],
  automation: ["make"],
  design: ["figma", "webflow"],
  infrastructure: ["google-cloud", "aws", "digitalocean"],
  databases: ["airtable"],
  project_management: ["monday", "clickup"],
  customer_support: ["zendesk"],
  ai: ["perplexity"],
  ecommerce: ["shopify", "webflow"],
  development: ["linear", "github"],
};
