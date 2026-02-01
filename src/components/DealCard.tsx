import { ArrowUpRight, Crown, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DealCardProps {
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

const DealCard = ({
  name,
  logo,
  description,
  dealText,
  savings,
  memberCount,
  isPremium = false,
  isFree = true,
  isPick = false,
}: DealCardProps) => {
  return (
    <div className="deal-card group relative">
      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isPremium && (
          <span className="badge-premium">
            <Crown className="h-3 w-3" />
            Premium
          </span>
        )}
        {isPick && (
          <span className="badge-pick">
            <Star className="h-3 w-3" />
            Secret's Pick
          </span>
        )}
      </div>

      {/* Logo and Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <img src={logo} alt={name} className="w-10 h-10 object-contain" />
        </div>
        <div className="flex-1 min-w-0 pr-20">
          <h3 className="font-semibold text-lg text-foreground truncate">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
        </div>
      </div>

      {/* Deal Info */}
      <div className="mb-4">
        <p className="text-sm text-foreground leading-relaxed line-clamp-2">
          {dealText}
        </p>
      </div>

      {/* Savings */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary font-bold text-lg">Save up to {savings}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Used by {memberCount.toLocaleString()} members</span>
        </div>
        <Button 
          variant={isFree ? "default" : "secondary"}
          size="sm"
          className="gap-1.5 group-hover:gap-2 transition-all"
        >
          {isFree ? "Get deal for free" : "Get deal"}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DealCard;