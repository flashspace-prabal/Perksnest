import { useState } from "react";
import { Search, Bell, User, ChevronDown, Menu, X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: "AI", subcategories: ["Development", "Automation", "Writing", "Marketing"] },
  { name: "Project Management", subcategories: ["Collaboration", "Task Management", "Productivity"] },
  { name: "Marketing", subcategories: ["Email Marketing", "SEO", "Social Media", "Content"] },
  { name: "Finance", subcategories: ["Payments", "Accounting", "Banking"] },
  { name: "Development", subcategories: ["Web Dev", "No-Code", "APIs"] },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Promo Banner */}
      <div className="promo-banner py-2.5 px-4">
        <div className="container-wide flex items-center justify-center gap-2 text-sm">
          <Gift className="h-4 w-4" />
          <span className="font-medium">
            Get 30% off on our Premium membership! Promo code: <span className="font-bold">30SECRET</span> - offer ends in{" "}
            <span className="font-bold">6d 23h 59m</span>
          </span>
          <button className="ml-4 hover:opacity-80 transition-opacity">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-foreground">Secret</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    Deals
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.name} className="cursor-pointer">
                      {cat.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    Solutions
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem className="cursor-pointer">White Label Solution</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Premium Solution - $149/year</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Free Access - Forever</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a href="#pricing" className="nav-link px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Pricing
              </a>
              <a href="#blog" className="nav-link px-3 py-2 rounded-md hover:bg-muted transition-colors">
                Blog
              </a>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for deals"
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Icons */}
            <button className="hidden sm:flex p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="hidden sm:flex p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-5 w-5" />
            </button>

            {/* CTA Button */}
            <Button className="hidden sm:flex">
              Explore Marketplace
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
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
              <a href="#" className="nav-link px-3 py-2 rounded-md hover:bg-muted">Deals</a>
              <a href="#" className="nav-link px-3 py-2 rounded-md hover:bg-muted">Solutions</a>
              <a href="#pricing" className="nav-link px-3 py-2 rounded-md hover:bg-muted">Pricing</a>
              <a href="#blog" className="nav-link px-3 py-2 rounded-md hover:bg-muted">Blog</a>
              <div className="pt-3 border-t border-border mt-2">
                <Button className="w-full">Explore Marketplace</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;