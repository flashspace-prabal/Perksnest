import { ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-primary to-primary/80" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container-wide relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/20 mb-8">
            <Gift className="h-8 w-8 text-primary-foreground" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Start saving on SaaS today
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join 212,000+ businesses who are already saving millions with Secret. 
            Access 324+ free deals instantly.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 text-base"
            >
              Explore Free Deals
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground gap-2 text-base"
            >
              Go Premium - $149/year
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-primary-foreground/60 text-sm mt-8">
            No credit card required • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;