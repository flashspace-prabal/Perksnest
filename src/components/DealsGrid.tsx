import { useState } from "react";
import { Grid, List, ArrowRight } from "lucide-react";
import DealCard from "./DealCard";
import { Button } from "@/components/ui/button";

const deals = [
  {
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    description: "Organize teamwork and increase productivity",
    dealText: "6 months free on the Business plan with Unlimited AI",
    savings: "$12,000",
    memberCount: 14307,
    isFree: true,
    isPick: false,
  },
  {
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    description: "Manage your online payments",
    dealText: "Waived Stripe fees on your next $20,000 in payment processing",
    savings: "$500",
    memberCount: 5721,
    isPremium: true,
    isFree: false,
    isPick: true,
  },
  {
    name: "Google Cloud",
    logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40d78d7d0825db8ea5ef3b99ab4070381ee86977c9168730/cloud/images/favicons/onecloud/super_cloud.png",
    description: "Cloud services by Google",
    dealText: "$2,000 in credits for 1 year if you never raised funds // $350,000 in credits for 2 years if you did",
    savings: "$350,000",
    memberCount: 9663,
    isFree: true,
  },
  {
    name: "Make",
    logo: "https://images.ctfassets.net/qqlj6g4ee76j/2qBkARKOnfQ4CDnntDdkKM/3c2d0d45ec67ce4ab0e2f77eabb13ec8/make-logo-square-small.png",
    description: "A no-code AI platform for limitless automation",
    dealText: "First month free on Pro plan (10,000 credits) + 40% off Pro or Teams annual plans",
    savings: "$283",
    memberCount: 9806,
    isFree: true,
  },
  {
    name: "Brevo",
    logo: "https://asset.brandfetch.io/idHYpS17EC/idlM3u45p2.jpeg",
    description: "Centralize marketing and sales tools to increase your growth",
    dealText: "75% off the annual Starter and Standard Plans",
    savings: "$5,661",
    memberCount: 4234,
    isFree: true,
    isPick: true,
  },
  {
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/guidelines_the-logo.svg",
    description: "CRM, marketing, sales and service platform",
    dealText: "75% off for 1 year on all HubSpot plans",
    savings: "$7,000",
    memberCount: 8432,
    isPremium: true,
    isFree: false,
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
  {
    name: "Airtable",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
    description: "Low-code platform for building apps",
    dealText: "$2,000 in credits for the first year",
    savings: "$2,000",
    memberCount: 5432,
    isPremium: true,
    isFree: false,
  },
];

const filterOptions = ["Most popular", "Premium", "Free", "Recently added"];

const DealsGrid = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("Most popular");

  return (
    <section className="py-16 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Most popular deals</h2>
            <p className="text-muted-foreground">
              Discover the SaaS deals your team needs to scale faster
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
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

        {/* Filter Pills */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {deals.map((deal, index) => (
            <div 
              key={deal.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DealCard {...deal} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-14">
          <Button size="lg" variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            View all 563 deals
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DealsGrid;