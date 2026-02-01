import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Star, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SafeImage from "@/components/SafeImage";

// Featured deal cards for the hero section
const featuredDeals = [
  { name: "MongoDB", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg", deal: "$500 Free Cloud Credits", subtitle: "The developer data platform", isNew: false, hasTrend: true },
  { name: "Cookiebot", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Cookiebot_logo.svg/512px-Cookiebot_logo.svg.png", deal: "10% off for 6 months", subtitle: "Solutions for cookie consent for websites and apps", isNew: false, hasFlame: true },
  { name: "Google Workspace", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Workspace_icon.svg/512px-Google_Workspace_icon.svg.png", deal: "20% off for 12 months", subtitle: "Everything you need to get anything done, all in one place", isNew: false, hasFlame: true },
  { name: "TikTok for Business", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/512px-TikTok_logo.svg.png", deal: "Up to $6,000 Free", subtitle: "Engage with your audience on TikTok with Ads", isNew: true, hasFlame: false },
  { name: "HubSpot", logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png", deal: "90% off your first year", subtitle: "Leading CRM & Customer Platform", isNew: false, hasFlame: true },
  { name: "Make", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Make_%28formerly_Integromat%29_Logo.png", deal: "12 Months Free", subtitle: "No-code workflow automation", isNew: false, hasFlame: true },
];

const bottomLogos = [
  { name: "GitHub", logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
  { name: "Intercom", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Intercom_logo.svg/512px-Intercom_logo.svg.png" },
  { name: "Asana", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Asana_logo.svg/512px-Asana_logo.svg.png" },
  { name: "Webflow", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Webflow_logo.svg" },
  { name: "Pipedrive", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Pipedrive_Logo.svg/512px-Pipedrive_Logo.svg.png" },
  { name: "Brevo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Brevo_logo.svg/512px-Brevo_logo.svg.png" },
];

const HeroBanner = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Main Hero Content */}
      <div className="py-16 lg:py-20">
        <div className="container-wide relative z-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* New badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-8">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                New
              </span>
              <span className="text-sm text-foreground">
                11 new perks added this month
              </span>
              <ArrowRight className="h-4 w-4 text-foreground" />
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              The #1 Perks Platform for Founders
            </h1>

            {/* Savings highlight - using primary/aubergine color */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Unlock{" "}
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md">
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
                <Check className="h-5 w-5 text-[hsl(145,63%,42%)]" />
                <span>350+ exclusive perks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-5 w-5 text-[hsl(145,63%,42%)]" />
                <span>All directly negotiated by us</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Check className="h-5 w-5 text-[hsl(145,63%,42%)]" />
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
                    className="w-full h-12 text-base bg-card border-border"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full h-14 text-base font-semibold gap-2 bg-foreground text-background hover:bg-foreground/90"
                  >
                    <Sparkles className="h-5 w-5" />
                    Get your free membership
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  
                  {/* "it's free" annotation */}
                  <div className="absolute -right-20 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-1">
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
                    <span className="text-primary font-medium italic text-lg">it's free</span>
                  </div>
                </div>
              </div>
            </form>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <span className="text-sm text-muted-foreground">Join 100,000+ founders</span>
              
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-background flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  <span>👨</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  <span>👨‍🦰</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  <span>👩</span>
                </div>
              </div>
              
              {/* Star rating */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[hsl(43,96%,56%)] text-[hsl(43,96%,56%)]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purple Wave Decoration */}
      <div className="relative">
        <svg 
          viewBox="0 0 1440 120" 
          className="w-full h-20 md:h-28"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" 
            className="fill-primary/30"
          />
          <path 
            d="M0,80 C360,140 720,20 1080,80 C1260,110 1380,100 1440,80 L1440,120 L0,120 Z" 
            className="fill-primary/20"
          />
        </svg>
      </div>

      {/* Floating Deal Cards Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background pb-16 pt-8">
        <div className="container-wide">
          {/* Featured Deal Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {featuredDeals.map((deal, index) => (
              <Link
                key={deal.name}
                to="/deals"
                className="group bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Icon badges */}
                <div className="flex justify-between items-start mb-3">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <SafeImage
                      src={deal.logo}
                      alt={deal.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-1">
                    {deal.isNew && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                    {deal.hasTrend && (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    )}
                    {deal.hasFlame && (
                      <Flame className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
                
                <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1">
                  {deal.deal}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                  {deal.subtitle}
                </p>
                
                <Button 
                  size="sm" 
                  className="w-full mt-3 bg-[hsl(145,63%,42%)] hover:bg-[hsl(145,63%,35%)] text-white text-xs"
                >
                  Get this deal
                </Button>
              </Link>
            ))}
          </div>

          {/* Bottom Logo Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {bottomLogos.map((logo) => (
              <div key={logo.name} className="w-24 h-8">
                <SafeImage
                  src={logo.logo}
                  alt={logo.name}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
