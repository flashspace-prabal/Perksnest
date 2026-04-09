import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { dealsData, getDealsByCategory } from "@/data/deals";

const CATEGORY_META: Record<string, { name: string; description: string; icon: string }> = {
  project:       { name: "Project Management", description: "Tools to plan, track, and ship your work faster", icon: "📋" },
  marketing:     { name: "Marketing", description: "Grow your audience and reach more customers", icon: "📣" },
  development:   { name: "Development", description: "Dev tools, hosting, and infrastructure deals", icon: "💻" },
  communication: { name: "Communication", description: "Stay connected with your team and customers", icon: "💬" },
  ai:            { name: "AI Tools", description: "The best AI tools with exclusive startup discounts", icon: "🤖" },
  data:          { name: "Data & Analytics", description: "Understand your users and make better decisions", icon: "📊" },
  customer:      { name: "Customer Success", description: "Support, CRM, and customer engagement tools", icon: "🤝" },
  sales:         { name: "Sales", description: "Close more deals with these sales tools", icon: "💰" },
  finance:       { name: "Finance", description: "Payments, accounting, and financial tools", icon: "💳" },
  design:        { name: "Design", description: "Create stunning visuals and UI/UX assets", icon: "🎨" },
};

// Get all unique categories with counts
export const getAllCategories = () => {
  const counts: Record<string, number> = {};
  dealsData.forEach(d => { counts[d.category] = (counts[d.category] || 0) + 1; });
  return Object.entries(counts).map(([id, count]) => ({
    id,
    count,
    ...( CATEGORY_META[id] || { name: id, description: "", icon: "🏷️" })
  })).sort((a, b) => b.count - a.count);
};

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const deals = getDealsByCategory(slug || "");
  const meta = CATEGORY_META[slug || ""] || { name: slug || "", description: "Browse all deals in this category", icon: "🏷️" };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <Link to="/categories" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-white text-sm mb-4">
              <ArrowLeft className="h-4 w-4" /> All Categories
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <span>{meta.icon}</span> {meta.name}
            </h1>
            <p className="text-primary-foreground/80 mt-2 text-lg">{meta.description}</p>
            <p className="text-primary-foreground/60 mt-1 text-sm">{deals.length} deal{deals.length !== 1 ? "s" : ""}</p>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-10">
          {deals.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No deals in this category yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map(deal => <DealCard key={deal.id} {...deal} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Category;
