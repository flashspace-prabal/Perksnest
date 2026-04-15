import React from "react";
import { ArrowRight } from "lucide-react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { Button } from "@/components/ui/button";

interface AlternativesSectionProps {
  deal: ComprehensiveDealDetail;
}

export const AlternativesSection: React.FC<AlternativesSectionProps> = ({
  deal,
}) => {
  return (
    <section
      id="alternatives-section"
      className="py-16 bg-white border-b border-slate-200"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {deal.name}: Pros and Cons
          </h2>
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-slate-900 mb-3">Pros</h3>
            <ul className="space-y-2 mb-6">
              <li className="flex gap-2 text-slate-700">
                <span className="text-blue-600">✓</span> Customer support available
                24/7
              </li>
              <li className="flex gap-2 text-slate-700">
                <span className="text-blue-600">✓</span> Transparent flat-rate
                pricing with no hidden fees
              </li>
              <li className="flex gap-2 text-slate-700">
                <span className="text-blue-600">✓</span> Advanced reporting and
                analytics features
              </li>
            </ul>

            <h3 className="font-bold text-slate-900 mb-3">Cons</h3>
            <ul className="space-y-2">
              <li className="flex gap-2 text-slate-700">
                <span className="text-red-600">✗</span> No free trial version
                available
              </li>
              <li className="flex gap-2 text-slate-700">
                <span className="text-red-600">✗</span> Platform availability only
                in 47 markets
              </li>
              <li className="flex gap-2 text-slate-700">
                <span className="text-red-600">✗</span> Complex API requiring
                development expertise
              </li>
            </ul>
          </div>
        </div>

        {/* Alternatives */}
        {deal.alternatives && deal.alternatives.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Popular Alternatives to {deal.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deal.alternatives.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-slate-50 rounded-lg p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition"
                >
                  {/* Logo */}
                  <div className="mb-4">
                    <img
                      src={alt.logo}
                      alt={alt.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>

                  {/* Name and Tagline */}
                  <h3 className="font-bold text-slate-900 text-lg mb-2">
                    {alt.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{alt.tagline}</p>

                  {/* Pros */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-slate-700">
                      Key Advantages
                    </p>
                    <ul className="space-y-1">
                      {alt.pros.slice(0, 3).map((pro, idx) => (
                        <li key={idx} className="text-xs text-slate-600">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Savings */}
                  {alt.savings && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-bold text-green-700">
                        Save up to {alt.savings}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full text-sm"
                    asChild
                  >
                    <a href={`/deals/${alt.id}`}>
                      View Deal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
