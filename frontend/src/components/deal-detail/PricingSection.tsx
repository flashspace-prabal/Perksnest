import React from "react";
import { Check } from "lucide-react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  deal: ComprehensiveDealDetail;
  onClaim?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  deal,
  onClaim,
}) => {
  return (
    <section id="pricing-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Pricing</h2>
          {deal.pricing.description && (
            <p className="text-lg text-slate-600">{deal.pricing.description}</p>
          )}
        </div>

        {deal.pricing.plans && deal.pricing.plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {deal.pricing.plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-lg border-2 p-6 sm:p-8 h-full flex flex-col transition ${
                  plan.highlighted
                    ? "border-blue-600 bg-white shadow-lg"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="space-y-4 mb-8">
                  <h3 className="min-h-[32px] text-2xl font-bold text-slate-900">
                    {plan.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex min-h-[48px] items-baseline gap-2">
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.price}
                      </span>
                      {plan.billingPeriod && (
                        <span className="text-slate-600">{plan.billingPeriod}</span>
                      )}
                    </div>
                    <p className="min-h-[48px] text-slate-600">{plan.description}</p>
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {onClaim && (
                  <div className="mt-auto">
                    <Button
                      onClick={onClaim}
                      className={`w-full py-2 h-10 rounded-lg font-semibold transition ${
                        plan.highlighted
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                      }`}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            ))}
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
