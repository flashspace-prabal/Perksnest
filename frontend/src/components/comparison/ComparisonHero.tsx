import { Link } from "react-router-dom";

import { ArrowRight, ExternalLink, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ComparisonPageData } from "@/data/comparisonPages";
import SafeImage from "@/components/SafeImage";

interface ComparisonHeroProps {
  comparison: ComparisonPageData;
}

const ComparisonHero = ({ comparison }: ComparisonHeroProps) => {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#eadcf0] bg-[radial-gradient(circle_at_top_left,rgba(92,33,105,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#fbf7fd_100%)] px-6 py-8 text-slate-950 shadow-[0_30px_90px_rgba(92,33,105,0.12)] sm:px-8 lg:px-10 lg:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#5c2169]">Comparison Guide</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{comparison.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{comparison.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-12 rounded-full bg-[#5c2169] px-6 text-base font-semibold text-white hover:bg-[#4a1b55]">
              <Link to="/deals">
                Explore marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {[comparison.toolA, comparison.toolB].map((tool) => (
            <Card key={tool.name} className="rounded-[1.5rem] border-[#eadcf0] bg-white/90 shadow-[0_18px_50px_rgba(92,33,105,0.1)] backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#eadcf0] bg-white p-2 shadow-sm">
                    <SafeImage src={tool.logo} alt={tool.name} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-950">{tool.name}</h2>
                        <p className="mt-1 text-sm text-slate-600">{tool.subtitle}</p>
                      </div>
                      <Button asChild size="sm" variant="secondary" className="rounded-full border border-[#eadcf0] bg-[#fbf7fd] text-[#5c2169] hover:bg-[#f5edf8]">
                        <Link to={tool.href}>
                          View deal
                          <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-[#f0e5f4] bg-[#fbf7fd] px-3 py-3">
                        <p className="text-slate-500">Offer</p>
                        <p className="mt-1 font-semibold text-slate-950">{tool.deal}</p>
                      </div>
                      <div className="rounded-2xl border border-[#f0e5f4] bg-[#fffaf0] px-3 py-3">
                        <p className="text-slate-500">Savings</p>
                        <p className="mt-1 font-semibold text-[#5c2169]">{tool.savings}</p>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      Best for {tool.audience}
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
