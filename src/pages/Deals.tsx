import { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, List, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCardNew from "@/components/DealCardNew";
import CategorySidebar from "@/components/CategorySidebar";
import { dealsData } from "@/data/deals";

const DEALS_PER_PAGE = 9;

const filterOptions = ["Most popular", "Premium", "Free", "Recently added"];

const Deals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState("Most popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDeals = dealsData.filter((deal) => {
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || deal.category === activeCategory;
    const matchesFilter = activeFilter === "Most popular" ||
                         (activeFilter === "Premium" && deal.isPremium) ||
                         (activeFilter === "Free" && deal.isFree);
    return matchesSearch && matchesCategory && matchesFilter;
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

              {/* Section Title */}
              <h2 className="text-2xl font-bold text-foreground mb-6">Most Popular Deals</h2>

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
                  <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory("all"); setActiveFilter("Most popular"); setCurrentPage(1); }}>
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
