import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, Bell, User, ChevronDown, Menu, X, Package,
  Crown, Sparkles, ArrowUpRight, LogOut, Settings, LayoutGrid,
  Brain, FolderKanban, Database, Users, Code2, Megaphone,
  DollarSign, MessageSquare, ShoppingCart, Briefcase, Monitor, UserCog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/lib/auth";
import { dealsData } from "@/data/deals";

// ─── Category definitions with icons, subcategories, and deal category keys ───
const megaCategories = [
  {
    name: "AI",
    icon: Brain,
    keys: ["ai"],
    subs: ["AI Development", "AI Automation", "AI Agents", "AI Writing", "AI Marketing", "AI Data Analysis", "AI Customer Support", "AI Productivity", "AI Sales & Business", "AI Design", "AI HR"],
  },
  {
    name: "Project Management",
    icon: FolderKanban,
    keys: ["project", "productivity"],
    subs: ["Collaboration", "Task Management", "Productivity", "Time Tracking", "Documentation", "Workflow Automation"],
  },
  {
    name: "Data & Analytics",
    icon: Database,
    keys: ["data", "analytics", "database"],
    subs: ["Business Intelligence", "Data Visualization", "Product Analytics", "Data Warehousing", "ETL & Pipelines"],
  },
  {
    name: "Customer",
    icon: Users,
    keys: ["customer", "crm"],
    subs: ["CRM", "Customer Success", "Live Chat", "Help Desk", "Community", "Feedback"],
  },
  {
    name: "Development",
    icon: Code2,
    keys: ["development", "infrastructure", "cloud"],
    subs: ["Web Development", "No-Code", "APIs", "DevOps", "Cloud Hosting", "CI/CD", "Monitoring"],
  },
  {
    name: "Marketing",
    icon: Megaphone,
    keys: ["marketing"],
    subs: ["Email Marketing", "SEO", "Social Media", "Content Marketing", "Advertising", "Influencer Marketing", "Marketing Automation"],
  },
  {
    name: "Finance",
    icon: DollarSign,
    keys: ["finance"],
    subs: ["Payments", "Accounting", "Banking", "Invoicing", "Expense Management", "Tax"],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    keys: ["communication"],
    subs: ["Messaging", "Video Conferencing", "Email", "VoIP", "Team Chat"],
  },
  {
    name: "Sales",
    icon: ShoppingCart,
    keys: ["sales"],
    subs: ["Sales Automation", "Lead Generation", "Proposals", "E-commerce", "Outreach"],
  },
  {
    name: "Design",
    icon: LayoutGrid,
    keys: ["design"],
    subs: ["UI/UX Design", "Graphic Design", "Prototyping", "Video Editing", "Brand Assets"],
  },
  {
    name: "IT & Security",
    icon: Monitor,
    keys: ["it", "automation"],
    subs: ["Cybersecurity", "Identity Management", "Device Management", "Compliance"],
  },
  {
    name: "Human Resources",
    icon: UserCog,
    keys: ["hr"],
    subs: ["Recruitment", "Payroll", "Performance", "Onboarding", "Benefits"],
  },
];

// Get featured deals for a mega category
function getFeaturedDeals(cat: typeof megaCategories[0]) {
  return dealsData
    .filter((d) => cat.keys.includes(d.category))
    .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
    .slice(0, 6);
}

// Solutions testimonials
const solutionsTestimonials = [
  { name: "Sarah Chen", role: "CTO, TechFlow", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah", quote: "PerksNest saved us over $50K in our first year. The deals are incredible." },
  { name: "Marcus Rivera", role: "Founder, LaunchPad", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus", quote: "The white-label solution is perfect for our accelerator portfolio." },
  { name: "Priya Sharma", role: "Head of Ops, ScaleUp", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya", quote: "We integrated PerksNest into our onboarding. Every new hire gets access." },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/deals?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const activeCat = megaCategories[hoveredCat];
  const featuredDeals = getFeaturedDeals(activeCat);
  const totalDeals = dealsData.length;
  const freeDeals = dealsData.filter((d) => d.isFree || !d.isPremium).length;
  const premiumDeals = totalDeals - freeDeals;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Promo Banner removed */}

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 relative z-10">
              <svg width="28" height="28" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.712 35.746c0 3.218-2.61 5.828-5.828 5.828-3.219 0-5.829-2.61-5.829-5.828 0-3.219 2.61-5.829 5.829-5.829h5.828v5.829z" fill="#E01E5A"/>
                <path d="M22.608 35.746c0-3.219 2.61-5.829 5.828-5.829 3.219 0 5.829 2.61 5.829 5.829v14.571c0 3.218-2.61 5.828-5.829 5.828-3.218 0-5.828-2.61-5.828-5.828V35.746z" fill="#E01E5A"/>
                <path d="M28.436 19.712c-3.218 0-5.828-2.61-5.828-5.828 0-3.219 2.61-5.829 5.828-5.829 3.219 0 5.829 2.61 5.829 5.829v5.828h-5.829z" fill="#36C5F0"/>
                <path d="M28.436 22.608c3.219 0 5.829 2.61 5.829 5.828 0 3.219-2.61 5.829-5.829 5.829H13.884c-3.218 0-5.828-2.61-5.828-5.829 0-3.218 2.61-5.828 5.828-5.828h14.552z" fill="#36C5F0"/>
                <path d="M44.471 28.436c0-3.218 2.61-5.828 5.828-5.828 3.219 0 5.829 2.61 5.829 5.828 0 3.219-2.61 5.829-5.829 5.829h-5.828v-5.829z" fill="#2EB67D"/>
                <path d="M41.575 28.436c0 3.219-2.61 5.829-5.829 5.829-3.218 0-5.828-2.61-5.828-5.829V13.884c0-3.218 2.61-5.828 5.828-5.828 3.219 0 5.829 2.61 5.829 5.828v14.552z" fill="#2EB67D"/>
                <path d="M35.746 44.471c3.219 0 5.829 2.61 5.829 5.828 0 3.219-2.61 5.829-5.829 5.829-3.218 0-5.828-2.61-5.828-5.829v-5.828h5.828z" fill="#ECB22E"/>
                <path d="M35.746 41.575c-3.218 0-5.828-2.61-5.828-5.829 0-3.218 2.61-5.828 5.828-5.828h14.571c3.218 0 5.828 2.61 5.828 5.828 0 3.219-2.61 5.829-5.828 5.829H35.746z" fill="#ECB22E"/>
              </svg>
              <span className="font-bold text-xl text-foreground">perksnest.</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* ═══ DEALS MEGA MENU ═══ */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className="nav-link bg-transparent hover:bg-secondary data-[state=open]:bg-secondary px-3 py-2"
                      onMouseEnter={() => setHoveredCat(0)}
                    >
                      Deals
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[820px] p-0">
                        <div className="flex" style={{ minHeight: '520px' }}>
                          {/* Left: Categories */}
                          <div className="w-[200px] py-3 border-r border-border bg-muted/30 shrink-0">
                            {megaCategories.map((cat, i) => {
                              const Icon = cat.icon;
                              return (
                                <button
                                  key={cat.name}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                                    hoveredCat === i
                                      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
                                      : "text-foreground hover:bg-muted"
                                  }`}
                                  onMouseEnter={() => setHoveredCat(i)}
                                  onClick={() => {
                                    navigate(`/deals?category=${activeCat.keys[0]}`);
                                  }}
                                >
                                  <Icon className="h-4 w-4 shrink-0" />
                                  {cat.name}
                                </button>
                              );
                            })}
                          </div>

                          {/* Middle: Subcategories + Stats */}
                          <div className="w-[240px] p-4 border-r border-border flex flex-col justify-between shrink-0">
                            <div>
                              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                                {activeCat.name}
                              </p>
                              <div className="space-y-1">
                                {activeCat.subs.map((sub) => (
                                  <Link
                                    key={sub}
                                    to={`/deals?category=${activeCat.keys[0]}&sub=${encodeURIComponent(sub.toLowerCase().replace(/\s+/g, "-"))}`}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors group"
                                  >
                                    {sub}
                                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </Link>
                                ))}
                              </div>
                            </div>

                            {/* Stats box */}
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="bg-muted/50 rounded-lg p-3">
                                <p className="text-xs font-semibold text-foreground mb-1">
                                  Deals marketplace
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                  PerksNest has {totalDeals} deals available. Get access to{" "}
                                  {freeDeals} deals for free and {premiumDeals} deals when you
                                  upgrade to Premium.
                                </p>
                                <Link
                                  to="/deals"
                                  className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  Explore marketplace
                                  <ArrowUpRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Right: Featured Deals */}
                          <div className="flex-1 p-4 min-w-0 overflow-hidden">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                              Featured Deals
                            </p>
                            <div className="space-y-2">
                              {featuredDeals.length > 0 ? (
                                featuredDeals.map((deal) => (
                                  <Link
                                    key={deal.id}
                                    to={`/deals/${deal.id}`}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                                  >
                                    <img
                                      src={deal.logo}
                                      alt={deal.name}
                                      className="w-8 h-8 rounded-md object-contain bg-white border border-border shrink-0"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                          `https://ui-avatars.com/api/?name=${encodeURIComponent(deal.name)}&background=random&size=32`;
                                      }}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                                        {deal.name}
                                        {deal.isPremium && (
                                          <Crown className="h-3 w-3 text-amber-500 shrink-0" />
                                        )}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {deal.dealText}
                                      </p>
                                    </div>
                                  </Link>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No deals in this category yet.
                                </p>
                              )}
                            </div>
                            {featuredDeals.length > 0 && (
                              <Link
                                to={`/deals?category=${activeCat.keys[0]}`}
                                className="mt-3 text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
                              >
                                Explore most popular deals
                                <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* ═══ SOLUTIONS MEGA MENU ═══ */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="nav-link bg-transparent hover:bg-secondary data-[state=open]:bg-secondary px-3 py-2">
                      Solutions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[850px] p-0">
                        <div className="flex">
                          {/* Left: Solutions */}
                          <div className="flex-1 p-6 border-r border-border">
                            <div className="mb-8">
                              <p className="text-xs font-semibold text-primary mb-2">
                                Trusted by 500+ clients
                              </p>
                              <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                White Label Solution
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Offer all our deals to your community members or portfolio
                                companies
                              </p>
                              <div className="space-y-2">
                                <Link
                                  to="/communities"
                                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
                                >
                                  <Sparkles className="h-4 w-4 text-primary" />
                                  For Communities & Content creators
                                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link
                                  to="/accelerators"
                                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
                                >
                                  <Sparkles className="h-4 w-4 text-primary" />
                                  For Accelerators, Incubators & VCs
                                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </div>
                            </div>

                            <div className="pt-6 border-t border-border">
                              <p className="text-xs font-semibold text-primary mb-2">
                                Trusted by 20,000+ clients
                              </p>
                              <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                                <Crown className="h-4 w-4 text-primary" />
                                Premium Solution
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Instantly access all the deals available on our marketplace
                                and millions in savings for your own business.
                              </p>
                              <Link
                                to="/pricing"
                                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group"
                              >
                                <Crown className="h-4 w-4 text-primary" />
                                For Startups, Entrepreneurs & Agencies
                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            </div>
                          </div>

                          {/* Middle: CTAs */}
                          <div className="w-[200px] p-6 border-r border-border flex flex-col justify-between">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-1">Contact us</p>
                              <a
                                href="mailto:sales@perksnest.co"
                                className="text-sm font-medium text-foreground hover:text-primary"
                              >
                                sales@perksnest.co
                              </a>
                              <Button
                                className="w-full mt-4"
                                onClick={() =>
                                  (window.location.href =
                                    "mailto:sales@perksnest.co?subject=Book a Demo")
                                }
                              >
                                Book a demo
                              </Button>
                            </div>
                            <div className="text-center pt-6 border-t border-border">
                              <p className="text-sm text-muted-foreground mb-1">
                                Upgrade to Premium
                              </p>
                              <p className="text-sm font-semibold text-foreground mb-3">
                                $20/year
                              </p>
                              <Link to="/pricing">
                                <Button variant="outline" className="w-full">
                                  Upgrade
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Right: Testimonials */}
                          <div className="w-[320px] p-6 space-y-5 max-h-[400px] overflow-y-auto">
                            {solutionsTestimonials.map((t, idx) => (
                              <div key={idx} className="flex gap-3">
                                <img
                                  src={t.avatar}
                                  alt={t.name}
                                  className="w-10 h-10 rounded-full shrink-0"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    {t.name}
                                  </p>
                                  <p className="text-xs text-primary mb-2">{t.role}</p>
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    "{t.quote}"
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Top-level links */}
              <Link
                to="/invite"
                className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors"
              >
                Invite
              </Link>
              <Link
                to="/pricing"
                className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/blog"
                className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search bar */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Explore Marketplace */}
            <Link to="/deals" className="hidden xl:flex">
              <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
                <LayoutGrid className="h-4 w-4" />
                Marketplace
              </Button>
            </Link>

            {/* Bell */}
            <button className="hidden sm:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {isAuthenticated && user ? (
              <>
                {/* Claimed Deals */}
                {user.claimedDeals && user.claimedDeals.length > 0 && (
                  <Link
                    to="/customer"
                    className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors relative"
                  >
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {user.claimedDeals.length}
                    </Badge>
                  </Link>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 hidden sm:block text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant="outline" className="mt-1 capitalize">
                        {user.plan}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <Link to="/customer">
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        My Account
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/customer">
                      <DropdownMenuItem className="cursor-pointer">
                        <Package className="h-4 w-4 mr-2" />
                        Claimed Deals ({user.claimedDeals?.length || 0})
                      </DropdownMenuItem>
                    </Link>
                    {(user.role === "admin" || user.roles?.includes("admin")) && (
                      <Link to="/admin">
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Portal
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {(user.role === "partner" ||
                      user.roles?.includes("partner") ||
                      user.roles?.includes("admin")) && (
                      <Link to="/partner">
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Partner Portal
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden sm:block nav-link font-medium"
                >
                  Sign in
                </button>
                
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>


        {/* Expandable Search Bar */}
        {showSearch && (
          <div className="border-t border-border py-3 px-4 animate-in slide-in-from-top-2">
            <form onSubmit={(e) => { e.preventDefault(); setShowSearch(false); handleSearch(e); }} className="w-full max-w-3xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder="Search for deals, companies, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-secondary/50 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/deals"
                className="nav-link px-3 py-2 rounded-md hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                to="/invite"
                className="nav-link px-3 py-2 rounded-md hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Invite & Earn
              </Link>
              <Link
                to="/pricing"
                className="nav-link px-3 py-2 rounded-md hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/blog"
                className="nav-link px-3 py-2 rounded-md hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="pt-3 border-t border-border mt-2 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      to="/customer"
                      className="block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        My Account
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-red-500 text-red-500"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (

                  <>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign in
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </header>
  );
};

export default Header;
