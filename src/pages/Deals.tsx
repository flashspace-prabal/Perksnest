import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Grid, List, SlidersHorizontal, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";

const categories = [
  { id: "all", name: "All Deals", count: 563 },
  { id: "ai", name: "AI", count: 89 },
  { id: "project", name: "Project Management", count: 67 },
  { id: "data", name: "Data & Analytics", count: 45 },
  { id: "customer", name: "Customer", count: 52 },
  { id: "development", name: "Development", count: 78 },
  { id: "marketing", name: "Marketing", count: 94 },
  { id: "finance", name: "Finance", count: 38 },
  { id: "communication", name: "Communication", count: 31 },
  { id: "sales", name: "Sales", count: 29 },
  { id: "business", name: "Business", count: 43 },
  { id: "it", name: "IT & Security", count: 36 },
  { id: "hr", name: "HR", count: 22 },
];

const allDeals = [
  {
    id: "notion",
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    description: "Organize teamwork and increase productivity",
    dealText: "6 months free on the Business plan with Unlimited AI",
    savings: "$12,000",
    memberCount: 14307,
    isFree: true,
    isPick: false,
    category: "project",
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    description: "Manage your online payments",
    dealText: "Waived Stripe fees on your next $20,000 in payment processing",
    savings: "$500",
    memberCount: 5721,
    isPremium: true,
    isFree: false,
    isPick: true,
    category: "finance",
  },
  {
    id: "google-cloud",
    name: "Google Cloud",
    logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40d78d7d0825db8ea5ef3b99ab4070381ee86977c9168730/cloud/images/favicons/onecloud/super_cloud.png",
    description: "Cloud services by Google",
    dealText: "$2,000 in credits for 1 year if you never raised funds // $350,000 in credits for 2 years if you did",
    savings: "$350,000",
    memberCount: 9663,
    isFree: true,
    category: "data",
  },
  {
    id: "make",
    name: "Make",
    logo: "https://images.ctfassets.net/qqlj6g4ee76j/2qBkARKOnfQ4CDnntDdkKM/3c2d0d45ec67ce4ab0e2f77eabb13ec8/make-logo-square-small.png",
    description: "A no-code AI platform for limitless automation",
    dealText: "First month free on Pro plan (10,000 credits) + 40% off Pro or Teams annual plans",
    savings: "$283",
    memberCount: 9806,
    isFree: true,
    category: "ai",
  },
  {
    id: "brevo",
    name: "Brevo",
    logo: "https://asset.brandfetch.io/idHYpS17EC/idlM3u45p2.jpeg",
    description: "Centralize marketing and sales tools to increase your growth",
    dealText: "75% off the annual Starter and Standard Plans",
    savings: "$5,661",
    memberCount: 4234,
    isFree: true,
    isPick: true,
    category: "marketing",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
    description: "CRM, marketing, sales and service platform",
    dealText: "75% off for 1 year on all HubSpot plans",
    savings: "$7,000",
    memberCount: 8432,
    isPremium: true,
    isFree: false,
    category: "customer",
  },
  {
    id: "slack",
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    description: "Team communication and collaboration",
    dealText: "25% off your first year on Slack Pro or Business+",
    savings: "$1,200",
    memberCount: 12543,
    isFree: true,
    category: "communication",
  },
  {
    id: "figma",
    name: "Figma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    description: "Collaborative interface design tool",
    dealText: "50% off Professional plan for startups",
    savings: "$600",
    memberCount: 7821,
    isFree: true,
    category: "development",
  },
  {
    id: "airtable",
    name: "Airtable",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
    description: "Low-code platform for building apps",
    dealText: "$2,000 in credits for the first year",
    savings: "$2,000",
    memberCount: 5432,
    isPremium: true,
    isFree: false,
    category: "development",
  },
  {
    id: "intercom",
    name: "Intercom",
    logo: "https://asset.brandfetch.io/idno2Liexv/idmjfvFR3c.jpeg",
    description: "Customer messaging platform",
    dealText: "95% off for Early-stage startups for 1 year",
    savings: "$15,000",
    memberCount: 6234,
    isFree: true,
    isPick: true,
    category: "customer",
  },
  {
    id: "aws",
    name: "AWS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    description: "Cloud computing services",
    dealText: "$100,000 in AWS credits for 2 years",
    savings: "$100,000",
    memberCount: 11234,
    isFree: true,
    category: "data",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Zendesk_logo.svg",
    description: "Customer service software",
    dealText: "6 months free on any Zendesk plan",
    savings: "$3,000",
    memberCount: 4521,
    isPremium: true,
    isFree: false,
    category: "customer",
  },
];

const filterOptions = ["Most popular", "Premium", "Free", "Recently added"];

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState("Most popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredDeals = allDeals.filter((deal) => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || deal.category === activeCategory;
    const matchesFilter = activeFilter === "Most popular" ||
                         (activeFilter === "Premium" && deal.isPremium) ||
                         (activeFilter === "Free" && deal.isFree);
    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-16">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Explore all deals
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Browse {allDeals.length}+ exclusive SaaS deals curated for startups
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for deals (e.g., Notion, Stripe, AWS...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-0 bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground/20 shadow-lg"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="container-wide py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-4">
                <h3 className="font-semibold mb-4">Categories</h3>
                <nav className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs ${
                        activeCategory === category.id 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </nav>

                {/* Notification CTA */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                    <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Get notified</p>
                      <p className="text-xs text-muted-foreground">When new deals are added</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeFilter === filter
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:border-primary/30"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {filteredDeals.length} deals
                  </span>
                  <div className="flex items-center border border-border rounded-lg p-1 bg-card">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "grid" 
                          ? "bg-secondary text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === "list" 
                          ? "bg-secondary text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Deals Grid */}
              {filteredDeals.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {filteredDeals.map((deal, index) => (
                    <Link 
                      key={deal.id}
                      to={`/deals/${deal.id}`}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <DealCard {...deal} />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">No deals found matching your criteria</p>
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("all"); setActiveFilter("Most popular"); }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Deals;