import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Grid, List, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCardNew from "@/components/DealCardNew";
import CategorySidebar from "@/components/CategorySidebar";

const allDeals = [
  {
    id: "notion",
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    description: "Organize teamwork and increase productivity",
    dealText: "6 months free on the Business plan with Unlimited AI",
    savings: "$12,000",
    memberCount: 14308,
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
    isPick: false,
    category: "finance",
  },
  {
    id: "google-cloud",
    name: "Google Cloud (GCP)",
    logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40d78d7d0825db8ea5ef3b99ab4070381ee86977c9168730/cloud/images/favicons/onecloud/super_cloud.png",
    description: "Cloud services by Google",
    dealText: "$2,000 in credits for 1 year if you never raised funds //...",
    savings: "$350,000",
    memberCount: 9663,
    isFree: true,
    isPick: true,
    category: "data",
  },
  {
    id: "make",
    name: "Make",
    logo: "https://images.ctfassets.net/qqlj6g4ee76j/2qBkARKOnfQ4CDnntDdkKM/3c2d0d45ec67ce4ab0e2f77eabb13ec8/make-logo-square-small.png",
    description: "A no-code AI platform for limitless automation",
    dealText: "First month free on Pro plan (10,000 credits) + 40% off Pro or Teams annual plans",
    savings: "$283",
    memberCount: 9812,
    isFree: true,
    isPick: false,
    category: "ai",
  },
  {
    id: "brevo",
    name: "Brevo (ex. Sendinblue)",
    logo: "https://asset.brandfetch.io/idHYpS17EC/idlM3u45p2.jpeg",
    description: "Centralize marketing and sales tools to increase your growth",
    dealText: "75% off the annual Starter and Standard Plans",
    savings: "$5,661",
    memberCount: 4236,
    isFree: true,
    isPick: false,
    category: "marketing",
  },
  {
    id: "zoom",
    name: "Zoom Meetings",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
    description: "Communication and collaboration platform",
    dealText: "30% off Zoom One Pro or Zoom One Business for 1 year",
    savings: "$1,200",
    memberCount: 1863,
    isFree: true,
    isPick: true,
    category: "communication",
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
    isPick: false,
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
    isPick: false,
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
    isPick: false,
    category: "development",
  },
];

const filterOptions = ["Most popular", "Premium", "Free", "Recently added"];

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState("Most popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
      
      <main className="py-8">
        <div className="container-wide">
          {/* Notification Banner */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center gap-4 px-6 py-3 bg-card border border-border rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">W</div>
                  <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">▶</div>
                  <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">N</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Never miss savings</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Enable browser notifications and be the first to know when a new deal drops
              </span>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>

          <div className="flex gap-10">
            {/* Sidebar */}
            <CategorySidebar 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeFilter === filter
                          ? "bg-foreground text-background"
                          : "bg-card border border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    1 to {filteredDeals.length} of {allDeals.length} results
                  </span>
                  <div className="flex items-center border border-border rounded-lg bg-card">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 transition-colors ${
                        viewMode === "list" 
                          ? "text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 transition-colors ${
                        viewMode === "grid" 
                          ? "text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Title */}
              <h2 className="text-2xl font-bold text-foreground mb-6">Most Popular Deals</h2>

              {/* Deals Grid */}
              {filteredDeals.length > 0 ? (
                <div className={`grid gap-5 ${
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
                      <DealCardNew {...deal} />
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
