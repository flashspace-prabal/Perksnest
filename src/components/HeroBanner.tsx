import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroBanner = () => {
  // Trusted by logos
  const trustedLogos = [
    "MetLife", "Ramp", "Marriott", "Figma", "Woo", "Vercel", "Uber", "Anthropic"
  ];

  return (
    <section className="relative overflow-hidden bg-background min-h-[600px] lg:min-h-[700px]">
      {/* Abstract Blob - CSS-based with soothing colors */}
      <div className="absolute top-0 right-0 w-[60%] h-full hidden lg:block pointer-events-none" aria-hidden="true">
        {/* Main aubergine blob - keeping this prominent */}
        <div 
          className="absolute -top-20 -right-20 w-[700px] h-[700px] rounded-[40%_60%_55%_45%/55%_45%_55%_45%] bg-primary/75"
          style={{ transform: 'rotate(-15deg)' }}
        />
        {/* Soft lavender blob */}
        <div 
          className="absolute top-10 right-10 w-[600px] h-[600px] rounded-[45%_55%_50%_50%/50%_50%_55%_45%]"
          style={{ 
            transform: 'rotate(-25deg)',
            backgroundColor: 'hsl(270 30% 85% / 0.6)'
          }}
        />
        {/* Warm cream/beige blob */}
        <div 
          className="absolute top-40 right-0 w-[550px] h-[550px] rounded-[50%_50%_45%_55%/45%_55%_50%_50%]"
          style={{ 
            transform: 'rotate(-10deg)',
            backgroundColor: 'hsl(40 40% 90% / 0.7)'
          }}
        />
        {/* Soft blush/rose blob */}
        <div 
          className="absolute top-60 right-20 w-[450px] h-[450px] rounded-[55%_45%_50%_50%/50%_50%_45%_55%]"
          style={{ 
            transform: 'rotate(5deg)',
            backgroundColor: 'hsl(350 40% 88% / 0.6)'
          }}
        />
        {/* Light sage/muted green blob */}
        <div 
          className="absolute top-20 right-40 w-[400px] h-[400px] rounded-[48%_52%_55%_45%/52%_48%_50%_50%]"
          style={{ 
            transform: 'rotate(-20deg)',
            backgroundColor: 'hsl(150 20% 88% / 0.5)'
          }}
        />
      </div>
      
      {/* Fade overlay for smooth blend */}
      <div 
        className="absolute top-0 right-0 w-[60%] h-full hidden lg:block pointer-events-none"
        style={{
          background: 'linear-gradient(to right, hsl(45 33% 97%) 0%, transparent 20%)',
        }}
        aria-hidden="true"
      />

      {/* Main Hero Content */}
      <div className="container-wide relative z-20 py-20 lg:py-28">
        <div className="max-w-xl">
          {/* Top badge */}
          <p className="text-muted-foreground text-sm mb-6 animate-fade-in">
            Global founders using PerksNest: <span className="text-primary font-semibold">100,000+</span>
          </p>

          {/* Main headline with solid colors */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-6 animate-fade-in animation-delay-100">
            Perks infrastructure to{" "}
            <br className="hidden sm:block" />
            <span className="text-primary">grow your </span>
            <span className="text-slack-red">startup.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed animate-fade-in animation-delay-200">
            Access exclusive deals, unlock savings, and scale faster—from your first tool to your hundredth.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-8 animate-fade-in animation-delay-300">
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
          <div className="flex flex-wrap items-center gap-6 animate-fade-in animation-delay-300">
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
