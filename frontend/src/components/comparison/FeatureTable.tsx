import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ComparisonFeatureRow } from "@/data/comparisonPages";

interface FeatureTableProps {
  toolAName: string;
  toolBName: string;
  rows: ComparisonFeatureRow[];
}

function Rating({ value }: { value: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-900">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </div>
  );
}

const FeatureTable = ({ toolAName, toolBName, rows }: FeatureTableProps) => {
  return (
    <Card className="overflow-hidden rounded-[1.6rem] border-stone-200 shadow-none">
      <CardContent className="p-0">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-stone-200 bg-stone-50 px-5 py-4 text-sm font-semibold text-stone-700 sm:px-6">
          <div>Feature</div>
          <div>{toolAName}</div>
          <div>{toolBName}</div>
        </div>
        {rows.map((row, index) => (
          <div
            key={row.feature}
            className={`grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-[1.1fr_1fr_1fr] sm:px-6 ${index < rows.length - 1 ? "border-b border-stone-200" : ""}`}
          >
            <div>
              <h3 className="font-semibold text-stone-900">{row.feature}</h3>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <Rating value={row.toolARating} />
              <p className="mt-3 text-sm leading-6 text-stone-600">{row.toolAValue}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <Rating value={row.toolBRating} />
              <p className="mt-3 text-sm leading-6 text-stone-600">{row.toolBValue}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FeatureTable;
