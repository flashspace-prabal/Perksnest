import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, Crown, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SkeletonDealCard } from "@/components/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { getDeals } from "@/lib/deals";
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

const getDealHref = (deal: Deal) => `/deals/${deal.slug || deal.id}`;

export const RelatedDealsSection: React.FC<RelatedDealsSectionProps> = ({ deal }) => {
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const preferredDealIdsKey = useMemo(
    () => (deal.relatedDeals || []).map((item) => item.id).filter(Boolean).join("|"),
    [deal.relatedDeals]
  );

  useEffect(() => {
    let isMounted = true;

    const loadRelatedDeals = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const allDeals = await getDeals();

        if (!allDeals.length) {
          throw new Error("No deals available");
        }

        const preferredDealIds = preferredDealIdsKey ? preferredDealIdsKey.split("|") : [];
        const normalizedCurrentName = deal.name.toLowerCase();
        const basePool = allDeals.filter(
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
        const deduped = merged.filter((item, index, list) => {
          const key = item.slug || item.id;
          return list.findIndex((entry) => (entry.slug || entry.id) === key) === index;
        });
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
  }, [deal.id, deal.name, deal.category, deal.subcategory, preferredDealIdsKey]);

  return (
    <section id="related-section" className="border-b border-gray-200 bg-[linear-gradient(180deg,#faf8fc_0%,#ffffff_100%)] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5c2169]">Recommended Deals</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">More tools founders unlock next</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Teams exploring {deal.name} usually compare it with adjacent tools in their stack. These are the strongest next-fit deals in the marketplace.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#5c2169]/15 bg-white px-4 py-2 text-sm font-medium text-[#5c2169] shadow-[0_16px_35px_-28px_rgba(92,33,105,0.45)]">
            <Sparkles className="h-4 w-4" />
            Curated for this deal
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="overflow-hidden rounded-[28px] border border-gray-200 bg-white p-5 shadow-[0_22px_55px_-40px_rgba(15,23,42,0.28)]">
                <SkeletonDealCard />
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_50px_-38px_rgba(239,68,68,0.3)]">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p className="text-base font-semibold text-slate-900">We couldn't load recommended deals right now.</p>
            <p className="mt-2 text-sm text-slate-600">You can still browse the full marketplace below.</p>
          </div>
        ) : relatedDeals.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {relatedDeals.map((relatedDeal) => (
              <Link
                key={relatedDeal.id}
                to={getDealHref(relatedDeal)}
                className="group relative block overflow-hidden rounded-[28px] border border-gray-200/90 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5c2169]/30 hover:shadow-[0_24px_55px_-34px_rgba(92,33,105,0.45)]"
              >
                <div className="absolute inset-y-5 left-0 w-1.5 rounded-full bg-gradient-to-b from-[#5c2169] via-[#7a2f8f] to-[#d4a0de]" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-[#5c2169]/5">
                        <img
                          src={relatedDeal.logo}
                          alt={relatedDeal.name}
                          className="h-8 w-8 object-contain"
                          onError={(event) => {
                            (event.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-[#5c2169]">
                          {relatedDeal.name}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {relatedDeal.isPremium ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                              <Crown className="h-3 w-3" />
                              Premium
                            </span>
                          ) : null}
                          {relatedDeal.isPick ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#5c2169]/15 bg-[#5c2169]/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5c2169]">
                              <Sparkles className="h-3 w-3" />
                              Pick
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#5c2169]/15 bg-[#5c2169]/5 px-3 py-2 text-sm font-semibold text-[#5c2169] transition-all duration-200 group-hover:border-[#5c2169]/30 group-hover:bg-[#5c2169] group-hover:text-white sm:inline-flex">
                      <span>Explore</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                    {relatedDeal.description || `Explore more tools like ${relatedDeal.name}.`}
                  </p>

                  <p className="mt-4 line-clamp-2 text-sm font-medium text-gray-900">
                    {relatedDeal.dealText || "Exclusive deal"}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                      Save up to {relatedDeal.savings || "Special offer"}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{(relatedDeal.memberCount || 0).toLocaleString()} members</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#5c2169]/18 bg-white p-8 text-center shadow-[0_24px_60px_-42px_rgba(92,33,105,0.28)]">
            <p className="text-lg font-semibold text-slate-900">No related deals available right now.</p>
            <p className="mt-2 text-sm text-slate-600">Browse the full marketplace to discover more offers.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <Button
            size="lg"
            asChild
            className="min-w-[220px] rounded-2xl bg-[#5c2169] px-7 text-white shadow-[0_18px_35px_-24px_rgba(92,33,105,0.6)] hover:bg-[#4c1b57]"
          >
            <Link to="/deals">
              Explore all deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
