import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VerdictCardProps {
  title: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
}

const VerdictCard = ({ title, points, ctaLabel, ctaHref }: VerdictCardProps) => {
  return (
    <Card className="rounded-[1.6rem] border-stone-200 shadow-none">
      <CardContent className="p-6 sm:p-7">
        <h3 className="text-2xl font-bold tracking-tight text-stone-900">{title}</h3>
        <ul className="mt-5 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm leading-6 text-stone-700">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-6 h-11 rounded-full px-5 font-semibold">
          <Link to={ctaHref}>
            {ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerdictCard;
