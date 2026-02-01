import { useState } from "react";
import { ChevronDown, ChevronRight, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
  subcategories?: SubCategory[];
}

const categories: Category[] = [
  { id: "all", name: "All deals", count: 578 },
  { 
    id: "ai", 
    name: "AI", 
    count: 89,
    subcategories: [
      { id: "ai-writing", name: "AI Writing" },
      { id: "ai-image", name: "AI Image" },
      { id: "ai-chat", name: "AI Chat" },
    ]
  },
  { 
    id: "project", 
    name: "Project Management", 
    count: 67,
    subcategories: [
      { id: "collaboration", name: "Collaboration" },
      { id: "task-management", name: "Task Management" },
      { id: "productivity", name: "Productivity" },
      { id: "presentation", name: "Presentation" },
      { id: "time-management", name: "Time Management" },
    ]
  },
  { 
    id: "data", 
    name: "Data", 
    count: 45,
    subcategories: [
      { id: "analytics", name: "Analytics" },
      { id: "business-intelligence", name: "Business Intelligence" },
    ]
  },
  { 
    id: "customer", 
    name: "Customer", 
    count: 52,
    subcategories: [
      { id: "crm", name: "CRM" },
      { id: "support", name: "Support" },
    ]
  },
  { 
    id: "development", 
    name: "Development", 
    count: 78,
    subcategories: [
      { id: "devtools", name: "Developer Tools" },
      { id: "testing", name: "Testing" },
    ]
  },
  { 
    id: "marketing", 
    name: "Marketing", 
    count: 94,
    subcategories: [
      { id: "email-marketing", name: "Email Marketing" },
      { id: "social-media", name: "Social Media" },
    ]
  },
  { id: "finance", name: "Finance", count: 38 },
  { id: "communication", name: "Communication", count: 31 },
  { id: "sales", name: "Sales", count: 29 },
  { id: "business", name: "Business", count: 43 },
  { id: "it", name: "IT & Security", count: 36 },
  { id: "hr", name: "HR", count: 22 },
];

interface CategorySidebarProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySidebar = ({ activeCategory, onCategoryChange }: CategorySidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["project"]);

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="w-64 shrink-0">
      <div className="sticky top-24">
        <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
        
        <nav className="space-y-1">
          {categories.map((category) => (
            <div key={category.id}>
              <button
                onClick={() => {
                  if (category.subcategories) {
                    toggleExpanded(category.id);
                  }
                  onCategoryChange(category.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === category.id
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  {category.subcategories && (
                    <span className="text-muted-foreground">
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  )}
                  {!category.subcategories && category.id === "all" && (
                    <span className="w-2 h-2 rounded-full bg-foreground" />
                  )}
                  <span>{category.name}</span>
                </div>
              </button>
              
              {/* Subcategories */}
              {category.subcategories && expandedCategories.includes(category.id) && (
                <div className="ml-6 mt-1 space-y-1">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onCategoryChange(sub.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        activeCategory === sub.id
                          ? "bg-secondary font-medium text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategorySidebar;
