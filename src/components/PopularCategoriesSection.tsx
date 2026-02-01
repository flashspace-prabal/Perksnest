import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { dealsData, Deal } from "@/data/deals";

const categoryTabs = [
  { id: "ai", name: "AI" },
  { id: "development", name: "Development" },
  { id: "project", name: "Project Management" },
  { id: "ai-agents", name: "AI Agents" },
  { id: "productivity", name: "Productivity" },
  { id: "ai-automation", name: "AI Automation" },
  { id: "ai-development", name: "AI Development" },
  { id: "no-code", name: "No-Code Development" },
  { id: "marketing", name: "Marketing" },
  { id: "collaboration", name: "Collaboration" },
  { id: "business", name: "Business" },
  { id: "data", name: "Data" },
];

// Map category tabs to deal categories
const getCategoryDeals = (categoryId: string): Deal[] => {
  const categoryMap: Record<string, string[]> = {
    "ai": ["ai"],
    "development": ["development"],
    "project": ["project"],
    "productivity": ["project"],
    "marketing": ["marketing"],
    "collaboration": ["project", "communication"],
    "business": ["business", "sales"],
    "data": ["data"],
  };
  
  const targetCategories = categoryMap[categoryId] || [categoryId];
  return dealsData.filter(deal => targetCategories.includes(deal.category)).slice(0, 9);
};

interface DealCardProps {
  deal: Deal;
}

const DealCard = ({ deal }: DealCardProps) => (
  <Link 
    to={`/deals/${deal.id}`}
    className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-1"
  >
    <div className="flex items-start gap-3 mb-3">
      <SafeImage
        src={deal.logo}
        alt={deal.name}
        className="w-12 h-12 rounded-lg object-contain bg-white p-1.5 border border-border"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-foreground">{deal.name}</h4>
          {deal.isPremium && (
            <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
              ☆ Premium
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Used by {deal.memberCount.toLocaleString()} members
        </p>
      </div>
    </div>
    
    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
      {deal.description}
    </p>
    
    <p className="text-sm text-primary font-medium line-clamp-2 mb-2">
      {deal.dealText}
    </p>
    
    <p className="text-sm text-muted-foreground">
      Save up to {deal.savings}
    </p>
  </Link>
);

const PopularCategoriesSection = () => {
  const [activeTab, setActiveTab] = useState("collaboration");
  const categoryDeals = getCategoryDeals(activeTab);
  const activeTabName = categoryTabs.find(t => t.id === activeTab)?.name || activeTab;

  return (
    <section className="py-16 bg-background">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Most popular categories
          </h2>
          <Link 
            to={`/deals?category=${activeTab}`}
            className="hidden md:flex items-center gap-1 text-primary font-medium hover:underline"
          >
            Browse all {activeTabName} software deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex gap-8">
          {/* Category Tabs Sidebar */}
          <div className="w-64 shrink-0">
            <nav className="space-y-1">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {activeTab === tab.id && <span className="mr-2">•</span>}
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Deals Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
            
            {categoryDeals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No deals found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Browse Link */}
        <div className="md:hidden mt-6 text-center">
          <Link 
            to={`/deals?category=${activeTab}`}
            className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
          >
            Browse all {activeTabName} software deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCategoriesSection;
