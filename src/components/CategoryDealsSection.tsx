import { Link } from "react-router-dom";
import { ChevronRight, Crown, ArrowUpRight, Users } from "lucide-react";
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
}

interface CategoryDealsSectionProps {
  categoryName: string;
  categorySlug: string;
  deals: Deal[];
}

const CategoryDealsSection = ({ categoryName, categorySlug, deals }: CategoryDealsSectionProps) => {
  return (
    <section className="py-8 border-t border-border">
      <div className="container-wide">
        <div className="grid lg:grid-cols-[200px_1fr] gap-8">
          {/* Category Label */}
          <div>
            <Link 
              to={`/deals?category=${categorySlug}`}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              {categoryName}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {deals.slice(0, 8).map((deal) => (
              <Link
                key={deal.id}
                to={`/deals/${deal.id}/redeem`}
                className="group"
              >
                <div className="bg-card rounded-lg border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center overflow-hidden border border-border shrink-0">
                      <SafeImage src={deal.logo} alt={deal.name} className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-medium text-sm text-foreground truncate">{deal.name}</h3>
                        {deal.isPremium && (
                          <Crown className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {deal.memberCount.toLocaleString()} members
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{deal.description}</p>
                  <p className="text-xs font-medium text-foreground mb-2 line-clamp-2">{deal.dealText}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-success font-semibold">Save {deal.savings}</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1">
                      {deal.isFree ? "Free" : "Get"}
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryDealsSection;
