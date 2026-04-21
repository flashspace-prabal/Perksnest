/**
 * Deal Type Classification
 * Maps deal IDs to their tier: "free" or "premium"
 */

export type DealType = "free" | "premium";

// FREE DEALS - Fully accessible to all users
export const FREE_DEALS: Record<string, true> = {
  "google-cloud": true,
  "aws": true,
  "microsoft-azure": true,
  "digitalocean": true,
  "vercel": true,
  "openai": true,
  "anthropic": true,
  "elevenlabs": true,
  "perplexity-ai": true,
  "mongodb": true,
  "supabase": true,
  "github": true,
  "posthog": true,
  "mixpanel": true,
  "notion": true,
  "canva": true,
  "miro": true,
  "linear": true,
  "sentry": true,
  "datadog": true,
  "new-relic": true,
  "stripe-atlas": true,
};

// PREMIUM DEALS - Restricted to premium users
export const PREMIUM_DEALS: Record<string, true> = {
  "cloudflare": true,
  "ovhcloud": true,
  "render": true,
  "scaleway": true,
  "backblaze": true,
  "cleura": true,
  "oracle": true,
  "deepinfra": true,
  "fireworks-ai": true,
  "inworld-ai": true,
  "anam-ai": true,
  "couchbase": true,
  "planetscale": true,
  "twilio-segment": true,
  "amplitude": true,
  "statsig": true,
  "retool": true,
  "algolia": true,
  "circleci": true,
  "gitlab": true,
  "bastion": true,
  "intercom": true,
  "hubspot": true,
  "zendesk": true,
  "salesforce": true,
  "brex": true,
  "ramp": true,
  "revolut-business": true,
  "gusto": true,
  "revsh": true,
  "zoho": true,
  "typeform": true,
  "lightfield-crm": true,
  "deel": true,
  "box-ai": true,
  "siemens": true,
  "alchemy": true,
  "infura": true,
  "snowflake": true,
  "atlassian": true,
  "whimsical": true,
  "tog": true,
  "meetgeek": true,
  // Additional deals not explicitly listed - defaulting to premium
  "wiz": true,
  "0x": true,
  "browserbase": true,
  "mercury": true,
};

/**
 * Get deal type by ID
 * @param dealId - The deal ID to check
 * @returns "free" | "premium"
 */
export function getDealType(dealId: string): DealType {
  if (FREE_DEALS[dealId]) return "free";
  if (PREMIUM_DEALS[dealId]) return "premium";
  // Default to free if not found
  console.warn(`[getDealType] Deal ${dealId} not classified - defaulting to FREE`);
  return "free";
}

/**
 * Check if a deal is premium
 */
export function isPremiumDeal(dealId: string): boolean {
  return PREMIUM_DEALS[dealId] === true;
}

/**
 * Check if a deal is free
 */
export function isFreeDeal(dealId: string): boolean {
  return FREE_DEALS[dealId] === true;
}

/**
 * Get all free deal IDs
 */
export function getFreeDealIds(): string[] {
  return Object.keys(FREE_DEALS);
}

/**
 * Get all premium deal IDs
 */
export function getPremiumDealIds(): string[] {
  return Object.keys(PREMIUM_DEALS);
}

/**
 * Filter deals by type
 */
export function filterDealsByType<T extends { id: string }>(
  deals: T[],
  type: DealType
): T[] {
  if (type === "free") {
    return deals.filter((d) => isFreeDeal(d.id));
  } else {
    return deals.filter((d) => isPremiumDeal(d.id));
  }
}
