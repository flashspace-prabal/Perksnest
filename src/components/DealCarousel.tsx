import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowUpRight, Crown, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeImage from "./SafeImage";

interface Deal {
  id: string;
  name: string;
  logo: string;
  description: string;
  dealText: string;
  savings: string;
  memberCount: number;
  isPremium?: boolean;
  isFree?: boolean;
  isPick?: boolean;
}

interface DealCarouselProps {
  title: string;
  subtitle?: string;
  deals: Deal[];
  browseLink?: string;
  browseLinkText?: string;
}

const DealCarousel = ({ title, subtitle, deals, browseLink, browseLinkText }: DealCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-border bg-card hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        >
          {deals.map((deal) => (
            <Link
              key={deal.id}
              to={`/deals/${deal.id}/redeem`}
              className="flex-shrink-0 w-[320px] group"
            >
              <div className={`relative bg-card rounded-xl border transition-all hover:shadow-lg hover:border-primary/30 h-full ${deal.isPick ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
                {/* Secret's Pick Badge - positioned with more space */}
                {deal.isPick && (
                  <div className="absolute -top-3 right-4 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md whitespace-nowrap">
                      <Sparkles className="h-3 w-3" />
                      Secret's Pick
                    </span>
                  </div>
                )}

                <div className={`p-5 ${deal.isPick ? 'pt-6' : ''}`}>
                  {/* Logo and Name Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
                      <SafeImage src={deal.logo} alt={deal.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{deal.name}</h3>
                    </div>
                  </div>

                  {/* Used by members - separate line */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Users className="h-3 w-3 shrink-0" />
                    <span>Used by {deal.memberCount.toLocaleString()} members</span>
                  </div>

                  {/* Get deal button - separate line */}
                  <div className="mb-4">
                    <Button
                      size="sm"
                      variant={deal.isFree ? "default" : "outline"}
                      className={`gap-1.5 text-sm w-full ${!deal.isFree ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' : ''}`}
                    >
                      {deal.isFree ? "Get deal for free" : "Get deal"}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{deal.description}</p>

                  {/* Deal Text */}
                  <p className="text-sm font-medium text-foreground mb-4 line-clamp-2">{deal.dealText}</p>

                  {/* Footer - savings and premium badge */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm text-success font-semibold">Save up to {deal.savings}</span>
                    {deal.isPremium && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-secondary text-muted-foreground">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse Link */}
        {browseLink && (
          <div className="mt-6">
            <Link to={browseLink}>
              <Button variant="outline" className="gap-2">
                {browseLinkText || "Browse all deals"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default DealCarousel;
