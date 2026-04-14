import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import AlternativesGrid from "@/components/comparison/AlternativesGrid";
import ComparisonHero from "@/components/comparison/ComparisonHero";
import FeatureTable from "@/components/comparison/FeatureTable";
import ProsCons from "@/components/comparison/ProsCons";
import VerdictCard from "@/components/comparison/VerdictCard";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAlternativeComparisons, getComparisonPageBySlug } from "@/data/comparisonPages";

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "differences", label: "Differences" },
  { id: "pros-cons", label: "Pros & Cons" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "final-verdict", label: "Final Verdict" },
  { id: "alternatives", label: "Alternatives" },
];

const ComparePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const comparison = getComparisonPageBySlug(slug || "");

  useEffect(() => {
    document.title = comparison
      ? `${comparison.toolA.name} vs ${comparison.toolB.name} | PerksNest`
      : "Compare Tools | PerksNest";
  }, [comparison]);

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_28%),linear-gradient(180deg,#fafaf9_0%,#f5f5f4_100%)]">
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
            <Card className="rounded-[1.6rem] border-stone-200 shadow-none">
              <CardContent className="p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Introduction</p>
                <p className="mt-4 text-base leading-8 text-stone-700">{comparison.intro}</p>
                <p className="mt-4 text-base leading-8 text-stone-700">
                  This comparison matters because both products can look similar at the surface, while the real choice usually depends on the workflow you need to support every day.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[1.6rem] border-stone-200 shadow-none" id="overview">
              <CardContent className="p-6 sm:p-7">
                <h2 className="text-3xl font-black tracking-tight text-stone-900">Overview</h2>
                <p className="mt-4 text-base leading-8 text-stone-700">{comparison.overview}</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[comparison.toolA, comparison.toolB].map((tool) => (
                    <div key={tool.name} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                      <h3 className="text-lg font-bold text-stone-900">{tool.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-stone-600">{tool.overview}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[1.6rem] border-stone-200 shadow-none" id="differences">
              <CardContent className="p-6 sm:p-7">
                <h2 className="text-3xl font-black tracking-tight text-stone-900">Differences</h2>
                <div className="mt-6 space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Core difference</h3>
                    <p className="mt-2 text-base leading-8 text-stone-700">{comparison.difference.core}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Target audience</h3>
                    <p className="mt-2 text-base leading-8 text-stone-700">{comparison.difference.audience}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">Use case</h3>
                    <p className="mt-2 text-base leading-8 text-stone-700">{comparison.difference.useCase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div id="pros-cons" className="space-y-6">
              <ProsCons title={`${comparison.toolA.name} Pros & Cons`} pros={comparison.pros.toolA} cons={comparison.cons.toolA} />
              <ProsCons title={`${comparison.toolB.name} Pros & Cons`} pros={comparison.pros.toolB} cons={comparison.cons.toolB} />
            </div>

            <section id="features">
              <h2 className="mb-5 text-3xl font-black tracking-tight text-stone-900">Features</h2>
              <FeatureTable toolAName={comparison.toolA.name} toolBName={comparison.toolB.name} rows={comparison.features} />
            </section>

            <Card className="rounded-[1.6rem] border-stone-200 shadow-none" id="pricing">
              <CardContent className="p-6 sm:p-7">
                <h2 className="text-3xl font-black tracking-tight text-stone-900">Pricing</h2>
                <p className="mt-4 text-base leading-8 text-stone-700">{comparison.pricing}</p>
              </CardContent>
            </Card>

            <section id="final-verdict">
              <h2 className="text-3xl font-black tracking-tight text-stone-900">Final Verdict</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700">{comparison.finalVerdict}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <VerdictCard title={`Choose ${comparison.toolA.name} if...`} points={comparison.chooseToolAIf} ctaLabel="Get Deal" ctaHref={comparison.toolA.href} />
                <VerdictCard title={`Choose ${comparison.toolB.name} if...`} points={comparison.chooseToolBIf} ctaLabel="Get Deal" ctaHref={comparison.toolB.href} />
              </div>
            </section>

            <section id="alternatives">
              <h2 className="text-3xl font-black tracking-tight text-stone-900">Alternatives</h2>
              <p className="mt-4 text-base leading-8 text-stone-700">If this pairing is not quite right, these related head-to-head guides can help you evaluate nearby options faster.</p>
              <div className="mt-6">
                <AlternativesGrid items={alternatives} />
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <Card className="rounded-[1.6rem] border-stone-200 shadow-none">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">Table of Contents</p>
                <nav className="mt-4 space-y-3">
                  {tocItems.map((item, index) => (
                    <a key={item.id} href={`#${item.id}`} className="block text-sm font-medium text-stone-600 transition-colors hover:text-stone-900">
                      {index + 1}. {item.label}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="rounded-[1.6rem] border-stone-200 bg-stone-900 text-white shadow-none">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">Quick Snapshot</p>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-stone-400">Choose {comparison.toolA.name} for</p>
                    <p className="mt-1 font-semibold text-white">{comparison.toolA.useCase}</p>
                  </div>
                  <div>
                    <p className="text-stone-400">Choose {comparison.toolB.name} for</p>
                    <p className="mt-1 font-semibold text-white">{comparison.toolB.useCase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
