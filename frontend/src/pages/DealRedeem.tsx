import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Copy, ExternalLink, Clock, Shield, Star, Gift, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthModal } from "@/components/AuthModal";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { getDeal } from "@/lib/deals";
import { Deal } from "@/data/deals";

// Extended redemption info
const redemptionInfo: Record<string, {
  promoCode?: string;
  website: string;
  steps: {
    title: string;
    description: string;
    link?: string;
    linkText?: string;
  }[];
  eligibility: string[];
  expiresIn: string;
}> = {
  "notion": {
    promoCode: "PERKSNEST2024",
    website: "https://notion.so",
    steps: [
      {
        title: "Create or sign in to your Notion account",
        description: "Visit Notion's website and create a new workspace or sign in to your existing account.",
        link: "https://notion.so/signup",
        linkText: "Go to Notion",
      },
      {
        title: "Navigate to Settings & Members",
        description: "Click on 'Settings & Members' in the left sidebar of your Notion workspace.",
      },
      {
        title: "Go to Plans & Billing",
        description: "Select 'Plans' or 'Upgrade' to access the billing section.",
      },
      {
        title: "Apply the promo code",
        description: "Enter the promo code below during checkout to get 6 months free on the Business plan.",
      },
      {
        title: "Enjoy your deal!",
        description: "Once applied, you'll have access to Notion Business with Unlimited AI for 6 months free.",
      },
    ],
    eligibility: [
      "New Notion Business plan subscribers only",
      "Startups with less than $10M in funding",
      "One redemption per company",
      "Must be a registered business",
    ],
    expiresIn: "30 days",
  },
  "stripe": {
    website: "https://stripe.com",
    steps: [
      {
        title: "Upgrade to Premium",
        description: "This deal requires a PerksNest Premium membership. Upgrade to access exclusive deals.",
        link: "/pricing",
        linkText: "View Premium Plans",
      },
      {
        title: "Apply through Stripe Atlas",
        description: "Complete the Stripe Atlas application to qualify for the fee waiver program.",
      },
      {
        title: "Get your fees waived",
        description: "Your processing fees will be automatically waived on your first $20,000.",
      },
    ],
    eligibility: [
      "PerksNest Premium members only",
      "New Stripe accounts",
      "Must process payments within 12 months",
    ],
    expiresIn: "No expiration",
  },
  "google-cloud": {
    website: "https://cloud.google.com",
    steps: [
      {
        title: "Check your eligibility",
        description: "Confirm you're a startup less than 10 years old and haven't received Google Cloud credits before.",
      },
      {
        title: "Apply through Google for Startups",
        description: "Use our partner link to apply for the Google for Startups Cloud Program.",
        link: "https://cloud.google.com/startup",
        linkText: "Apply Now",
      },
      {
        title: "Provide company details",
        description: "Fill out your company information and funding status in the application.",
      },
      {
        title: "Receive your credits",
        description: "Once approved, credits will be applied to your Google Cloud account within 5-7 business days.",
      },
    ],
    eligibility: [
      "Startups less than 10 years old",
      "Have not previously received Google Cloud credits",
      "Associated with an approved partner (PerksNest qualifies!)",
      "Valid business registration required",
    ],
    expiresIn: "Ongoing",
  },
  "make": {
    promoCode: "PERKSNESTMAKE40",
    website: "https://make.com",
    steps: [
      {
        title: "Sign up for Make",
        description: "Create a new Make account or sign in to your existing one.",
        link: "https://make.com/register",
        linkText: "Create Account",
      },
      {
        title: "Choose the Pro plan",
        description: "Navigate to pricing and select the Pro plan (monthly or annual).",
      },
      {
        title: "Apply the discount code",
        description: "Enter the promo code below at checkout for your first month free + 40% off annual.",
      },
      {
        title: "Start automating",
        description: "Build your first automation scenario with 10,000 operations included.",
      },
    ],
    eligibility: [
      "New Make Pro subscribers",
      "One redemption per account",
      "Valid for annual plans only for the 40% discount",
    ],
    expiresIn: "60 days",
  },
};

// Default redemption info for deals without specific info
const defaultRedemptionInfo = {
  website: "#",
  steps: [
    {
      title: "Sign up through PerksNest",
      description: "Click the button below to visit the partner website and create your account.",
    },
    {
      title: "Apply your discount",
      description: "Your discount will be automatically applied when you sign up through our link.",
    },
  ],
  eligibility: [
    "New customers only",
    "One redemption per account",
  ],
  expiresIn: "Ongoing",
};

const DealRedeem = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [baseDeal, setBaseDeal] = useState<Deal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (dealId) {
      getDeal(dealId)
        .then(deal => setBaseDeal(deal))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dealId]);

  const redemption = dealId && redemptionInfo[dealId] ? redemptionInfo[dealId] : defaultRedemptionInfo;

  const deal = baseDeal ? {
    ...baseDeal,
    promoCode: redemption.promoCode,
    website: redemption.website,
    steps: redemption.steps,
    eligibility: redemption.eligibility,
    expiresIn: redemption.expiresIn,
  } : null;

  const isClaimed = dealId && user?.claimedDeals.includes(dealId);
  const isPremiumDeal = deal?.isPremium;
  const canViewCode = isAuthenticated && isClaimed && (!isPremiumDeal || user?.plan === 'premium');

  const handleCopyCode = () => {
    if (deal?.promoCode && canViewCode) {
      navigator.clipboard.writeText(deal.promoCode);
      toast.success("Promo code copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-wide py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading deal...</h1>
        </div>
        <Footer />
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="container-wide max-w-4xl">
          {/* Back Link */}
          <Link 
            to={`/deals/${dealId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to deal details
          </Link>

          {/* Deal Header Card */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border">
                <img src={deal.logo} alt={deal.name} className="w-12 h-12 object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{deal.name}</h1>
                  {deal.isFree ? (
                    <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">
                      Free
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">{deal.description}</p>
                
                {/* Deal & Savings */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Gift className="h-5 w-5" />
                    {deal.dealText}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Used by <span className="font-semibold text-foreground">{deal.memberCount.toLocaleString()}</span> members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expires in: <span className="font-semibold text-foreground">{deal.expiresIn}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-success/10 text-success font-semibold rounded-full">
                  Save up to {deal.savings}
                </span>
              </div>
            </div>
          </div>

          {/* Auth Check Alert */}
          {!isAuthenticated && (
            <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Please sign in to view the promo code and redemption instructions.
                <Button
                  variant="link"
                  className="h-auto p-0 ml-2 text-primary"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign in now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Not Claimed Alert */}
          {isAuthenticated && !isClaimed && (
            <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                You need to claim this deal first to view the promo code.
                <Link to={`/deals/${dealId}`}>
                  <Button variant="link" className="h-auto p-0 ml-2 text-primary">
                    Claim deal
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Premium Lock Alert */}
          {isAuthenticated && isPremiumDeal && !(user?.plan === 'premium') && (
            <Alert className="mb-8 border-primary/50 bg-primary/10">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                This is a premium deal. Upgrade to Pro to access it.
                <Link to="/pricing">
                  <Button variant="link" className="h-auto p-0 ml-2 text-primary">
                    View plans
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Promo Code Card (if available and accessible) */}
          {deal.promoCode && (
            <div className={`bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 ${!canViewCode ? 'blur-sm pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your promo code</p>
                  <p className="text-2xl font-bold font-mono text-foreground tracking-wider">
                    {canViewCode ? deal.promoCode : '••••••••'}
                  </p>
                </div>
                <Button onClick={handleCopyCode} variant="outline" className="gap-2" disabled={!canViewCode}>
                  <Copy className="h-4 w-4" />
                  Copy Code
                </Button>
              </div>
            </div>
          )}

          {/* Step by Step Instructions */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Check className="h-5 w-5 text-success" />
              How to redeem this deal
            </h2>
            
            <div className="space-y-6">
              {deal.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shrink-0">
                      {index + 1}
                    </div>
                    {index < deal.steps.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    {step.link && (
                      <Link 
                        to={step.link}
                        target={step.link.startsWith('http') ? '_blank' : undefined}
                        rel={step.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <Button variant="outline" size="sm" className="gap-2">
                          {step.linkText}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Eligibility requirements
            </h2>
            <ul className="space-y-3">
              {deal.eligibility.map((req, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <span className="text-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Footer */}
          <div className="flex flex-wrap gap-4">
            <a href={deal.website} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" className="w-full gap-2 h-14 text-lg">
                <ExternalLink className="h-5 w-5" />
                Go to {deal.name}
              </Button>
            </a>
            <Link to={`/deals/${dealId}`} className="flex-1">
              <Button size="lg" variant="outline" className="w-full h-14 text-lg">
                View full deal details
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default DealRedeem;
