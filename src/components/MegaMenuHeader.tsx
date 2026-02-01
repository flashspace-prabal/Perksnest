import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  Bell,
  Grid3X3,
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
  Briefcase,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/SafeImage";
import { dealsData } from "@/data/deals";

const categories = [
  { 
    id: "ai", 
    name: "AI", 
    icon: Sparkles,
    subcategories: ["AI Development", "AI Automation", "AI Agents", "AI Writing", "AI Marketing", "AI Data Analysis", "AI Customer Support", "AI Productivity", "AI Sales and Business", "AI Design", "AI HR"]
  },
  { 
    id: "project", 
    name: "Project Management", 
    icon: FolderKanban,
    subcategories: ["Collaboration", "Task Management", "Productivity", "Presentation", "Time Management"]
  },
  { 
    id: "data", 
    name: "Data", 
    icon: BarChart3,
    subcategories: ["Analytics", "Business Intelligence", "Data Visualization", "ETL Tools"]
  },
  { 
    id: "customer", 
    name: "Customer", 
    icon: Users,
    subcategories: ["CRM", "Customer Support", "Customer Success", "Live Chat"]
  },
  { 
    id: "development", 
    name: "Development", 
    icon: Code,
    subcategories: ["Developer Tools", "Testing", "No-Code Development", "API Tools"]
  },
  { 
    id: "marketing", 
    name: "Marketing", 
    icon: Megaphone,
    subcategories: ["Email Marketing", "Social Media", "SEO Tools", "Content Marketing"]
  },
  { 
    id: "finance", 
    name: "Finance", 
    icon: DollarSign,
    subcategories: ["Accounting", "Invoicing", "Expense Management"]
  },
  { 
    id: "communication", 
    name: "Communication", 
    icon: MessageCircle,
    subcategories: ["Video Conferencing", "Team Messaging", "Email"]
  },
  { 
    id: "sales", 
    name: "Sales", 
    icon: ShoppingCart,
    subcategories: ["E-commerce", "Sales Automation", "Lead Generation"]
  },
  { 
    id: "business", 
    name: "Business", 
    icon: Building2,
    subcategories: ["Business Operations", "Legal", "Consulting"]
  },
  { 
    id: "it", 
    name: "IT", 
    icon: Shield,
    subcategories: ["Security", "Infrastructure", "DevOps"]
  },
  { 
    id: "hr", 
    name: "Human Resources", 
    icon: UserCog,
    subcategories: ["Recruiting", "HR Management", "Payroll"]
  },
  { 
    id: "operations", 
    name: "Operations Management", 
    icon: Settings,
    subcategories: ["Workflow Automation", "Supply Chain", "Inventory"]
  },
  { 
    id: "lifestyle", 
    name: "Lifestyle", 
    icon: Briefcase,
    subcategories: ["Wellness", "Personal Finance", "Education"]
  },
];

// Get featured deals for mega menu
const featuredDeals = dealsData.slice(0, 8);

const MegaMenuHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dealsMenuOpen, setDealsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-xl text-foreground">perksnest.</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Deals Mega Menu */}
              <div 
                className="relative"
                onMouseEnter={() => setDealsMenuOpen(true)}
                onMouseLeave={() => setDealsMenuOpen(false)}
              >
                <button className={`nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary transition-colors ${dealsMenuOpen ? 'border-b-2 border-foreground' : ''}`}>
                  Deals
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Mega Menu Dropdown */}
                {dealsMenuOpen && (
                  <div className="absolute top-full left-0 w-[1000px] bg-background border border-border rounded-lg shadow-xl -ml-8 animate-fade-in">
                    <div className="flex">
                      {/* Categories Column */}
                      <div className="w-64 border-r border-border p-4 max-h-[500px] overflow-y-auto">
                        {categories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <button
                              key={category.id}
                              onMouseEnter={() => setActiveCategory(category)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                                activeCategory.id === category.id
                                  ? "bg-secondary font-medium text-foreground"
                                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{category.name}</span>
                              {activeCategory.id === category.id && (
                                <span className="ml-auto text-xs">•</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Subcategories Column */}
                      <div className="w-56 border-r border-border p-4">
                        <h4 className="font-semibold text-foreground mb-4">{activeCategory.name}</h4>
                        <div className="space-y-2">
                          {activeCategory.subcategories.map((sub) => (
                            <Link
                              key={sub}
                              to={`/deals?category=${activeCategory.id}&sub=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>

                        {/* Deals Marketplace Card */}
                        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                          <h5 className="font-semibold text-foreground mb-2">Deals marketplace</h5>
                          <p className="text-xs text-muted-foreground mb-3">
                            PerksNest has 590 deals available. Get access to 330 deals for free and 260 deals when you upgrade to Premium.
                          </p>
                          <Link 
                            to="/deals"
                            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                          >
                            Explore marketplace
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Featured Deals Column */}
                      <div className="flex-1 p-4">
                        <div className="grid grid-cols-2 gap-3">
                          {featuredDeals.map((deal) => (
                            <Link
                              key={deal.id}
                              to={`/deals/${deal.id}`}
                              className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                              <SafeImage
                                src={deal.logo}
                                alt={deal.name}
                                className="w-10 h-10 rounded-lg object-contain bg-white p-1 border border-border"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-foreground">{deal.name}</span>
                                  {deal.isPremium && (
                                    <span className="text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">☆ Premium</span>
                                  )}
                                </div>
                                <p className="text-xs text-primary line-clamp-2 mt-0.5">{deal.dealText}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Save up to {deal.savings}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link 
                          to="/deals"
                          className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline mt-4"
                        >
                          Explore most popular deals
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/deals" className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Solutions
                <ChevronDown className="h-4 w-4" />
              </Link>

              <Link to="/invite" className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Invite
              </Link>

              <Link to="/pricing" className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Pricing
              </Link>

              <Link to="/blog" className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for deals"
                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link 
              to="/deals" 
              className="hidden lg:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <Grid3X3 className="h-4 w-4" />
              Explore Marketplace
            </Link>

            <button className="hidden md:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            <button className="hidden md:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Users className="h-5 w-5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link to="/deals" className="nav-link px-3 py-2 rounded-md hover:bg-secondary" onClick={() => setMobileMenuOpen(false)}>Deals</Link>
              <Link to="/pricing" className="nav-link px-3 py-2 rounded-md hover:bg-secondary" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/blog" className="nav-link px-3 py-2 rounded-md hover:bg-secondary" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link to="/invite" className="nav-link px-3 py-2 rounded-md hover:bg-secondary" onClick={() => setMobileMenuOpen(false)}>Invite & Earn</Link>
              <div className="pt-3 border-t border-border mt-2 space-y-2">
                <Button variant="outline" className="w-full border-primary text-primary">Sign in</Button>
                <Link to="/deals" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MegaMenuHeader;
