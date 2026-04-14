import { Check, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface ProsConsProps {
  title: string;
  pros: string[];
  cons: string[];
}

const ProsCons = ({ title, pros, cons }: ProsConsProps) => {
  return (
    <Card className="rounded-[1.6rem] border-stone-200 shadow-none">
      <CardContent className="p-6 sm:p-7">
        <h3 className="text-xl font-bold tracking-tight text-stone-900">{title}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Pros</p>
            <ul className="mt-4 space-y-3">
              {pros.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-stone-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">Cons</p>
            <ul className="mt-4 space-y-3">
              {cons.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-stone-700">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProsCons;
