import React from "react";
import { Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface RelatedDealsSectionProps {
  deal: ComprehensiveDealDetail;
}

export const RelatedDealsSection: React.FC<RelatedDealsSectionProps> = ({
  deal,
}) => {
  return (
    <section
      id="related-section"
      className="py-16 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            People also like these promo codes
          </h2>
          <p className="text-lg text-slate-600">
            {deal.name} is great, but we offer discounts on 570+ SaaS solutions.
            Here are related deals you might enjoy.
          </p>
        </div>

        {deal.relatedDeals && deal.relatedDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deal.relatedDeals.map((relatedDeal) => (
              <div
                key={relatedDeal.id}
                className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={relatedDeal.logo}
                    alt={relatedDeal.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <h3 className="font-bold text-slate-900">
                    {relatedDeal.name}
                  </h3>
                </div>

                {/* Deal Text */}
                <p className="text-slate-700 font-semibold mb-4">
                  {relatedDeal.dealText || `Get exclusive deal on ${relatedDeal.name}`}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">
                      {relatedDeal.memberCount ? relatedDeal.memberCount.toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <p className="text-xl font-bold text-green-600">
                      {relatedDeal.savings || "Special offer"}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <a href={`/deals/${relatedDeal.id}`}>Explore Deal</a>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
            <p className="text-slate-600">No related deals available</p>
          </div>
        )}

        {/* Explore More CTA */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            asChild
          >
            <a href="/explore">Explore all 570+ deals</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
