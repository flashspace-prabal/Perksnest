import React from "react";
import { Lock, Gift } from "lucide-react";
import DealCard from "@/components/DealCard";
import { Deal } from "@/data/deals";
import { isFreeDeal, isPremiumDeal } from "@/lib/deal-types";

interface DealsGridProps {
  deals: Deal[];
  showSections?: boolean; // Show separate FREE/PREMIUM sections
  layout?: "grid" | "list";
}

export const DealsGrid: React.FC<DealsGridProps> = ({
  deals,
  showSections = true,
  layout = "grid",
}) => {
  const freeDeal = deals.filter((d) => isFreeDeal(d.id));
  const premiumDeals = deals.filter((d) => isPremiumDeal(d.id));

  if (!showSections) {
    // Simple grid without sections
    return (
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} {...deal} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* FREE DEALS SECTION */}
      {freeDeal.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Free Deals</h2>
              <p className="text-sm text-gray-600 mt-1">
                {freeDeal.length} deals available for everyone
              </p>
            </div>
          </div>
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {freeDeal.map((deal) => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>
        </section>
      )}

      {/* PREMIUM DEALS SECTION */}
      {premiumDeals.length > 0 && (
        <section className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-700/10 rounded-3xl blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Premium Deals 💎
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {premiumDeals.length} exclusive deals for premium members
                </p>
              </div>
            </div>
            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {premiumDeals.map((deal) => (
                <div key={deal.id} className="relative group">
                  {/* Premium glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition blur-lg" />
                  <div className="relative">
                    <DealCard {...deal} isPremium={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {deals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No deals found</p>
        </div>
      )}
    </div>
  );
};

export default DealsGrid;
