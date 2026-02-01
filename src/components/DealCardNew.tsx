import { Crown, Sparkles, Users } from "lucide-react";
import SafeImage from "./SafeImage";

interface DealCardNewProps {
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

const DealCardNew = ({
  name,
  logo,
  description,
  dealText,
  savings,
  memberCount,
  isPremium = false,
  isPick = false,
}: DealCardNewProps) => {
  return (
    <div className={`relative bg-card rounded-xl border transition-all hover:shadow-lg hover:border-primary/30 h-full flex flex-col ${isPick ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}> 
      {/* PerksNest Pick Badge - keep fully inside card to avoid clipping */}
      {isPick && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md whitespace-nowrap">
            <Sparkles className="h-3 w-3" />
            PerksNest Pick
          </span>
        </div>
      )}

      <div className={`p-5 flex flex-col flex-1 ${isPick ? 'pt-14' : ''}`}>
        {/* Header with Logo and Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border">
            <SafeImage src={logo} alt={name} className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-secondary text-muted-foreground shrink-0">
                  <Crown className="h-3 w-3" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5 shrink-0" />
              Used by {memberCount.toLocaleString()} members
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {description}
        </p>

        {/* Deal Text */}
        <p className="text-sm font-medium text-foreground mb-3 line-clamp-2 flex-1">
          {dealText}
        </p>

        {/* Savings - always at bottom */}
        <p className="text-sm text-success font-semibold mt-auto pt-2">
          Save up to {savings}
        </p>
      </div>
    </div>
  );
};

export default DealCardNew;
