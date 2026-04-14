import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getMostPopularDeals } from "@/data/deals";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDeals from "@/components/FeaturedDeals";
import CompareToolsSection from "@/components/CompareToolsSection";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import TestimonialsSection from "@/components/TestimonialsSection";

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
        <div className="max-w-3xl mx-auto">
          {/* Stats Badge */}
          <p className="text-sm text-gray-500 mb-6">
            Global founders using PerksNest: <span className="text-[#5c2169] font-medium">100,000+</span>
          </p>

          {/* Main Headline - Responsive Scaling */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-semibold leading-[1.1] tracking-tight mb-6 text-gray-900">
            Perks infrastructure to <span className="text-[#5c2169]">grow your startup.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
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
const StripeTrustedBy = () => {
  const logos = ["MetLife", "Ramp", "Marriott", "Figma", "Woo", "Vercel", "Uber", "Anthropic"];
  
  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 opacity-60">
          {logos.map((logo) => (
            <span key={logo} className="text-base sm:text-lg font-semibold text-gray-400 hover:text-gray-600 transition-colors decoration-gray-400/30">
              {logo}
            </span>
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

      <main>
        {/* Minimal Hero */}
        <StripeHero isAuthenticated={isAuthenticated} />
        
        {/* Trusted By Logos */}
        <StripeTrustedBy />
        
        {/* Original How It Works */}
        <HowItWorks />
        
        {/* Original Featured Deals - Restored Section */}
        <FeaturedDeals deals={mostPopularDeals} />

        {/* Homepage Comparison Entry Point */}
        <CompareToolsSection />
        
        {/* Original Popular Categories */}
        <div className="bg-gray-50/50">
          <PopularCategoriesSection />
        </div>
        
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
