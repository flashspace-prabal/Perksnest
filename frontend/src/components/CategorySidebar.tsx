import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { dealsData } from "@/data/deals";

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

// Map template category IDs to actual deal category values
const categoryMapping: Record<string, string[]> = {
  "ai": ["ai"],
  "project": ["productivity"],
  "data": ["cloud", "database", "storage", "infrastructure", "analytics", "monitoring"],
  "customer": ["crm", "support"],
  "development": ["deployment", "ci-cd", "web3", "automation"],
  "marketing": [], // No specific marketing deals in current data
  "finance": ["finance", "payments"],
  "communication": ["communication"],
  "sales": [], // No specific sales deals in current data
  "business": [], // No specific business deals in current data
  "it": ["security", "tools", "backup", "forms"],
  "hr": ["hr"],
};

const categoryTemplates: Omit<Category, 'count'>[] = [
  { id: "all", name: "All deals" },
  { id: "ai", name: "AI" },
  { id: "project", name: "Project Management", subcategories: [
    { id: "collaboration", name: "Collaboration" },
    { id: "task", name: "Task Management" },
    { id: "productivity", name: "Productivity" },
    { id: "presentation", name: "Presentation" },
    { id: "time", name: "Time Management" },
  ]},
  { id: "data", name: "Data & Cloud" },
  { id: "customer", name: "Customer" },
  { id: "development", name: "Development" },
  { id: "marketing", name: "Marketing" },
  { id: "finance", name: "Finance" },
  { id: "communication", name: "Communication" },
  { id: "sales", name: "Sales" },
  { id: "business", name: "Business" },
  { id: "it", name: "IT & Security" },
  { id: "hr", name: "HR" },
];

interface CategorySidebarProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySidebar = ({ activeCategory, onCategoryChange }: CategorySidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: dealsData.length };
    
    // Count deals for each template category
    Object.entries(categoryMapping).forEach(([templateId, categoryValues]) => {
      const count = dealsData.filter(deal => categoryValues.includes(deal.category)).length;
      counts[templateId] = count;
    });
    
    return counts;
  }, []);

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  return (
    <div className="w-56 shrink-0 hidden lg:block">
      <div className="sticky top-24">
        <h3 className="text-base font-semibold text-foreground mb-3">Categories</h3>
        <nav className="space-y-0.5">
          {categoryTemplates.map((template) => {
            const count = categoryCounts[template.id] || 0;
            const isActive = activeCategory === template.id;
            const isExpanded = expandedCategories.includes(template.id);

            return (
              <div key={template.id}>
                <button
                  onClick={() => {
                    if (template.subcategories) toggleExpanded(template.id);
                    onCategoryChange(template.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {template.subcategories ? (
                      <span className="text-muted-foreground">
                        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                      </span>
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-transparent shrink-0" />
                    )}
                    <span>{template.name}</span>
                  </div>
                  {count > 0 && (
                    <span className={`text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{count}</span>
                  )}
                </button>

                {template.subcategories && isExpanded && (
                  <div className="ml-5 mt-0.5 space-y-0.5">
                    {template.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => onCategoryChange(sub.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          activeCategory === sub.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default CategorySidebar;
