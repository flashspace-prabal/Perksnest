import { Check, Zap, Crown, Building2, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      "Deal bookmarking",
    ],
    cta: "Get started free",
    ctaLink: "/deals",
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
      "Everything in Free, plus:",
      "Access to ALL deals (563+)",
      "New premium deals weekly",
      "Private Slack community",
      "Priority 7/7 support",
      "Deal comparison tools",
      "Advanced analytics",
      "API access",
    ],
    cta: "Upgrade to Pro",
    ctaLink: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with custom requirements",
    price: "Custom",
    period: "",
    icon: Building2,
    features: [
      "Everything in Pro, plus:",
      "White-label platform",
      "Custom deal curation",
      "Dedicated account manager",
      "SSO & advanced security",
      "Custom integrations",
      "SLA guarantees",
      "Volume discounts",
    ],
    cta: "Contact sales",
    ctaLink: "/contact",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "What's included in the free plan?",
    answer: "The free plan gives you access to 324+ verified free deals from top SaaS companies. You can bookmark deals, receive basic notifications, and access our community support. No credit card required.",
  },
  {
    question: "How does the Pro plan work?",
    answer: "Pro gives you unlimited access to all 563+ deals on our platform, including premium deals that can save you up to $350,000. You also get priority support, access to our private Slack community, and advanced features like deal comparison.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes! You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period. We also offer a 7-day money-back guarantee if you're not satisfied.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), as well as PayPal. For Enterprise plans, we also support invoicing and wire transfers.",
  },
  {
    question: "Do deals expire?",
    answer: "Each deal has its own terms and expiration dates. We keep all deals up-to-date and remove expired offers. Most deals are available on an ongoing basis, while some are limited-time offers.",
  },
  {
    question: "How do I redeem a deal?",
    answer: "Simply click on any deal to see the redemption instructions. Most deals involve clicking through to the vendor's website with a special link or promo code that we provide. The process typically takes less than 5 minutes.",
  },
  {
    question: "What if a deal doesn't work?",
    answer: "Contact our support team and we'll help you resolve the issue. If a deal is no longer valid, we'll remove it from the platform and help you find alternatives. Pro members get priority support with faster response times.",
  },
  {
    question: "Is there a referral program?",
    answer: "Yes! Share PerksNest with friends and earn $20 credit for every person who upgrades to Pro. Your friends also get $20 off their first year. Check out our Invite page for your unique referral link.",
  },
];

const comparisonFeatures = [
  { feature: "Free deals access", free: "324+", pro: "563+", enterprise: "563+" },
  { feature: "Premium deals", free: false, pro: true, enterprise: true },
  { feature: "Deal notifications", free: "Basic", pro: "Priority", enterprise: "Custom" },
  { feature: "Support", free: "Community", pro: "7/7 Priority", enterprise: "Dedicated" },
  { feature: "Private Slack community", free: false, pro: true, enterprise: true },
  { feature: "Deal comparison tools", free: false, pro: true, enterprise: true },
  { feature: "Analytics dashboard", free: false, pro: true, enterprise: true },
  { feature: "API access", free: false, pro: true, enterprise: true },
  { feature: "White-label platform", free: false, pro: false, enterprise: true },
  { feature: "Custom integrations", free: false, pro: false, enterprise: true },
  { feature: "SSO", free: false, pro: false, enterprise: true },
  { feature: "Dedicated account manager", free: false, pro: false, enterprise: true },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="py-16 md:py-24 gradient-hero">
          <div className="container-wide">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Simple, transparent pricing
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Start for free, upgrade when you're ready. Save thousands on the tools your startup needs.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 -mt-8">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                
                return (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl p-8 transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground scale-[1.02] shadow-2xl ring-4 ring-primary/20"
                        : "bg-card border border-border hover:border-primary/30 hover:shadow-lg"
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

                    <Link to={plan.ctaLink}>
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
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 bg-card">
          <div className="container-wide">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Compare plans
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Feature</th>
                    <th className="text-center py-4 px-4 font-semibold">Free</th>
                    <th className="text-center py-4 px-4 font-semibold bg-primary/5 rounded-t-lg">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={row.feature} className={index % 2 === 0 ? "bg-secondary/30" : ""}>
                      <td className="py-4 px-4 text-sm">{row.feature}</td>
                      <td className="text-center py-4 px-4">
                        {typeof row.free === "boolean" ? (
                          row.free ? <Check className="h-5 w-5 text-success mx-auto" /> : <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-sm">{row.free}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4 bg-primary/5">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? <Check className="h-5 w-5 text-success mx-auto" /> : <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-sm font-medium">{row.pro}</span>
                        )}
                      </td>
                      <td className="text-center py-4 px-4">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? <Check className="h-5 w-5 text-success mx-auto" /> : <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-sm">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <HelpCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold">Frequently asked questions</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-xl px-6"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="container-wide">
            <div className="text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to start saving?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join 212,000+ startups already saving millions on SaaS tools.
              </p>
              <Link to="/deals">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2">
                  Explore deals
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;