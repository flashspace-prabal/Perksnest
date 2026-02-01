import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/SafeImage";

// Floating brand logos for hero
const leftLogos = [
  { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg", size: "w-12 h-12" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", size: "w-16 h-16" },
  { name: "Zendesk", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Zendesk_logo.svg", size: "w-14 h-14" },
  { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", size: "w-10 h-10" },
  { name: "Airtable", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg", size: "w-12 h-12" },
];

const rightLogos = [
  { name: "Intercom", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Intercom_logo.svg", size: "w-12 h-12" },
  { name: "Twilio", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Twilio-logo-red.svg", size: "w-14 h-14" },
  { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", size: "w-12 h-12" },
  { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", size: "w-14 h-14" },
  { name: "HubSpot", logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png", size: "w-10 h-10" },
];

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      {/* Left Floating Logos */}
      <div className="absolute left-8 lg:left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 items-center">
        {leftLogos.map((logo, i) => (
          <div
            key={logo.name}
            className={`${logo.size} opacity-60 hover:opacity-100 transition-opacity duration-300`}
            style={{
              transform: `translateX(${i % 2 === 0 ? '20px' : '-10px'})`,
              animationDelay: `${i * 100}ms`
            }}
          >
            <SafeImage
              src={logo.logo}
              alt={logo.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Right Floating Logos */}
      <div className="absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8 items-center">
        {rightLogos.map((logo, i) => (
          <div
            key={logo.name}
            className={`${logo.size} opacity-60 hover:opacity-100 transition-opacity duration-300`}
            style={{
              transform: `translateX(${i % 2 === 0 ? '-20px' : '10px'})`,
              animationDelay: `${i * 100}ms`
            }}
          >
            <SafeImage
              src={logo.logo}
              alt={logo.name}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Center Content */}
      <div className="container-wide relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Top deals for founders
          </h1>

          {/* Highlighted amount */}
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-6">
            Get USD 250,000<br />
            in Credits & Perks
          </p>

          {/* Description */}
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Affording SaaS resources and tools is tough for startups early on. This fixes it.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Join the Club
          </Button>

          {/* Secondary Link */}
          <div className="mt-6">
            <Link 
              to="/deals"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Explore Perks
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Logos Row */}
      <div className="md:hidden mt-12 overflow-x-auto">
        <div className="flex items-center justify-center gap-6 px-4">
          {[...leftLogos.slice(0, 3), ...rightLogos.slice(0, 3)].map((logo) => (
            <div key={logo.name} className="w-10 h-10 shrink-0 opacity-60">
              <SafeImage
                src={logo.logo}
                alt={logo.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
