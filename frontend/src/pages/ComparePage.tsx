import { Link, useParams } from "react-router-dom";

import { ArrowRight, BadgeDollarSign, CheckCircle2, Users } from "lucide-react";

import AlternativesGrid from "@/components/comparison/AlternativesGrid";
import ComparisonHero from "@/components/comparison/ComparisonHero";
import FeatureTable from "@/components/comparison/FeatureTable";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAlternativeComparisons, getComparisonPageBySlug, type ComparisonToolData } from "@/data/comparisonPages";
import SafeImage from "@/components/SafeImage";
import { useSeo } from "@/lib/seo";

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "best-fit", label: "Best Fit" },
  { id: "deals", label: "Deals" },
  { id: "alternatives", label: "Alternatives" },
];

const getDealIdFromHref = (href: string) => href.split("/deals/")[1]?.split(/[?#]/)[0] || "";

const ToolSnapshotCard = ({ tool }: { tool: ComparisonToolData }) => (
  <Card className="rounded-[1.75rem] border-[#eadcf0] bg-white shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#eadcf0] bg-white p-2 shadow-sm">
          <SafeImage src={tool.logo} alt={tool.name} className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-black text-slate-950">{tool.name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{tool.subtitle}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#f0e5f4] bg-[#fbf7fd] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#5c2169]">
            <Users className="h-4 w-4" />
            Best For
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">{tool.audience}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            <BadgeDollarSign className="h-4 w-4" />
            Deal Value
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-900">{tool.savings}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DealHighlightCard = ({ tool }: { tool: ComparisonToolData }) => (
  <Card className="rounded-[1.75rem] border-[#eadcf0] bg-white shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#eadcf0] bg-white p-2">
          <SafeImage src={tool.logo} alt={tool.name} className="h-full w-full object-contain" />
        </div>
        <div>
          <h3 className="font-black text-slate-950">{tool.name}</h3>
          <p className="text-sm text-slate-500">{tool.deal}</p>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-[linear-gradient(135deg,#5c2169,#7c2d8f)] p-5 text-white">
        <p className="text-sm text-white/75">Potential savings</p>
        <p className="mt-1 text-3xl font-black">{tool.savings}</p>
      </div>
      <Button asChild className="mt-5 h-11 w-full rounded-full bg-[#5c2169] font-semibold text-white hover:bg-[#4a1b55]">
        <Link to={tool.href}>
          Claim Deal
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);


const ComparePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const comparison = getComparisonPageBySlug(slug || "");

  useSeo(
    comparison
      ? {
          title: `${comparison.toolA.name} vs ${comparison.toolB.name} | PerksNest`,
          description: comparison.intro,
          path: `/compare/${comparison.slug}`,
        }
      : {
          title: "Compare Tools | PerksNest",
          description: "Compare startup software side by side to understand tradeoffs, pricing, features, and the right fit for your team.",
          path: slug ? `/compare/${slug}` : "/",
        }
  );

  if (!comparison) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Comparison Not Found</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-900">We couldn’t find that comparison page.</h1>
          <p className="mt-4 text-base text-stone-600">The slug may be wrong, or the comparison has not been added to the static dataset yet.</p>
          <Button asChild className="mt-8">
            <Link to="/deals">Explore marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const alternatives = getAlternativeComparisons(comparison.alternatives);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(92,33,105,0.10),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8f5fa_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Compare" },
            { label: `${comparison.toolA.name} vs ${comparison.toolB.name}` },
          ]}
        />

        <div className="mt-6">
          <ComparisonHero comparison={comparison} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.42fr]">
          <div className="space-y-8">
            <Card className="rounded-[1.75rem] border-[#eadcf0] bg-white shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
              <CardContent className="p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Decision Context</p>
                <p className="mt-4 text-base leading-8 text-slate-700">{comparison.intro}</p>
                <p className="mt-4 text-base leading-8 text-slate-700">{comparison.difference.core}</p>
              </CardContent>
            </Card>

            <section id="overview">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Hero Comparison</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">At a glance</h2>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <ToolSnapshotCard tool={comparison.toolA} />
                <ToolSnapshotCard tool={comparison.toolB} />
              </div>
            </section>

            <Card className="rounded-[1.75rem] border-[#eadcf0] bg-white shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
              <CardContent className="p-6 sm:p-7">
                <h2 className="text-3xl font-black tracking-tight text-slate-950">Overview</h2>
                <p className="mt-4 text-base leading-8 text-slate-700">{comparison.overview}</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[comparison.toolA, comparison.toolB].map((tool) => (
                    <div key={tool.name} className="rounded-2xl border border-[#f0e5f4] bg-[#fbf7fd] p-5">
                      <h3 className="text-lg font-bold text-slate-950">{tool.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.overview}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <section id="features">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Core Comparison</p>
              <h2 className="mb-5 mt-2 text-3xl font-black tracking-tight text-slate-950">Feature comparison table</h2>
              <FeatureTable toolAName={comparison.toolA.name} toolBName={comparison.toolB.name} rows={comparison.features} />
            </section>

            <section id="best-fit">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Who Should Use What</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Choose based on your workflow</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{comparison.finalVerdict}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {[
                  { tool: comparison.toolA, points: comparison.chooseToolAIf },
                  { tool: comparison.toolB, points: comparison.chooseToolBIf },
                ].map(({ tool, points }) => (
                  <Card key={tool.name} className="rounded-[1.75rem] border-[#eadcf0] bg-white shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-black text-slate-950">Choose {tool.name} if...</h3>
                      <ul className="mt-5 space-y-3">
                        {points.map((point) => (
                          <li key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5c2169]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section id="deals">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">PerksNest Deals</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Claim the better offer when you decide</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">{comparison.pricing}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <DealHighlightCard tool={comparison.toolA} />
                <DealHighlightCard tool={comparison.toolB} />
              </div>
            </section>

            <section id="alternatives">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">Alternatives</h2>
              <p className="mt-4 text-base leading-8 text-slate-700">If this pairing is not quite right, these related head-to-head guides can help you evaluate nearby options faster.</p>
              <div className="mt-6">
                <AlternativesGrid items={alternatives} />
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <Card className="rounded-[1.75rem] border-[#eadcf0] bg-white shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#5c2169]">Table of Contents</p>
                <nav className="mt-4 space-y-3">
                  {tocItems.map((item, index) => (
                    <a key={item.id} href={`#${item.id}`} className="block text-sm font-medium text-slate-600 transition-colors hover:text-[#5c2169]">
                      {index + 1}. {item.label}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="rounded-[1.75rem] border-[#5c2169] bg-[#5c2169] text-white shadow-[0_24px_70px_rgba(92,33,105,0.22)]">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Quick Snapshot</p>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-white/60">Choose {comparison.toolA.name} for</p>
                    <p className="mt-1 font-semibold text-white">{comparison.toolA.useCase}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Choose {comparison.toolB.name} for</p>
                    <p className="mt-1 font-semibold text-white">{comparison.toolB.useCase}</p>
                  </div>
                </div>
                <Button asChild className="mt-6 h-11 w-full rounded-full bg-white text-[#5c2169] hover:bg-white/90">
                  <Link to="#deals">View deals</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
