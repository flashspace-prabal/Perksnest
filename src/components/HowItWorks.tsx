import { UserPlus, Search, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HowItWorks = () => {
  const navigate = useNavigate();
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up Free",
      description: "Create an account in seconds—no credit card required.",
    },
    {
      icon: Search,
      title: "Browse & Claim Deals",
      description: "Find the exact tools you need and instantly claim discounts.",
    },
    {
      icon: TrendingUp,
      title: "Save on Your Stack",
      description: "Save up to $50,000 on software and redirect cash to growth.",
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container-wide">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-muted-foreground text-lg">
            How does it work? Sign up, find your stack, and unlock thousands in savings instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative flex flex-col items-center text-center group">
                {/* Connector Line (Desktop Only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-border/60 -z-10 group-hover:bg-primary/20 transition-colors" />
                )}
                
                {/* Step Circle */}
                <div className="relative w-20 h-20 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-primary transition-all duration-300 z-10">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                    {index + 1}
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed balance-text">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-16 text-center">
          <Button
            size="lg"
            className="h-14 px-10 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all group"
            onClick={() => navigate('/signup')}
          >
            Start Saving Now
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Join 5,000+ founders today. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
