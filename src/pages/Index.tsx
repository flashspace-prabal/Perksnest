import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HeroBanner from "@/components/HeroBanner";
import HowItWorks from "@/components/HowItWorks";
import FeaturedDeals from "@/components/FeaturedDeals";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import {
  getMostPopularDeals,
} from "@/data/deals";

const Index = () => {
  useEffect(() => {
    document.title = "PerksNest - Exclusive SaaS Deals for Startups";
  }, []);

  const mostPopularDeals = getMostPopularDeals();

  return (
    <div className="min-h-screen bg-background">
      
      <Header />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner />

        {/* How It Works */}
        <HowItWorks />

        {/* Featured Deals (Locked Preview) */}
        <FeaturedDeals deals={mostPopularDeals} />

        {/* Trust & Testimonials */}
        <TestimonialsCarousel />

        {/* Most Popular Categories Section */}
        <PopularCategoriesSection />

        {/* Pricing */}
        <PricingSection />

        {/* CTA */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default Index;
