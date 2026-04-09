import { useState, useEffect } from "react";
import { ArrowUpRight, Crown, Sparkles, Users } from "lucide-react";
import UpvoteButton from "@/components/UpvoteButton";
import ExpiryBadge from "@/components/ExpiryBadge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAverageRating } from "@/lib/reviews";

interface DealCardProps {
  name: string;
  company?: string;
  logo: string;
  description: string;
  dealText: string;
  id: string;
  expiresAt?: string;
  savings: string;
  memberCount: number;
  isPremium?: boolean;
  isFree?: boolean;
  isPick?: boolean;
  featured?: boolean;
}

const DealCard = ({
  id,
  name,
  company,
  logo,
  description,
  dealText,
  expiresAt,
  savings,
  memberCount,
  isPremium = false,
  isFree = true,
  isPick = false,
  featured = false,
}: DealCardProps) => {
  const dealId = id || name.toLowerCase().replace(/\s+/g, '-');
  const [avgRating, setAvgRating] = useState(0);
  useEffect(() => { getAverageRating(dealId).then(setAvgRating); }, [dealId]);

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const companySlug = slugify(company || name);

  // Removed preventDefault to allow navigation

  return (
    <div className="deal-card group relative">
      {/* Badges */}
      <div className="absolute top-5 right-5 flex gap-2">
        {featured && (
          <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            ⭐ Featured
          </span>
        )}
        {isPremium && (
          <span className="badge-premium">
            <Crown className="h-3 w-3" />
            Premium
          </span>
        )}
        {isPick && (
          <span className="badge-pick">
            <Sparkles className="h-3 w-3" />
            Top Pick
          </span>
        )}
      </div>

      {/* Logo and Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border">
          <img src={logo} alt={name} className="w-9 h-9 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
        </div>
        <div className="flex-1 min-w-0 pr-20">
          <div className="flex items-center gap-2">
            <Link to={`/brand/${companySlug}`} className="hover:underline">
              <h3 className="font-semibold text-lg text-foreground truncate">{name}</h3>
            </Link>
            {avgRating !== null && (
              <span className="text-xs text-yellow-600 font-medium whitespace-nowrap">
                ★ {avgRating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
        </div>
      </div>

      {/* Deal Info */}
      <div className="mb-5">
        <p className="text-sm text-foreground leading-relaxed line-clamp-2">
          {dealText}
        </p>
      </div>

      {/* Savings */}
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-success/10 text-success">
Save up to {savings}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{memberCount.toLocaleString()} members</span>
          <ExpiryBadge expiresAt={expiresAt} />
          <UpvoteButton dealId={id} compact />
        </div>
        <Link to={`/deals/${dealId}`}>
          <Button
            variant={isFree ? "default" : "outline"}
            size="sm"
            className={`gap-1.5 group-hover:gap-2 transition-all ${!isFree ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' : ''}`}
          >
            {isFree ? "Get free deal" : "Get deal"}
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DealCard;