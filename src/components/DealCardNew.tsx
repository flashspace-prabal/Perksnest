import { Crown, Sparkles, Users } from "lucide-react";

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
    <div className={`relative bg-card rounded-xl border transition-all hover:shadow-lg hover:border-primary/30 ${isPick ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
      {/* Secret's Pick Badge */}
      {isPick && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md">
            <Sparkles className="h-3 w-3" />
            Secret's Pick
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header with Logo and Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0 border border-border">
            <img src={logo} alt={name} className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-foreground truncate">{name}</h3>
              {isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-secondary text-muted-foreground">
                  <Crown className="h-3 w-3" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Used by {memberCount.toLocaleString()} members
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Deal Text */}
        <p className="text-sm font-medium text-primary mb-2 line-clamp-2">
          {dealText}
        </p>

        {/* Savings */}
        <p className="text-sm text-muted-foreground">
          Save up to <span className="font-semibold text-foreground">{savings}</span>
        </p>
      </div>
    </div>
  );
};

export default DealCardNew;
