import React from "react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import * as LucideIcons from "lucide-react";

interface FeaturesSectionProps {
  deal: ComprehensiveDealDetail;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ deal }) => {
  return (
    <section id="features-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {deal.name} Features
          </h2>
          <p className="text-lg text-slate-600">
            Explore the key capabilities that make {deal.name} a powerful choice
          </p>
        </div>

        {deal.features && deal.features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deal.features.map((feature) => {
              const IconComponent = feature.icon
                ? (LucideIcons[feature.icon as keyof typeof LucideIcons] as any)
                : null;

              return (
                <div
                  key={feature.id}
                  className="flex gap-4 p-6 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  {IconComponent && (
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600">No features listed</p>
          </div>
        )}
      </div>
    </section>
  );
};
