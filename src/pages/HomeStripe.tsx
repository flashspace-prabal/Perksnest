import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Star, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  getMostPopularDeals,
  getFreeDeals,
  getRecentlyAddedDeals,
} from "@/data/deals";
import HeroBanner from "@/components/HeroBanner";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDeals from "@/components/FeaturedDeals";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

// Stripe Header Component
const StripeHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[#635bff] font-bold text-2xl tracking-tight">
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Note: StripeHero replaced by minimal HeroBanner or integrated content
const StripeHero = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-20 lg:pt-16 lg:pb-32 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Stats Badge */}
          <p className="text-sm text-gray-500 mb-6">
            Global founders using PerksNest: <span className="text-[#635bff] font-medium">100,000+</span>
          </p>

          {/* Main Headline - Solid Color, Minimal */}
          <h1 className="text-5xl md:text-6xl lg:text-[68px] font-semibold leading-[1.1] tracking-tight mb-6 text-gray-900">
            Perks infrastructure to <span className="text-[#635bff]">grow your startup.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
            Your startup deserves better pricing. Discover the software perks that compound over time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              to="/deals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#635bff] hover:bg-[#5851ea] text-white font-medium rounded-full transition-colors"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
             {!isAuthenticated && (
              <button 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-full transition-colors"
                onClick={() => navigate('/signup')}
              >
                Sign up with Google
              </button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
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
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            What our members are saying
          </h2>
        </div>
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
                <div className="w-10 h-10 rounded-full bg-[#635bff]/10 flex items-center justify-center text-[#635bff] font-semibold">
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

// Main Page Component
const HomeStripe = () => {
  const { isAuthenticated } = useAuth();
  const mostPopularDeals = getMostPopularDeals();

  return (
    <div className="min-h-screen bg-white font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">
      <StripeHeader />

      <main>
        {/* Minimal Hero */}
        <StripeHero isAuthenticated={isAuthenticated} />
        
        {/* Trusted By Logos */}
        <StripeTrustedBy />
        
        {/* Original How It Works */}
        <HowItWorks />
        
        {/* Original Featured Deals - Restored Section */}
        <FeaturedDeals deals={mostPopularDeals} />
        
        {/* Original Popular Categories */}
        <div className="bg-gray-50/50">
          <PopularCategoriesSection />
        </div>
        
        {/* Original Testimonials Carousel */}
        <StripeTestimonials />
        
        {/* Original Pricing */}
        <PricingSection />
        
        {/* Original CTA Section */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default HomeStripe;
