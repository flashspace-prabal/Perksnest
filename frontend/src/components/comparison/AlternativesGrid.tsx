import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ComparisonPageData } from "@/data/comparisonPages";
import SafeImage from "@/components/SafeImage";

interface AlternativesGridProps {
  items: ComparisonPageData[];
}

const AlternativesGrid = ({ items }: AlternativesGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link key={item.slug} to={`/compare/${item.slug}`} className="group block h-full">
          <Card className="relative h-full overflow-hidden rounded-[1.75rem] border-[#eadcf0] bg-white/90 shadow-[0_18px_55px_rgba(92,33,105,0.08)] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-[#d9b9e4] hover:shadow-[0_28px_80px_rgba(92,33,105,0.16)]">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_20%_0%,rgba(92,33,105,0.16),transparent_32%),linear-gradient(135deg,rgba(92,33,105,0.08),rgba(245,158,11,0.08))]" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center -space-x-3">
                  {[item.toolA, item.toolB].map((tool) => (
                    <div key={tool.name} className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white p-2 shadow-md shadow-[#5c2169]/10">
                      <SafeImage src={tool.logo} alt={tool.name} className="h-full w-full object-contain" />
                    </div>
                  ))}
                </div>
                <span className="rounded-full border border-[#eadcf0] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#5c2169]">
                  Compare
                </span>
              </div>

              <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950">
                {item.toolA.name} vs {item.toolB.name}
              </h3>
              <p className="mt-2 text-sm font-medium text-[#5c2169]">{item.toolA.useCase} vs {item.toolB.useCase}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.subtitle}</p>

              <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#f0e5f4] bg-[#fbf7fd] px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Potential savings</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{item.toolA.savings} / {item.toolB.savings}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#5c2169] transition-transform duration-300 group-hover:translate-x-1">
                  Compare Now
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default AlternativesGrid;
