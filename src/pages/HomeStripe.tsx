import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, ChevronDown, Menu, X } from "lucide-react";
import {
  getMostPopularDeals, 
  getFreeDeals, 
  getRecentlyAddedDeals,
} from "@/data/deals";

// Stripe Header Component
const StripeHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/h1" className="text-[#635bff] font-bold text-2xl tracking-tight">
              perksnest
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/deals" className="flex items-center gap-1 px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
                Products
                <ChevronDown className="h-4 w-4" />
              </Link>
              <Link to="/deals" className="flex items-center gap-1 px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
                Solutions
                <ChevronDown className="h-4 w-4" />
              </Link>
              <Link to="/deals" className="flex items-center gap-1 px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
                Developers
                <ChevronDown className="h-4 w-4" />
              </Link>
              <Link to="/deals" className="flex items-center gap-1 px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
                Resources
                <ChevronDown className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden lg:block px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors font-medium">
              H1
            </Link>
            <Link 
              to="/deals" 
              className="hidden md:block px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              to="/deals"
              className="hidden md:flex items-center gap-1 px-4 py-2 bg-[#635bff] hover:bg-[#5851ea] text-white text-[15px] font-medium rounded-full transition-colors"
            >
              Contact sales
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <div className="flex flex-col gap-2">
              <Link to="/deals" className="px-3 py-2 text-gray-600 hover:text-gray-900">Products</Link>
              <Link to="/deals" className="px-3 py-2 text-gray-600 hover:text-gray-900">Solutions</Link>
              <Link to="/pricing" className="px-3 py-2 text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link to="/" className="px-3 py-2 text-gray-600 hover:text-gray-900 font-medium">H1</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Stripe Hero Component
const StripeHero = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-20 lg:pt-12 lg:pb-32">
      {/* Gradient Wave Background */}
      <div className="absolute top-0 right-0 w-3/4 h-full pointer-events-none overflow-hidden">
        <svg viewBox="0 0 800 800" className="absolute -right-40 top-0 w-[900px] h-[900px]">
          <defs>
            <linearGradient id="stripe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#80e9ff" />
              <stop offset="25%" stopColor="#a960ee" />
              <stop offset="50%" stopColor="#ff6b6b" />
              <stop offset="75%" stopColor="#ffbe0b" />
              <stop offset="100%" stopColor="#80e9ff" />
            </linearGradient>
          </defs>
          <path 
            d="M400,100 C550,100 700,200 750,350 C800,500 700,650 550,700 C400,750 250,700 150,550 C50,400 100,200 250,100 C350,30 400,100 400,100" 
            fill="url(#stripe-gradient)" 
            opacity="0.6"
          />
          <path 
            d="M450,150 C600,180 720,280 750,420 C780,560 680,680 520,720 C360,760 200,680 120,520 C40,360 100,200 260,140 C380,90 450,150 450,150" 
            fill="url(#stripe-gradient)" 
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          {/* Stats Badge */}
          <p className="text-sm text-gray-500 mb-6">
            Global founders using PerksNest: <span className="text-[#635bff] font-medium">100,000+</span>
          </p>

          {/* Main Headline with gradient text */}
          <h1 className="text-5xl md:text-6xl lg:text-[68px] font-semibold leading-[1.1] tracking-tight mb-6">
            <span className="text-gray-900">Perks infrastructure </span>
            <span className="bg-gradient-to-r from-[#635bff] via-[#a960ee] to-[#ff6b6b] bg-clip-text text-transparent">
              to grow your startup.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-xl">
            Access exclusive deals, unlock savings, and scale faster—from your first tool to your hundredth.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link 
              to="/deals"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#635bff] hover:bg-[#5851ea] text-white font-medium rounded-full transition-colors"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-full transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#635bff]" />
              <span>350+ exclusive perks</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#635bff]" />
              <span>All directly negotiated</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#635bff]" />
              <span>Trusted globally</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Trusted By Section
const StripeTrustedBy = () => {
  const logos = ["MetLife", "Ramp", "Marriott", "Figma", "Woo", "Vercel", "Uber", "Anthropic"];
  
  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {logos.map((logo) => (
            <span key={logo} className="text-lg font-semibold text-gray-400 hover:text-gray-500 transition-colors">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// Section Header Component
const StripeSectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-12">
    <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
      <span className="text-gray-900">{title.split(" ").slice(0, -2).join(" ")} </span>
      <span className="text-gray-400">{title.split(" ").slice(-2).join(" ")}</span>
    </h2>
    <p className="text-lg text-gray-500 max-w-2xl">{subtitle}</p>
  </div>
);

// Deal Card Component (Stripe style)
const StripeDealCard = ({ deal }: { deal: any }) => (
  <Link 
    to={`/deals/${deal.id}`}
    className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
  >
    <div className="flex items-start gap-4 mb-4">
      <img 
        src={deal.logo} 
        alt={deal.name}
        className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-2"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-[#635bff] transition-colors">
          {deal.name}
        </h3>
        <p className="text-sm text-gray-500">{deal.category}</p>
      </div>
      {deal.isPremium && (
        <span className="text-xs bg-[#635bff]/10 text-[#635bff] px-2 py-1 rounded-full font-medium">
          Premium
        </span>
      )}
    </div>
    <p className="text-[#635bff] font-medium mb-2">{deal.dealText}</p>
    <p className="text-sm text-gray-500">Save up to {deal.savings}</p>
  </Link>
);

// Deal Carousel Section
const StripeDealSection = ({ title, subtitle, deals }: { title: string; subtitle: string; deals: any[] }) => (
  <section className="py-16 lg:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <StripeSectionHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.slice(0, 8).map((deal) => (
          <StripeDealCard key={deal.id} deal={deal} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link 
          to="/deals" 
          className="inline-flex items-center gap-2 text-[#635bff] font-medium hover:underline"
        >
          View all deals
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

// Categories Section
const StripeCategories = () => {
  const categories = [
    { name: "AI Tools", icon: "✨", count: 45 },
    { name: "Development", icon: "💻", count: 38 },
    { name: "Marketing", icon: "📢", count: 52 },
    { name: "Finance", icon: "💰", count: 28 },
    { name: "Productivity", icon: "⚡", count: 64 },
    { name: "Design", icon: "🎨", count: 31 },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <StripeSectionHeader 
          title="Popular categories for founders" 
          subtitle="Browse deals by category to find exactly what you need" 
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.name}
              to={`/deals?category=${cat.name.toLowerCase()}`}
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#635bff]/30 hover:shadow-lg transition-all text-center"
            >
              <span className="text-4xl mb-3 block">{cat.icon}</span>
              <h3 className="font-medium text-gray-900 group-hover:text-[#635bff] transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{cat.count} deals</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const StripeTestimonials = () => {
  const testimonials = [
    { name: "Sarah Chen", role: "Founder, TechStart", quote: "PerksNest saved us over $50,000 in our first year. The deals are incredible.", avatar: "S" },
    { name: "Marcus Johnson", role: "CEO, GrowthLabs", quote: "Essential for any startup. The curated deals actually matter for our stack.", avatar: "M" },
    { name: "Elena Rodriguez", role: "CTO, DevFlow", quote: "We use 12 tools from PerksNest. The savings compound every month.", avatar: "E" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <StripeSectionHeader 
          title="Loved by founders worldwide" 
          subtitle="See what founders are saying about PerksNest" 
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#ffbe0b] text-[#ffbe0b]" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#a960ee] flex items-center justify-center text-white font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const StripePricing = () => {
  const plans = [
    { name: "Free", price: "$0", period: "/month", features: ["Access to 330+ free deals", "Basic support", "Community access"], cta: "Get started", highlight: false },
    { name: "Premium", price: "$49", period: "/month", features: ["All 590+ deals", "Priority support", "Exclusive perks", "Early access"], cta: "Start free trial", highlight: true },
    { name: "Team", price: "$199", period: "/month", features: ["Everything in Premium", "Team management", "Custom deals", "Dedicated manager"], cta: "Contact sales", highlight: false },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-500">Choose the plan that works for you</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-2xl p-8 ${plan.highlight ? 'bg-[#635bff] text-white ring-4 ring-[#635bff]/20' : 'bg-white border border-gray-200'}`}
            >
              <h3 className={`text-xl font-semibold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                <span className={plan.highlight ? 'text-white/70' : 'text-gray-500'}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                    <Check className={`h-4 w-4 ${plan.highlight ? 'text-white' : 'text-[#635bff]'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-medium transition-colors ${
                plan.highlight 
                  ? 'bg-white text-[#635bff] hover:bg-gray-100' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section
const StripeCTA = () => (
  <section className="py-16 lg:py-24 bg-gradient-to-r from-[#635bff] via-[#a960ee] to-[#ff6b6b]">
    <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
        Ready to save on the tools you love?
      </h2>
      <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Join 100,000+ founders who are scaling smarter with exclusive deals.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link 
          to="/deals"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#635bff] font-medium rounded-full hover:bg-gray-100 transition-colors"
        >
          Get started for free
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link 
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-medium rounded-full hover:bg-white/30 transition-colors border border-white/30"
        >
          View pricing
        </Link>
      </div>
    </div>
  </section>
);

// Footer
const StripeFooter = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h4 className="font-semibold mb-4">Products</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/deals" className="hover:text-white transition-colors">All Deals</Link></li>
            <li><Link to="/deals" className="hover:text-white transition-colors">Premium</Link></li>
            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/invite" className="hover:text-white transition-colors">Invite & Earn</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[#635bff] font-bold text-xl">perksnest</span>
        <p className="text-sm text-gray-500">© 2024 PerksNest. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main Page Component
const HomeStripe = () => {
  const mostPopularDeals = getMostPopularDeals();
  const recentlyAddedDeals = getRecentlyAddedDeals();
  const freeDeals = getFreeDeals();

  return (
    <div className="min-h-screen bg-white font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      <StripeHeader />
      
      <main>
        <StripeHero />
        <StripeTrustedBy />
        
        <StripeDealSection
          title="Most popular deals"
          subtitle="Discover the SaaS deals that founders love the most"
          deals={mostPopularDeals}
        />
        
        <StripeCategories />
        
        <div className="bg-gray-50">
          <StripeDealSection
            title="Recently added deals"
            subtitle="Fresh perks added every week to help your startup grow"
            deals={recentlyAddedDeals}
          />
        </div>
        
        <StripeDealSection
          title="Free deals"
          subtitle="Get started with these amazing free deals"
          deals={freeDeals}
        />
        
        <StripeTestimonials />
        <StripePricing />
        <StripeCTA />
      </main>

      <StripeFooter />
    </div>
  );
};

export default HomeStripe;
