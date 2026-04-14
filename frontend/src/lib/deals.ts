/**
 * Deals data layer with API fallback
 * Fetches deals from API when available, falls back to static data
 */

import { dealsData, Deal } from '@/data/deals';
import { getAllDeals, getDealById } from './api';
import { getStaticStartupMarketplaceDeals } from './startupDeals';

// Feature flag to enable API fetching
const USE_API = true; // Set to false to use static data only

const startupMarketplaceDeals = getStaticStartupMarketplaceDeals();

function dedupeDeals(deals: Deal[]): Deal[] {
  const seen = new Set<string>();
  return deals.filter((deal) => {
    const key = deal.slug || deal.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Get all deals from API or static data
 */
export async function getDeals(): Promise<Deal[]> {
  if (!USE_API) {
    return dedupeDeals([...startupMarketplaceDeals, ...dealsData]);
  }

  try {
    const response = await getAllDeals();

    // Check if response has deals array AND it's not empty
    if (response && response.deals && Array.isArray(response.deals) && response.deals.length > 0) {
      // Transform API response to Deal format if needed
      const apiDeals = response.deals.map((d: any) => ({
        id: d.id,
        name: d.name,
        company: d.company,
        logo: d.logo,
        description: d.description,
        dealText: d.deal_text || d.dealText,
        savings: d.savings,
        memberCount: d.member_count || d.memberCount || 0,
        isPremium: d.is_premium || d.isPremium,
        isFree: d.is_free || d.isFree,
        isPick: d.is_pick || d.isPick,
        featured: d.featured,
        category: d.category,
        subcategory: d.subcategory,
        lastAdded: d.last_added || d.lastAdded,
        expiresAt: d.expires_at || d.expiresAt,
        collection: d.collection,
      }));

      console.log(`Loaded ${apiDeals.length} deals from API`);
      return dedupeDeals([...startupMarketplaceDeals, ...apiDeals]);
    }

    // Fallback to static data if API response is malformed or empty
    console.warn('API returned empty or unexpected format, falling back to static data');
    return dedupeDeals([...startupMarketplaceDeals, ...dealsData]);
  } catch (error) {
    console.error('Failed to fetch deals from API, using static data:', error);
    return dedupeDeals([...startupMarketplaceDeals, ...dealsData]);
  }
}

/**
 * Get a single deal by ID from API or static data
 */
export async function getDeal(dealId: string): Promise<Deal | null> {
  const startupDeal = startupMarketplaceDeals.find((deal) => deal.slug === dealId || deal.id === dealId);
  if (startupDeal) {
    return startupDeal;
  }

  if (!USE_API) {
    return dealsData.find(d => d.id === dealId) || null;
  }

  try {
    const response = await getDealById(dealId);

    if (response && response.deal) {
      const d = response.deal;
      console.log(`Loaded deal ${dealId} from API`);
      return {
        id: d.id,
        name: d.name,
        company: d.company,
        logo: d.logo,
        description: d.description,
        dealText: d.deal_text || d.dealText,
        savings: d.savings,
        memberCount: d.member_count || d.memberCount || 0,
        isPremium: d.is_premium || d.isPremium,
        isFree: d.is_free || d.isFree,
        isPick: d.is_pick || d.isPick,
        featured: d.featured,
        category: d.category,
        subcategory: d.subcategory,
        lastAdded: d.last_added || d.lastAdded,
        expiresAt: d.expires_at || d.expiresAt,
        collection: d.collection,
      };
    }

    // Fallback to static data
    console.warn(`Deal ${dealId} not found in API, checking static data`);
    return dealsData.find(d => d.id === dealId) || null;
  } catch (error) {
    console.error(`Failed to fetch deal ${dealId} from API, using static data:`, error);
    return dealsData.find(d => d.id === dealId) || null;
  }
}

/**
 * Get deals by category
 */
export async function getDealsByCategory(category: string): Promise<Deal[]> {
  const allDeals = await getDeals();
  return allDeals.filter(d => d.category === category);
}

/**
 * Get deals by subcategory
 */
export async function getDealsBySubcategory(subcategory: string): Promise<Deal[]> {
  const allDeals = await getDeals();
  return allDeals.filter(d => d.subcategory === subcategory);
}

/**
 * Get featured deals
 */
export async function getFeaturedDeals(): Promise<Deal[]> {
  const allDeals = await getDeals();
  return allDeals.filter(d => d.featured);
}

/**
 * Search deals by name or description
 */
export async function searchDeals(query: string): Promise<Deal[]> {
  const allDeals = await getDeals();
  const lowerQuery = query.toLowerCase();
  return allDeals.filter(
    d =>
      d.name.toLowerCase().includes(lowerQuery) ||
      d.description.toLowerCase().includes(lowerQuery)
  );
}
