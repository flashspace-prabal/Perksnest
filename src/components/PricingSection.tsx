import { Check, Crown, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free Access",
    description: "For Startups, Entrepreneurs & Agencies",
    price: "$0",
    period: "Forever",
    icon: Zap,
    features: [
      "Access to 324 verified free deals",
      "No credit card required",
      "Permanent free access",
      "Community support",
      "Basic deal notifications",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Premium",
    description: "For Startups, Entrepreneurs & Agencies",
    price: "$149",
    period: "/year",
    originalPrice: "$213",
    icon: Crown,
    features: [
      "Access all present and future deals",
      "New premium deals each week",
      "Private community access",
      "7/7 Premium support",
      "Priority notifications",
      "Deal comparison tools",
      "Cancel anytime",
    ],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    name: "White Label",
    description: "For Communities, Accelerators & VCs",
    price: "Custom",
    period: "",
    icon: Building2,
    features: [
      "Customized white-label platform",
      "Unlimited access for your community",
      "Add your own deals",
      "7/7 Premium support",
      "Full branding customization",
      "Partner-level integrations",
      "Dedicated account manager",
    ],
    cta: "Book a Demo",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge-pick mb-4 inline-block">Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to our curated SaaS deals.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground scale-105 shadow-2xl"
                    : "bg-card border border-border hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.highlighted ? "bg-primary-foreground/20" : "bg-muted"
                  }`}>
                    <Icon className={`h-6 w-6 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{plan.name}</h3>
                    <p className={`text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className={`text-sm mt-1 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      <span className="line-through">{plan.originalPrice}</span> with 30% off
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-primary-foreground" : "text-primary"
                      }`} />
                      <span className={`text-sm ${plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : ""
                  }`}
                  variant={plan.highlighted ? "secondary" : "default"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;