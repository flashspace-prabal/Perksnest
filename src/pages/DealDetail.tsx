import { useParams, Link } from "react-router-dom";
import { Star, Heart, Share2, Info, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCardNew from "@/components/DealCardNew";
import SafeImage from "@/components/SafeImage";
import { toast } from "sonner";
import { dealsData } from "@/data/deals";

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
      quote: "I tried to apply for Notion's startup program on my own, but I was not accepted. After joining Secret, they approved my request in a matter of days, and now I can benefit from a plan that really helps my business without adding recurring costs, which is great for a startup.",
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
      quote: "Stripe's integration was seamless and the fee waiver through Secret saved us a significant amount during our early growth phase.",
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
      quote: "The Google Cloud credits from Secret allowed us to scale our infrastructure without worrying about costs in the early stages.",
      author: "Mike Johnson",
      role: "Founder, CloudApp",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
  },
};

const saasLogos = [
  { logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", discount: "-50%" },
  { logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", discount: "-$400" },
  { logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40d78d7d0825db8ea5ef3b99ab4070381ee86977c9168730/cloud/images/favicons/onecloud/super_cloud.png", discount: "-100%" },
  { logo: "https://www.brevo.com/wp-content/uploads/2024/01/Logo.svg", discount: "-75%" },
  { logo: "https://www.make.com/en/apple-touch-icon.png", discount: "-100%" },
];

const relatedDeals = dealsData.slice(0, 3);

const DealDetail = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const baseDeal = dealId ? dealsData.find(d => d.id === dealId) : null;
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
                            <SafeImage src={item.logo} alt="" className="w-6 h-6 object-contain" />
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
                  {/* More deal content would go here */}
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
                <Button className="w-full h-12 text-base font-semibold">
                  View instructions
                </Button>
              </div>
            </div>
          </div>

          {/* Related Deals */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-8">People also liked these deals</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedDeals.map((deal) => (
                <Link key={deal.id} to={`/deals/${deal.id}`}>
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
