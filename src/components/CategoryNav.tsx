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
  Settings,
  Plane
} from "lucide-react";

const categories = [
  { id: "all", name: "All Deals", icon: Sparkles, count: 563 },
  { id: "ai", name: "AI", icon: Sparkles, count: 89 },
  { id: "project", name: "Project Management", icon: FolderKanban, count: 67 },
  { id: "data", name: "Data", icon: BarChart3, count: 45 },
  { id: "customer", name: "Customer", icon: Users, count: 52 },
  { id: "development", name: "Development", icon: Code, count: 78 },
  { id: "marketing", name: "Marketing", icon: Megaphone, count: 94 },
  { id: "finance", name: "Finance", icon: DollarSign, count: 38 },
  { id: "communication", name: "Communication", icon: MessageCircle, count: 31 },
  { id: "sales", name: "Sales", icon: ShoppingCart, count: 29 },
  { id: "business", name: "Business", icon: Building2, count: 43 },
  { id: "it", name: "IT", icon: Shield, count: 36 },
  { id: "hr", name: "Human Resources", icon: UserCog, count: 22 },
  { id: "operations", name: "Operations", icon: Settings, count: 18 },
  { id: "lifestyle", name: "Lifestyle", icon: Plane, count: 12 },
];

const CategoryNav = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <section className="border-b border-border bg-background sticky top-[104px] z-40">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background text-muted-foreground"
                  }`}>
                    {category.count}
                  </span>
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