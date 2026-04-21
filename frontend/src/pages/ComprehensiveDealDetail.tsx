import { isPremiumDeal } from "@/lib/deal-types";
/**
 * Refactored Deal Detail Page - Production Grade
 * Comprehensive product/deal page with all sections matching reference design
 * 
 * Structure:
 * 1. Hero section with sticky deal card
 * 2. Sticky tab navigation
 * 3. Deals section
 * 4. General information
 * 5. FAQ section
 * 6. Pricing section
 * 7. Features section
 * 8. Reviews section
 * 9. Alternatives section
 * 10. Related deals section
 * 11. Resources section
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Data & Types
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { stripeDealDetail } from "@/data/stripe-deal";
import { notionDealDetail } from "@/data/notion-deal";
import { makeDealDetail } from "@/data/make-deal";
import { ALL_COMPREHENSIVE_DEALS, getComprehensiveDealByIdFromMaster } from "@/data/index-all-deals";
import { dealsData } from "@/data/deals";
import { convertBasicDealToComprehensive } from "@/lib/deal-converter";
import { createClient } from "@supabase/supabase-js";

// Components
import { DealHero } from "@/components/deal-detail/DealHero";
import { DealTabs } from "@/components/deal-detail/DealTabs";
import { DealsSection } from "@/components/deal-detail/DealsSection";
import { GeneralSection } from "@/components/deal-detail/GeneralSection";
import { FAQSection } from "@/components/deal-detail/FAQSection";
import { PricingSection } from "@/components/deal-detail/PricingSection";
import { FeaturesSection } from "@/components/deal-detail/FeaturesSection";
import { ReviewsSection } from "@/components/deal-detail/ReviewsSection";
import { RelatedDealsSection } from "@/components/deal-detail/RelatedDealsSection";
import { ResourcesSection } from "@/components/deal-detail/ResourcesSection";

// Hooks
import { useAuth } from "@/lib/auth";
import { useBookmarks } from "@/lib/bookmarks";
import { useSeo } from "@/lib/seo";

/**
 * Tab configuration for anchor navigation
 */
const DEAL_TABS = [
  { id: "deals", label: "Deals", sectionId: "deals-section" },
  { id: "general", label: "General", sectionId: "general-section" },
  { id: "faq", label: "FAQ", sectionId: "faq-section" },
  { id: "pricing", label: "Pricing", sectionId: "pricing-section" },
  { id: "features", label: "Features", sectionId: "features-section" },
  { id: "reviews", label: "Reviews", sectionId: "reviews-section" },
  { id: "related", label: "Also Likes", sectionId: "related-section" },
  { id: "resources", label: "Resources", sectionId: "resources-section" },
];

/**
 * Data source resolver with Supabase first, fallback to static data
 * Priority: Supabase → Comprehensive deals data → Legacy data
 */
async function getComprehensiveDealData(dealId: string): Promise<ComprehensiveDealDetail | null> {
  try {
    // Try Supabase first
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      try {
        const { data, error } = await supabase
          .from("deals")
          .select("*")
          .eq("id", dealId)
          .maybeSingle();

        if (!error && data) {
          console.log("✅ Loaded deal from Supabase:", dealId);
          return data as ComprehensiveDealDetail;
        }
      } catch (err) {
        console.log("⚠️ Supabase fetch failed, falling back to static data:", err);
      }
    }
  } catch (err) {
    console.log("⚠️ Supabase initialization failed:", err);
  }

  // Fallback to comprehensive static data (from master index)
  const staticData = getComprehensiveDealByIdFromMaster(dealId);
  if (staticData) {
    console.log("✅ Loaded deal from comprehensive static data:", dealId);
    return staticData;
  }

  // Final fallback - check legacy data sources for backward compatibility
  const legacyDataMap: Record<string, ComprehensiveDealDetail> = {
    stripe: stripeDealDetail,
    notion: notionDealDetail,
    make: makeDealDetail,
  };

  if (legacyDataMap[dealId]) {
    console.log("✅ Loaded deal from legacy data:", dealId);
    return legacyDataMap[dealId];
  }

  // Fallback to basic deals data - convert to comprehensive format
  const basicDeal = dealsData.find((d) => d.id === dealId);
  if (basicDeal) {
    console.log("✅ Converting basic deal to comprehensive:", dealId);
    return convertBasicDealToComprehensive(basicDeal);
  }

  console.warn("❌ Deal not found:", dealId);
  return null;
}

/**
 * Main Refactored Deal Detail Page Component
 */
export const ComprehensiveDealDetailPage: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmark, isBookmarkPending } = useBookmarks();

  const [deal, setDeal] = useState<ComprehensiveDealDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Load deal data
  useEffect(() => {
    if (!dealId) {
      setIsLoading(false);
      return;
    }

    const loadDealData = async () => {
      try {
        const dealData = await getComprehensiveDealData(dealId);
        if (dealData) {
          setDeal(dealData);
          setIsClaimed(user?.claimedDeals?.includes(dealId) || false);
        } else {
          console.warn("Deal not found:", dealId);
        }
      } catch (error) {
        console.error("Failed to load deal:", error);
        toast.error("Failed to load deal details");
      } finally {
        setIsLoading(false);
      }
    };

    loadDealData();
  }, [dealId, user?.claimedDeals]);

  // SEO Setup
  useSeo(
    deal
      ? {
          title: `${deal.name} ${deal.title} | PerksNest`,
          description: deal.seoDescription || deal.shortDescription,
          path: `/deals/${dealId}`,
          image: deal.logo,
        }
      : {
          title: "Deal | PerksNest",
          description: "Exclusive SaaS deals and promo codes for startups",
          path: `/deals/${dealId}`,
        }
  );

  // Handlers
  const handleClaim = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to claim deals");
      navigate("/login");
      return;
    }

    setIsClaiming(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsClaimed(true);
      toast.success(`${deal?.name} deal claimed successfully!`);

      // Navigate to redeem page after a short delay
      setTimeout(() => {
        navigate(`/deals/${dealId}/redeem`);
      }, 1000);
    } catch (error) {
      console.error("Failed to claim deal:", error);
      toast.error("Failed to claim deal. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save deals");
      navigate("/login");
      return;
    }

    try {
      await toggleBookmark(dealId || "");
      toast.success(
        isBookmarked(dealId || "") ? "Deal removed from saved" : "Deal saved!"
      );
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      toast.error("Failed to save deal");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share && deal) {
        await navigator.share({
          title: deal.name,
          text: deal.dealHighlight?.headline || deal.shortDescription,
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      // User might have canceled the share or it failed
      if (error instanceof Error && error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        } catch (clipboardError) {
          toast.error("Failed to share or copy link");
        }
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!deal) {
    return (
      <div className="flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Deal Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The deal you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/deals")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Deals
          </Button>
        </div>
      </div>
    );
  }

  // Check premium access
  const isMUserPremium = user?.plan === "premium" || user?.plan === "enterprise";
  const requireUpgrade = (!!deal?.isPremium || (!!dealId && isPremiumDeal(dealId))) && !isMUserPremium;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <DealHero
        deal={deal}
        onClaim={requireUpgrade ? () => navigate("/pricing") : handleClaim}
        onBookmark={handleBookmark}
        onShare={handleShare}
        isClaimed={isClaimed}
        isBookmarked={isBookmarked(dealId || "")}
        isLoading={isClaiming}
        requireUpgrade={requireUpgrade}
      />

      {/* Sticky Tabs Navigation */}
      <DealTabs tabs={DEAL_TABS} />

      {/* Deals Section */}
      <DealsSection deal={deal} />

      {/* FAQ Section */}
      <FAQSection deal={deal} />

      {/* Pricing Section */}
      <PricingSection deal={deal} onClaim={handleClaim} />

      {/* Features Section */}
      <FeaturesSection deal={deal} />

      {/* Reviews Section */}
      <ReviewsSection deal={deal} />

      {/* General Information */}
      <GeneralSection deal={deal} />

      {/* Related/Also Likes Section */}
      <RelatedDealsSection deal={deal} />

      {/* Resources Section */}
      <ResourcesSection deal={deal} />

      {/* Footer CTA */}
      <section className="py-16 bg-blue-50 border-t border-blue-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to get started with {deal.name}?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            {deal.dealHighlight?.headline || deal.shortDescription}
          </p>
          <Button
            onClick={handleClaim}
            size="lg"
            disabled={isClaimed || isClaiming}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isClaimed ? "Already Claimed" : "Claim Your Deal Now"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ComprehensiveDealDetailPage;
