import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-primary">
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/5" />

      <div className="container-wide relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join 100,000+ startups already saving millions with PerksNest. Start free today.
          </p>

          {/* CTAs - Responsive Stacking */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 text-base px-8 h-12 sm:h-14 w-full sm:w-auto"
              onClick={() => navigate('/signup')}
            >
              Sign Up Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2 text-base px-8 h-12 sm:h-14 w-full sm:w-auto"
              onClick={() => navigate('/deals')}
            >
              Browse 100+ Deals
            </Button>
          </div>

          {/* Trust Badge */}
          <p className="text-primary-foreground/60 text-sm mt-10">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;