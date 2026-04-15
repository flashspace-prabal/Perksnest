import React from "react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface DealsSectionProps {
  deal: ComprehensiveDealDetail;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ deal }) => {
  return (
    <section id="deals-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Title */}
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {deal.deals?.title || `About ${deal.name}`}
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed">
            {deal.deals?.explanation || "This SaaS tool helps businesses streamline operations and improve productivity."}
          </p>
        </div>

        {/* How Can I Benefit */}
        {deal.deals && (deal.deals.howCanBenefit || (deal.deals as any).howCanIBenefit) && (
          <div className="bg-blue-50 rounded-lg p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              How can I benefit from this {deal.name} discount?
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {deal.deals.howCanBenefit || (deal.deals as any).howCanIBenefit}
            </p>
          </div>
        )}

        {/* Eligibility */}
        {deal.eligibility && (Array.isArray(deal.eligibility) ? deal.eligibility.length > 0 : deal.eligibility.requirements?.length > 0) && (
          <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Who is eligible for this {deal.name} startup program?
            </h3>
            <ul className="space-y-3">
              {Array.isArray(deal.eligibility)
                ? deal.eligibility.map((req, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-700">
                      <span className="text-blue-600 font-bold">✓</span>
                      {req}
                    </li>
                  ))
                : (deal.eligibility as any).requirements?.map((req: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-slate-700">
                      <span className="text-blue-600 font-bold">✓</span>
                      {req}
                    </li>
                  ))
              }
            </ul>

            {!Array.isArray(deal.eligibility) && (deal.eligibility as any).limitations && (deal.eligibility as any).limitations.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3">Limitations:</h4>
                <ul className="space-y-2">
                  {(deal.eligibility as any).limitations.map((limit: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-slate-600 text-sm">
                      <span className="text-slate-400">•</span>
                      {limit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Why Choose This */}
        {deal.deals?.whyChooseThis && (
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Why should I consider this {deal.name} promo code among other SaaS deals?
            </h3>
            <p className="text-slate-700 leading-relaxed">
              {deal.deals.whyChooseThis}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
