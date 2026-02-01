import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Check, Crown, Sparkles, Users, ExternalLink, Copy, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { toast } from "sonner";

// Mock deal data
const dealsData: Record<string, {
  name: string;
  logo: string;
  description: string;
  longDescription: string;
  dealText: string;
  savings: string;
  memberCount: number;
  isPremium: boolean;
  isFree: boolean;
  isPick: boolean;
  category: string;
  howToUse: string[];
  eligibility: string[];
  expiresIn: string;
  website: string;
}> = {
  "notion": {
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    description: "Organize teamwork and increase productivity",
    longDescription: "Notion is an all-in-one workspace where you can write, plan, collaborate and get organized. The app allows you to take notes, add tasks, manage projects & more.",
    dealText: "6 months free on the Business plan with Unlimited AI",
    savings: "$12,000",
    memberCount: 14307,
    isFree: true,
    isPremium: false,
    isPick: false,
    category: "Project Management",
    howToUse: [
      "Click the 'Get deal' button to access the offer",
      "Sign up for a new Notion account or log in to your existing account",
      "Enter the promo code provided during checkout",
      "Enjoy 6 months free on the Business plan!",
    ],
    eligibility: [
      "Valid for new Notion Business plan subscribers",
      "Must be a startup with less than $10M in funding",
      "One redemption per company",
    ],
    expiresIn: "30 days",
    website: "https://notion.so",
  },
  "stripe": {
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    description: "Manage your online payments",
    longDescription: "Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use their software to accept payments and manage their businesses online.",
    dealText: "Waived Stripe fees on your next $20,000 in payment processing",
    savings: "$500",
    memberCount: 5721,
    isPremium: true,
    isFree: false,
    isPick: true,
    category: "Finance",
    howToUse: [
      "Upgrade to Secret Premium to access this deal",
      "Click the 'Get deal' button to access the application form",
      "Complete the Stripe Atlas application",
      "Your fee waiver will be automatically applied",
    ],
    eligibility: [
      "Available for Secret Premium members only",
      "Valid for new Stripe accounts",
      "Must process payments within 12 months",
    ],
    expiresIn: "No expiration",
    website: "https://stripe.com",
  },
  "google-cloud": {
    name: "Google Cloud",
    logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40d78d7d0825db8ea5ef3b99ab4070381ee86977c9168730/cloud/images/favicons/onecloud/super_cloud.png",
    description: "Cloud services by Google",
    longDescription: "Google Cloud Platform is a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.",
    dealText: "$2,000 in credits for 1 year if you never raised funds // $350,000 in credits for 2 years if you did",
    savings: "$350,000",
    memberCount: 9663,
    isFree: true,
    isPremium: false,
    isPick: false,
    category: "Cloud & Infrastructure",
    howToUse: [
      "Click the 'Get deal' button",
      "Apply through the Google for Startups Cloud Program",
      "Provide your company details and funding status",
      "Credits will be applied to your Google Cloud account",
    ],
    eligibility: [
      "Must be a startup less than 10 years old",
      "Have not previously received Google Cloud credits",
      "Associated with an approved partner (Secret qualifies!)",
    ],
    expiresIn: "Ongoing",
    website: "https://cloud.google.com",
  },
};

const relatedDeals = [
  {
    name: "Make",
    logo: "https://images.ctfassets.net/qqlj6g4ee76j/2qBkARKOnfQ4CDnntDdkKM/3c2d0d45ec67ce4ab0e2f77eabb13ec8/make-logo-square-small.png",
    description: "A no-code AI platform for limitless automation",
    dealText: "First month free on Pro plan (10,000 credits) + 40% off",
    savings: "$283",
    memberCount: 9806,
    isFree: true,
  },
  {
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    description: "Team communication and collaboration",
    dealText: "25% off your first year on Slack Pro or Business+",
    savings: "$1,200",
    memberCount: 12543,
    isFree: true,
  },
  {
    name: "Figma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    description: "Collaborative interface design tool",
    dealText: "50% off Professional plan for startups",
    savings: "$600",
    memberCount: 7821,
    isFree: true,
  },
];

const DealDetail = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const deal = dealId ? dealsData[dealId] : null;

  const handleCopyLink = () => {
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
          <div className="mb-8">
            <Link 
              to="/deals" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to deals
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Deal Header */}
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border">
                    <img src={deal.logo} alt={deal.name} className="w-12 h-12 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">{deal.name}</h1>
                      {deal.isPremium && (
                        <span className="badge-premium">
                          <Crown className="h-3 w-3" />
                          Premium
                        </span>
                      )}
                      {deal.isPick && (
                        <span className="badge-pick">
                          <Sparkles className="h-3 w-3" />
                          Top Pick
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{deal.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {deal.memberCount.toLocaleString()} members using this
                      </span>
                      <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                        {deal.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed mb-6">{deal.longDescription}</p>

                {/* Deal Offer */}
                <div className="bg-accent/30 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-2">The Deal</h3>
                  <p className="text-foreground text-lg mb-3">{deal.dealText}</p>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-bold bg-success/10 text-success">
                    Save up to {deal.savings}
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gap-2">
                    {deal.isFree ? "Get deal for free" : "Get deal"}
                    <ArrowUpRight className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="gap-2" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                    Share
                  </Button>
                  <a href={deal.website} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Visit website
                    </Button>
                  </a>
                </div>
              </div>

              {/* How to Use */}
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  How to use this deal
                </h2>
                <ol className="space-y-4">
                  {deal.howToUse.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-foreground pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Eligibility */}
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold mb-4">Deal Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Expires in
                    </span>
                    <span className="font-medium">{deal.expiresIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Access</span>
                    <span className={`font-medium ${deal.isFree ? 'text-success' : 'text-primary'}`}>
                      {deal.isFree ? 'Free' : 'Premium'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{deal.category}</span>
                  </div>
                </div>
              </div>

              {/* Premium Upsell */}
              {!deal.isFree && (
                <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
                  <Crown className="h-8 w-8 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Unlock Premium Deals</h3>
                  <p className="text-primary-foreground/80 text-sm mb-4">
                    Get access to all premium deals including this one with Secret Premium.
                  </p>
                  <Link to="/pricing">
                    <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                      Upgrade for $149/year
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Related Deals */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">People also liked these deals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDeals.map((deal) => (
                <Link key={deal.name} to={`/deals/${deal.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <DealCard {...deal} />
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