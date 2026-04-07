import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Crown, Sparkles, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeImage from "./SafeImage";
import { useAuth } from "@/lib/auth";

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

interface FeaturedDealsProps {
  deals: Deal[];
}

export const FeaturedDeals = ({ deals }: FeaturedDealsProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  // Display up to 6 deals on desktop, 4 on mobile (handled by css grid)
  const displayDeals = deals.slice(0, 6);

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container-wide">
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Deals Available Right Now
          </h2>
          <p className="text-muted-foreground text-lg">
            A sneak peek at some of the world-class tools you can save on. Join thousands of founders already saving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {displayDeals.map((deal, index) => {
            // Lock the last 3 deals if not authenticated
            const isLocked = !isAuthenticated && index >= 3;

            return (
              <div key={deal.id} className="relative group">
                {/* The Card - Enhanced with Full Content */}
                <Link
                  to={isLocked ? '/signup' : `/deals/${deal.id}`}
                  className={`block h-full bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col cursor-pointer ${
                    isLocked ? 'blur-[1.5px] pointer-events-none' : ''
                  } ${deal.isPick ? 'border-primary ring-1 ring-primary/20' : ''}`}
                >
                  {/* Badges row */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 flex-wrap">
                    {deal.isPick && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-sm whitespace-nowrap animate-pulse">
                        <Sparkles className="h-3 w-3" />
                        PerksNest Pick
                      </span>
                    )}
                    {deal.isPremium && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-5 flex flex-col flex-1 ${deal.isPick || deal.isPremium ? 'pt-12' : 'pt-5'}`}>
                    {/* Logo + Company name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 group-hover:bg-primary/5 transition-colors">
                        <SafeImage 
                          src={deal.logo} 
                          alt={deal.name} 
                          className="w-8 h-8 object-contain" 
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight truncate group-hover:text-primary transition-colors">
                          {deal.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Users className="h-3 w-3 shrink-0" />
                          Used by {deal.memberCount?.toLocaleString() || '0'} members
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                      {deal.description}
                    </p>

                    {/* Deal text - highlighted */}
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 flex-1 mb-3 bg-gray-50 p-3 rounded-lg">
                      {deal.dealText}
                    </p>

                    {/* Savings — emerald, always at bottom */}
                    <div className="pt-3 border-t border-gray-100 mt-auto">
                      <p className="text-sm font-semibold text-emerald-600">
                        Save up to {deal.savings}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Locked Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px] rounded-xl border border-border/50">
                    <div className="bg-background shadow-lg rounded-full p-4 mb-3 border border-border">
                      <Lock className="h-6 w-6 text-foreground" />
                    </div>
                    <Button 
                      className="rounded-full shadow-md hover:scale-105 transition-transform text-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/signup');
                      }}
                    >
                      Sign up to unlock
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {!isAuthenticated && (
           <div className="mt-12 text-center">
              <Button 
                size="lg" 
                className="rounded-full px-8 h-12" 
                onClick={() => navigate('/signup')}
              >
                 See all 100+ deals
              </Button>
           </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDeals;
