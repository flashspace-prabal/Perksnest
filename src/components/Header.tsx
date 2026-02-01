import { useState } from "react";
import { Search, ChevronDown, Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Main Header */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2">
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
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                    Features
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
                  <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                    Solutions
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem className="cursor-pointer">For Startups</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">For Enterprise</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">For Agencies</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link flex items-center gap-1 px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                    Resources
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem className="cursor-pointer">Blog</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Help Center</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Community</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a href="#pricing" className="nav-link px-3 py-2 rounded-md hover:bg-secondary transition-colors">
                Pricing
              </a>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden md:flex p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Sign In */}
            <a href="#" className="hidden sm:block nav-link font-medium">
              Sign in
            </a>

            {/* CTA Buttons */}
            <Button variant="outline" className="hidden sm:flex border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Request a demo
            </Button>
            <Button className="hidden md:flex">
              Get started
            </Button>

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
              <a href="#" className="nav-link px-3 py-2 rounded-md hover:bg-secondary">Features</a>
              <a href="#" className="nav-link px-3 py-2 rounded-md hover:bg-secondary">Solutions</a>
              <a href="#" className="nav-link px-3 py-2 rounded-md hover:bg-secondary">Resources</a>
              <a href="#pricing" className="nav-link px-3 py-2 rounded-md hover:bg-secondary">Pricing</a>
              <div className="pt-3 border-t border-border mt-2 space-y-2">
                <Button variant="outline" className="w-full border-primary text-primary">Request a demo</Button>
                <Button className="w-full">Get started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;