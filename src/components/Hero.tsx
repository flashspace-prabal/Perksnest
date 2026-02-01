import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustedLogos = [
  { name: "OpenAI", display: "OpenAI" },
  { name: "Stripe", display: "stripe" },
  { name: "Shopify", display: "Shopify" },
  { name: "Airbnb", display: "airbnb" },
  { name: "Uber", display: "Uber" },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container-wide relative">
        <div className="py-16 md:py-24 lg:py-28">
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-center text-foreground mb-6 animate-fade-in leading-tight max-w-4xl mx-auto">
            Your startup's collective{" "}
            <span className="inline-flex items-center">
              <span className="text-4xl md:text-5xl lg:text-[3.5rem] mx-2">🧠</span>
            </span>{" "}
            for SaaS deals.
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-100">
            Save big and scale faster, with exclusive deals on the best software tools curated just for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in animation-delay-200">
            <Button size="lg" className="text-base gap-2 px-8">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8"
            >
              Find your plan
            </Button>
          </div>

          {/* Trusted By */}
          <div className="text-center animate-fade-in animation-delay-300">
            <p className="text-sm text-muted-foreground mb-6">Trusted by top teams</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {trustedLogos.map((logo) => (
                <span
                  key={logo.name}
                  className="text-lg md:text-xl font-semibold text-foreground/40 hover:text-foreground/60 transition-colors cursor-default"
                >
                  {logo.display}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* App Preview Mockup */}
        <div className="relative max-w-5xl mx-auto mb-[-100px] animate-fade-in-up animation-delay-300">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-card">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background rounded-md px-4 py-1 text-sm text-muted-foreground w-64 text-center">
                  secret.com/deals
                </div>
              </div>
            </div>
            
            {/* Mock Content */}
            <div className="flex min-h-[400px]">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col w-60 bg-primary p-4 text-primary-foreground">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center text-sm font-bold">
                    A
                  </div>
                  <span className="font-semibold">Acme Inc</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary-foreground/10">
                    <span>🏠</span> Home
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-foreground/10">
                    <span>💰</span> My Deals
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-foreground/10">
                    <span>⭐</span> Saved
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary-foreground/10">
                    <span>📊</span> Analytics
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-primary-foreground/20">
                  <p className="text-xs text-primary-foreground/70 mb-2">Categories</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5"># AI Tools</div>
                    <div className="flex items-center gap-2 px-3 py-1.5"># Marketing</div>
                    <div className="flex items-center gap-2 px-3 py-1.5"># Development</div>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 bg-background p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold"># trending-deals</h3>
                  <span className="text-sm text-muted-foreground">542 deals</span>
                </div>
                <div className="space-y-4">
                  {/* Deal Messages */}
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg">📦</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">Notion</span>
                        <span className="text-xs text-muted-foreground">2:34 PM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">6 months free on the Business plan – <span className="text-success font-medium">Save $12,000</span></p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg">💳</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">Stripe</span>
                        <span className="text-xs text-muted-foreground">1:20 PM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Waived fees on $20,000 processing – <span className="text-success font-medium">Save $500</span></p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-lg">☁️</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">Google Cloud</span>
                        <span className="text-xs text-muted-foreground">11:45 AM</span>
                      </div>
                      <p className="text-sm text-muted-foreground">$350,000 in credits for funded startups – <span className="text-success font-medium">Save $350K</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;