import MegaMenuHeader from "@/components/MegaMenuHeader";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import DealCarousel from "@/components/DealCarousel";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import { 
  getMostPopularDeals, 
  getFreeDeals, 
  getRecentlyAddedDeals,
} from "@/data/deals";

const Index = () => {
  const mostPopularDeals = getMostPopularDeals();
  const recentlyAddedDeals = getRecentlyAddedDeals();
  const freeDeals = getFreeDeals();

  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <MegaMenuHeader />
      
      <main>
        {/* Testimonials */}
        <TestimonialsCarousel />

        {/* Most Popular Deals */}
        <DealCarousel
          title="Most popular deals"
          subtitle="Discover the SaaS deals that are the most popular on our software marketplace right now"
          deals={mostPopularDeals}
          browseLink="/deals?sort=most_popular"
          browseLinkText="Browse most popular deals"
        />

        {/* Most Popular Categories Section */}
        <PopularCategoriesSection />

        {/* Recently Added */}
        <div className="bg-secondary/30">
          <DealCarousel
            title="Recently added"
            subtitle="We add amazing discounts, credits and promo codes every week to make sure you always find the right tool to grow your business."
            deals={recentlyAddedDeals}
            browseLink="/deals?sort=recently_added"
            browseLinkText="Browse recently added deals"
          />
        </div>

        {/* Free Deals */}
        <DealCarousel
          title="Free deals"
          subtitle="Discover all the software deals and discounts that are accessible for free on Secret"
          deals={freeDeals}
          browseLink="/deals?filter=free"
          browseLinkText="Browse free deals"
        />

        {/* Pricing */}
        <PricingSection />

        {/* CTA */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
