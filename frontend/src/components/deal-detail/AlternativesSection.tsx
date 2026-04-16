import React, { useMemo } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { DEALS_BY_CATEGORY, ALL_COMPREHENSIVE_DEALS } from "@/data/index-all-deals";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AlternativesSectionProps {
  deal: ComprehensiveDealDetail;
}

export const AlternativesSection: React.FC<AlternativesSectionProps> = ({
  deal,
}) => {
  const navigate = useNavigate();

  // Get real alternatives - 3 from same category, then fallback to others
  const realAlternatives = useMemo(() => {
    let categoryAlternatives: ComprehensiveDealDetail[] = [];
    let currentCategory = "";

    // Find which category this deal belongs to and get alternatives
    for (const [category, dealIds] of Object.entries(DEALS_BY_CATEGORY)) {
      if (dealIds.includes(deal.id)) {
        currentCategory = category;
        categoryAlternatives = dealIds
          .filter((id) => id !== deal.id)
          .map((id) => ALL_COMPREHENSIVE_DEALS[id])
          .filter((d) => d !== undefined) as ComprehensiveDealDetail[];
        break;
      }
    }

    // If we have 3 or more from category, return those
    if (categoryAlternatives.length >= 3) {
      return categoryAlternatives.slice(0, 3);
    }

    // Otherwise, fill with deals from other categories
    const allOtherDeals: ComprehensiveDealDetail[] = [];
    for (const [category, dealIds] of Object.entries(DEALS_BY_CATEGORY)) {
      if (category !== currentCategory) {
        dealIds
          .filter((id) => id !== deal.id && !categoryAlternatives.find((d) => d.id === id))
          .forEach((id) => {
            const d = ALL_COMPREHENSIVE_DEALS[id];
            if (d) allOtherDeals.push(d);
          });
      }
    }

    // Combine: category deals + other deals to get exactly 3
    const combined = [...categoryAlternatives, ...allOtherDeals];
    return combined.slice(0, 3);
  }, [deal.id]);

  return (
    <section
      id="alternatives-section"
      className="py-20 bg-slate-900 border-b border-slate-700"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1 bg-purple-600 bg-opacity-20 border border-purple-500 rounded-full text-purple-300 text-sm font-semibold mb-4">
            COMPARISON GUIDE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {deal.name} vs Alternatives: Which tool should you choose?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Compare {deal.name} with popular alternatives to find the best fit for your team.
          </p>
        </div>

        {/* Current Deal Card + Comparison */}
        {realAlternatives.length > 0 && (
          <div className="space-y-12">
            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Current Deal */}
              <div className="bg-gradient-to-br from-purple-900 to-slate-800 rounded-2xl p-8 border border-purple-500 border-opacity-50 shadow-2xl">
                <div className="flex items-start gap-4 mb-8">
                  <img
                    src={deal.logo}
                    alt={deal.name}
                    className="w-16 h-16 rounded-xl object-cover bg-white p-2"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-white">{deal.name}</h3>
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                        Current
                      </span>
                    </div>
                    <p className="text-slate-300">{deal.subtitle}</p>
                  </div>
                </div>

                {/* Deal Offer Box */}
                <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 mb-8 border border-purple-500 border-opacity-30">
                  <p className="text-sm text-slate-400 mb-2">Special Offer</p>
                  <p className="text-3xl font-bold text-white mb-2">
                    {deal.dealHighlight?.savings || "Special discount"}
                  </p>
                  <p className="text-slate-300 text-sm">{deal.dealHighlight?.headline}</p>
                </div>

                {/* Key Features */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Why Choose {deal.name}:</h4>
                  <ul className="space-y-3">
                    {(deal.deals?.whyChooseThis || []).slice(0, 4).map((benefit, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                        <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => navigate(`/deals/${deal.id}`)}
                  className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white text-base font-semibold py-3 rounded-lg"
                >
                  View {deal.name} Deal
                </Button>
              </div>

              {/* Alternatives */}
              <div className="space-y-6">
                {realAlternatives.map((alt, idx) => (
                  <div
                    key={alt.id}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition cursor-pointer shadow-lg"
                    onClick={() => navigate(`/deals/${alt.id}`)}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={alt.logo}
                        alt={alt.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white p-2"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-white">{alt.name}</h4>
                        <p className="text-sm text-slate-400">{alt.subtitle}</p>
                      </div>
                    </div>

                    {/* Alt Features */}
                    <ul className="space-y-2 mb-4">
                      {(alt.deals?.whyChooseThis || []).slice(0, 2).map((benefit, jdx) => (
                        <li key={jdx} className="flex gap-2 text-slate-300 text-sm">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* View Alternative */}
                    <Button
                      onClick={() => navigate(`/deals/${alt.id}`)}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      Compare
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-white mb-8">Detailed Comparison</h3>
              <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
                <table className="w-full">
                  <thead className="bg-slate-900 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Feature</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">{deal.name}</th>
                      {realAlternatives.slice(0, 2).map((alt) => (
                        <th key={alt.id} className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                          {alt.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    <tr className="hover:bg-slate-700 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">Pricing Model</td>
                      <td className="px-6 py-4 text-sm text-white">Flexible & Affordable</td>
                      {realAlternatives.slice(0, 2).map((alt) => (
                        <td key={alt.id} className="px-6 py-4 text-sm text-slate-300">
                          {alt.pricing?.[0]?.name || "Enterprise"}
                        </td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-700 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">Free Trial</td>
                      <td className="px-6 py-4 text-sm text-white flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-400" /> Available
                      </td>
                      {realAlternatives.slice(0, 2).map((alt) => (
                        <td key={alt.id} className="px-6 py-4 text-sm text-slate-300">Limited</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-700 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">Support Quality</td>
                      <td className="px-6 py-4 text-sm text-white">24/7 Premium Support</td>
                      {realAlternatives.slice(0, 2).map((alt) => (
                        <td key={alt.id} className="px-6 py-4 text-sm text-slate-300">Business Hours</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-700 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">Scalability</td>
                      <td className="px-6 py-4 text-sm text-white flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-400" /> Enterprise Ready
                      </td>
                      {realAlternatives.slice(0, 2).map((alt) => (
                        <td key={alt.id} className="px-6 py-4 text-sm text-slate-300">Limited at Scale</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-slate-700 transition">
                      <td className="px-6 py-4 text-sm font-medium text-slate-300">API Access</td>
                      <td className="px-6 py-4 text-sm text-white flex items-center gap-2">
                        <Check className="w-4 h-4 text-purple-400" /> Full API
                      </td>
                      {realAlternatives.slice(0, 2).map((alt) => (
                        <td key={alt.id} className="px-6 py-4 text-sm text-slate-300">Limited API</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
