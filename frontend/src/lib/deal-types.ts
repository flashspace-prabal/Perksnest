export type DealType = "free" | "premium";

export const FREE_DEALS: Record<string, true> = {
  "notion": true,
  "intercom": true,
  "anam-ai": true,
  "miro": true,
  "revsh": true,
  "revolut-business": true,
  "lightfield-crm": true,
  "meetgeek": true,
  "supabase": true,
  "sentry": true,
  "backblaze": true,
  "cleura": true,
  "inworld-ai": true,
  "deepinfra": true,
  "couchbase": true,
  "planetscale": true,
  "statsig": true,
  "bastion": true,
  "wiz": true,
  "gusto": true,
  "brex": true,
  "typeform": true,
  "box-ai": true,
  "box-ai-startup-partner-program": true,
  "siemens": true,
  "alchemy": true,
  "infura": true,
  "browserbase": true,
};

export const PREMIUM_DEALS: Record<string, true> = {
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
  "github": true,
  "posthog": true,
  "mixpanel": true,
  "fireworks-ai": true,
  "together-ai": true,
  "canva": true,
  "linear": true,
  "datadog": true,
  "new-relic": true,
  "stripe-atlas": true,
  "cloudflare": true,
  "ovhcloud": true,
  "render": true,
  "scaleway": true,
  "oracle": true,
  "twilio-segment": true,
  "amplitude": true,
  "retool": true,
  "algolia": true,
  "circleci": true,
  "gitlab": true,
  "hubspot": true,
  "zendesk": true,
  "salesforce": true,
  "ramp": true,
  "zoho": true,
  "deel": true,
  "mercury": true,
  "mercury-startup-perks": true,
  "0x": true,
  "0x-jumpstart": true,
};

export function getDealType(dealId: string): DealType {
  if (PREMIUM_DEALS[dealId]) return "premium";
  return "free";
}

export function isPremiumDeal(dealId: string): boolean {
  return PREMIUM_DEALS[dealId] === true;
}

export function isFreeDeal(dealId: string): boolean {
  return FREE_DEALS[dealId] === true;
}

export function getFreeDealIds(): string[] {
  return Object.keys(FREE_DEALS);
}

export function getPremiumDealIds(): string[] {
  return Object.keys(PREMIUM_DEALS);
}

export function filterDealsByType<T extends { id: string }>(
  deals: T[],
  type: DealType
): T[] {
  return deals.filter((deal) => getDealType(deal.id) === type);
}
