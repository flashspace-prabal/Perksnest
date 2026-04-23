import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getMostPopularDeals, type Deal } from "@/data/deals";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDeals from "@/components/FeaturedDeals";
import CompareToolsSection from "@/components/CompareToolsSection";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SafeImage from "@/components/SafeImage";

const getCompanyName = (deal: Deal) => {
  return (deal.company || deal.name)
    .replace(/\s+Startup Program$/i, "")
    .replace(/\s+Startup Credits$/i, "")
    .replace(/\s+for Startups$/i, "")
    .trim();
};

// Stripe Header Component
const StripeHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-[#5c2169] font-bold text-2xl tracking-tight">
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
          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              to="/login" 
              className="hidden md:block px-4 py-2 text-[15px] text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              to="/signup"
              className="hidden sm:flex items-center gap-1 px-4 py-2 bg-[#5c2169] hover:bg-[#4a1a52] text-white text-[15px] font-medium rounded-full transition-colors"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-6 space-y-4">
            <nav className="flex flex-col gap-1">
              <Link to="/deals" className="px-3 py-2.5 text-[15px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Products</Link>
              <Link to="/deals" className="px-3 py-2.5 text-[15px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Solutions</Link>
              <Link to="/pricing" className="px-3 py-2.5 text-[15px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">Pricing</Link>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t px-3">
              <Link to="/login" className="flex items-center justify-center py-2.5 text-[15px] font-medium text-gray-600 hover:text-gray-900 border rounded-full">Sign in</Link>
              <Link to="/signup" className="flex items-center justify-center py-2.5 text-[15px] font-medium bg-[#5c2169] text-white rounded-full">Get started</Link>
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
        <div className="max-w-4xl mx-auto">
          {/* Stats Badge */}
          <p className="text-sm text-gray-500 mb-6">
            Global founders using PerksNest: <span className="text-[#5c2169] font-medium">100,000+</span>
          </p>

          {/* Main Headline - Responsive Scaling */}
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-semibold leading-[1.1] tracking-tight mb-6 text-center text-gray-900">
            Perks infrastructure to <span className="text-[#5c2169]">grow your startup.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto">
            Your startup deserves better pricing. Discover the software perks that compound over time.
          </p>

          {/* CTA Buttons - Responsive Stacking */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              to="/deals"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#5c2169] hover:bg-[#4a1a52] text-white font-medium rounded-full transition-colors shadow-lg shadow-[#5c2169]/20"
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
             {!isAuthenticated && (
              <button 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-full transition-colors"
                onClick={() => navigate('/signup')}
              >
                Sign up with Google
              </button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#5c2169]" />
              <span>150+ exclusive perks</span>
            </div>
             <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#5c2169]" />
              <span>Curated for founders & teams</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#5c2169]" />
              <span>Trusted globally</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Trusted By Section
const StripeTrustedBy = ({ deals }: { deals: Deal[] }) => {
  const logoDeals = deals.map((deal) => ({
    id: deal.id,
    name: getCompanyName(deal),
    logo: deal.logo,
  }));
  const purpleLogoFilter = "grayscale(1) sepia(0.32) saturate(560%) hue-rotate(238deg) brightness(0.82) contrast(1.08)";

  return (
    <section className="overflow-hidden bg-white py-10 border-t border-gray-100">
      <div className="mb-7 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.22em] text-[#5c2169] uppercase">Trusted by 1000+ businesses</p>
        <p className="mt-2 text-sm text-gray-500">Deals from brands you already use</p>
      </div>

      <div className="relative mx-auto max-w-7xl overflow-hidden border-y border-[#5c2169]/10 bg-[#5c2169]/[0.03] py-7 shadow-[0_8px_32px_rgba(92,33,105,0.05)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <style>{`
          @keyframes stripe-logo-marquee {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }

          .stripe-logo-marquee {
            display: flex;
            width: max-content;
            animation: stripe-logo-marquee 32s linear infinite;
            will-change: transform;
          }

          .stripe-logo-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="stripe-logo-marquee" aria-label="Partner logos">
          {[...logoDeals, ...logoDeals].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group flex h-16 w-48 shrink-0 items-center justify-center gap-3.5 px-4 sm:w-52 md:w-56"
              aria-hidden={index >= logoDeals.length}
            >
              <SafeImage
                src={item.logo}
                alt={item.name}
                className="h-7 w-7 shrink-0 object-contain opacity-80 transition duration-300"
                fallbackClassName="h-7 w-7 shrink-0 text-xs text-primary/70"
                loading="lazy"
                style={{
                  filter: purpleLogoFilter,
                  mixBlendMode: "multiply",
                }}
              />
              <span className="min-w-0 truncate text-base font-semibold text-primary/70 transition-colors duration-300">
                {item.name}
              </span>
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
  const featuredDeals = mostPopularDeals.map((deal) => ({
    ...deal,
    memberCount: deal.memberCount ?? 0,
  }));

  return (
    <div className="min-h-screen bg-white font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,sans-serif]">

      <main>
        {/* Minimal Hero */}
        <StripeHero isAuthenticated={isAuthenticated} />
        
        {/* Trusted By Logos */}
        <StripeTrustedBy deals={mostPopularDeals} />

        {/* Original Featured Deals - Restored Section */}
        <FeaturedDeals deals={featuredDeals} />

        {/* Homepage Comparison Entry Point */}
        <CompareToolsSection />
        
        {/* Original Popular Categories */}
        <div className="bg-gray-50/50">
          <PopularCategoriesSection />
        </div>

        {/* Original How It Works */}
        <HowItWorks />
        {/* Moving Testimonials */}
        <TestimonialsSection />
        
        {/* Original Pricing */}
        <PricingSection />
        
        {/* Original CTA Section */}
        <CTASection />
      </main>

    </div>
  );
};

export default HomeStripe;
