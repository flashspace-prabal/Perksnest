import { Bookmark, Crown, Loader2, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { type MouseEvent, useState } from "react";
import SafeImage from "./SafeImage";
import { useAuth } from "@/lib/auth";
import { useBookmarks } from "@/lib/bookmarks";
import { toast } from "sonner";

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
  const [isPressed, setIsPressed] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isBookmarked, isBookmarkPending, toggleBookmark } = useBookmarks();
  const href = slug ? `/deals/${slug}` : id ? `/deals/${id}` : '#';
  const saved = id ? isBookmarked(id) : false;
  const isSaving = id ? isBookmarkPending(id) : false;

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);
  const handleBookmarkClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!id) return;

    if (!isAuthenticated) {
      toast.info("Sign in to save deals");
      return;
    }

    try {
      const nowSaved = await toggleBookmark(id);
      toast.success(nowSaved ? "Deal saved" : "Deal removed from saved");
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      toast.error("Failed to update saved deals");
    }
  };

  return (
    <Link to={href} className="block h-full">
      <div 
        className={`relative bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all h-full flex flex-col cursor-pointer group ${
          isPressed ? "scale-95" : "scale-100"
        } transition-transform duration-150`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badges row — top left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
          {isPick && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-sm whitespace-nowrap animate-pulse">
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

        <button
          type="button"
          aria-label={saved ? `Remove ${name} from saved deals` : `Save ${name} deal`}
          className={`absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm transition-colors ${
            saved ? "border-primary/30 text-primary" : "border-gray-200 text-gray-500 hover:border-primary/30 hover:text-primary"
          }`}
          onClick={handleBookmarkClick}
          disabled={!id || isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          )}
        </button>

        <div className={`p-5 flex flex-col flex-1 ${isPick || isPremium ? 'pt-12' : 'pt-5'}`}>
          {/* Logo + Company name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 group-hover:bg-primary/5 transition-colors">
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
