/**
 * Dynamic Deal Comparison Page - SEO-Focused Long-Form Design
 * Inspired by JoinSecret comparison pages
 * Route: /compare/[deal1-id]/vs/[deal2-id]
 */

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { getComprehensiveDealByIdFromMaster } from "@/data/index-all-deals";
import { dealsData } from "@/data/deals";
import { convertBasicDealToComprehensive } from "@/lib/deal-converter";

// Sub-components

const CompareHero: React.FC<{ deal1: ComprehensiveDealDetail; deal2: ComprehensiveDealDetail }> = ({
  deal1,
  deal2,
}) => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">
        Deals &gt; Comparison &gt; {deal1.name} vs {deal2.name}
      </div>

      {/* Hero Title */}
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        {deal1.name} vs {deal2.name}:<br />
        Choosing the Best Solution
      </h1>

      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Compare {deal1.name} and {deal2.name} to find the perfect tool for your startup needs. See exclusive discounts and features side-by-side.
      </p>

      {/* Deal Cards */}
      <div className="grid grid-cols-2 gap-6">
        <DealCard deal={deal1} />
        <DealCard deal={deal2} />
      </div>
    </div>
  </div>
);

const DealCard: React.FC<{ deal: ComprehensiveDealDetail }> = ({ deal }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
    <div className="flex items-center gap-4 mb-4">
      <img src={deal.logo} alt={deal.name} className="w-12 h-12 rounded-lg object-cover" />
      <div>
        <h3 className="text-lg font-bold text-gray-900">{deal.name}</h3>
        <p className="text-sm text-gray-600">Used by {deal.memberCount?.toLocaleString()} members</p>
      </div>
    </div>

    <div className="text-3xl font-bold text-emerald-600 mb-2">
      {deal.dealHighlight?.savings || "Special Deal"}
    </div>
    <p className="text-sm text-gray-600">{deal.dealHighlight?.headline}</p>
  </div>
);

const ComparisonTable: React.FC<{ deal1: ComprehensiveDealDetail; deal2: ComprehensiveDealDetail }> = ({
  deal1,
  deal2,
}) => {
  const features = [
    { name: "Reporting & Analytics", key: "reporting" },
    { name: "Pricing Model", key: "pricing" },
    { name: "Ease of Use", key: "ease" },
    { name: "Integrations", key: "integrations" },
    { name: "Customer Support", key: "support" },
    { name: "Best For", key: "bestFor" },
  ];

  const getFeatureData = (product: ComprehensiveDealDetail, key: string): string => {
    const featureMap: Record<string, Record<string, string>> = {
      reporting: { reporting: "Advanced analytics dashboards" },
      pricing: { pricing: "Flexible & scalable plans" },
      ease: { ease: "Intuitive interface" },
      integrations: { integrations: "500+ integrations available" },
      support: { support: "24/7 dedicated support" },
      bestFor: { bestFor: "Growing teams" },
    };
    return featureMap[key]?.[key] || "Feature included";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Feature</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">{deal1.name}</th>
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">{deal2.name}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">{feature.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>{getFeatureData(deal1, feature.key)}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>{getFeatureData(deal2, feature.key)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const WhatsTheDifference: React.FC<{
  deal1: ComprehensiveDealDetail;
  deal2: ComprehensiveDealDetail;
}> = ({ deal1, deal2 }) => (
  <div className="grid grid-cols-2 gap-8">
    {/* Product A */}
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{deal1.name}</h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        {deal1.deals?.explanation || deal1.shortDescription || "Professional solution built for teams."}
      </p>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-emerald-900">Key Strength:</p>
        <p className="text-sm text-emerald-700 mt-2">
          {deal1.deals?.whyChooseThis?.[0] || "Industry-leading features"}
        </p>
      </div>
    </div>

    {/* Product B */}
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{deal2.name}</h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        {deal2.deals?.explanation || deal2.shortDescription || "Comprehensive platform for growing teams."}
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900">Key Strength:</p>
        <p className="text-sm text-blue-700 mt-2">
          {deal2.deals?.whyChooseThis?.[0] || "Powerful capabilities"}
        </p>
      </div>
    </div>
  </div>
);

const FeatureSection: React.FC<{
  title: string;
  deal1: ComprehensiveDealDetail;
  deal2: ComprehensiveDealDetail;
  description: string;
}> = ({ title, deal1, deal2, description }) => (
  <div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-700 leading-relaxed mb-8">{description}</p>

    <div className="grid grid-cols-2 gap-8 mb-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-3">{deal1.name}</h4>
        <ul className="space-y-2">
          {deal1.deals?.whyChooseThis?.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-3">{deal2.name}</h4>
        <ul className="space-y-2">
          {deal2.deals?.whyChooseThis?.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const VerdictSection: React.FC<{
  deal1: ComprehensiveDealDetail;
  deal2: ComprehensiveDealDetail;
}> = ({ deal1, deal2 }) => (
  <div className="grid grid-cols-2 gap-8">
    {/* Product A */}
    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8">
      <h3 className="text-2xl font-bold text-emerald-900 mb-4">✓ {deal1.name} is best if:</h3>
      <ul className="space-y-3">
        {deal1.deals?.whyChooseThis?.slice(0, 4).map((item, idx) => (
          <li key={idx} className="flex gap-3 text-emerald-800">
            <span className="font-bold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Product B */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
      <h3 className="text-2xl font-bold text-blue-900 mb-4">✓ {deal2.name} is best if:</h3>
      <ul className="space-y-3">
        {deal2.deals?.whyChooseThis?.slice(0, 4).map((item, idx) => (
          <li key={idx} className="flex gap-3 text-blue-800">
            <span className="font-bold">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const CtaSection: React.FC<{
  deal1: ComprehensiveDealDetail;
  deal2: ComprehensiveDealDetail;
  navigate: Function;
}> = ({ deal1, deal2, navigate }) => (
  <div className="bg-gray-50 border-t border-gray-200 py-12">
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Get Exclusive Deals</h2>

      <div className="grid grid-cols-2 gap-8">
        {/* Deal 1 CTA */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <img src={deal1.logo} alt={deal1.name} className="w-16 h-16 rounded-lg object-cover mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{deal1.name}</h3>
          <p className="text-emerald-600 text-2xl font-bold mb-2">{deal1.dealHighlight?.savings}</p>
          <p className="text-gray-600 mb-6">{deal1.dealHighlight?.headline}</p>
          <Button
            onClick={() => navigate(`/deals/${deal1.id}`)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg"
          >
            Get {deal1.name} Deal
          </Button>
        </div>

        {/* Deal 2 CTA */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <img src={deal2.logo} alt={deal2.name} className="w-16 h-16 rounded-lg object-cover mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{deal2.name}</h3>
          <p className="text-blue-600 text-2xl font-bold mb-2">{deal2.dealHighlight?.savings}</p>
          <p className="text-gray-600 mb-6">{deal2.dealHighlight?.headline}</p>
          <Button
            onClick={() => navigate(`/deals/${deal2.id}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
          >
            Get {deal2.name} Deal
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Main Page Component

const DynamicComparePage: React.FC = () => {
  const { deal1: deal1Param, deal2: deal2Param } = useParams<{
    deal1: string;
    deal2: string;
  }>();
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deal1, setDeal1] = React.useState<ComprehensiveDealDetail | null>(null);
  const [deal2, setDeal2] = React.useState<ComprehensiveDealDetail | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Load deal1
      let d1 = getComprehensiveDealByIdFromMaster(deal1Param || "");
      if (!d1) {
        const basicDeal1 = dealsData.find((d) => d.id === deal1Param);
        if (basicDeal1) {
          d1 = convertBasicDealToComprehensive(basicDeal1);
        }
      }

      // Load deal2
      let d2 = getComprehensiveDealByIdFromMaster(deal2Param || "");
      if (!d2) {
        const basicDeal2 = dealsData.find((d) => d.id === deal2Param);
        if (basicDeal2) {
          d2 = convertBasicDealToComprehensive(basicDeal2);
        }
      }

      if (!d1 || !d2) {
        setError("One or both deals not found");
        setLoading(false);
        return;
      }

      setDeal1(d1);
      setDeal2(d2);
      setLoading(false);
    } catch (err) {
      setError("Failed to load comparison data");
      console.error(err);
      setLoading(false);
    }
  }, [deal1Param, deal2Param]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (error || !deal1 || !deal2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Comparison Not Found</h1>
        <p className="text-gray-600 mb-6">{error || "Unable to load comparison data"}</p>
        <Button
          onClick={() => navigate("/")}
          className="bg-gray-900 text-white hover:bg-gray-800 font-bold py-2 px-6 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Deals
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <CompareHero deal1={deal1} deal2={deal2} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Introduction Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Compare?</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Choosing the right tool is critical for startup success. Both {deal1.name} and {deal2.name} are
              powerful solutions, but they serve different needs and use cases.
            </p>
            <p>
              This comprehensive comparison helps you understand the key differences, pricing models, feature
              sets, and ideal use cases for each platform. Use this guide to make an informed decision based on
              your specific requirements and business needs.
            </p>
            <p>
              Each product excels in different areas. Our detailed analysis will help you determine which one
              aligns best with your startup's current stage and future growth plans.
            </p>
          </div>
        </section>

        {/* Quick Comparison Table */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Comparison</h2>
          <ComparisonTable deal1={deal1} deal2={deal2} />
        </section>

        {/* What's the Difference */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What's the Difference?</h2>
          <WhatsTheDifference deal1={deal1} deal2={deal2} />
        </section>

        {/* Feature Breakdown Sections */}
        <section>
          <FeatureSection
            title="Reporting & Analytics"
            deal1={deal1}
            deal2={deal2}
            description="Both platforms offer robust reporting capabilities. Here's how they compare in analytics depth, customization, and real-time insights."
          />
        </section>

        <section>
          <FeatureSection
            title="Pricing Models"
            deal1={deal1}
            deal2={deal2}
            description="Pricing is a key differentiator for startups. Check the flexibility and scalability of each platform's pricing structure and what's included."
          />
        </section>

        <section>
          <FeatureSection
            title="Ease of Use"
            deal1={deal1}
            deal2={deal2}
            description="User experience is critical for adoption. Learn which platform has the steeper learning curve and how quickly your team can get productive."
          />
        </section>

        <section>
          <FeatureSection
            title="Integrations & Customization"
            deal1={deal1}
            deal2={deal2}
            description="Extensibility matters for workflow efficiency. See how many third-party integrations and custom APIs each platform supports."
          />
        </section>

        {/* Verdict Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Which is Best For You?</h2>
          <VerdictSection deal1={deal1} deal2={deal2} />
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I use both tools together?</h3>
              <p className="text-gray-700">
                Yes, many teams use complementary tools together. Check the integration documentation for both
                platforms to understand compatibility options.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-700">
                Both platforms offer free trials. Use our exclusive startup deals to get extended trial access or
                significant discounts on your first subscription.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">What if I need to switch later?</h3>
              <p className="text-gray-700">
                Both platforms support data export capabilities. Switching is possible but requires planning,
                potentially manual work, and should be part of your long-term strategy.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Which one is better for enterprise?</h3>
              <p className="text-gray-700">
                Enterprise needs vary significantly. Both have enterprise plans, but {deal1.name} typically offers
                more customization options, while {deal2.name} focuses on ease of use at scale.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <CtaSection deal1={deal1} deal2={deal2} navigate={navigate} />

      {/* Back Button */}
      <div className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Button
            onClick={() => navigate(-1)}
            className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-semibold py-2 px-6 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicComparePage;
