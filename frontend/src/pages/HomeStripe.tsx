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
    <section className="relative overflow-hidden bg-white pt-14 pb-20 lg:pt-20 lg:pb-24 border-b border-gray-100 min-h-[620px]">
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[60%] lg:block" aria-hidden="true">
        <div
          className="absolute -right-24 -top-24 h-[760px] w-[760px] rounded-[40%_60%_55%_45%/55%_45%_55%_45%] bg-[#5c2169]/75"
          style={{ transform: "rotate(-15deg)" }}
        />
        <div
          className="absolute right-10 top-8 h-[650px] w-[650px] rounded-[45%_55%_50%_50%/50%_50%_55%_45%]"
          style={{
            transform: "rotate(-25deg)",
            backgroundColor: "hsl(270 30% 82% / 0.68)",
          }}
        />
        <div
          className="absolute right-0 top-36 h-[590px] w-[590px] rounded-[50%_50%_45%_55%/45%_55%_50%_50%]"
          style={{
            transform: "rotate(-10deg)",
            backgroundColor: "hsl(40 42% 90% / 0.76)",
          }}
        />
        <div
          className="absolute right-20 top-56 h-[500px] w-[500px] rounded-[55%_45%_50%_50%/50%_50%_45%_55%]"
          style={{
            transform: "rotate(5deg)",
            backgroundColor: "hsl(350 42% 88% / 0.64)",
          }}
        />
        <div
          className="absolute right-44 top-16 h-[430px] w-[430px] rounded-[48%_52%_55%_45%/52%_48%_50%_50%]"
          style={{
            transform: "rotate(-20deg)",
            backgroundColor: "hsl(150 22% 88% / 0.52)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[60%] lg:block"
        style={{
          background: "linear-gradient(to right, #fff 0%, rgba(255,255,255,0.72) 12%, transparent 26%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* Stats Badge */}
          <p className="text-sm text-gray-500 mb-6">
            Global founders using PerksNest: <span className="text-[#5c2169] font-medium">100,000+</span>
          </p>

          {/* Main Headline - Responsive Scaling */}
          <h1 className="max-w-3xl text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-semibold leading-[1.02] tracking-tight mb-6 text-left text-gray-900">
            Perks infrastructure to{" "}
            <span className="text-[#5c2169]">grow your startup </span>
    
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl">
            Access exclusive deals, unlock savings, and scale faster—from your first tool to your hundredth.
          </p>

          {/* CTA Buttons - Responsive Stacking */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
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
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#5c2169]" />
              <span>350+ exclusive perks</span>
            </div>
             <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-[#5c2169]" />
              <span>All directly negotiated</span>
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
