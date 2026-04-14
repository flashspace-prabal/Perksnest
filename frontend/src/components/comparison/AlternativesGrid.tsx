import { Link } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ComparisonPageData } from "@/data/comparisonPages";

interface AlternativesGridProps {
  items: ComparisonPageData[];
}

const AlternativesGrid = ({ items }: AlternativesGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Link key={item.slug} to={`/compare/${item.slug}`} className="block">
          <Card className="h-full rounded-[1.4rem] border-stone-200 transition-all hover:-translate-y-1 hover:border-stone-300 hover:shadow-lg">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-stone-500">Alternative</p>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-stone-900">{item.toolA.name} vs {item.toolB.name}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.subtitle}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-stone-900">
                Read comparison
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default AlternativesGrid;
