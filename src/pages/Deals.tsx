import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Grid, List, Star, Search, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DealCardNew from "@/components/DealCardNew";
import CategorySidebar from "@/components/CategorySidebar";
import { dealsData, getExpiryLabel } from "@/data/deals";
import { getUpvoteCount } from "@/lib/store";

const DEALS_PER_PAGE = 9;
const filterOptions = ["Most popular", "Most upvoted", "Expiring soon", "Premium", "Free", "Recently added"];

const Deals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [activeFilter, setActiveFilter] = useState(searchParams.get("sort") || "Most popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (activeFilter !== "Most popular") params.set("sort", activeFilter);
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory, activeFilter, setSearchParams]);

  const filteredDeals = dealsData
    .filter((deal) => {
      const matchesSearch =
        searchQuery === "" ||
        deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || deal.category === activeCategory;
      const matchesPremium = activeFilter !== "Premium" || deal.isPremium;
      const matchesFree = activeFilter !== "Free" || deal.isFree;
      return matchesSearch && matchesCategory && matchesPremium && matchesFree;
    })
    .sort((a, b) => {
      if (activeFilter === "Most upvoted") return getUpvoteCount(b.id) - getUpvoteCount(a.id);
      if (activeFilter === "Expiring soon") {
        const aExpiry = getExpiryLabel(a.expiresAt);
        const bExpiry = getExpiryLabel(b.expiresAt);
        return aExpiry.localeCompare(bExpiry);
      }
      if (activeFilter === "Recently added") return b.id.localeCompare(a.id);
      return b.memberCount - a.memberCount;
    });

  const featuredDeals = filteredDeals.filter((d) => d.isPick).slice(0, 4);
  const totalPages = Math.ceil(filteredDeals.length / DEALS_PER_PAGE);
  const paginatedDeals = filteredDeals.slice((currentPage - 1) * DEALS_PER_PAGE, currentPage * DEALS_PER_PAGE);
  const startResult = (currentPage - 1) * DEALS_PER_PAGE + 1;
  const endResult = Math.min(currentPage * DEALS_PER_PAGE, filteredDeals.length);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <CategorySidebar activeCategory={activeCategory} onCategoryChange={(cat) => { setActiveCategory(cat); setCurrentPage(1); }} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Search bar */}
            <div className="relative mb-5">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search deals, companies, categories..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-gray-400"
              />
              {searchInput && (
                <button onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter pills + view toggle */}
            <div className="flex items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      activeFilter === filter
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-gray-600"}`}>
                  <Grid className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-gray-600"}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Results count */}
            {filteredDeals.length > 0 && (
              <p className="text-sm text-gray-500 mb-5">
                {startResult} to {endResult} of {filteredDeals.length} results
              </p>
            )}

            {/* Featured Deals */}
            {featuredDeals.length > 0 && currentPage === 1 && !searchQuery && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                  <h2 className="text-lg font-bold text-gray-900">Featured Deals</h2>
                </div>
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {featuredDeals.map((deal) => (
                    <DealCardNew
                      key={deal.id}
                      id={deal.id}
                      slug={deal.id}
                      name={deal.name}
                      logo={deal.logo}
                      description={deal.description}
                      dealText={deal.dealText}
                      savings={deal.savings}
                      memberCount={deal.memberCount}
                      isPremium={deal.isPremium}
                      isPick={deal.isPick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Deals */}
            <div className="mb-6">
              {!searchQuery && currentPage === 1 && (
                <h2 className="text-lg font-bold text-gray-900 mb-4">All Deals</h2>
              )}

              {filteredDeals.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-2">No deals found</p>
                  <p className="text-gray-400 text-sm">Try a different search or category</p>
                </div>
              ) : (
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {paginatedDeals.map((deal) => (
                    <DealCardNew
                      key={deal.id}
                      id={deal.id}
                      slug={deal.id}
                      name={deal.name}
                      logo={deal.logo}
                      description={deal.description}
                      dealText={deal.dealText}
                      savings={deal.savings}
                      memberCount={deal.memberCount}
                      isPremium={deal.isPremium}
                      isPick={deal.isPick}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Deals;
