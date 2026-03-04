import { useState } from "react";
import { toast } from "sonner";
import MegaMenuHeader from "@/components/MegaMenuHeader";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import HeroBanner from "@/components/HeroBanner";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import TestimonialCards from "@/components/TestimonialCards";
import DealCarousel from "@/components/DealCarousel";
import PopularCategoriesSection from "@/components/PopularCategoriesSection";
import CompareToolsSection from "@/components/CompareToolsSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        {/* Hero Banner */}
        <HeroBanner />

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
          subtitle="Discover all the software deals and discounts that are accessible for free on PerksNest"
          deals={freeDeals}
          browseLink="/deals?filter=free"
          browseLinkText="Browse free deals"
        />

        {/* Compare Tools */}
        <CompareToolsSection />

        {/* Testimonial Cards */}
        <TestimonialCards />

        {/* Pricing */}
        <PricingSection />

        {/* Weekly Digest Subscribe */}
        <WeeklyDigestSection />

        {/* CTA */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

function WeeklyDigestSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const subscribers = JSON.parse(localStorage.getItem('pn_digest_subscribers') || '[]');
    if (subscribers.some((s: any) => s.email === email)) {
      setAlreadySubscribed(true);
      return;
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    localStorage.setItem('pn_digest_subscribers', JSON.stringify(subscribers));

    fetch('https://api.perksnest.co/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'digest_subscribe', to: email, name: email })
    }).catch(() => {});

    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get the best SaaS deals every Monday</h2>
        <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
          Join 50,000+ founders who get weekly emails with hand-picked deals, new tool launches, and exclusive discounts.
        </p>
        {submitted ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <p className="text-lg font-medium">✓ You're subscribed!</p>
            <p className="text-sm text-purple-100 mt-2">Check your inbox for the next digest.</p>
          </div>
        ) : alreadySubscribed ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <p className="text-lg font-medium">Already subscribed!</p>
            <p className="text-sm text-purple-100 mt-2">You're on the list for weekly updates.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 h-12 bg-white text-gray-900"
            />
            <Button type="submit" size="lg" className="bg-white text-purple-600 hover:bg-gray-100 h-12 px-8">
              Subscribe Free
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Index;
