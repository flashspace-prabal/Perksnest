import { useState } from "react";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroBanner = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", email);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 pt-12 pb-20">
      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-to-br from-primary/20 via-violet-300/30 to-transparent rounded-tl-[100px] blur-sm" />
      
      <div className="container-wide relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* New badge */}
          <a 
            href="/deals" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background shadow-sm hover:shadow-md transition-shadow mb-8"
          >
            <span className="text-sm font-medium text-muted-foreground">New</span>
            <span className="text-sm text-primary font-medium">11 new perks added this month</span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </a>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            The #1 Perks Platform for Founders
          </h1>

          {/* Subheadline with highlighted amount */}
          <p className="text-xl md:text-2xl text-foreground mb-4">
            Unlock{" "}
            <span className="bg-yellow-300 px-2 py-1 rounded font-bold">
              $3,000,000+
            </span>{" "}
            in exclusive savings from 350+ partners.
          </p>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Discover the ultimate membership tailored for entrepreneurs, businesses, startups, and founders
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Check className="h-5 w-5 text-primary" />
              <span>350+ exclusive perks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Check className="h-5 w-5 text-primary" />
              <span>All directly negotiated by us</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Check className="h-5 w-5 text-primary" />
              <span>Trusted by 100,000+ founders globally</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-4">
            <div className="space-y-3">
              <div className="text-left">
                <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g max@yourbusiness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 text-base bg-background border-border"
                  required
                />
              </div>
              
              <div className="relative">
                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full h-14 text-base font-semibold gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Get your free membership
                  <ArrowRight className="h-5 w-5" />
                </Button>
                
                {/* "it's free" annotation */}
                <div className="absolute -right-16 top-1/2 -translate-y-1/2 hidden lg:flex items-center gap-1">
                  <svg width="40" height="20" viewBox="0 0 40 20" className="text-primary">
                    <path 
                      d="M0 10 Q 10 5 30 15" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path 
                      d="M25 12 L30 15 L28 10" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-primary font-handwriting text-lg italic">it's free</span>
                </div>
              </div>
            </div>
          </form>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className="text-sm text-muted-foreground">Join 100,000+ founders</span>
            
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                J
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                M
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                S
              </div>
            </div>
            
            {/* Star rating */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
