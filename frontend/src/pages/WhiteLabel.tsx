import { Globe, Shield, BarChart3, Users, Palette, Settings, Check, ChevronDown, Rocket, Building2, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const stats = [
  { value: "500+", label: "Exclusive Deals" },
  { value: "150K+", label: "Active Members" },
  { value: "$50K", label: "Average Savings" },
];

const steps = [
  {
    number: "1",
    title: "Choose Your Deals",
    description: "Select from our curated library of 500+ exclusive SaaS deals or let us manage the entire catalog for you",
  },
  {
    number: "2",
    title: "White-Label Setup",
    description: "We customize the platform with your branding, domain, and SSO integration",
  },
  {
    number: "3",
    title: "Launch & Support",
    description: "Go live in days with ongoing support and regular deal updates from our team",
  },
];

const features = [
  { icon: Globe, title: "Custom Domain", description: "Host the platform on your own domain with full SSL support and custom branding" },
  { icon: Shield, title: "SSO Integration", description: "Seamlessly integrate with your existing authentication system using SAML or OAuth" },
  { icon: Settings, title: "Deal Curation", description: "Choose which deals to feature or let our team handle curation based on your audience" },
  { icon: Users, title: "Team Management", description: "Manage user access, permissions, and member onboarding with built-in admin tools" },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Track engagement, popular deals, and ROI with comprehensive analytics and reporting" },
  { icon: Palette, title: "White-Label Branding", description: "Fully customize colors, logos, and messaging to match your brand identity" },
];

const audiences = [
  {
    icon: Rocket,
    title: "VCs & Accelerators",
    description: "Provide immediate value to your portfolio companies with exclusive deals that help them scale faster and save on tools they need.",
    bullets: ["Differentiate your program", "Increase portfolio success", "Track engagement metrics"],
  },
  {
    icon: Building2,
    title: "Communities & DAOs",
    description: "Monetize your community and add member value with exclusive perks that drive engagement and retention.",
    bullets: ["New revenue stream", "Boost member engagement", "Strengthen community value"],
  },
  {
    icon: Heart,
    title: "Enterprise HR",
    description: "Enhance your employee benefits package with valuable SaaS deals that improve productivity and satisfaction.",
    bullets: ["Attract top talent", "Improve employee satisfaction", "Cost-effective benefits"],
  },
];

const pricingFeatures = [
  "Full white-label customization",
  "Access to 500+ SaaS deals",
  "Custom domain & SSO",
  "Advanced analytics dashboard",
  "Dedicated account manager",
  "Priority support (SLA)",
  "Regular deal updates",
];

const faqs = [
  {
    question: "How long does setup take?",
    answer: "Most white-label implementations are live within 5-7 business days. Our team handles all the technical setup, customization, and testing to ensure a smooth launch.",
  },
  {
    question: "What does white-label pricing include?",
    answer: "Pricing includes full platform access, custom branding, SSO integration, dedicated support, and ongoing deal curation. We tailor pricing based on your community size and requirements.",
  },
  {
    question: "Can we choose which deals to offer?",
    answer: "Absolutely! You can curate the deal catalog to match your audience's needs, or let our team handle curation based on your community profile.",
  },
  {
    question: "How does the integration work?",
    answer: "We support SAML and OAuth SSO integration, custom domain mapping, and API access for deeper integrations with your existing tools and workflows.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "Enterprise clients receive a dedicated account manager, priority support with SLA guarantees, and regular check-ins to optimize deal performance and engagement.",
  },
];

const WhiteLabel = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleBookDemo = () => {
    window.location.href = 'mailto:sales@perksnest.co?subject=White-Label%20Platform%20Demo%20Request&body=I%20am%20interested%20in%20learning%20more%20about%20the%20PerksNest%20white-label%20platform.';
  };

  const handleSeeHowWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSales = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero — clean, flat, text-focused */}
      <section className="bg-primary">
        <div className="container-wide py-20 md:py-28 lg:py-32 text-center">
          <p className="text-sm font-semibold text-primary-foreground/60 uppercase tracking-widest mb-6 animate-fade-in">
            White-Label Platform
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-primary-foreground mb-6 animate-fade-in leading-tight max-w-3xl mx-auto">
            Power your community with exclusive SaaS deals
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-100">
            Offer 500+ exclusive SaaS deals to your portfolio companies, community members, or employees with our white-label platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14 animate-fade-in animation-delay-200">
            <Button size="lg" onClick={handleBookDemo} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 text-base gap-2">
              Book a Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" onClick={handleSeeHowWorks} variant="outline" className="border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-base">
              See How It Works
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 animate-fade-in animation-delay-300">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <div className="text-center px-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/60 mt-1">{stat.label}</div>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden md:block w-px h-12 bg-primary-foreground/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-background">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get your white-label perks platform up and running in days, not months
            </p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Connecting line — simple solid */}
            <div className="hidden md:block absolute top-7 left-[20%] right-[20%] h-px bg-border" />
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="relative z-10 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Enterprise-Grade Features</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to deliver value to your community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border/60 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                <CardContent className="pt-8 pb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center mb-5">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Who Is This For?</h2>
            <p className="text-muted-foreground text-lg">Trusted by leading organizations worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audiences.map((audience) => (
              <Card key={audience.title} className="border-border/60 hover:shadow-card-hover transition-all duration-200 overflow-hidden">
                <div className="h-1 bg-primary" />
                <CardContent className="pt-8 pb-8">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                    <audience.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{audience.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{audience.description}</p>
                  <ul className="space-y-2.5">
                    {audience.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-2.5 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 bg-secondary/40">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pricing</h2>
            <p className="text-muted-foreground text-lg">Tailored to your organization's needs</p>
          </div>
          <div className="max-w-lg mx-auto">
            <Card className="border-primary/30 shadow-lg overflow-hidden">
              <div className="h-1 bg-primary" />
              <CardContent className="pt-10 pb-10 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-2">Enterprise</h3>
                <div className="text-4xl font-extrabold text-primary mb-2">Custom Pricing</div>
                <p className="text-muted-foreground mb-8">Based on your community size and requirements</p>
                <ul className="space-y-3 text-left mb-10 max-w-xs mx-auto">
                  {pricingFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-foreground">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button size="lg" onClick={handleBookDemo} className="w-full py-6 text-base font-semibold gap-2">
                  Book a Demo
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-border/60">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 border-t border-border/50">
                    <p className="text-muted-foreground leading-relaxed pt-4">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — clean solid bg */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto mb-10">
            Join 500+ organizations delivering value to their communities with our white-label platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleBookDemo} className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-8 py-6 text-base gap-2">
              Book a Demo
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" onClick={handleContactSales} variant="outline" className="border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-semibold px-8 py-6 text-base">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WhiteLabel;
