import type { Deal } from "@/data/deals";
import { getStaticStartupDeal, startupDeals, type StartupDeal } from "@/data/startupDeals";
import { db } from "@/lib/supabase";

type StartupDealRow = {
  title: string;
  slug: string;
  category: string;
  description: string;
  perks: string;
  steps: unknown;
  website_url: string;
  created_at?: string | null;
};

function normalizeSteps(steps: unknown): string[] {
  if (!Array.isArray(steps)) return [];
  return steps.filter((step): step is string => typeof step === "string");
}

function mapRowToStartupDeal(row: StartupDealRow, fallback?: StartupDeal): StartupDeal {
  return {
    index: fallback?.index ?? 0,
    title: row.title,
    slug: row.slug,
    category: row.category,
    description: row.description,
    perks: row.perks,
    steps: normalizeSteps(row.steps),
    website_url: row.website_url,
    created_at: row.created_at ?? undefined,
  };
}

function deriveSavingsLabel(perks: string) {
  const patterns = [
    /Up to [^,.]+/i,
    /\$[\d,.]+[^,.]*/i,
    /\d+% discount[^,.]*/i,
    /\d+ months free[^,.]*/i,
    /Free tier[^,.]*/i,
  ];

  for (const pattern of patterns) {
    const match = perks.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return perks.length > 44 ? `${perks.slice(0, 44)}...` : perks;
}

function faviconForUrl(url: string) {
  if (!url) return "https://www.google.com/s2/favicons?domain=perksnest.co&sz=128";

  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return "https://www.google.com/s2/favicons?domain=perksnest.co&sz=128";
  }
}

export function toMarketplaceDeal(deal: StartupDeal): Deal {
  return {
    id: deal.slug,
    slug: deal.slug,
    name: deal.title,
    company: deal.title,
    logo: faviconForUrl(deal.website_url),
    description: deal.description,
    dealText: deal.perks,
    savings: deriveSavingsLabel(deal.perks),
    memberCount: 0,
    isFree: true,
    isPremium: false,
    isPick: false,
    featured: false,
    category: deal.category,
    subcategory: "startup-program",
    lastAdded: deal.created_at?.slice(0, 10),
  };
}

export function getStaticStartupDeals() {
  return startupDeals;
}

export function getStaticStartupMarketplaceDeals() {
  return startupDeals.map(toMarketplaceDeal);
}

export function isStartupDealSlug(slug: string) {
  return Boolean(getStaticStartupDeal(slug));
}

export async function getStartupDealBySlug(slug: string): Promise<StartupDeal | null> {
  const staticDeal = getStaticStartupDeal(slug);

  try {
    const { data, error } = await db
      .from("deals")
      .select("title, slug, category, description, perks, steps, website_url, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return mapRowToStartupDeal(data as StartupDealRow, staticDeal ?? undefined);
    }
  } catch (error) {
    console.warn(`Falling back to static startup deal for ${slug}:`, error);
  }

  return staticDeal;
}
