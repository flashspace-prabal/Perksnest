import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "212,980+", label: "Businesses" },
  { value: "$5.4B+", label: "Total Savings" },
  { value: "975", label: "SaaS Companies" },
  { value: "563+", label: "Deals Available" },
];

const popularSearches = ["Notion", "Stripe", "Google Cloud", "Make", "HubSpot", "Slack"];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/50 via-background to-background" />
      
      <div className="container-wide relative">
        <div className="py-16 md:py-24 lg:py-32">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <span className="badge-pick">
              🎉 Over 324 Free Deals Available
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-foreground mb-6 animate-fade-in animation-delay-100">
            The Secret to{" "}
            <span className="text-primary">save big</span> on SaaS
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-200">
            Access exclusive deals on the best software tools. Join 212,000+ businesses 
            saving millions on SaaS subscriptions.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 animate-fade-in animation-delay-300">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for deals (e.g., Notion, Stripe, AWS...)"
                className="w-full pl-14 pr-36 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-lg"
              />
              <Button 
                className="absolute right-2 top-1/2 -translate-y-1/2"
                size="lg"
              >
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-2 mb-16 animate-fade-in animation-delay-300">
            <span className="text-sm text-muted-foreground mr-2">Popular:</span>
            {popularSearches.map((search) => (
              <button
                key={search}
                className="px-3 py-1.5 text-sm rounded-full border border-border bg-card hover:bg-muted hover:border-primary/30 text-muted-foreground hover:text-foreground transition-all"
              >
                {search}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="stat-value text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};

export default Hero;