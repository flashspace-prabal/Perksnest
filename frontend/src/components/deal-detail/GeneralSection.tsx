import React from "react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";

interface GeneralSectionProps {
  deal: ComprehensiveDealDetail;
}

export const GeneralSection: React.FC<GeneralSectionProps> = ({ deal }) => {
  return (
    <section id="general-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            General information
          </h2>

          {/* Overview */}
          <div className="space-y-4 mb-10">
            <p className="text-lg text-slate-700 leading-relaxed">
              {(deal.general?.overview || (deal as any).generalInfo?.overview) || `${deal.name} is a powerful platform designed to help teams be more productive and efficient.`}
            </p>
          </div>

          {/* Use Cases */}
          {((deal.general?.useCases || (deal as any).generalInfo?.useCases) && (deal.general?.useCases || (deal as any).generalInfo?.useCases).length > 0) && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Use Cases</h3>
              <div className="grid grid-cols-2 gap-3">
                {(deal.general?.useCases || (deal as any).generalInfo?.useCases).map((useCase: string, idx: number) => (
                  <div key={idx} className="flex gap-2 text-slate-700">
                    <span className="text-blue-600 font-bold">•</span>
                    {useCase}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Info */}
          {(deal.general?.technicalInfo || (deal as any).generalInfo?.technicalInfo) && (
            <div className="bg-white rounded-lg p-6 border border-slate-200 mb-10">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                Technical Information
              </h3>
              <p className="text-slate-700 leading-relaxed">
                {deal.general?.technicalInfo || (deal as any).generalInfo?.technicalInfo}
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        {(deal.general?.features || (deal as any).generalInfo?.features) && (deal.general?.features || (deal as any).generalInfo?.features).length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(deal.general?.features || (deal as any).generalInfo?.features).map((feature: any) => {
                const IconComponent = feature.icon
                  ? (LucideIcons[feature.icon as keyof typeof LucideIcons] as any)
                  : null;

                return (
                  <Card key={feature.id} className="border border-slate-200">
                    <CardHeader>
                      <div className="flex gap-3 items-start">
                        {IconComponent && (
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
