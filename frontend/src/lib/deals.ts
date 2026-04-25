/**
 * Deals data layer with Supabase integration
 * Priorities: Supabase → API → Static data
 */

import { dealsData, Deal, enrichDeals } from '@/data/deals';
import { getAllDeals, getDealById } from './api';
import { createClient } from '@supabase/supabase-js';
import { normalizeMemberCount } from './member-count';

// Feature flags
const USE_SUPABASE = true; // Set to false to skip Supabase
const USE_API = true; // Set to false to skip API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
let supabase: ReturnType<typeof createClient> | null = null;

function initSupabase() {
  if (!supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

function dedupeDeals(deals: Deal[]): Deal[] {
  const seen = new Set<string>();
  return deals.filter((deal) => {
    const key = deal.slug || deal.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function transformSupabaseDeals(data: any[]): Deal[] {
  return data.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    company: d.company || d.company_name,
    logo: d.logo,
    description: d.short_description || d.description,
    dealText: d.discounted_value || d.deal_text,
    savings: d.savings_amount || d.savings,
    memberCount: normalizeMemberCount(d),
    isPremium: d.is_premium || false,
    isFree: d.is_free || false,
    isPick: d.is_pick || false,
    featured: d.featured || false,
    category: d.category,
    subcategory: d.subcategory,
    lastAdded: d.last_added,
    expiresAt: d.expires_at,
    collection: d.collection,
    redeemUrl: d.redeem_url,
    promoCode: d.promo_code,
    steps: d.steps || [],
    website: d.website,
    eligibility: d.eligibility || [],
    expiresIn: d.expires_in,
  }));
}

/**
 * Get all deals from Supabase, API, or static data
 */
export async function getDeals(): Promise<Deal[]> {
  // Try Supabase first
  if (USE_SUPABASE) {
    try {
      const client = initSupabase();
      if (client) {
        const { data, error } = await client
          .from('deals')
          .select('*');

        if (error) throw error;
        if (data && data.length > 0) {
          console.log(`✅ Loaded ${data.length} deals from Supabase`);
          return dedupeDeals(transformSupabaseDeals(data));
        }
      }
    } catch (error) {
      console.warn('Failed to fetch deals from Supabase, trying API:', error);
    }
  }

  // Try API second
  if (USE_API) {
    try {
      const response = await getAllDeals();

      if (response && response.deals && Array.isArray(response.deals) && response.deals.length > 0) {
        const apiDeals = response.deals.map((d: any) => ({
          id: d.id,
          slug: d.slug,
          name: d.name,
          company: d.company || d.company_name,
          logo: d.logo,
          description: d.short_description || d.description,
          dealText: d.discounted_value || d.deal_text || d.dealText,
          savings: d.savings_amount || d.savings,
          memberCount: normalizeMemberCount(d),
          isPremium: d.is_premium || d.isPremium,
          isFree: d.is_free || d.isFree,
          isPick: d.is_pick || d.isPick,
          featured: d.featured,
          category: d.category,
          subcategory: d.subcategory,
          lastAdded: d.last_added || d.lastAdded,
          expiresAt: d.expires_at || d.expiresAt,
          collection: d.collection,
          redeemUrl: d.redeem_url || d.redeemUrl,
          promoCode: d.promo_code || d.promoCode,
          steps: d.steps || [],
          website: d.website || d.redeemUrl,
          eligibility: d.eligibility || [],
          expiresIn: d.expires_in || d.expiresIn,
        }));

        console.log(`✅ Loaded ${apiDeals.length} deals from API`);
        return dedupeDeals([...apiDeals]);
      }
    } catch (error) {
      console.warn('Failed to fetch deals from API, using static data:', error);
    }
  }

  // Fallback to static data
  console.log('📦 Using static deals data');
  return dedupeDeals([...enrichDeals(dealsData)]);
}

/**
 * Get a single deal by ID from Supabase, API, or static data
 */
export async function getDeal(dealId: string): Promise<Deal | null> {
  // Try Supabase first
  if (USE_SUPABASE) {
    try {
      const client = initSupabase();
      if (client) {
        const { data, error } = await client
          .from('deals')
          .select('*')
          .or(`id.eq.${dealId},slug.eq.${dealId}`)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
        if (data) {
          console.log(`✅ Loaded deal ${dealId} from Supabase`);
          return transformSupabaseDeals([data])[0];
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch deal ${dealId} from Supabase, trying API:`, error);
    }
  }

  // Try API second
  if (USE_API) {
    try {
      const response = await getDealById(dealId);

      if (response && response.deal) {
        const d = response.deal;
        console.log(`✅ Loaded deal ${dealId} from API`);
        return {
          id: d.id,
          slug: d.slug,
          name: d.name,
          company: d.company || d.company_name,
          logo: d.logo,
          description: d.short_description || d.description,
          dealText: d.discounted_value || d.deal_text || d.dealText,
          savings: d.savings_amount || d.savings,
          memberCount: normalizeMemberCount(d),
          isPremium: d.is_premium || d.isPremium,
          isFree: d.is_free || d.isFree,
          isPick: d.is_pick || d.isPick,
          featured: d.featured,
          category: d.category,
          subcategory: d.subcategory,
          lastAdded: d.last_added || d.lastAdded,
          expiresAt: d.expires_at || d.expiresAt,
          collection: d.collection,
          redeemUrl: d.redeem_url || d.redeemUrl,
          promoCode: d.promo_code || d.promoCode,
          steps: d.steps || [],
          website: d.website || d.redeemUrl,
          eligibility: d.eligibility || [],
          expiresIn: d.expires_in || d.expiresIn,
        };
      }
    } catch (error) {
      console.warn(`Failed to fetch deal ${dealId} from API, checking static data:`, error);
    }
  }

  // Fallback to static data
  console.log(`📦 Searching for deal ${dealId} in static data`);
  const staticDeal = dealsData.find(d => d.id === dealId || d.slug === dealId);
  if (staticDeal) {
    const enriched = enrichDeals([staticDeal])[0];
    return enriched;
  }
  return null;
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
