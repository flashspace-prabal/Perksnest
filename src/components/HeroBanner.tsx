import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
  // Trusted by logos
  const trustedLogos = [
    "MetLife", "Ramp", "Marriott", "Figma", "Woo", "Vercel", "Uber", "Anthropic"
  ];

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Main Hero Content */}
      <div className="container-wide relative z-20 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            {/* Top badge */}
            <p className="text-muted-foreground text-sm mb-6">
              Global founders using PerksNest: <span className="text-primary font-semibold">100,000+</span>
            </p>

            {/* Main headline with gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6">
              Perks infrastructure{" "}
              <span className="bg-gradient-to-r from-primary via-[hsl(270,60%,50%)] to-[hsl(350,80%,60%)] bg-clip-text text-transparent">
                to grow your startup.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
              Access exclusive deals, unlock savings, and scale faster—from your first tool to your hundredth.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Button 
                size="lg" 
                className="h-12 px-6 text-base font-semibold gap-2 rounded-full"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="h-12 px-6 text-base font-medium gap-2 rounded-full border-border hover:bg-secondary"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>350+ exclusive perks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>All directly negotiated</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Trusted globally</span>
              </div>
            </div>
          </div>

          {/* Right Side - Abstract Gradient Blob */}
          <div className="hidden lg:flex justify-end items-center relative">
            <div className="relative w-[500px] h-[500px]">
              {/* Main blob */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, hsl(270 60% 85% / 0.8) 0%, hsl(320 70% 80% / 0.7) 40%, hsl(30 80% 75% / 0.8) 100%)",
                  filter: "blur(2px)",
                }}
              />
              {/* Inner lighter blob */}
              <div 
                className="absolute inset-8 rounded-full"
                style={{
                  background: "linear-gradient(180deg, hsl(280 50% 92% / 0.9) 0%, hsl(320 60% 88% / 0.7) 50%, hsl(30 70% 85% / 0.6) 100%)",
                  filter: "blur(1px)",
                }}
              />
              {/* Innermost glow */}
              <div 
                className="absolute inset-20 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(0 0% 100% / 0.6) 0%, transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="border-t border-border bg-background py-8">
        <div className="container-wide">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustedLogos.map((logo) => (
              <span 
                key={logo}
                className="text-muted-foreground font-medium text-sm md:text-base tracking-wide hover:text-foreground transition-colors cursor-default"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
