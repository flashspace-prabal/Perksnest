import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, Menu, X, Sparkles, Crown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    quote: "I'm able to put forth innovative growth strategies and systems for clients that were previously constrained by the cost of entry for some of Secret's fantastic library of platforms.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "David Stepania",
    role: "Founder at Thirsty Sprout",
    quote: "Secret is a must join if you'd like to accelerate your companies growth. We've taken advantage of several deals offered by Secret some of which can't be found anywhere else!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Scott McKeon",
    role: "Co-Founder at Espresso",
    quote: "Secret is an amazing resource for startups. It has helped us discover new tools as well as get free usage for tools we already use. It sounds too good to be true, but it's real!",
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

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Main Header */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
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
              <span className="font-bold text-xl text-foreground">secret</span>
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
                              <Button className="w-full mt-4">
                                Book a demo
                              </Button>
                            </div>
                            <div className="text-center pt-6 border-t border-border">
                              <p className="text-sm text-muted-foreground mb-1">Upgrade to Premium</p>
                              <p className="text-sm font-semibold text-foreground mb-3">For $149/year</p>
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
                  <DropdownMenuItem className="cursor-pointer">Help Center</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/pricing" className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Link to="/deals" className="hidden md:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
            </Link>

            {/* Sign In */}
            <a href="#" className="hidden sm:block nav-link font-medium">
              Sign in
            </a>

            {/* CTA Buttons */}
            <Button variant="outline" className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Request a demo
            </Button>
            <Link to="/deals">
              <Button className="hidden md:flex">
                Get started
              </Button>
            </Link>

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

export default Header;