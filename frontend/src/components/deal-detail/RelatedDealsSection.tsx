import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import DealCardNew from "@/components/DealCardNew";
import { SkeletonDealCard } from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { getAllDeals } from "@/lib/api";
import type { Deal } from "@/data/deals";
import type { ComprehensiveDealDetail } from "@/data/deal-details-schema";

type RelatedDealsInput = {
  id: string;
  name: string;
  category?: string;
  subcategory?: string;
  relatedDeals?: Array<{ id: string }>;
};

interface RelatedDealsSectionProps {
  deal: ComprehensiveDealDetail | RelatedDealsInput;
}

const mapApiDeal = (raw: Record<string, unknown>): Deal => ({
  id: String(raw.id || ""),
  slug: typeof raw.slug === "string" ? raw.slug : undefined,
  name: String(raw.name || "Untitled Deal"),
  company: typeof raw.company === "string" ? raw.company : undefined,
  logo: String(raw.logo || ""),
  description: String(raw.description || "Explore this startup-friendly software deal."),
  dealText: String(raw.deal_text || raw.dealText || "Exclusive deal"),
  savings: String(raw.savings || "Special offer"),
  memberCount: Number(raw.member_count || raw.memberCount || 0),
  isPremium: Boolean(raw.is_premium || raw.isPremium),
  isFree: Boolean(raw.is_free || raw.isFree),
  isPick: Boolean(raw.is_pick || raw.isPick),
  category: String(raw.category || ""),
  subcategory: typeof raw.subcategory === "string" ? raw.subcategory : undefined,
  redeemUrl: typeof raw.redeem_url === "string" ? raw.redeem_url : typeof raw.redeemUrl === "string" ? raw.redeemUrl : undefined,
  website: typeof raw.website === "string" ? raw.website : undefined,
  promoCode: typeof raw.promo_code === "string" ? raw.promo_code : typeof raw.promoCode === "string" ? raw.promoCode : undefined,
  expiresAt: typeof raw.expires_at === "string" ? raw.expires_at : typeof raw.expiresAt === "string" ? raw.expiresAt : undefined,
  steps: Array.isArray(raw.steps) ? (raw.steps as string[]) : undefined,
});

const getDealHref = (deal: Deal) => `/deals/${deal.slug || deal.id}`;

export const RelatedDealsSection: React.FC<RelatedDealsSectionProps> = ({ deal }) => {
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const preferredDealIds = useMemo(
    () => (deal.relatedDeals || []).map((item) => item.id).filter(Boolean),
    [deal]
  );

  useEffect(() => {
    let isMounted = true;

    const loadRelatedDeals = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getAllDeals();
        const apiDeals = Array.isArray(response?.deals)
          ? response.deals.map((item: Record<string, unknown>) => mapApiDeal(item))
          : [];

        if (!apiDeals.length) {
          throw new Error("No deals returned from backend");
        }

        const normalizedCurrentName = deal.name.toLowerCase();
        const basePool = apiDeals.filter(
          (item) => item.id !== deal.id && item.slug !== deal.id && item.name.toLowerCase() !== normalizedCurrentName
        );

        const preferredMatches = preferredDealIds
          .map((preferredId) => basePool.find((item) => item.id === preferredId || item.slug === preferredId))
          .filter((item): item is Deal => Boolean(item));

        const categoryMatches = deal.category
          ? basePool.filter((item) => item.category === deal.category)
          : [];

        const subcategoryMatches = deal.subcategory
          ? basePool.filter((item) => item.subcategory === deal.subcategory)
          : [];

        const fallbackMatches = [...basePool].sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));

        const merged = [...preferredMatches, ...subcategoryMatches, ...categoryMatches, ...fallbackMatches];
        const deduped = merged.filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index);
        const selected = deduped.slice(0, 3);

        if (isMounted) {
          setRelatedDeals(selected);
        }
      } catch (error) {
        console.error("Failed to load related deals from backend:", error);
        if (isMounted) {
          setRelatedDeals([]);
          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRelatedDeals();

    return () => {
      isMounted = false;
    };
  }, [deal.id, deal.name, deal.category, deal.subcategory, preferredDealIds]);

  return (
    <section id="related-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">People also like these promo codes</h2>
          <p className="text-lg text-slate-600">
            {deal.name} is great, but we offer discounts on more software your team may also need.
            Here are related deals you might enjoy.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex h-full flex-col gap-4">
                <SkeletonDealCard />
                <div className="h-11 rounded-lg bg-white border border-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p className="text-base font-semibold text-slate-900">We couldn't load recommended deals right now.</p>
            <p className="mt-2 text-sm text-slate-600">You can still browse the full marketplace below.</p>
          </div>
        ) : relatedDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedDeals.map((relatedDeal) => (
              <div key={relatedDeal.id} className="flex h-full flex-col gap-4">
                <DealCardNew
                  id={relatedDeal.id}
                  slug={relatedDeal.slug}
                  name={relatedDeal.name}
                  logo={relatedDeal.logo}
                  description={relatedDeal.description || `Explore more tools like ${relatedDeal.name}`}
                  dealText={relatedDeal.dealText || "Exclusive deal"}
                  savings={relatedDeal.savings || "Special offer"}
                  memberCount={relatedDeal.memberCount || 0}
                  isPremium={relatedDeal.isPremium}
                  isFree={relatedDeal.isFree}
                  isPick={relatedDeal.isPick}
                />
                <Button asChild className="h-11 w-full bg-primary hover:bg-primary/90">
                  <Link to={getDealHref(relatedDeal)}>Explore Deal</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-900 font-semibold">No related deals available right now.</p>
            <p className="mt-2 text-sm text-slate-600">Browse the full marketplace to discover more offers.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button size="lg" asChild className="min-w-[200px] bg-primary hover:bg-primary/90">
            <Link to="/deals">Explore all deals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
