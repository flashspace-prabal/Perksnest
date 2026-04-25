import React from "react";
import { Check, Sparkles } from "lucide-react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface PricingSectionProps {
  deal: ComprehensiveDealDetail;
  onClaim?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  deal,
}) => {
  const plans = deal.pricing?.plans || [];

  return (
    <section id="pricing-section" className="py-16 bg-[#fbf7fd] border-b border-[#eadcf0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#5c2169]/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#5c2169]">
            <Sparkles className="h-3.5 w-3.5" />
            Partner pricing
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{deal.name} pricing</h2>
          {deal.pricing.description && (
            <p className="max-w-3xl text-lg leading-8 text-slate-600">{deal.pricing.description}</p>
          )}
        </div>

        {plans.length > 0 ? (
          <div className="-mx-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <div className="flex min-w-full gap-5 lg:grid lg:grid-cols-3">
              {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`min-w-[280px] flex-1 rounded-3xl border p-5 sm:min-w-[340px] sm:p-6 h-full flex flex-col transition lg:min-w-0 ${
                  plan.highlighted
                    ? "border-[#5c2169]/30 bg-white shadow-[0_18px_55px_rgba(92,33,105,0.10)]"
                    : "border-[#eadcf0] bg-white"
                }`}
              >
                <div className="flex flex-col gap-5">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{plan.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="break-anywhere text-3xl font-black text-slate-900">
                        {plan.price}
                      </span>
                      {plan.billingPeriod && (
                        <span className="text-sm text-slate-500">{plan.billingPeriod}</span>
                      )}
                    </div>
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {plan.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                        <Check className="w-5 h-5 text-[#5c2169] flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-6 text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
            <p className="text-slate-600">Pricing information not available</p>
          </div>
        )}
      </div>
    </section>
  );
};
