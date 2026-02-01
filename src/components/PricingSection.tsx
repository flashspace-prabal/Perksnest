import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    description: "For individuals and small teams getting started",
    price: "$0",
    period: "forever",
    icon: Zap,
    features: [
      "Access to 324 free deals",
      "Basic deal notifications",
      "Community support",
      "No credit card required",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For growing startups ready to scale faster",
    price: "$149",
    period: "/year",
    originalPrice: "$213",
    icon: Crown,
    features: [
      "All free features, plus:",
      "Access to ALL deals (563+)",
      "New premium deals weekly",
      "Private Slack community",
      "Priority 7/7 support",
      "Deal comparison tools",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with custom requirements",
    price: "Custom",
    period: "",
    icon: Building2,
    features: [
      "All Pro features, plus:",
      "White-label platform",
      "Custom deal curation",
      "Dedicated account manager",
      "SSO & advanced security",
      "API access",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-card">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find your plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free, upgrade when you're ready. All plans include access to our curated SaaS deals.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground scale-[1.02] shadow-2xl ring-4 ring-primary/20"
                    : "bg-background border border-border hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-slack-yellow text-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    plan.highlighted ? "bg-primary-foreground/20" : "bg-secondary"
                  }`}>
                    <Icon className={`h-6 w-6 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{plan.name}</h3>
                  </div>
                </div>

                <p className={`text-sm mb-6 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <div className={`text-sm mt-1 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      <span className="line-through">{plan.originalPrice}</span> – save 30%
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-primary-foreground" : "text-success"
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
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
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