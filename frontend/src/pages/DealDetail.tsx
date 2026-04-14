import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Bookmark, Share2, Info, Users, ExternalLink, Lock, Check, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DealCardNew from "@/components/DealCardNew";
import SafeImage from "@/components/SafeImage";
import { AuthModal } from "@/components/AuthModal";
import { DealReviews } from "@/components/DealReviews";
import UpvoteButton from "@/components/UpvoteButton";
import ExpiryBadge from "@/components/ExpiryBadge";
import { sendEmail } from '@/lib/store';
import { useAuth } from "@/lib/auth";
import { useBookmarks } from "@/lib/bookmarks";
import { toast } from "sonner";
import { Deal } from "@/data/deals";
import { getDealReview } from "@/data/reviews";
import { getExtendedDealInfo } from "@/data/extended-deals";
import { getPartnerDeals, PartnerDeal } from "@/lib/store";
import { claimDeal as apiClaimDeal, getDealClaims, getUserClaims } from "@/lib/api";
import { getDeal, getDealsByCategory } from "@/lib/deals";
import { useSeo } from "@/lib/seo";

import notionLogo from "@/assets/logos/notion.png";
import stripeLogo from "@/assets/logos/stripe.svg";
import googleCloudLogo from "@/assets/logos/google-cloud.svg";
import brevoLogo from "@/assets/logos/brevo.ico";
import makeLogo from "@/assets/logos/make.ico";
import React from "react";

interface DealDetailData extends Deal {
  websiteUrl?: string;
  promoCode?: string;
  tagline: string;
  longDescription: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  features?: string[];
  useCases?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
}

const normalizeClaimedDeals = (payload: unknown): string[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "deal_id" in item && typeof item.deal_id === "string") {
          return item.deal_id;
        }
        return null;
      })
      .filter((dealId): dealId is string => !!dealId);
  }

  if (payload && typeof payload === "object" && "claimedDeals" in payload) {
    const claimedDeals = payload.claimedDeals;
    if (Array.isArray(claimedDeals)) {
      return claimedDeals.filter((dealId): dealId is string => typeof dealId === "string");
    }
  }

  return [];
};

// Get extended deal info from the new extended-deals data file
const getDealExtendedInfo = (dealId: string) => {
  return getExtendedDealInfo(dealId);
};

const saasLogos = [
  { name: "Notion", logo: notionLogo, discount: "-50%" },
  { name: "Stripe", logo: stripeLogo, discount: "-$400" },
  { name: "Google Cloud", logo: googleCloudLogo, discount: "-100%" },
  { name: "Brevo", logo: brevoLogo, discount: "-75%" },
  { name: "Make", logo: makeLogo, discount: "-100%" },
];

const DealDetail = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, claimDeal } = useAuth();
  const { isBookmarked, isBookmarkPending, toggleBookmark } = useBookmarks();
  const isPro = user?.plan === 'premium';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [claimCount, setClaimCount] = useState<number>(0);

  const [partnerDeal, setPartnerDeal] = useState<PartnerDeal | null>(null);
  const [serverClaimedDeals, setServerClaimedDeals] = useState<string[]>([]);
  const [baseDeal, setBaseDeal] = useState<Deal | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch deal details
  useEffect(() => {
    if (!dealId) return;
    
    setIsLoading(true);
    
    // Core deal data — must succeed for page to render well
    getDeal(dealId)
      .then(deal => {
        setBaseDeal(deal);
        if (deal?.category) {
          getDealsByCategory(deal.category)
            .then(categoryDeals => {
              setRelatedDeals(categoryDeals.filter(d => d.id !== dealId).slice(0, 3));
            })
            .catch(err => console.error('Failed to fetch related deals:', err));
        }
      })
      .catch(err => {
        console.error('Failed to fetch core deal data:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Secondary metadata — non-blocking
    getPartnerDeals()
      .then(partnerDealsData => {
        const found = partnerDealsData.find(d => d.id === dealId && d.status === 'approved');
        setPartnerDeal(found || null);
      })
      .catch(err => console.warn('Failed to fetch partner deals metadata:', err));

    getDealClaims(dealId)
      .then(claimData => {
        if (claimData?.count !== undefined) {
          setClaimCount(claimData.count);
        }
      })
      .catch(err => console.warn('Failed to fetch deal claims metadata:', err));

    if (isAuthenticated) {
      getUserClaims()
        .then(claims => setServerClaimedDeals(normalizeClaimedDeals(claims)))
        .catch(err => console.warn('Failed to fetch user claims metadata:', err));
    }
  }, [dealId, isAuthenticated]);

  // Fetch user's claimed deals from server
  useEffect(() => {
    if (isAuthenticated) {
      getUserClaims()
        .then(data => setServerClaimedDeals(normalizeClaimedDeals(data)))
        .catch(err => {
          console.error('Failed to fetch user claims:', err);
        });
    }
  }, [isAuthenticated]);

  // If it's a partner deal, convert to deal format
  const effectiveDeal = baseDeal || (partnerDeal ? {
    id: partnerDeal.id,
    name: partnerDeal.name,
    company: partnerDeal.partnerName,
    logo: partnerDeal.logoUrl || "",
    description: partnerDeal.description,
    dealText: partnerDeal.dealText,
    savings: partnerDeal.savings,
    category: partnerDeal.category,
    websiteUrl: partnerDeal.websiteUrl,
    promoCode: partnerDeal.promoCode,
    isFree: true,
    memberCount: partnerDeal.claims || 0,
  } : null);
  const extendedInfo = dealId ? getDealExtendedInfo(dealId) : null;

  // Combine base deal with extended info, fallback to effectiveDeal (including partner deals)
  const deal: DealDetailData | null = effectiveDeal ? {
    ...effectiveDeal,
    tagline: extendedInfo?.tagline || effectiveDeal.description,
    longDescription: extendedInfo?.longDescription || effectiveDeal.description,
    subcategory: extendedInfo?.subcategory || "Software",
    rating: extendedInfo?.rating || 4.5,
    reviewCount: extendedInfo?.reviewCount || 50,
    features: extendedInfo?.features,
    useCases: extendedInfo?.useCases,
    testimonial: extendedInfo?.testimonial || {
      quote: "This deal saved us a lot of money!",
      author: "Happy Customer",
      role: "Founder",
    },
  } : null;

  useSeo(
    deal
      ? {
          title: `${deal.name} Deal | PerksNest`,
          description: deal.description || deal.longDescription,
          path: `/deals/${dealId || deal.id}`,
          image: deal.logo || undefined,
        }
      : {
          title: "Deal | PerksNest",
          description: "Explore startup-friendly software deals, savings, and promo offers curated by PerksNest.",
          path: dealId ? `/deals/${dealId}` : "/deals",
        }
  );

  const handleBookmark = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!dealId) return;

    try {
      const result = await toggleBookmark(dealId);
      toast.success(result ? "Deal saved!" : "Deal removed from saved");
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      toast.error("Failed to update saved deals");
    }
  };

  const isClaimed = !!dealId && (user?.claimedDeals?.includes(dealId) || serverClaimedDeals.includes(dealId));
  const isPremiumDeal = deal?.isPremium;
  const canClaim = isAuthenticated && (!isPremiumDeal || isPro);

  const [isClaiming, setIsClaiming] = React.useState(false);

  const handleClaimDeal = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (isPremiumDeal && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (!dealId) return;

    // Check if already claimed locally or on server
    if (user?.claimedDeals.includes(dealId) || serverClaimedDeals.includes(dealId)) {
      toast.error('Deal already claimed');
      return;
    }

    setIsClaiming(true);
    try {
      console.log(`Claiming deal: ${dealId}`);
      
      // Call backend API to track claim (with timeout and retry)
      const response = await apiClaimDeal(dealId);
      console.log('Claim response:', response);

      // Also update local state
      claimDeal(dealId);

      // Increment local claim count
      setClaimCount(prev => prev + 1);

      const dealName = deal?.name || 'Deal';
      const isFallback = Boolean((response as { fallback?: boolean })?.fallback);
      
      if (isFallback) {
        toast.success(`${dealName} claimed! (offline mode - syncing when online)`);
      } else {
        toast.success(`${dealName} claimed successfully!`);
      }

      // Send confirmation email
      if (user?.email) {
        sendEmail('deal_claimed', user.email, user.name, deal?.name || dealId, '');
      }

      // Navigate after a short delay for better UX
      setTimeout(() => {
        navigate(`/deals/${dealId}/redeem`);
      }, 800);
    } catch (error: unknown) {
      console.error('Failed to claim deal:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to claim deal';
      
      if (errorMsg.includes('timeout') || errorMsg.includes('AbortError')) {
        toast.error('Network timeout. Please check your connection and try again.');
      } else if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        toast.error('Session expired. Please log in again.');
        setShowAuthModal(true);
      } else if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
        toast.error('You are not eligible to claim this deal.');
      } else {
        toast.error('Failed to claim deal. Please try again.');
      }
    } finally {
      setIsClaiming(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-wide py-20">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              {/* Loading skeleton */}
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-secondary"></div>
                  <span className="text-2xl text-muted-foreground">&</span>
                  <div className="w-14 h-14 rounded-xl bg-secondary"></div>
                </div>
                <div className="h-12 bg-secondary rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-secondary rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-secondary rounded w-full mb-2"></div>
                <div className="h-4 bg-secondary rounded w-5/6 mb-8"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="h-12 bg-secondary rounded mb-4"></div>
                <div className="h-6 bg-secondary rounded w-2/3 mb-6"></div>
                <div className="h-12 bg-secondary rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-wide py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Deal not found</h1>
          <Link to="/deals">
            <Button>Browse all deals</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      <main className="py-8">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="mb-10 text-sm">
            <ol className="flex items-center gap-2 text-gray-400">
              <li>
                <Link to="/deals" className="hover:text-gray-900 transition-colors uppercase tracking-widest font-bold text-[10px]">
                  {deal.category}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-bold uppercase tracking-widest text-[10px]">{deal.name} Promo Code</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Brand Logos */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center border border-border">
                  <SafeImage src={deal.logo} alt={deal.name} className="w-9 h-9 object-contain" />
                </div>
                <span className="text-2xl text-muted-foreground">&</span>
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">P.</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {deal.name} Promo code
              </h1>

              {/* Tagline - Only show if different from Long Description */}
              {deal.tagline !== deal.longDescription && (
                <p className="text-lg text-muted-foreground mb-6">{deal.tagline}</p>
              )}

              {/* Long Description */}
              <p className="text-foreground leading-relaxed mb-8">{deal.longDescription}</p>

              {/* Redeemed Count */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    className="w-8 h-8 rounded-full border-2 border-background"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face"
                    className="w-8 h-8 rounded-full border-2 border-background"
                    alt=""
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                    className="w-8 h-8 rounded-full border-2 border-background"
                    alt=""
                  />
                </div>
                <span className="text-sm text-foreground">
                  🔥 <span className="font-semibold">{claimCount > 0 ? claimCount : deal.memberCount}</span> {claimCount > 0 ? 'startups claimed' : 'times redeemed'}
                </span>
              </div>

              {/* Testimonial - Unique Review for Each Deal */}
              {(() => {
                const review = dealId ? getDealReview(dealId) : null;
                return review ? (
                  <div className="bg-card border border-border rounded-xl p-6 mb-8">
                    <div className="text-4xl text-muted-foreground mb-4">"</div>
                    <p className="text-foreground leading-relaxed mb-6">
                      {review.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={review.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
                        alt={review.author}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{review.author}</p>
                        <p className="text-sm text-muted-foreground">{review.role}{review.company ? `, ${review.company}` : ''}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback testimonial from extendedInfo
                  <div className="bg-card border border-border rounded-xl p-6 mb-8">
                    <div className="text-4xl text-muted-foreground mb-4">"</div>
                    <p className="text-foreground leading-relaxed mb-6">
                      {deal.testimonial.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <img 
                        src={deal.testimonial.avatar} 
                        alt={deal.testimonial.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-foreground">{deal.testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{deal.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Save Big CTA Banner */}
              <div className="bg-secondary rounded-xl p-6 mb-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {saasLogos.map((item, index) => (
                        <div key={index} className="relative">
                          <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden">
                            <SafeImage src={item.logo} alt={item.name} className="w-6 h-6 object-contain" />
                          </div>
                          <span className="absolute -top-2 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-success text-white rounded">
                            {item.discount}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="font-semibold text-foreground">Save big on 570+ SaaS</span>
                  </div>
                  <Link to="/deals">
                    <Button variant="outline" className="font-medium">
                      Explore marketplace
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="deals" className="mb-12">
                <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
                  {["Deals", "General", "FAQ", "Pricing", "Features", "Reviews", "Alternatives & VS", "Also likes", "Resources"].map((tab) => (
                    <TabsTrigger 
                      key={tab}
                      value={tab.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}
                      className="px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-foreground"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="deals" className="pt-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    {deal.name} Promo Code: {deal.dealText}
                  </h2>
                  <p className="text-muted-foreground">{deal.description}</p>
                </TabsContent>
                <TabsContent value="general" className="pt-8">
                  <h2 className="text-2xl font-bold mb-4">About {deal.name}</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{deal.longDescription}</p>
                  
                  {extendedInfo?.useCases && extendedInfo.useCases.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold mb-4 mt-8">Best For</h3>
                      <div className="grid sm:grid-cols-2 gap-3 mb-8">
                        {extendedInfo.useCases.map((useCase, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                            <span className="text-primary font-bold text-lg mt-0.5">✓</span>
                            <span className="text-sm">{useCase}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <p className="text-muted-foreground">
                    Visit <a href={`https://${(deal.company || deal.name).toLowerCase().replace(/\s+/g, '')}.com`} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">{deal.company || deal.name}</a> to learn more about this product.
                  </p>
                </TabsContent>
                <TabsContent value="faq" className="pt-8">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {[
                      { q: `How do I claim the ${deal.name} deal?`, a: `Click "Get Deal" above, copy the promo code, and apply it at checkout on the ${deal.company || deal.name} website.` },
                      { q: "Is this deal exclusive to PerksNest?", a: "Yes! This deal is exclusively available through PerksNest members. You won't find it publicly." },
                      { q: "How long is this deal valid?", a: deal.expiresAt ? `This deal expires on ${new Date(deal.expiresAt).toLocaleDateString()}.` : "This deal is available while stocks last." },
                      { q: "Can I use this deal more than once?", a: "Each promo code is typically valid for one use per account unless stated otherwise." },
                    ].map((item, i) => (
                      <div key={i} className="border border-border rounded-xl p-5">
                        <h3 className="font-semibold mb-2">{item.q}</h3>
                        <p className="text-muted-foreground text-sm">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="pricing" className="pt-8">
                  <h2 className="text-2xl font-bold mb-6">{deal.name} Pricing</h2>
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-primary">{deal.savings}</span>
                      <span className="text-muted-foreground">savings with PerksNest</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Deal: {deal.dealText}</p>
                  </div>
                  <p className="text-muted-foreground">For full pricing details, visit the {deal.company || deal.name} website directly.</p>
                </TabsContent>
                <TabsContent value="features" className="pt-8">
                  <h2 className="text-2xl font-bold mb-6">{deal.name} Features</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(extendedInfo?.features || deal.features || ["Collaboration tools", "Advanced analytics", "Priority support", "API access", "Custom integrations", "Team management"]).map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-4 border border-border rounded-xl hover:bg-primary/5 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-primary text-sm font-bold">✓</span>
                        </div>
                        <span className="text-sm font-medium leading-relaxed">{f}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-8">
                  <DealReviews dealId={deal.id} dealName={deal.name} />
                </TabsContent>
                <TabsContent value="alternatives-vs" className="pt-8">
                  <h2 className="text-2xl font-bold mb-6">Alternatives & Comparisons</h2>
                  <p className="text-muted-foreground mb-6">Looking for alternatives to {deal.name}? Here are similar tools available on PerksNest.</p>
                  <Link to="/deals" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                    Browse all deals <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </TabsContent>
                <TabsContent value="also-likes" className="pt-8">
                  <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                  <p className="text-muted-foreground mb-6">Members who viewed this deal also looked at:</p>
                  <Link to="/deals" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                    Explore more deals <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </TabsContent>
                <TabsContent value="resources" className="pt-8">
                  <h2 className="text-2xl font-bold mb-6">Resources</h2>
                  <div className="space-y-4">
                    <a href={`mailto:support@perksnest.co?subject=Help with ${deal.name} deal`} className="flex items-center gap-3 p-4 border border-border rounded-xl hover:border-primary transition-colors">
                      <span className="text-2xl">📧</span>
                      <div><p className="font-medium">Contact Support</p><p className="text-sm text-muted-foreground">Get help with this deal</p></div>
                    </a>
                    <Link to="/docs" className="flex items-center gap-3 p-4 border border-border rounded-xl hover:border-primary transition-colors">
                      <span className="text-2xl">📚</span>
                      <div><p className="font-medium">Documentation</p><p className="text-sm text-muted-foreground">How to use PerksNest deals</p></div>
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6">
                {/* Logo and Rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-border">
                      <SafeImage src={deal.logo} alt={deal.name} className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{deal.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{deal.rating}/5</span>
                        <span className="text-muted-foreground">({deal.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button onClick={handleShare} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`p-2 hover:bg-secondary rounded-lg transition-colors ${
                        dealId && isBookmarked(dealId) ? "text-primary" : ""
                      }`}
                      disabled={dealId ? isBookmarkPending(dealId) : true}
                    >
                      {dealId && isBookmarkPending(dealId) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Bookmark className={`h-4 w-4 ${dealId && isBookmarked(dealId) ? "fill-current" : "text-muted-foreground"}`} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Savings */}
                <p className="text-primary font-semibold mb-2">Save up to {deal.savings}</p>

                {/* Deal Text */}
                <h4 className="text-xl font-bold text-foreground mb-6 leading-tight">
                  {deal.dealText}
                </h4>

                {/* CTA Button */}
                {isClaimed ? (
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => navigate(`/deals/${dealId}/redeem`)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    View Promo Code
                  </Button>
                ) : isPremiumDeal && !isPro ? (
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    onClick={() => navigate('/pricing')}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade to Claim
                  </Button>
                ) : (
                  <Button
                    className="w-full h-12 text-base font-semibold"
                    onClick={handleClaimDeal}
                    disabled={isClaiming}
                  >
                    {isClaiming ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Claiming...
                      </>
                    ) : !isAuthenticated ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Claim Deal
                      </>
                    ) : (
                      'Claim Deal'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          <AuthModal
            open={showAuthModal}
            onOpenChange={setShowAuthModal}
            onSuccess={() => {
              setShowAuthModal(false);
              handleClaimDeal();
            }}
          />

          {/* Related Deals */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">People also liked these deals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDeals.map((deal) => (
                <Link key={deal.id} to={`/deals/${deal.id}`} className="block h-full">
                  <DealCardNew {...deal} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

    </div>
  );
};

export default DealDetail;
