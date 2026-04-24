import { CheckCircle2, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ComparisonFeatureRow } from "@/data/comparisonPages";

interface FeatureTableProps {
  toolAName: string;
  toolBName: string;
  rows: ComparisonFeatureRow[];
}

function Rating({ value, highlighted }: { value: number; highlighted?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${highlighted ? "bg-[#5c2169] text-white" : "bg-slate-100 text-slate-900"}`}>
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      {value.toFixed(1)}
    </div>
  );
}

const FeatureTable = ({ toolAName, toolBName, rows }: FeatureTableProps) => {
  return (
    <Card className="overflow-hidden rounded-[1.75rem] border-[#eadcf0] shadow-[0_18px_55px_rgba(92,33,105,0.08)]">
      <CardContent className="p-0">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-[#eadcf0] bg-[#fbf7fd] px-5 py-4 text-sm font-bold text-slate-800 sm:px-6">
          <div>Feature</div>
          <div>{toolAName}</div>
          <div>{toolBName}</div>
        </div>
        {rows.map((row, index) => {
          const toolAWins = row.toolARating >= row.toolBRating;
          const toolBWins = row.toolBRating >= row.toolARating;

          return (
            <div
              key={row.feature}
              className={`grid grid-cols-1 gap-4 px-5 py-5 transition-colors hover:bg-[#fffcff] sm:grid-cols-[1.1fr_1fr_1fr] sm:px-6 ${index < rows.length - 1 ? "border-b border-[#f0e5f4]" : ""}`}
            >
              <div>
                <h3 className="font-bold text-slate-950">{row.feature}</h3>
                <p className="mt-1 text-xs text-slate-500">Side-by-side buying signal</p>
              </div>
              <div className={`rounded-2xl border p-4 ${toolAWins ? "border-[#d9b9e4] bg-[#fbf7fd]" : "border-slate-200 bg-white"}`}>
                <div className="flex items-center justify-between gap-3">
                  <Rating value={row.toolARating} highlighted={toolAWins} />
                  {toolAWins ? <CheckCircle2 className="h-5 w-5 text-[#5c2169]" /> : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{row.toolAValue}</p>
              </div>
              <div className={`rounded-2xl border p-4 ${toolBWins ? "border-[#d9b9e4] bg-[#fbf7fd]" : "border-slate-200 bg-white"}`}>
                <div className="flex items-center justify-between gap-3">
                  <Rating value={row.toolBRating} highlighted={toolBWins} />
                  {toolBWins ? <CheckCircle2 className="h-5 w-5 text-[#5c2169]" /> : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{row.toolBValue}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FeatureTable;
