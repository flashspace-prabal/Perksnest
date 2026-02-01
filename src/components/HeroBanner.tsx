import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SafeImage from "@/components/SafeImage";

// Floating brand logos for hero - bigger sizes
const leftLogos = [
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", size: "w-16 h-16", delay: "0s" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", size: "w-24 h-24", delay: "0.5s" },
  { name: "Zendesk", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Zendesk_logo.svg", size: "w-20 h-20", delay: "1s" },
  { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", size: "w-16 h-16", delay: "1.5s" },
  { name: "Airtable", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg", size: "w-20 h-20", delay: "2s" },
];

const rightLogos = [
  { name: "Intercom", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Intercom_logo.svg", size: "w-16 h-16", delay: "0.3s" },
  { name: "Twilio", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg", size: "w-20 h-20", delay: "0.8s" },
  { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", size: "w-16 h-16", delay: "1.3s" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", size: "w-24 h-24", delay: "1.8s" },
  { name: "HubSpot", logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png", size: "w-14 h-14", delay: "2.3s" },
];

const HeroBanner = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5 py-16 lg:py-24">
      {/* Decorative Purple Diagonal Shapes */}
      <div className="absolute bottom-0 right-0 w-full h-[300px] pointer-events-none overflow-hidden">
        {/* Back shape */}
        <div 
          className="absolute bottom-0 right-0 w-[700px] h-[200px] bg-primary/10 origin-bottom-right"
          style={{
            transform: 'skewY(-6deg) translateY(50px)',
          }}
        />
        {/* Front shape */}
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[180px] bg-primary/15 origin-bottom-right"
          style={{
            transform: 'skewY(-6deg) translateY(80px)',
          }}
        />
      </div>

      {/* Left Floating Logos - Bigger and Visible */}
      <div className="absolute left-4 lg:left-12 xl:left-20 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 items-center z-20">
        {leftLogos.map((logo, i) => (
          <div
            key={logo.name}
            className={`${logo.size} animate-float drop-shadow-lg hover:scale-110 transition-transform duration-300`}
            style={{
              transform: `translateX(${i % 2 === 0 ? '30px' : '-15px'})`,
              animationDelay: logo.delay,
            }}
          >
            <SafeImage
              src={logo.logo}
              alt={logo.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Right Floating Logos - Bigger and Visible */}
      <div className="absolute right-4 lg:right-12 xl:right-20 top-1/3 -translate-y-1/2 hidden lg:flex flex-col gap-6 items-center z-20">
        {rightLogos.map((logo, i) => (
          <div
            key={logo.name}
            className={`${logo.size} animate-float drop-shadow-lg hover:scale-110 transition-transform duration-300`}
            style={{
              transform: `translateX(${i % 2 === 0 ? '-30px' : '15px'})`,
              animationDelay: logo.delay,
            }}
          >
            <SafeImage
              src={logo.logo}
              alt={logo.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Center Content */}
      <div className="container-wide relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main headline with mixed weight */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            <span className="font-bold">Top deals</span>{" "}
            <span className="font-normal">for</span>{" "}
            <span className="font-bold">founders</span>
          </h1>

          {/* Highlighted amount */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6">
            Get USD 250,000<br />
            in Credits & Perks
          </p>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Affording SaaS resources and tools is tough for startups early on. This fixes it.
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

          {/* Social Proof - Join founders with avatars and stars */}
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

      {/* Mobile Logos Row */}
      <div className="lg:hidden mt-12 overflow-x-auto">
        <div className="flex items-center justify-center gap-6 px-4">
          {[...leftLogos.slice(0, 3), ...rightLogos.slice(0, 3)].map((logo) => (
            <div key={logo.name} className="w-12 h-12 shrink-0 animate-float" style={{ animationDelay: logo.delay }}>
              <SafeImage
                src={logo.logo}
                alt={logo.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
