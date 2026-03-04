import { Crown, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import SafeImage from "./SafeImage";

interface DealCardNewProps {
  id?: string;
  name: string;
  logo: string;
  description: string;
  dealText: string;
  savings: string;
  memberCount: number;
  isPremium?: boolean;
  isFree?: boolean;
  isPick?: boolean;
  slug?: string;
}

const DealCardNew = ({
  id,
  name,
  logo,
  description,
  dealText,
  savings,
  memberCount,
  isPremium = false,
  isPick = false,
  slug,
}: DealCardNewProps) => {
  const href = slug ? `/deals/${slug}` : id ? `/deals/${id}` : '#';

  return (
    <Link to={href} className="block h-full">
      <div className="relative bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all h-full flex flex-col cursor-pointer group">
        {/* Badges row — top left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
          {isPick && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-sm whitespace-nowrap">
              <Sparkles className="h-3 w-3" />
              PerksNest Pick
            </span>
          )}
          {isPremium && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
              <Crown className="h-3 w-3" />
              Premium
            </span>
          )}
        </div>

        <div className={`p-5 flex flex-col flex-1 ${isPick || isPremium ? 'pt-12' : 'pt-5'}`}>
          {/* Logo + Company name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
              <SafeImage src={logo} alt={name} className="w-8 h-8 object-contain" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight truncate group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Users className="h-3 w-3 shrink-0" />
                Used by {memberCount.toLocaleString()} members
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
            {description}
          </p>

          {/* Deal text */}
          <p className="text-sm font-medium text-gray-800 line-clamp-2 flex-1 mb-3">
            {dealText}
          </p>

          {/* Savings — teal/green, always at bottom */}
          <div className="pt-2 border-t border-gray-100 mt-auto">
            <p className="text-sm font-semibold text-emerald-600">
              Save up to {savings}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DealCardNew;
