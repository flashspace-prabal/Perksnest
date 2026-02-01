import { Check, Crown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const logoIcons = [
  { name: "Notion", bg: "bg-white", initial: "N" },
  { name: "Airtable", bg: "bg-red-500", initial: "A" },
  { name: "Monday", bg: "bg-yellow-400", initial: "M" },
  { name: "Google", bg: "bg-white", initial: "G" },
  { name: "AWS", bg: "bg-orange-500", initial: "A" },
  { name: "Brevo", bg: "bg-blue-600", initial: "B" },
  { name: "Meta", bg: "bg-blue-500", initial: "M" },
];

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  initial: string;
  color: string;
}

interface PricingPlan {
  trustBadge: string;
  trustBadgeColor: string;
  name: string;
  isPremium?: boolean;
  description: string;
  showLogos: boolean;
  extraLogosText?: string;
  price?: string;
  priceSubtext?: string;
  customPriceText?: string;
  cta: string;
  ctaVariant: "default" | "primary" | "outline";
  targetAudience: string;
  targetLinks?: { text: string; href: string }[];
  features: { text: string; bold?: string; text2?: string }[];
  testimonial: Testimonial;
}

const plans: PricingPlan[] = [
  {
    trustBadge: "Trusted by 150,000+ clients",
    trustBadgeColor: "text-muted-foreground",
    name: "Free Access",
    description: "Access over 330 verified deals and discounts at no cost",
    showLogos: true,
    extraLogosText: "+323",
    price: "Free",
    priceSubtext: "Forever",
    cta: "Sign up for free",
    ctaVariant: "default",
    targetAudience: "Tailored for Startups & Agencies",
    features: [
      { text: 'Access all deals that are marked as "free" on our marketplace' },
    ],
    testimonial: {
      name: "Josh Bartolomucci",
      role: "Marketing Manager",
      quote: "\"PerksNest has helped us discover new tools as well as get free usage for tools we already use. It's like free money. Sounds too good to be true, but... it's real!\"",
      initial: "J",
      color: "from-gray-500 to-gray-700",
    },
  },
  {
    trustBadge: "Trusted by 20,000+ clients",
    trustBadgeColor: "text-primary",
    name: "Premium Solution",
    isPremium: true,
    description: "Access all the present and future deals on our marketplace",
    showLogos: true,
    extraLogosText: "+all deals",
    price: "$149",
    priceSubtext: "/ year",
    customPriceText: "cancel anytime",
    cta: "Go Premium",
    ctaVariant: "primary",
    targetAudience: "Tailored for Startups & Agencies",
    features: [
      { text: "Access ", bold: "all the deals", text2: " on our marketplace" },
      { text: "New ", bold: "Premium deals", text2: " each week" },
      { text: "Private community access" },
      { text: "7/7 Premium support" },
    ],
    testimonial: {
      name: "David Stepania",
      role: "Founder at Thirsty Sprout",
      quote: "\"PerksNest is a must join if you'd like to accelerate your companies growth. We've taken advantage of several deals offered by PerksNest some of which can't be found anywhere else!\"",
      initial: "D",
      color: "from-amber-500 to-orange-600",
    },
  },
  {
    trustBadge: "Trusted by 500+ clients",
    trustBadgeColor: "text-primary",
    name: "White Label Solution",
    description: "Empower your community with exclusive deals — all showcased on your own branded white-label platform.",
    showLogos: true,
    extraLogosText: "+all deals",
    customPriceText: "Book a demo and get your custom quote",
    cta: "Contact sales",
    ctaVariant: "outline",
    targetAudience: "",
    targetLinks: [
      { text: "Communities & Content creators", href: "/communities" },
      { text: "Accelerators, Incubators, VCs", href: "/accelerators" },
    ],
    features: [
      { text: "Customized white-label platform" },
      { text: "Unlimited access to all of our deals for your community" },
      { text: "Add your own deals & remove PerksNest's deals" },
      { text: "7/7 Premium support" },
    ],
    testimonial: {
      name: "Mark Kashef",
      role: "Founder of Early AI-dopters",
      quote: "\"By integrating PerksNest as a reward in our gamified community, we boosted conversions, slashed churn, and saw a 60% increase in annual upgrades, with full ROI in under one week!\"",
      initial: "M",
      color: "from-blue-500 to-indigo-600",
    },
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-secondary/30">
      <div className="container-wide">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col"
            >
              {/* Trust Badge */}
              <p className={`text-sm font-medium mb-4 ${plan.trustBadgeColor}`}>
                {plan.trustBadge}
              </p>

              {/* Plan Name */}
              <div className="flex items-center gap-2 mb-3">
                {plan.isPremium && (
                  <Crown className="h-5 w-5 text-foreground" />
                )}
                <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {plan.description}
              </p>

              {/* Logo Stack */}
              {plan.showLogos && (
                <div className="flex items-center gap-1 mb-6">
                  {logoIcons.slice(0, 7).map((logo, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-md ${logo.bg} border border-border flex items-center justify-center text-xs font-bold text-foreground`}
                    >
                      {logo.initial}
                    </div>
                  ))}
                  {plan.extraLogosText && (
                    <span className="text-xs text-muted-foreground ml-1">
                      {plan.extraLogosText}
                    </span>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                {plan.price ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      {plan.priceSubtext && (
                        <span className="text-muted-foreground text-sm">{plan.priceSubtext}</span>
                      )}
                    </div>
                    {plan.customPriceText && (
                      <p className="text-sm text-muted-foreground mt-1">{plan.customPriceText}</p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{plan.customPriceText}</p>
                )}
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full mb-4 ${
                  plan.ctaVariant === "primary"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : plan.ctaVariant === "outline"
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
                size="lg"
              >
                {plan.isPremium && <Crown className="h-4 w-4 mr-2" />}
                {plan.cta}
              </Button>

              {/* Target Audience */}
              {plan.targetAudience && (
                <p className="text-sm text-center text-muted-foreground mb-6">
                  {plan.targetAudience}
                </p>
              )}
              {plan.targetLinks && (
                <div className="text-center space-y-1 mb-6">
                  {plan.targetLinks.map((link, i) => (
                    <Link
                      key={i}
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                    >
                      {link.text}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border my-4" />

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {feature.bold ? (
                        <>
                          {feature.text}
                          <strong className="text-foreground">{feature.bold}</strong>
                          {(feature as any).text2}
                        </>
                      ) : (
                        feature.text
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Testimonial */}
              <div className="bg-secondary/50 rounded-xl p-4 mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${plan.testimonial.color} flex items-center justify-center text-white font-bold`}>
                    {plan.testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{plan.testimonial.name}</p>
                    <p className="text-xs text-primary">{plan.testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {plan.testimonial.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
