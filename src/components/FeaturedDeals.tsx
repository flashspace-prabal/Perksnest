import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Crown, Sparkles, Lock } from "lucide-react";
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
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Deals Available Right Now
          </h2>
          <p className="text-muted-foreground text-lg">
            A sneak peek at some of the world-class tools you can save on. Join thousands of founders already saving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayDeals.map((deal, index) => {
            // Lock the last 3 deals if not authenticated
            const isLocked = !isAuthenticated && index >= 3;

            return (
              <div key={deal.id} className="relative group">
                {/* The Card */}
                <Link
                  to={isLocked ? '/signup' : `/deals/${deal.id}`}
                  className={`block h-full bg-card rounded-xl border p-6 transition-all duration-300 ${isLocked ? 'blur-[1.5px]' : 'hover:shadow-lg hover:border-primary/30'} ${deal.isPick ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}
                >
                  {deal.isPick && (
                    <div className="absolute -top-3 right-4 z-10">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full shadow-sm">
                        <Sparkles className="h-3 w-3" />
                        PerksNest Pick
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center p-2 border border-border">
                       <SafeImage src={deal.logo} alt={deal.name} className="w-10 h-10 object-contain" loading="lazy" />
                    </div>
                    {deal.isPremium && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-muted-foreground text-xs font-medium rounded-md">
                        <Crown className="h-3 w-3" />
                        Premium
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {deal.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                    {deal.description}
                  </p>

                  <div className="bg-secondary/50 rounded-lg p-3 mb-4">
                    <p className="font-medium text-foreground text-sm line-clamp-2">
                       {deal.dealText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                     <span className="text-sm font-semibold text-success">
                       Save up to {deal.savings}
                     </span>
                     <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:underline">
                        Claim Deal <ArrowUpRight className="h-4 w-4" />
                     </span>
                  </div>
                </Link>

                {/* Locked Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[1px] rounded-xl border border-border/50">
                    <div className="bg-background shadow-lg rounded-full p-4 mb-4 border border-border">
                      <Lock className="h-6 w-6 text-foreground" />
                    </div>
                    <Button 
                      className="rounded-full shadow-md hover:scale-105 transition-transform"
                      onClick={() => navigate('/signup')}
                    >
                      Sign up free to unlock
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {!isAuthenticated && (
           <div className="mt-12 text-center">
              <Button size="lg" className="rounded-full px-8 h-12" onClick={() => navigate('/signup')}>
                 See all 100+ deals
              </Button>
           </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDeals;
