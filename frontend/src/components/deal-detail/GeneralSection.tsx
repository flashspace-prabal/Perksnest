import React from "react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface GeneralSectionProps {
  deal: ComprehensiveDealDetail;
}

export const GeneralSection: React.FC<GeneralSectionProps> = ({ deal }) => {
  return (
    <section id="general-section" className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Main Title */}
        <div>
          <h2 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8"
            style={{
              fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
            }}
          >
            General information
          </h2>

          {/* Overview - Rich Description */}
          <div className="space-y-6 mb-16">
            <p 
              className="text-xl text-gray-700 leading-relaxed"
              style={{
                fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                fontSize: '16px',
                lineHeight: '1.6',
              }}
            >
              {(deal.general?.overview || (deal as any).generalInfo?.overview) || `${deal.name} is a powerful platform designed to help teams be more productive and efficient.`}
            </p>

            {/* Why It's Valuable - Key Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8">
              <h3 
                className="text-lg font-bold text-gray-900 mb-4"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                }}
              >
                ✨ Why {deal.name} is valuable
              </h3>
              <p 
                className="text-gray-700"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                This tool compounds over time—the more you use it, the more value you extract. Perfect for startups looking to scale their operations without adding recurring costs.
              </p>
            </div>
          </div>

          {/* Use Cases - Grid Layout */}
          {((deal.general?.useCases || (deal as any).generalInfo?.useCases) && (deal.general?.useCases || (deal as any).generalInfo?.useCases).length > 0) && (
            <div className="mb-16">
              <h3 
                className="text-2xl font-bold text-gray-900 mb-8"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                }}
              >
                Best for
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(deal.general?.useCases || (deal as any).generalInfo?.useCases).map((useCase: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex gap-3 items-start p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-gray-100 transition"
                  >
                    <span className="text-blue-600 font-bold text-xl flex-shrink-0">→</span>
                    <p 
                      className="text-gray-700"
                      style={{
                        fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.5',
                      }}
                    >
                      {useCase}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Info */}
          {(deal.general?.technicalInfo || (deal as any).generalInfo?.technicalInfo) && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-16">
              <h3 
                className="text-lg font-bold text-gray-900 mb-4"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                }}
              >
                Technical Information
              </h3>
              <p 
                className="text-gray-700 leading-relaxed"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                  fontSize: '14px',
                  lineHeight: '1.6',
                }}
              >
                {deal.general?.technicalInfo || (deal as any).generalInfo?.technicalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
