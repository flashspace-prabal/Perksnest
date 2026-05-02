import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Grid, List, Star, Search, X, Loader2, TrendingUp, Clock, Zap, Gift, Lock } from "lucide-react";
import DealCardNew from "@/components/DealCardNew";
import CategorySidebar from "@/components/CategorySidebar";
import { Deal, getExpiryLabel } from "@/data/deals";
import { getUpvoteCount, getPartnerDeals, PartnerDeal } from "@/lib/store";
import { getDeals } from "@/lib/deals";
import { normalizeMemberCount } from "@/lib/member-count";
import { SkeletonDealCard, SkeletonLoader } from "@/components/SkeletonLoader";
import { isFreeDeal, isPremiumDeal } from "@/lib/deal-types";
import { categoryHasDeals } from "@/lib/category-visibility";

const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.log(...args);
};

const DEALS_PER_PAGE = 9;
const filterOptions = ["Most popular", "Most upvoted", "Expiring soon", "Premium", "Free", "Recently added"];

// Map template category IDs to actual deal category values (for main category filtering)
const templateCategoryMapping: Record<string, string[]> = {
  "ai": ["ai"],
  "project": ["productivity"],
  "data": ["cloud", "database", "storage", "infrastructure", "analytics", "monitoring"],
  "customer": ["crm", "support"],
  "development": ["deployment", "ci-cd", "web3", "automation"],
  "marketing": [],
  "finance": ["finance", "payments"],
  "communication": ["communication"],
  "sales": [],
  "business": [],
  "it": ["security", "tools", "backup", "forms"],
  "hr": ["hr"],
};

// Map subcategory IDs to parent category IDs
const subcategoryToParent: Record<string, string> = {
  // AI subcategories
  "ai-agents": "ai",
  "ai-writing": "ai",
  "ai-image": "ai",
  "ai-video": "ai",
  "ai-audio": "ai",
  "ai-coding": "ai",
  "ai-chatbots": "ai",
  "ai-data": "ai",
  "ai-automation": "ai",
  "machine-learning": "ai",
  "nlp": "ai",
  "computer-vision": "ai",
  // Marketing subcategories
  "email-marketing": "marketing",
  "social-media": "marketing",
  "seo": "marketing",
  "content-marketing": "marketing",
  "advertising": "marketing",
  "analytics-marketing": "marketing",
  "influencer": "marketing",
  "video-marketing": "marketing",
  "affiliate": "marketing",
  "crm": "marketing",
  "lead-generation": "marketing",
  // Finance subcategories
  "accounting": "finance",
  "invoicing": "finance",
  "payments": "finance",
  "banking": "finance",
  "tax": "finance",
  "expense": "finance",
  "payroll": "finance",
  "fundraising": "finance",
  "billing": "finance",
  "crypto": "finance",
  // Development subcategories
  "backend": "development",
  "frontend": "development",
  "devops": "development",
  "api": "development",
  "database": "development",
  "hosting": "development",
  "cloud": "development",
  "testing": "development",
  "monitoring": "development",
  "security-dev": "development",
  "nocode": "development",
  "lowcode": "development",
  "mobile-dev": "development",
  // Project Management subcategories
  "collaboration": "project",
  "task": "project",
  "productivity": "project",
  "presentation": "project",
  "time": "project",
  "documentation": "project",
  "knowledge-base": "project",
  "agile": "project",
  // Sales subcategories
  "lead-gen": "sales",
  "outreach": "sales",
  "prospecting": "sales",
  "pipeline": "sales",
  "proposals": "sales",
  // HR subcategories
  "recruiting": "hr",
  "onboarding": "hr",
  "performance": "hr",
  "benefits": "hr",
  "remote-work": "hr",
  "employee-engagement": "hr",
  // Design subcategories
  "ui-ux": "design",
  "graphic-design": "design",
  "prototyping": "design",
  "video-editing": "design",
  "photo-editing": "design",
  "branding": "design",
  // Support subcategories
  "helpdesk": "support",
  "live-chat": "support",
  "ticketing": "support",
  "customer-success": "support",
  // Communication subcategories
  "messaging": "communication",
  "video-conferencing": "communication",
  "email": "communication",
  "voip": "communication",
};

const sidebarCategoryIds = [
  "all",
  "ai",
  "project",
  "data",
  "customer",
  "development",
  "marketing",
  "finance",
  "communication",
  "sales",
  "business",
  "it",
  "hr",
];

const Deals = () => {
  useEffect(() => {
    document.title = "Browse SaaS Deals | PerksNest";
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all");
  const [activeFilter, setActiveFilter] = useState(searchParams.get("sort") || "Most popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [partnerDeals, setPartnerDeals] = useState<PartnerDeal[]>([]);
  const [dealsData, setDealsData] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isSyncingFromUrl = useRef(false);

  useEffect(() => {
    const nextSearchQuery = searchParams.get("q") || "";
    const nextCategory = searchParams.get("category") || "all";
    const nextFilter = searchParams.get("sort") || "Most popular";

    const hasUrlStateChange =
      searchQuery !== nextSearchQuery ||
      searchInput !== nextSearchQuery ||
      activeCategory !== nextCategory ||
      activeFilter !== nextFilter;

    if (hasUrlStateChange) {
      isSyncingFromUrl.current = true;
    }

    if (searchQuery !== nextSearchQuery) setSearchQuery(nextSearchQuery);
    if (searchInput !== nextSearchQuery) setSearchInput(nextSearchQuery);
    if (activeCategory !== nextCategory) setActiveCategory(nextCategory);
    if (activeFilter !== nextFilter) setActiveFilter(nextFilter);
    if (hasUrlStateChange) setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    getPartnerDeals().then(deals => setPartnerDeals(deals.filter(d => d.status === "approved")));
  }, []);

  // Fetch deals from API
  useEffect(() => {
    setIsLoading(true);
    devLog('Deals.tsx: Starting to fetch deals...');
    getDeals()
      .then(deals => {
        devLog(`Deals.tsx: Received ${deals.length} deals from getDeals()`, deals);
        setDealsData(deals);
      })
      .catch(err => {
        console.error('Deals.tsx: Failed to fetch deals:', err);
        setDealsData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Merge partner deals into deals list
  const partnerDealsMapped: Deal[] = partnerDeals.map(d => ({
    id: d.id,
    name: d.name,
    company: d.partnerName,
    logo: d.logoUrl || "",
    description: d.description,
    dealText: d.dealText,
    savings: d.savings,
    memberCount: normalizeMemberCount(d, d.id),
    isFree: true,
    isPremium: false,
    isPick: false,
    category: d.category,
    subcategory: "",
    promoCode: d.promoCode,
  }));

  const allDeals = [...partnerDealsMapped, ...dealsData];
  
  // Log deal stats
  useEffect(() => {
    devLog(`Deals.tsx: Partner deals: ${partnerDealsMapped.length}, Regular deals: ${dealsData.length}, Total: ${allDeals.length}`);
  }, [allDeals.length, partnerDealsMapped.length, dealsData.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (activeCategory !== "all") params.set("category", activeCategory);
    if (activeFilter !== "Most popular") params.set("sort", activeFilter);
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeCategory, activeFilter, setSearchParams]);

  const matchesSearch = (deal: Deal, query: string) => {
    if (!query) return true;
    const normalizedQuery = query.toLowerCase();
    return (
      deal.name.toLowerCase().includes(normalizedQuery) ||
      deal.company?.toLowerCase().includes(normalizedQuery) ||
      deal.description?.toLowerCase().includes(normalizedQuery)
    );
  };

  const matchesCategory = (deal: Deal, categoryId: string) => {
    const parentCategory = subcategoryToParent[categoryId];
    const mappedCategories = templateCategoryMapping[categoryId] || [];

    return (
      categoryId === "all" ||
      deal.category === categoryId ||
      deal.subcategory === categoryId ||
      mappedCategories.includes(deal.category) ||
      (!!parentCategory && deal.category === parentCategory)
    );
  };

  const getDealAccessType = (deal: Deal) => {
    const premium = isPremiumDeal(deal.id) || deal.isPremium;
    return premium ? "premium" : "free";
  };

  const scopedDeals = useMemo(
    () => allDeals.filter((deal) => matchesSearch(deal, searchQuery) && matchesCategory(deal, activeCategory)),
    [allDeals, searchQuery, activeCategory]
  );

  const freeDealsCount = useMemo(
    () => scopedDeals.filter((deal) => getDealAccessType(deal) === "free").length,
    [scopedDeals]
  );

  const premiumDealsCount = useMemo(
    () => scopedDeals.filter((deal) => getDealAccessType(deal) === "premium").length,
    [scopedDeals]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const categoryId of sidebarCategoryIds) {
      counts[categoryId] = allDeals.filter((deal) => {
        const inSearch = matchesSearch(deal, searchQuery);
        const inCategory = matchesCategory(deal, categoryId);
        const accessType = getDealAccessType(deal);
        const matchesAccess =
          activeFilter === "Premium"
            ? accessType === "premium"
            : activeFilter === "Free"
              ? accessType === "free"
              : true;

        return inSearch && inCategory && matchesAccess;
      }).length;
    }

    return counts;
  }, [allDeals, searchQuery, activeFilter]);

  const categoryAvailabilityCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const categoryId of sidebarCategoryIds) {
      counts[categoryId] = categoryId === "all"
        ? allDeals.length
        : allDeals.filter((deal) => categoryHasDeals(categoryId, [deal])).length;
    }

    return counts;
  }, [allDeals]);

  const filteredDeals = scopedDeals
    .filter((deal) => {
      const accessType = getDealAccessType(deal);
      const matchesPremium = activeFilter !== "Premium" || accessType === "premium";
      const matchesFree = activeFilter !== "Free" || accessType === "free";
      return matchesPremium && matchesFree;
    })
    .sort((a, b) => {
      if (activeFilter === "Most upvoted") return getUpvoteCount(b.id) - getUpvoteCount(a.id);
      if (activeFilter === "Expiring soon") {
        // Sort by soonest expiry first; treat no expiry as far future
        const MAX_DATE = new Date('2099-12-31').getTime();
        const aTime = a.expiresAt ? new Date(a.expiresAt).getTime() : MAX_DATE;
        const bTime = b.expiresAt ? new Date(b.expiresAt).getTime() : MAX_DATE;
        return aTime - bTime;
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <CategorySidebar
              activeCategory={activeCategory}
              categoryCounts={categoryCounts}
              categoryAvailabilityCounts={categoryAvailabilityCounts}
              onCategoryChange={(cat) => { setActiveCategory(cat); setCurrentPage(1); }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-5 lg:hidden">
              <CategorySidebar
                activeCategory={activeCategory}
                categoryCounts={categoryCounts}
                categoryAvailabilityCounts={categoryAvailabilityCounts}
                onCategoryChange={(cat) => { setActiveCategory(cat); setCurrentPage(1); }}
              />
            </div>

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
            <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {filterOptions.map((filter) => {
                  const getFilterIcon = () => {
                    switch(filter) {
                      case "Most upvoted": return <TrendingUp className="h-3.5 w-3.5" />;
                      case "Expiring soon": return <Clock className="h-3.5 w-3.5" />;
                      case "Recently added": return <Zap className="h-3.5 w-3.5" />;
                      default: return null;
                    }
                  };
                  
                  return (
                    <button
                      key={filter}
                      onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all border active:scale-95 ${
                        activeFilter === filter
                          ? "bg-primary text-white border-primary shadow-sm shadow-primary/30"
                          : "bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:bg-primary/5"
                      }`}
                      title={`Sort by ${filter.toLowerCase()}`}
                    >
                      {getFilterIcon()}
                      {filter}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode("grid")} 
                  className={`p-2 rounded transition-all active:scale-95 ${viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  title="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")} 
                  className={`p-2 rounded transition-all active:scale-95 ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  title="List view"
                >
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
                  <h2 className="text-xl font-bold text-gray-900">Featured Deals</h2>
                </div>
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                  {featuredDeals.map((deal) => (
                    <DealCardNew
                      key={deal.id}
                      id={deal.id}
                      slug={deal.slug || deal.id}
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

            {/* All Deals - Split into FREE and PREMIUM sections */}
            <div className="mb-6 space-y-12">
              {!searchQuery && currentPage === 1 && (
                <h2 className="text-lg font-bold text-gray-900 mb-4">All Deals</h2>
              )}

              {isLoading ? (
                <SkeletonLoader 
                  count={viewMode === "grid" ? 9 : 5} 
                  variant={viewMode === "grid" ? "card" : "row"}
                  className={viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}
                />
              ) : filteredDeals.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
                  <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-semibold mb-2">No deals found</p>
                  <p className="text-gray-500 text-sm mb-6">
                    {searchQuery && !activeCategory ? "No results for your search" : "Try adjusting your filters or category"}
                  </p>
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setSearchQuery("");
                      setActiveCategory("all");
                      setActiveFilter("Most popular");
                      setCurrentPage(1);
                    }}
                    className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <>
                  {/* FREE DEALS SECTION - Only show if not filtering by Premium */}
                  {activeFilter !== "Premium" && (() => {
                    const freeDeal = paginatedDeals.filter((deal) => getDealAccessType(deal) === "free");
                    return freeDeal.length > 0 ? (
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <Gift className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-bold text-gray-900">Free Deals</h3>
                          <span className="text-sm text-gray-500">({freeDealsCount})</span>
                        </div>
                        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                          {freeDeal.map((deal) => (
                            <DealCardNew
                              key={deal.id}
                              id={deal.id}
                              slug={deal.slug || deal.id}
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
                      </section>
                    ) : null;
                  })()}

                  {/* PREMIUM DEALS SECTION - Only show if not filtering by Free */}
                  {activeFilter !== "Free" && (() => {
                    const premiumDeals = paginatedDeals.filter((deal) => getDealAccessType(deal) === "premium");
                    return premiumDeals.length > 0 ? (
                      <section className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/5 to-purple-700/5 rounded-3xl blur-2xl pointer-events-none" />
                        <div className="relative">
                          <div className="flex items-center gap-3 mb-4">
                            <Lock className="h-5 w-5 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-900">Premium Deals</h3>
                            <span className="text-sm text-gray-500">({premiumDealsCount})</span>
                          </div>
                          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                            {premiumDeals.map((deal) => (
                              <div key={deal.id} className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition blur-lg" />
                                <div className="relative">
                                  <DealCardNew
                                    id={deal.id}
                                    slug={deal.slug || deal.id}
                                    name={deal.name}
                                    logo={deal.logo}
                                    description={deal.description}
                                    dealText={deal.dealText}
                                    savings={deal.savings}
                                    memberCount={deal.memberCount}
                                    isPremium={true}
                                    isPick={deal.isPick}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    ) : null;
                  })()}
                </>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {/* Smart Pagination with Ellipsis */}
                {(() => {
                  const pages: (number | string)[] = [];
                  const maxVisible = 7;
                  const halfWindow = Math.floor(maxVisible / 2);

                  if (totalPages <= maxVisible) {
                    // Show all pages if total is small
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);

                    // Calculate range around current page
                    let start = Math.max(2, currentPage - halfWindow);
                    let end = Math.min(totalPages - 1, currentPage + halfWindow);

                    // Adjust range if near start or end
                    if (currentPage <= halfWindow + 1) {
                      end = Math.min(totalPages - 1, maxVisible - 1);
                    }
                    if (currentPage > totalPages - halfWindow - 1) {
                      start = Math.max(2, totalPages - maxVisible + 2);
                    }

                    // Add left ellipsis
                    if (start > 2) {
                      pages.push('...');
                    }

                    // Add range
                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    // Add right ellipsis
                    if (end < totalPages - 1) {
                      pages.push('...');
                    }

                    // Always show last page
                    pages.push(totalPages);
                  }

                  return pages.map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                          •••
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white shadow-sm shadow-primary/30"
                            : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}

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

    </div>
  );
};

export default Deals;
