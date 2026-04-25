/**
 * Dynamic Deal Comparison Page - SEO-Focused Long-Form Design
 * Inspired by JoinSecret comparison pages
 * Route: /compare/[deal1-id]/vs/[deal2-id]
 */

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Check, ArrowRight, BadgeDollarSign, Users } from "lucide-react";
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
  <div className="border-b border-[#eadcf0] bg-[radial-gradient(circle_at_top,rgba(92,33,105,0.10),transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbf7fd_100%)]">
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm font-medium text-slate-500">
        Deals &gt; Comparison &gt; {deal1.name} vs {deal2.name}
      </div>

      {/* Hero Title */}
      <h1 className="max-w-4xl text-3xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
        {deal1.name} vs {deal2.name}:<br />
        choose the right startup tool
      </h1>

      <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
        Compare use cases, pricing signals, integrations, performance, founder reviews, and PerksNest deal value before you claim.
      </p>

      {/* Deal Cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <DealCard deal={deal1} />
        <div className="flex items-center justify-center">
          <span className="rounded-full border border-[#eadcf0] bg-white px-4 py-2 text-sm font-black text-[#5c2169] shadow-sm">VS</span>
        </div>
        <DealCard deal={deal2} />
      </div>
    </div>
  </div>
);

const DealCard: React.FC<{ deal: ComprehensiveDealDetail }> = ({ deal }) => (
  <div className="rounded-[1.5rem] sm:rounded-[1.75rem] border border-[#eadcf0] bg-white p-4 sm:p-6 shadow-[0_18px_55px_rgba(92,33,105,0.10)]">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#eadcf0] bg-white p-2 shadow-sm">
        <img src={deal.logo} alt={deal.name} className="h-full w-full object-contain" />
      </div>
      <div className="min-w-0">
        <h3 className="break-anywhere text-lg sm:text-xl font-black text-slate-950">{deal.name}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
          <Users className="h-4 w-4" />
          {deal.memberCount?.toLocaleString() || "Startup"} members
        </p>
      </div>
    </div>

    <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#5c2169,#7c2d8f)] p-5 text-white">
      <p className="flex items-center gap-2 text-sm text-white/75">
        <BadgeDollarSign className="h-4 w-4" />
        Deal value
      </p>
      <div className="mt-1 break-anywhere text-2xl sm:text-3xl font-black">
      {deal.dealHighlight?.savings || "Special Deal"}
      </div>
    </div>
    <p className="mt-4 text-sm leading-6 text-slate-600">{deal.dealHighlight?.headline || deal.shortDescription}</p>
  </div>
);

const ComparisonTable: React.FC<{ deal1: ComprehensiveDealDetail; deal2: ComprehensiveDealDetail }> = ({
  deal1,
  deal2,
}) => {
  const features = [
    { name: "Pricing Model", key: "pricing" },
    { name: "Ease of Use", key: "ease" },
    { name: "Integrations", key: "integrations" },
    { name: "Performance", key: "performance" },
    { name: "Best For", key: "bestFor" },
  ];

  const getFeatureData = (product: ComprehensiveDealDetail, key: string): string => {
    const featureMap: Record<string, string> = {
      pricing: product.pricing?.description || product.dealHighlight?.headline || "Startup-friendly pricing and partner offers",
      ease: product.features?.[0]?.description || product.shortDescription || "Clear onboarding for startup teams",
      integrations: product.features?.[1]?.description || "Works with common startup workflows and tool stacks",
      performance: product.features?.[2]?.description || "Reliable enough for growing product and operations teams",
      bestFor: product.deals?.howCanBenefit?.[0] || product.deals?.whyChooseThis?.[0] || product.subcategory || product.category || "Growing teams",
    };
    return featureMap[key] || "Feature included";
  };

  return (
    <div className="overflow-x-auto rounded-[1.75rem] border border-[#eadcf0] bg-white shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-[#eadcf0] bg-[#fbf7fd]">
            <th className="px-6 py-4 text-left text-sm font-black text-slate-950">Feature</th>
            <th className="px-6 py-4 text-left text-sm font-black text-slate-950">{deal1.name}</th>
            <th className="px-6 py-4 text-left text-sm font-black text-slate-950">{deal2.name}</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <tr key={idx} className="border-b border-[#f0e5f4] transition hover:bg-[#fffcff] last:border-b-0">
              <td className="px-6 py-5 text-sm font-bold text-slate-950">{feature.name}</td>
              <td className="px-6 py-5 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-[#5c2169]" />
                  <span>{getFeatureData(deal1, feature.key)}</span>
                </div>
              </td>
              <td className="px-6 py-5 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 shrink-0 text-[#5c2169]" />
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
  <div className="grid items-stretch gap-6 md:grid-cols-2">
    {/* Product A */}
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-2xl font-black text-slate-950">{deal1.name}</h3>
      <p className="mb-6 leading-relaxed text-slate-700">
        {deal1.deals?.explanation || deal1.shortDescription || "Professional solution built for teams."}
      </p>
      <div className="mt-auto rounded-2xl border border-[#eadcf0] bg-[#fbf7fd] p-4">
        <p className="text-sm font-semibold text-[#5c2169]">Key Strength:</p>
        <p className="mt-2 text-sm text-slate-700">
          {deal1.deals?.whyChooseThis?.[0] || "Industry-leading features"}
        </p>
      </div>
    </div>

    {/* Product B */}
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-2xl font-black text-slate-950">{deal2.name}</h3>
      <p className="mb-6 leading-relaxed text-slate-700">
        {deal2.deals?.explanation || deal2.shortDescription || "Comprehensive platform for growing teams."}
      </p>
      <div className="mt-auto rounded-2xl border border-[#eadcf0] bg-[#fbf7fd] p-4">
        <p className="text-sm font-semibold text-[#5c2169]">Key Strength:</p>
        <p className="mt-2 text-sm text-slate-700">
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
    <h3 className="mb-4 text-2xl font-black text-slate-950">{title}</h3>
    <p className="mb-8 leading-relaxed text-slate-700">{description}</p>

    <div className="mb-8 grid gap-8 md:grid-cols-2">
      <div className="rounded-[1.5rem] border border-[#eadcf0] bg-white p-6 shadow-[0_12px_35px_rgba(92,33,105,0.06)]">
        <h4 className="mb-3 font-bold text-slate-950">{deal1.name}</h4>
        <ul className="space-y-2">
          {deal1.deals?.whyChooseThis?.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5c2169]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.5rem] border border-[#eadcf0] bg-white p-6 shadow-[0_12px_35px_rgba(92,33,105,0.06)]">
        <h4 className="mb-3 font-bold text-slate-950">{deal2.name}</h4>
        <ul className="space-y-2">
          {deal2.deals?.whyChooseThis?.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex gap-2 text-sm text-slate-700">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#5c2169]" />
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
  <div className="grid gap-6 md:grid-cols-2">
    {/* Product A */}
    <div className="rounded-[1.75rem] border border-[#eadcf0] bg-white p-8 shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
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
    <div className="rounded-[1.75rem] border border-[#eadcf0] bg-white p-8 shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
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
  <div className="border-t border-[#eadcf0] bg-[#fbf7fd] py-14">
    <div className="mx-auto max-w-6xl px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Deals Highlight</p>
      <h2 className="mb-10 mt-2 text-center text-3xl font-black text-slate-950">Claim the deal when you decide</h2>

      <div className="grid items-stretch gap-8 md:grid-cols-2">
        {/* Deal 1 CTA */}
        <div className="flex h-full flex-col rounded-[1.75rem] border border-[#eadcf0] bg-white p-8 text-center shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
          <img src={deal1.logo} alt={deal1.name} className="mx-auto mb-6 h-16 w-16 rounded-2xl object-contain" />
          <h3 className="mb-2 text-2xl font-black text-slate-950">{deal1.name}</h3>
          <p className="mb-2 text-3xl font-black text-[#5c2169]">{deal1.dealHighlight?.savings}</p>
          <p className="mb-6 text-sm leading-6 text-slate-600">{deal1.dealHighlight?.headline}</p>
          <Button
            onClick={() => navigate(`/deals/${deal1.id}`)}
            className="mt-auto h-12 w-full rounded-full bg-[#5c2169] font-bold text-white hover:bg-[#4a1b55]"
          >
            Claim Deal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Deal 2 CTA */}
        <div className="flex h-full flex-col rounded-[1.75rem] border border-[#eadcf0] bg-white p-8 text-center shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
          <img src={deal2.logo} alt={deal2.name} className="mx-auto mb-6 h-16 w-16 rounded-2xl object-contain" />
          <h3 className="mb-2 text-2xl font-black text-slate-950">{deal2.name}</h3>
          <p className="mb-2 text-3xl font-black text-[#5c2169]">{deal2.dealHighlight?.savings}</p>
          <p className="mb-6 text-sm leading-6 text-slate-600">{deal2.dealHighlight?.headline}</p>
          <Button
            onClick={() => navigate(`/deals/${deal2.id}`)}
            className="mt-auto h-12 w-full rounded-full bg-[#5c2169] font-bold text-white hover:bg-[#4a1b55]"
          >
            Claim Deal
            <ArrowRight className="ml-2 h-4 w-4" />
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8f5fa_100%)]">
      {/* Hero Section */}
      <CompareHero deal1={deal1} deal2={deal2} />

      {/* Main Content */}
      <div className="mx-auto max-w-6xl space-y-16 px-6 py-16">
        {/* Introduction Section */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Decision Context</p>
          <h2 className="mb-6 mt-2 text-3xl font-black text-slate-950">Why Compare?</h2>
          <div className="rounded-[1.75rem] border border-[#eadcf0] bg-white p-7 leading-relaxed text-slate-700 shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Core Table</p>
          <h2 className="mb-6 mt-2 text-3xl font-black text-slate-950">Feature Comparison</h2>
          <ComparisonTable deal1={deal1} deal2={deal2} />
        </section>

        {/* What's the Difference */}
        <section>
          <h2 className="mb-8 text-3xl font-black text-slate-950">What's the Difference?</h2>
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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Who Should Use What</p>
          <h2 className="mb-8 mt-2 text-3xl font-black text-slate-950">Which is Best For You?</h2>
          <VerdictSection deal1={deal1} deal2={deal2} />
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="mb-6 text-3xl font-black text-slate-950">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="rounded-[1.25rem] border border-[#eadcf0] bg-white p-6">
              <h3 className="font-bold text-gray-900 mb-2">Can I use both tools together?</h3>
              <p className="text-gray-700">
                Yes, many teams use complementary tools together. Check the integration documentation for both
                platforms to understand compatibility options.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-[#eadcf0] bg-white p-6">
              <h3 className="font-bold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-700">
                Both platforms offer free trials. Use our exclusive startup deals to get extended trial access or
                significant discounts on your first subscription.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-[#eadcf0] bg-white p-6">
              <h3 className="font-bold text-gray-900 mb-2">What if I need to switch later?</h3>
              <p className="text-gray-700">
                Both platforms support data export capabilities. Switching is possible but requires planning,
                potentially manual work, and should be part of your long-term strategy.
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-[#eadcf0] bg-white p-6">
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
      <div className="border-t border-[#eadcf0] bg-white py-6">
        <div className="mx-auto max-w-6xl px-6">
          <Button
            onClick={() => navigate(-1)}
            className="rounded-full border border-[#eadcf0] bg-white px-6 py-2 font-semibold text-slate-900 hover:bg-[#fbf7fd]"
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
