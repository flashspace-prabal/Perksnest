import { useState } from "react";
import { 
  Sparkles, 
  FolderKanban, 
  BarChart3, 
  Users, 
  Code, 
  Megaphone, 
  DollarSign, 
  MessageCircle, 
  ShoppingCart,
  Building2,
  Shield,
  UserCog,
  Zap
} from "lucide-react";

const categories = [
  { id: "all", name: "All Deals", icon: Zap, count: 563 },
  { id: "ai", name: "AI", icon: Sparkles, count: 89 },
  { id: "project", name: "Project Management", icon: FolderKanban, count: 67 },
  { id: "data", name: "Data & Analytics", icon: BarChart3, count: 45 },
  { id: "customer", name: "Customer", icon: Users, count: 52 },
  { id: "development", name: "Development", icon: Code, count: 78 },
  { id: "marketing", name: "Marketing", icon: Megaphone, count: 94 },
  { id: "finance", name: "Finance", icon: DollarSign, count: 38 },
  { id: "communication", name: "Communication", icon: MessageCircle, count: 31 },
  { id: "sales", name: "Sales", icon: ShoppingCart, count: 29 },
  { id: "business", name: "Business", icon: Building2, count: 43 },
  { id: "it", name: "IT & Security", icon: Shield, count: 36 },
  { id: "hr", name: "HR", icon: UserCog, count: 22 },
];

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <section className="border-b border-border bg-card sticky top-16 z-40">
      <div className="container-wide">
        <div className="overflow-x-auto scrollbar-hide py-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;