import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import DealCarousel from "@/components/DealCarousel";
import CategoryDealsSection from "@/components/CategoryDealsSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import { 
  getMostPopularDeals, 
  getFreeDeals, 
  getRecentlyAddedDeals,
  getDealsByCategory 
} from "@/data/deals";

const Index = () => {
  const mostPopularDeals = getMostPopularDeals();
  const recentlyAddedDeals = getRecentlyAddedDeals();
  const freeDeals = getFreeDeals();
  const aiDeals = getDealsByCategory("ai");
  const projectDeals = getDealsByCategory("project");
  const marketingDeals = getDealsByCategory("marketing");
  const developmentDeals = getDealsByCategory("development");
  const customerDeals = getDealsByCategory("customer");
  const dataDeals = getDealsByCategory("data");

  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Header />
      
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

        {/* Category Sections */}
        <div className="bg-secondary/30 py-8">
          <div className="container-wide mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Browse deals by category
            </h2>
          </div>
          
          {aiDeals.length > 0 && (
            <CategoryDealsSection
              categoryName="AI Tools"
              categorySlug="ai"
              deals={aiDeals}
            />
          )}
          
          {projectDeals.length > 0 && (
            <CategoryDealsSection
              categoryName="Project Management"
              categorySlug="project"
              deals={projectDeals}
            />
          )}
          
          {marketingDeals.length > 0 && (
            <CategoryDealsSection
              categoryName="Marketing"
              categorySlug="marketing"
              deals={marketingDeals}
            />
          )}
          
          {developmentDeals.length > 0 && (
            <CategoryDealsSection
              categoryName="Development"
              categorySlug="development"
              deals={developmentDeals}
            />
          )}
          
          {customerDeals.length > 0 && (
            <CategoryDealsSection
              categoryName="Customer Support"
              categorySlug="customer"
              deals={customerDeals}
            />
          )}
          
          {dataDeals.length > 0 && (
            <CategoryDealsSection
              categoryName="Cloud & Data"
              categorySlug="data"
              deals={dataDeals}
            />
          )}
        </div>

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
