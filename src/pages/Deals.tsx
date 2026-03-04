import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Grid, List, Bell, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCardNew from "@/components/DealCardNew";
import CategorySidebar from "@/components/CategorySidebar";
import { dealsData } from "@/data/deals";

const DEALS_PER_PAGE = 9;

const filterOptions = ["Most popular", "Premium", "Free", "Recently added"];

const Deals = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL params, with defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [activeFilter, setActiveFilter] = useState(searchParams.get("sort") || "Most popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem("notificationsEnabled");
    return saved === "true";
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to page 1 when searching
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (activeFilter !== "Most popular") params.set("sort", activeFilter);
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory, activeFilter, setSearchParams]);

  // Save notification preference to localStorage
  useEffect(() => {
    localStorage.setItem("notificationsEnabled", String(notificationsEnabled));
  }, [notificationsEnabled]);

  const filteredDeals = dealsData
    .filter((deal) => {
      const matchesSearch = searchQuery === "" ||
                           deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           deal.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || deal.category === activeCategory;
      const matchesFilter = activeFilter === "Most popular" ||
                           activeFilter === "Recently added" ||
                           (activeFilter === "Premium" && deal.isPremium) ||
                           (activeFilter === "Free" && deal.isFree);
      return matchesSearch && matchesCategory && matchesFilter;
    })
    .sort((a, b) => {
      if (activeFilter === "Recently added") {
        // Sort by lastAdded date, most recent first
        const dateA = a.lastAdded ? new Date(a.lastAdded).getTime() : 0;
        const dateB = b.lastAdded ? new Date(b.lastAdded).getTime() : 0;
        return dateB - dateA;
      }
      return 0; // Keep original order for other filters
    });

  const totalPages = Math.ceil(filteredDeals.length / DEALS_PER_PAGE);
  const startIndex = (currentPage - 1) * DEALS_PER_PAGE;
  const paginatedDeals = filteredDeals.slice(startIndex, startIndex + DEALS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container-wide">
          {/* Notification Banner */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center gap-4 px-6 py-3 bg-card border border-border rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">W</div>
                  <div className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center text-white text-xs font-bold">▶</div>
                  <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">N</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Never miss savings</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Enable browser notifications and be the first to know when a new deal drops
              </span>
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </div>

          <div className="flex gap-10">
            {/* Sidebar */}
            <CategorySidebar 
              activeCategory={activeCategory} 
              onCategoryChange={setActiveCategory} 
            />

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search deals by name, company, category..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {filteredDeals.length} result{filteredDeals.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                )}
              </div>

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex gap-2">
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeFilter === filter
                          ? "bg-foreground text-background"
                          : "bg-card border border-border text-foreground hover:bg-secondary"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {startIndex + 1} to {Math.min(startIndex + DEALS_PER_PAGE, filteredDeals.length)} of {filteredDeals.length} results
                  </span>
                  <div className="flex items-center border border-border rounded-lg bg-card">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 transition-colors ${
                        viewMode === "list" 
                          ? "text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 transition-colors ${
                        viewMode === "grid" 
                          ? "text-foreground" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Featured Deals Section */}
              {searchQuery === "" && activeCategory === "all" && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6">⭐ Featured Deals</h2>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className={`grid gap-5 ${
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}>
                      {dealsData.filter(deal => deal.featured).slice(0, 6).map((deal) => (
                        <Link
                          key={deal.id}
                          to={`/deals/${deal.id}`}
                          className="block h-full"
                        >
                          <DealCardNew {...deal} />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Section Title */}
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {searchQuery || activeCategory !== "all" ? "Search Results" : "All Deals"}
              </h2>

              {/* Deals Grid */}
              {paginatedDeals.length > 0 ? (
                <>
                  <div className={`grid gap-5 ${
                    viewMode === "grid" 
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                      : "grid-cols-1"
                  }`}>
                    {paginatedDeals.map((deal, index) => (
                      <Link 
                        key={deal.id}
                        to={`/deals/${deal.id}`}
                        className="animate-fade-in block h-full"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <DealCardNew {...deal} />
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, idx) => (
                          typeof page === 'number' ? (
                            <button
                              key={idx}
                              onClick={() => handlePageChange(page)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                                currentPage === page
                                  ? "bg-card border-2 border-foreground text-foreground"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                              }`}
                            >
                              {page}
                            </button>
                          ) : (
                            <span key={idx} className="px-2 text-muted-foreground">…</span>
                          )
                        ))}
                      </div>

                      {/* Next Button */}
                      {currentPage < totalPages && (
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="gap-1"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">No deals found matching your criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                      setActiveCategory("all");
                      setActiveFilter("Most popular");
                      setCurrentPage(1);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Deals;
