import { toast } from "sonner";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ChevronDown, Menu, X, Sparkles, Crown, ArrowUpRight, User, LogOut, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/lib/auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const solutionsTestimonials = [
  {
    name: "Stephane Gringer",
    role: "Partner at Chameleon Collective",
    quote: "I'm able to put forth innovative growth strategies and systems for clients that were previously constrained by the cost of entry for some of PerksNest's fantastic library of platforms.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "David Stepania",
    role: "Founder at Thirsty Sprout",
    quote: "PerksNest is a must join if you'd like to accelerate your companies growth. We've taken advantage of several deals offered by PerksNest some of which can't be found anywhere else!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Scott McKeon",
    role: "Co-Founder at Espresso",
    quote: "PerksNest is an amazing resource for startups. It has helped us discover new tools as well as get free usage for tools we already use. It sounds too good to be true, but it's real!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
];

const categories = [
  { name: "AI", href: "/deals?category=ai" },
  { name: "Project Management", href: "/deals?category=project" },
  { name: "Marketing", href: "/deals?category=marketing" },
  { name: "Finance", href: "/deals?category=finance" },
  { name: "Development", href: "/deals?category=development" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Main Header */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center relative z-10 cursor-pointer">
              <span className="font-bold text-xl text-foreground">perksnest.</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                    Deals
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <Link to="/deals">
                    <DropdownMenuItem className="cursor-pointer font-medium">
                      All Deals
                    </DropdownMenuItem>
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat.name} to={cat.href}>
                      <DropdownMenuItem className="cursor-pointer">
                        {cat.name}
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="nav-link bg-transparent hover:bg-secondary data-[state=open]:bg-secondary px-3 py-2">
                      Solutions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[850px] p-0">
                        <div className="flex">
                          {/* Left Column - Solutions */}
                          <div className="flex-1 p-6 border-r border-border">
                            {/* White Label Solution */}
                            <div className="mb-8">
                              <p className="text-xs font-semibold text-primary mb-2">Trusted by 500+ clients</p>
                              <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                White Label Solution
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Offer all our deals to your community members or portfolio companies
                              </p>
                              <div className="space-y-2">
                                <Link to="/communities" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group">
                                  <Sparkles className="h-4 w-4 text-primary" />
                                  For Communities & Content creators
                                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                                <Link to="/accelerators" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group">
                                  <Sparkles className="h-4 w-4 text-primary" />
                                  For Accelerators, Incubators & VCs
                                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </div>
                            </div>

                            {/* Premium Solution */}
                            <div className="pt-6 border-t border-border">
                              <p className="text-xs font-semibold text-primary mb-2">Trusted by 20,000+ clients</p>
                              <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                                <Crown className="h-4 w-4 text-primary" />
                                Premium solution
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Instantly access all the deals available on our marketplace and millions in savings for your own business.
                              </p>
                              <Link to="/pricing" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group">
                                <Crown className="h-4 w-4 text-primary" />
                                For Startups, Entrepreneurs & Agencies
                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            </div>
                          </div>

                          {/* Middle Column - CTAs */}
                          <div className="w-[200px] p-6 border-r border-border flex flex-col justify-between">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-1">Contact us</p>
                              <a href="mailto:sales@perksnest.com" className="text-sm font-medium text-foreground hover:text-primary">
                                sales@perksnest.com
                              </a>
                              <Button
                                className="w-full mt-4"
                                onClick={() => window.location.href = 'mailto:sales@perksnest.co?subject=Book a Demo'}
                              >
                                Book a demo
                              </Button>
                            </div>
                            <div className="text-center pt-6 border-t border-border">
                              <p className="text-sm text-muted-foreground mb-1">Upgrade to Premium</p>
                              <p className="text-sm font-semibold text-foreground mb-3">From $2/month</p>
                              <Link to="/pricing">
                                <Button variant="outline" className="w-full">
                                  Upgrade
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Right Column - Testimonials */}
                          <div className="w-[320px] p-6 space-y-5 max-h-[400px] overflow-y-auto">
                            {solutionsTestimonials.map((testimonial, idx) => (
                              <div key={idx} className="flex gap-3">
                                <img
                                  src={testimonial.avatar}
                                  alt={testimonial.name}
                                  className="w-10 h-10 rounded-full shrink-0"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                                  <p className="text-xs text-primary mb-2">{testimonial.role}</p>
                                  <p className="text-xs text-muted-foreground leading-relaxed">"{testimonial.quote}"</p>
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                    Resources
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <Link to="/blog">
                    <DropdownMenuItem className="cursor-pointer">Blog</DropdownMenuItem>
                  </Link>
                  <Link to="/invite">
                    <DropdownMenuItem className="cursor-pointer">Invite & Earn</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = "mailto:support@perksnest.co?subject=Help Center"}>Help Center</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu><Link to="/pricing" className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search - hide on /deals page */}
            {!location.pathname.startsWith('/deals') && (
              <Link to="/deals" className="hidden md:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                <Search className="h-5 w-5" />
              </Link>
            )}

            {isAuthenticated && user ? (
              <>
                {/* Claimed Deals Badge */}
                {user.claimedDeals.length > 0 && (
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
                        Claimed Deals ({user.claimedDeals.length})
                      </DropdownMenuItem>
                    </Link>
                    {(user.role === 'admin' || user.roles?.includes('admin')) && (
                      <Link to="/admin">
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Portal
                        </DropdownMenuItem>
                      </Link>
                    )}
                    {(user.role === 'partner' || user.roles?.includes('partner') || user.roles?.includes('admin')) && (
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
                {/* Sign In */}
                <button
                  onClick={() => window.location.href = '/login'}
                  className="hidden sm:block nav-link font-medium"
                >
                  Sign in
                </button>

                {/* CTA Buttons */}
                <Button
                  variant="outline"
                  className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => window.open('mailto:hello@perksnest.co?subject=Demo Request', '_blank')}
                >
                  Request a demo
                </Button>
                <Button
                  className="hidden md:flex"
                  onClick={() => window.location.href = '/login'}
                >
                  Get started
                </Button>
              </>
            )}

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
                {isAuthenticated && user ? (
                  <>
                    <Link to="/customer" className="block" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">My Account</Button>
                    </Link>
                    <Button variant="outline" className="w-full border-red-500 text-red-500"
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full border-primary text-primary"
                      onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}>
                      Sign in
                    </Button>
                    <Button className="w-full"
                      onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }}>
                      Get started free
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </header>
  );
};

export default Header;