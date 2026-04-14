import { Link } from "react-router-dom";

import { ArrowRight, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ComparisonPageData } from "@/data/comparisonPages";
import SafeImage from "@/components/SafeImage";

interface ComparisonHeroProps {
  comparison: ComparisonPageData;
}

const ComparisonHero = ({ comparison }: ComparisonHeroProps) => {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-[linear-gradient(135deg,#111827_0%,#1f2937_52%,#78350f_100%)] px-6 py-8 text-white shadow-[0_28px_80px_-42px_rgba(28,25,23,0.55)] sm:px-8 lg:px-10 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-200">Comparison Guide</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{comparison.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-200">{comparison.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full px-6 text-base font-semibold">
              <Link to="/deals">
                Explore marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {[comparison.toolA, comparison.toolB].map((tool) => (
            <Card key={tool.name} className="rounded-[1.5rem] border-white/10 bg-white/8 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/95 p-2">
                    <SafeImage src={tool.logo} alt={tool.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-white">{tool.name}</h2>
                        <p className="mt-1 text-sm text-stone-300">{tool.subtitle}</p>
                      </div>
                      <Button asChild size="sm" variant="secondary" className="rounded-full">
                        <Link to={tool.href}>
                          View deal
                          <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-black/15 px-3 py-3">
                        <p className="text-stone-300">Offer</p>
                        <p className="mt-1 font-semibold text-white">{tool.deal}</p>
                      </div>
                      <div className="rounded-2xl bg-black/15 px-3 py-3">
                        <p className="text-stone-300">Savings</p>
                        <p className="mt-1 font-semibold text-white">{tool.savings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonHero;
