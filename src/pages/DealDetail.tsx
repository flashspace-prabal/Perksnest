import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Heart, Share2, Info, Users, ExternalLink, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCardNew from "@/components/DealCardNew";
import SafeImage from "@/components/SafeImage";
import { AuthModal } from "@/components/AuthModal";
import { DealReviews } from "@/components/DealReviews";
import UpvoteButton from "@/components/UpvoteButton";
import ExpiryBadge from "@/components/ExpiryBadge";
import { toggleBookmark, getBookmarkedDealIds, sendEmail } from '@/lib/store';
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { dealsData } from "@/data/deals";
import { getPartnerDeals, PartnerDeal } from "@/lib/store";

import notionLogo from "@/assets/logos/notion.png";
import stripeLogo from "@/assets/logos/stripe.svg";
import googleCloudLogo from "@/assets/logos/google-cloud.svg";
import brevoLogo from "@/assets/logos/brevo.ico";
import makeLogo from "@/assets/logos/make.ico";

// Extended deal info for detail pages
const dealExtendedInfo: Record<string, {
  tagline: string;
  longDescription: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
}> = {
  "notion": {
    tagline: "Organize teamwork and increase productivity",
    longDescription: "Knowledge base, project management, note taking, and more. Notion leverages AI to centralize your team's work, facilitate collaboration, ensure proper project follow-up, and boost overall productivity and efficiency.",
    subcategory: "Collaboration Software",
    rating: 4.5,
    reviewCount: 50,
    testimonial: {
      quote: "I tried to apply for Notion's startup program on my own, but I was not accepted. After joining PerksNest, they approved my request in a matter of days, and now I can benefit from a plan that really helps my business without adding recurring costs, which is great for a startup.",
      author: "Alejandro Goffa",
      role: "Founder, KeySpanish",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  },
  "stripe": {
    tagline: "Manage your online payments",
    longDescription: "Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use their software to accept payments and manage their businesses online.",
    subcategory: "Payment Processing",
    rating: 4.8,
    reviewCount: 120,
    testimonial: {
      quote: "Stripe's integration was seamless and the fee waiver through PerksNest saved us a significant amount during our early growth phase.",
      author: "Sarah Chen",
      role: "CTO, TechStartup",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
  },
  "google-cloud": {
    tagline: "Cloud services by Google",
    longDescription: "Google Cloud Platform is a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.",
    subcategory: "Cloud Computing",
    rating: 4.6,
    reviewCount: 85,
    testimonial: {
      quote: "The Google Cloud credits from PerksNest allowed us to scale our infrastructure without worrying about costs in the early stages.",
      author: "Mike Johnson",
      role: "Founder, CloudApp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  },
};

const saasLogos = [
  { name: "Notion", logo: notionLogo, discount: "-50%" },
  { name: "Stripe", logo: stripeLogo, discount: "-$400" },
  { name: "Google Cloud", logo: googleCloudLogo, discount: "-100%" },
  { name: "Brevo", logo: brevoLogo, discount: "-75%" },
  { name: "Make", logo: makeLogo, discount: "-100%" },
];

const relatedDeals = dealsData.slice(0, 3);

const DealDetail = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isPro, claimDeal } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [partnerDeal, setPartnerDeal] = useState<PartnerDeal | null>(null);
  
  useEffect(() => {
    if (dealId) {
      getPartnerDeals().then(deals => {
        const found = deals.find(d => d.id === dealId && d.status === 'approved');
        setPartnerDeal(found || null);
      });
    }
  }, [dealId]);

  const baseDeal = dealId ? dealsData.find(d => d.id === dealId) : null;
  
  // If it's a partner deal, convert to deal format
  const effectiveDeal = baseDeal || (partnerDeal ? {
    id: partnerDeal.id,
    name: partnerDeal.name,
    company: partnerDeal.partnerName,
    description: partnerDeal.description,
    dealText: partnerDeal.dealText,
    savings: partnerDeal.savings,
    category: partnerDeal.category,
    websiteUrl: partnerDeal.websiteUrl,
    promoCode: partnerDeal.promoCode,
    isFree: true,
    memberCount: partnerDeal.claims || 0,
  } : null);
  const extendedInfo = dealId ? dealExtendedInfo[dealId] : null;

  // Combine base deal with extended info
  const deal = baseDeal ? {
    ...baseDeal,
    tagline: extendedInfo?.tagline || baseDeal.description,
    longDescription: extendedInfo?.longDescription || baseDeal.description,
    subcategory: extendedInfo?.subcategory || "Software",
    rating: extendedInfo?.rating || 4.5,
    reviewCount: extendedInfo?.reviewCount || 50,
    testimonial: extendedInfo?.testimonial || {
      quote: "This deal saved us a lot of money!",
      author: "Happy Customer",
      role: "Founder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  } : null;

  const [isBookmarked, setIsBookmarked] = useState(() => {
    if (!user || !dealId) return false;
    return false; // loaded async below
  });

  const handleBookmark = () => {
    if (!user) { toast.info("Sign in to save deals"); return; }
    if (!dealId) return;
    const result = toggleBookmark(user.id, dealId);
    setIsBookmarked(result);
    toast.success(result ? "Deal saved!" : "Deal removed from saved");
    window.dispatchEvent(new Event('bookmarks-updated'));
  };

  const isClaimed = dealId && user?.claimedDeals.includes(dealId);
  const isPremiumDeal = deal?.isPremium;
  const canClaim = isAuthenticated && (!isPremiumDeal || isPro);

  const handleClaimDeal = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (isPremiumDeal && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (dealId && claimDeal(dealId)) {
      toast.success(`${deal?.name} deal claimed successfully!`);
      // Send confirmation email
      if (user?.email) {
        sendEmail({ type: 'deal_claimed', to: user.email, name: user.name, dealName: deal?.name || dealId || '', promoCode: undefined });
      }
      navigate(`/deals/${dealId}/redeem`);
    } else {
      toast.error('Deal already claimed');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (!deal) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-wide py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Deal not found</h1>
          <Link to="/deals">
            <Button>Browse all deals</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li>
                <Link to="/deals" className="hover:text-foreground transition-colors">
                  {deal.category}
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/deals" className="hover:text-foreground transition-colors">
                  {deal.subcategory}
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">{deal.name} Promo Code</li>
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
                <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center">
                  <span className="text-2xl font-bold text-background">S.</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {deal.name} Promo code
              </h1>

              {/* Tagline */}
              <p className="text-lg text-muted-foreground mb-6">{deal.tagline}</p>

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
                  Redeemed <span className="font-semibold">{deal.memberCount.toLocaleString()}</span> times
                </span>
              </div>

              {/* Testimonial */}
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
                  <p className="text-muted-foreground mb-4">{deal.description}</p>
                  <p className="text-muted-foreground">Visit <a href={`https://${(deal.company || deal.name).toLowerCase().replace(/\s+/g, '')}.com`} target="_blank" rel="noopener" className="text-primary underline">{deal.company || deal.name}</a> to learn more about this product.</p>
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
                    {(deal.features || ["Collaboration tools", "Advanced analytics", "Priority support", "API access", "Custom integrations", "Team management"]).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-4 border border-border rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary text-sm">✓</span>
                        </div>
                        <span className="text-sm font-medium">{f}</span>
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
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <Heart className="h-4 w-4 text-muted-foreground" />
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
                  >
                    {!isAuthenticated && <Lock className="h-4 w-4 mr-2" />}
                    Claim Deal
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

          {/* Reviews Section */}
          <DealReviews dealId={dealId || ''} dealName={deal?.name || ''} />

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

      <Footer />
    </div>
  );
};

export default DealDetail;
