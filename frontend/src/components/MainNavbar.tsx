import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight,
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
  LayoutDashboard,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { dealsData } from "@/data/deals";
import SafeImage from "./SafeImage";

// Category Data from original MegaMenu - Fully Enriched
const categories = [
  { 
    id: "ai", 
    name: "AI", 
    icon: Sparkles,
    subcategories: ["AI Development", "AI Automation", "AI Agents", "AI Writing", "AI Marketing", "AI Data Analysis"]
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

const featuredDeals = dealsData.slice(0, 4);

const MainNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
    setProfileMenuOpen(false);
  }, [location]);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const getUserInitials = () => user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'U';
  const portalLinks = [
    { label: "User Portal", to: "/customer", icon: LayoutDashboard },
    ...(isAdmin ? [{ label: "Admin Portal", to: "/admin", icon: ShieldCheck }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/" className="text-[#5c2169] font-bold text-2xl tracking-tighter hover:opacity-90 transition-opacity">
              perksnest
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {/* Products (Mega Menu) */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveMenu("products")}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className={`flex items-center gap-1.5 px-4 py-2 text-[15px] font-medium transition-colors ${activeMenu === "products" ? 'text-gray-900 border-b-2 border-[#5c2169]' : 'text-gray-600 hover:text-gray-900'}`}>
                  Products
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeMenu === "products" ? 'rotate-180' : ''}`} />
                </button>

                {/* Mega Menu Dropdown - Enriched with all categories */}
                {activeMenu === "products" && (
                  <div className="absolute top-full -left-20 w-[950px] bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 flex">
                    {/* Left Column: Categories List */}
                    <div className="w-72 bg-gray-50/50 p-6 border-r border-gray-100 max-h-[550px] overflow-y-auto custom-scrollbar">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-5">Categories</h4>
                      <div className="space-y-0.5">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          const isActive = activeCategory.id === cat.id;
                          return (
                            <button
                              key={cat.id}
                              onMouseEnter={() => setActiveCategory(cat)}
                              onClick={() => navigate(`/deals?category=${cat.id}`)}
                              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm transition-all group ${isActive ? 'bg-white text-[#5c2169] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border ${isActive ? 'bg-[#5c2169]/5 border-[#5c2169]/20 text-[#5c2169]' : 'bg-white border-gray-100 text-gray-400 group-hover:text-gray-700'}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="font-semibold">{cat.name}</span>
                              </div>
                              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#5c2169]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Sub-navigation & Deals */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="flex flex-1">
                            {/* Subcategories */}
                            <div className="w-64 p-8 border-r border-gray-50">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">{activeCategory.name} Sub-links</h4>
                                <div className="space-y-4">
                                    {activeCategory.subcategories.map((sub) => (
                                    <Link
                                        key={sub}
                                        to={`/deals?category=${activeCategory.id}&sub=${sub.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="block text-[14px] font-medium text-gray-600 hover:text-[#5c2169] transition-colors"
                                    >
                                        {sub}
                                    </Link>
                                    ))}
                                </div>
                                <div className="mt-10 pt-6 border-t border-gray-100">
                                    <Link to={`/deals?category=${activeCategory.id}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5c2169] group/all">
                                        View all {activeCategory.name}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover/all:translate-x-1" />
                                    </Link>
                                </div>
                            </div>

                            {/* Featured Selection */}
                            <div className="flex-1 p-8 bg-gray-50/20">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Handpicked Deals</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {featuredDeals.slice(0, 3).map((deal) => (
                                        <Link
                                            key={deal.id}
                                            to={`/deals/${deal.id}`}
                                            className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl hover:border-[#5c2169]/30 transition-all shadow-sm shadow-gray-100/50 group/select"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2.5 border border-gray-50 group-hover/select:bg-white transition-colors">
                                            <SafeImage src={deal.logo} alt={deal.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="font-bold text-gray-900 text-[14px]">{deal.name}</span>
                                                    <span className="text-[9px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">ACTIVE</span>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-1">{deal.dealText}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                
                                <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-[#5c2169] to-[#4a1a52] text-white">
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Exclusive Offer</p>
                                    <h5 className="font-bold text-lg mb-1">Featured Newsletter</h5>
                                    <p className="text-xs opacity-90 mb-4 whitespace-nowrap">Join 50k+ founders getting weekly perks.</p>
                                    <Link to="/signup" className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-white text-[#5c2169] text-xs font-bold hover:bg-gray-50 transition-colors">
                                        Subscribe
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                )}
              </div>

   

              <Link to="/pricing" className="px-4 py-2 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link to="/blog" className="px-4 py-2 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link to="/invite" className="px-4 py-2 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Invite
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isAuthenticated ? (
                <>
                <Link 
                    to="/login" 
                    className="hidden sm:block px-4 py-2 text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Sign in
                </Link>
                <Link 
                    to="/signup"
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#5c2169] hover:bg-[#4a1a52] text-white text-[15px] font-bold rounded-full transition-all shadow-lg shadow-[#5c2169]/20 active:scale-95"
                >
                    Join PerksNest
                    <ArrowRight className="h-4 w-4" />
                </Link>
                </>
            ) : (
                <div className="relative flex items-center gap-3">
                   <button
                    type="button"
                    onClick={() => setProfileMenuOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-2 py-1.5 hover:bg-gray-100 transition-colors"
                   >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
                        <span className="text-sm font-bold text-[#5c2169]">{getUserInitials()}</span>
                      </span>
                      <ChevronDown className={`hidden sm:block h-4 w-4 text-gray-500 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
                   </button>
                   {profileMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
                      <div className="border-b border-gray-100 px-3 py-2">
                        <p className="truncate text-sm font-semibold text-gray-900">{user?.name || "User"}</p>
                        <p className="truncate text-xs text-gray-500">{user?.email || ""}</p>
                      </div>
                      <div className="py-2">
                        {portalLinks.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              onClick={() => setProfileMenuOpen(false)}
                            >
                              <Icon className="h-4 w-4 text-[#5c2169]" />
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={() => {
                            setProfileMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                          <LogOut className="h-4 w-4 text-gray-500" />
                          Sign out
                        </button>
                      </div>
                    </div>
                   )}
                </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-300">
            <nav className="flex flex-col gap-6">
              <div className="space-y-4 px-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">Navigation</p>
                  <Link to="/deals" className="block px-4 py-2 text-lg font-semibold text-gray-900">Browse Deals</Link>
                  <Link to="/pricing" className="block px-4 py-2 text-lg font-semibold text-gray-900">Pricing</Link>
                  <Link to="/blog" className="block px-4 py-2 text-lg font-semibold text-gray-900">Blog</Link>
                  <Link to="/invite" className="block px-4 py-2 text-lg font-semibold text-gray-900">Invite & Earn</Link>
              </div>
              
              <div className="space-y-4 px-2">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4">Categories</p>
                   <div className="grid grid-cols-2 gap-2 px-2">
                        {categories.map(cat => (
                            <Link key={cat.id} to={`/deals?category=${cat.id}`} className="p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-700">{cat.name}</Link>
                        ))}
                   </div>
              </div>
            </nav>

            <div className="flex flex-col gap-3 pt-6 border-t px-4">
              {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="flex items-center justify-center py-4 text-gray-700 font-bold border-2 rounded-2xl">Sign in</Link>
                    <Link to="/signup" className="flex items-center justify-center py-4 bg-[#5c2169] text-white font-bold rounded-2xl shadow-xl shadow-[#5c2169]/20">Get started</Link>
                  </>
                ) : (
                <>
                  {portalLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-4 text-sm font-bold text-gray-800"
                      >
                        <Icon className="h-4 w-4 text-[#5c2169]" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <button 
                    onClick={() => logout()}
                    className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainNavbar;
