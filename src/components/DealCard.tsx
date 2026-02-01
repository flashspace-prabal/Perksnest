import { ArrowUpRight, Crown, Sparkles, Users } from "lucide-react";
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
      <div className="absolute top-5 right-5 flex gap-2">
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
          <img src={logo} alt={name} className="w-9 h-9 object-contain" />
        </div>
        <div className="flex-1 min-w-0 pr-20">
          <h3 className="font-semibold text-lg text-foreground truncate">{name}</h3>
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
        </div>
        <Button 
          variant={isFree ? "default" : "outline"}
          size="sm"
          className={`gap-1.5 group-hover:gap-2 transition-all ${!isFree ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground' : ''}`}
        >
          {isFree ? "Get free deal" : "Get deal"}
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DealCard;