import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Building, MapPin, Settings, Bell, CreditCard, Gift,
  Wallet, Calendar, Download, Share2, Copy, TrendingUp, Users,
  DollarSign, Clock, Bookmark, Star, Tag,
  Search, ChevronRight, ExternalLink, MessageSquare, Send, X, Sparkles, Award, CheckCircle, Loader2, AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { useBookmarks } from "@/lib/bookmarks";
import { dealsData, type Deal } from "@/data/deals";
import { toast } from "sonner";
import { getTickets, createTicket, getReferralSummary, getUserClaims, type ReferralEntry } from "@/lib/api";
import { getDeals } from "@/lib/deals";
import { getPartnerDeals, type PartnerDeal } from "@/lib/store";
import { buildReferralLink } from "@/lib/referrals";
import { API_BASE_URL } from "@/lib/runtime";
import SavingsInsights, { DealSavingsIndicator } from "@/components/dashboard/SavingsInsights";
import { FEATURES } from "@/lib/feature-flags";

interface TicketSummary {
  id: string;
  subject: string;
  message: string;
  status: "open" | "closed" | "pending";
  createdAt: string;
  updatedAt?: string;
}

const CustomerPortal = () => {
  // SEO: unique page title
  document.title = "My Account | PerksNest";

  const navigate = useNavigate();
  const { user, isAuthenticated, updatePlan, logout, claimDeal, refetchClaimedDeals } = useAuth();
  const {
    bookmarkedDealIds,
    isLoading: areBookmarksLoading,
    error: bookmarksError,
    toggleBookmark: toggleSavedDeal,
  } = useBookmarks();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [catalogDeals, setCatalogDeals] = useState<Deal[]>([]);
  const [partnerDeals, setPartnerDeals] = useState<PartnerDeal[]>([]);
  const [areSavedDealsLoading, setAreSavedDealsLoading] = useState(true);
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [isReferralLoading, setIsReferralLoading] = useState(true);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [isBillingPortalLoading, setIsBillingPortalLoading] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [cancellationError, setCancellationError] = useState<string | null>(null);
  const [isSubscriptionCancelled, setIsSubscriptionCancelled] = useState(false);
  const [claimEventsByDealId, setClaimEventsByDealId] = useState<Record<string, string>>({});

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access your portal");
      navigate("/login?returnUrl=/customer");
    }
  }, [isAuthenticated, navigate]);

  // Initialize form fields when user data loads
  useEffect(() => {
    if (user) {
      setEditedName(user.name);
      setEditedEmail(user.email);
    }
  }, [user]);

  // Refetch claimed deals from server when component mounts or user changes
  useEffect(() => {
    if (user && isAuthenticated) {
      refetchClaimedDeals()
        .then(() => {
          console.log('Claimed deals refetched successfully');
        })
        .catch(err => {
          console.error('Failed to refetch claimed deals:', err);
        });
    }
  }, [user?.id, isAuthenticated, refetchClaimedDeals]);

  // Fetch tickets from API
  useEffect(() => {
    if (user) {
      getTickets()
        .then(data => setTickets(data.tickets || []))
        .catch(err => console.error('Failed to fetch tickets:', err));
    }
  }, [user]);

  useEffect(() => {
    if (!FEATURES.referrals || !user?.id) {
      setIsReferralLoading(false);
      setReferrals([]);
      setReferralEarnings(0);
      return;
    }

    setIsReferralLoading(true);
    getReferralSummary()
      .then(summary => {
        setReferrals(summary.referrals);
        setReferralEarnings(summary.totalEarned);
      })
      .catch(error => {
        console.error("Failed to load referrals:", error);
        setReferrals([]);
        setReferralEarnings(0);
      })
      .finally(() => setIsReferralLoading(false));
  }, [user?.id]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getDeals(), getPartnerDeals()])
      .then(([apiDeals, partnerDealRows]) => {
        if (!isMounted) return;
        setCatalogDeals(apiDeals);
        setPartnerDeals(partnerDealRows.filter(deal => deal.status === "approved"));
      })
      .catch(error => {
        console.error("Failed to load deals catalog for saved deals:", error);
      })
      .finally(() => {
        if (isMounted) setAreSavedDealsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!user?.id || !isAuthenticated) {
      setClaimEventsByDealId({});
      return () => {
        isMounted = false;
      };
    }

    getUserClaims()
      .then((response) => {
        if (!isMounted) return;

        console.log("[CustomerPortal] Dashboard claims fetch response:", response);
        const rawClaims = Array.isArray((response as { claims?: unknown[] })?.claims)
          ? (response as { claims: unknown[] }).claims
          : Array.isArray(response)
            ? response
            : [];

        const nextClaimEvents = rawClaims.reduce<Record<string, string>>((accumulator, entry) => {
          if (!entry || typeof entry !== "object") return accumulator;

          const dealId = typeof (entry as { deal_id?: unknown }).deal_id === "string"
            ? ((entry as { deal_id: string }).deal_id)
            : null;
          const claimedAt = typeof (entry as { claimed_at?: unknown }).claimed_at === "string"
            ? ((entry as { claimed_at: string }).claimed_at)
            : null;

          if (dealId) {
            accumulator[dealId] = claimedAt || new Date().toISOString();
          }

          return accumulator;
        }, {});

        setClaimEventsByDealId(nextClaimEvents);
      })
      .catch((error) => {
        console.error("[CustomerPortal] Failed to fetch claimed deal events:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id, isAuthenticated]);

  const allDealLookup = useMemo(() => {
    const partnerDealsMapped: Deal[] = partnerDeals.map(deal => ({
      id: deal.id,
      name: deal.name,
      company: deal.partnerName,
      logo: deal.logoUrl || "",
      description: deal.description,
      dealText: deal.dealText,
      savings: deal.savings,
      memberCount: deal.claims || 0,
      isPremium: false,
      isFree: true,
      category: deal.category,
      subcategory: "",
    }));

    const lookup = new Map<string, Deal>();
    [...partnerDealsMapped, ...catalogDeals, ...dealsData].forEach(deal => {
      if (!lookup.has(deal.id)) {
        lookup.set(deal.id, deal);
      }
      if (deal.slug && !lookup.has(deal.slug)) {
        lookup.set(deal.slug, deal);
      }
    });

    return lookup;
  }, [catalogDeals, partnerDeals]);

  const claimedDealIds = useMemo(
    () => Array.from(new Set([...(user?.claimedDeals ?? []), ...Object.keys(claimEventsByDealId)])),
    [user?.claimedDeals, claimEventsByDealId]
  );

  const claimedDealsWithDetails = useMemo(() => {
    const mappedDeals = claimedDealIds
      .map((claimedDealId) => {
        const deal = allDealLookup.get(claimedDealId);

        if (!deal) {
          console.warn("[CustomerPortal] Missing deal metadata for claimed deal:", claimedDealId);
          return null;
        }

        return {
          id: deal.id,
          vendor: deal.name,
          logo: deal.logo,
          name: deal.dealText,
          claimedDate: claimEventsByDealId[claimedDealId] || user?.createdAt || new Date().toISOString(),
          status: "active" as const,
          expiresDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          savings: parseInt(String(deal.savings || "0").replace(/[$,]/g, ''), 10) || 0,
          redemptionCode: `${deal.id.toUpperCase()}-${user?.referralCode || "PN"}`
        };
      })
      .filter(Boolean) as Array<{
        id: string;
        vendor: string;
        logo: string;
        name: string;
        claimedDate: string;
        status: "active" | "redeemed" | "pending";
        expiresDate: string;
        savings: number;
        redemptionCode: string;
      }>;

    console.log("[CustomerPortal] Claimed deals prepared for dashboard:", mappedDeals);
    return mappedDeals;
  }, [allDealLookup, claimEventsByDealId, claimedDealIds, user?.createdAt, user?.referralCode]);

  // Calculate total savings from claimed deals
  const totalSavings = claimedDealsWithDetails.reduce((acc, deal) => acc + deal.savings, 0);

  const savedDeals = useMemo(() => {
    return bookmarkedDealIds
      .map(dealId => allDealLookup.get(dealId))
      .filter((deal): deal is Deal => !!deal)
      .map(deal => ({
        id: deal.id,
        vendor: deal.name,
        logo: deal.logo,
        description: deal.description,
        name: deal.dealText,
        savings: deal.savings,
        expiry: deal.expiresAt ? new Date(deal.expiresAt).toLocaleDateString() : "Ongoing",
        isPremium: deal.isPremium,
        isFree: deal.isFree,
      }));
  }, [allDealLookup, bookmarkedDealIds]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2);
  }, [tickets]);

  // If not authenticated, don't render anything (will redirect)
  if (!user || !isAuthenticated) {
    return null;
  }

  const effectiveUserPlan = isSubscriptionCancelled ? 'free' : user.plan;
  const hasActivePremiumSubscription =
    effectiveUserPlan === 'premium' && (user.status ?? 'active') === 'active';

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Code copied to clipboard!");
  };

  const copyReferralLink = () => {
    const referralLink = buildReferralLink(user.referralCode);
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Update user in Supabase via API
      const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update local auth context
      if (user) {
        const updatedUser = { ...user, name: editedName, email: editedEmail };
        // Re-login to refresh auth state (ideally would have updateUser function)
      }

      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    setIsCreatingTicket(true);
    try {
      const result = await createTicket({
        subject: newTicketSubject,
        message: newTicketMessage,
        priority: 'medium'
      });

      toast.success("Ticket created successfully!");
      setNewTicketSubject("");
      setNewTicketMessage("");

      // Refresh tickets
      const data = await getTickets();
      setTickets(data.tickets || []);
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setIsCreatingTicket(false);
    }
  };

  const handleClaimDeal = async (dealId: string) => {
    try {
      console.log("[CustomerPortal] Claiming deal from dashboard:", dealId);
      await claimDeal(dealId);
      await refetchClaimedDeals();

      try {
        const refreshedClaims = await getUserClaims();
        console.log("[CustomerPortal] Claims after dashboard claim:", refreshedClaims);
      } catch (claimsError) {
        console.warn("[CustomerPortal] Failed to refetch claims after dashboard claim:", claimsError);
      }
      
      toast.success("Deal claimed successfully!");
    } catch (error) {
      console.error('Failed to claim deal:', error);
      toast.error("Failed to claim deal");
    }
  };

  // Get plan badge variant
  const getPlanBadgeClass = () => {
    switch (effectiveUserPlan) {
      case 'premium':
        return "bg-gradient-to-r from-primary to-purple-500";
      case 'enterprise':
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case 'free':
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getPlanLabel = () => {
    return effectiveUserPlan.charAt(0).toUpperCase() + effectiveUserPlan.slice(1);
  };

  const handleOpenBillingPortal = async () => {
    if (isBillingPortalLoading) return;

    setIsBillingPortalLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/billing/portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      toast.error('Could not open billing portal');
    } catch {
      toast.error('Billing portal unavailable');
    } finally {
      setIsBillingPortalLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (isCancellingSubscription || !hasActivePremiumSubscription) return;

    setCancellationError(null);
    setIsCancellingSubscription(true);

    try {
      await updatePlan('free');

      setIsSubscriptionCancelled(true);
      setIsCancelDialogOpen(false);

      toast.success('Your subscription has been cancelled.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel subscription';
      setCancellationError(message);
      toast.error(message);
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl text-primary-foreground font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Badge className={getPlanBadgeClass()}>{getPlanLabel()}</Badge>
            </div>
            <div className="flex items-center gap-6 mt-2 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={() => document.getElementById('settings-tab')?.click()}>
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 ${FEATURES.referrals ? "md:grid-cols-4" : "md:grid-cols-2"} gap-4 mb-8`}>
          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary">Total Savings</p>
                  <p className="text-2xl font-bold text-primary">${totalSavings.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Deals Claimed</p>
                  <p className="text-2xl font-bold">{user.claimedDeals.length}</p>
                </div>
                <Gift className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          {FEATURES.referrals && (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Referral Earnings</p>
                      <p className="text-2xl font-bold">${referralEarnings}</p>
                    </div>
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Referrals</p>
                      <p className="text-2xl font-bold">{referrals.length}</p>
                    </div>
                    <Share2 className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="claimed" className="space-y-6">
          <TabsList className="bg-background border">
            <TabsTrigger value="claimed" className="gap-2">
              <Wallet className="h-4 w-4" />
              My Deals
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
            {FEATURES.referrals && (
              <TabsTrigger value="referrals" className="gap-2">
                <Share2 className="h-4 w-4" />
                Referrals
              </TabsTrigger>
            )}
            <TabsTrigger value="tickets" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger id="settings-tab" value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Claimed Deals Tab */}
          <TabsContent value="claimed">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Claimed Deals</CardTitle>
                <Link to="/deals">
                  <Button>Browse More Deals</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {claimedDealsWithDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">No deals claimed yet</p>
                    <p className="text-muted-foreground mb-6">Start claiming deals to see them here</p>
                    <Link to="/deals">
                      <Button>Browse Deals</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {claimedDealsWithDetails.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-background border flex items-center justify-center overflow-hidden">
                            <img src={deal.logo} alt={deal.vendor} className="w-8 h-8 object-contain" />
                          </div>
                          <div>
                            <p className="font-medium">{deal.vendor}</p>
                            <p className="text-sm text-muted-foreground mb-1">{deal.name}</p>
                            <DealSavingsIndicator savings={deal.savings} />
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span>Claimed {new Date(deal.claimedDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Expires {new Date(deal.expiresDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={
                            deal.status === "active" ? "default" :
                            deal.status === "redeemed" ? "secondary" : "outline"
                          }>
                            {deal.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {deal.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Redemption Code</p>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-muted px-2 py-1 rounded">{deal.redemptionCode}</code>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => copyCode(deal.id, deal.redemptionCode)}
                              >
                                {copiedCode === deal.id ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <p className="text-primary font-semibold">+${deal.savings.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    <SavingsInsights deals={claimedDealsWithDetails} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Deals Tab */}
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Deals ({savedDeals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {areSavedDealsLoading || areBookmarksLoading ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
                    <p className="text-lg font-medium mb-2">Loading saved deals</p>
                    <p className="text-muted-foreground">Fetching your latest bookmarks...</p>
                  </div>
                ) : bookmarksError ? (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Couldn't load saved deals</p>
                    <p className="text-muted-foreground mb-6">{bookmarksError}</p>
                    <Link to="/deals">
                      <Button>Browse Deals</Button>
                    </Link>
                  </div>
                ) : savedDeals.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">No saved deals yet</p>
                    <p className="text-muted-foreground mb-6">Save deals you're interested in for later</p>
                    <Link to="/deals">
                      <Button>Browse Deals</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedDeals.map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-background border flex items-center justify-center overflow-hidden shrink-0">
                            <img src={deal.logo} alt={deal.vendor} className="w-8 h-8 object-contain" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{deal.vendor}</p>
                            <p className="text-sm text-muted-foreground">{deal.description}</p>
                            <p className="text-sm text-foreground mt-1">{deal.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              {deal.isPremium && <Badge variant="secondary" className="text-xs">Premium</Badge>}
                              {deal.isFree && <Badge variant="outline" className="text-xs">Free</Badge>}
                              <Badge variant="outline" className="text-xs">Expires {deal.expiry}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-primary font-semibold">{deal.savings}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  await toggleSavedDeal(deal.id);
                                  toast.success("Deal removed from saved");
                                } catch (error) {
                                  console.error("Failed to remove saved deal:", error);
                                  toast.error("Failed to update saved deals");
                                }
                              }}
                            >
                              <Bookmark className="h-4 w-4 fill-current" />
                            </Button>
                            <Link to={`/deals/${deal.id}`}>
                              <Button size="sm">View Deal</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab - hidden while referrals feature is disabled. */}
          {FEATURES.referrals && (
          <TabsContent value="referrals">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Your Referrals ({referrals.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {isReferralLoading ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-pulse" />
                      <p className="text-lg font-medium mb-2">Loading referrals</p>
                      <p className="text-muted-foreground">Fetching your referral activity...</p>
                    </div>
                  ) : referrals.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">No referrals yet</p>
                      <p className="text-muted-foreground">Share your referral link to start earning!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {referrals.map((referral) => (
                        <div key={`${referral.referreeEmail}-${referral.createdAt}`} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {referral.referreeEmail.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{referral.referreeEmail}</p>
                              <p className="text-sm text-muted-foreground">Referral code {referral.code}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined {new Date(referral.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={referral.status === "converted" || referral.status === "paid" ? "default" : "secondary"}>
                              {referral.status}
                            </Badge>
                            {(referral.status === "converted" || referral.status === "paid") && (
                              <p className="text-primary font-semibold">+${referral.creditAmount}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invite Friends</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Earn $20 for every friend who signs up and claims a deal!
                  </p>
                  <div className="p-4 bg-muted rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Your referral code</p>
                    <div className="flex gap-2 mb-3">
                      <Input value={user.referralCode} readOnly className="text-sm font-mono" />
                      <Button size="icon" variant="outline" onClick={copyReferralLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Your referral link</p>
                    <div className="flex gap-2">
                      <Input value={buildReferralLink(user.referralCode)} readOnly className="text-sm" />
                      <Button size="icon" variant="outline" onClick={copyReferralLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg mb-4 border border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Total Earned</p>
                      <p className="text-2xl font-bold text-primary">${referralEarnings}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From {referrals.length} referral{referrals.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={copyReferralLink}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          )}

          {/* Tickets Tab */}
          <TabsContent value="tickets">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input
                        placeholder="Brief description of your issue"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <textarea
                        className="w-full min-h-[120px] px-3 py-2 border border-border rounded-lg resize-none"
                        placeholder="Provide details about your issue or question..."
                        value={newTicketMessage}
                        onChange={(e) => setNewTicketMessage(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleCreateTicket}
                      disabled={isCreatingTicket}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isCreatingTicket ? "Creating..." : "Submit Ticket"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle>My Tickets</CardTitle>
                  {tickets.length > 0 && (
                    <Link to="/customer/tickets">
                      <Button variant="outline" size="sm">
                        View All Tickets
                      </Button>
                    </Link>
                  )}
                </CardHeader>
                <CardContent>
                  {tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">No tickets yet</p>
                      <p className="text-muted-foreground">Create a ticket above if you need help</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTickets.map((ticket) => (
                        <Link to={`/customer/tickets/${ticket.id}`} key={ticket.id} className="block p-4 bg-muted/50 rounded-lg hover:bg-border transition-colors group">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{ticket.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                Created {new Date(ticket.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={
                              ticket.status === 'open' ? 'default' :
                              ticket.status === 'closed' ? 'secondary' : 'outline'
                            }>
                              {ticket.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{ticket.message}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}

          {/* Billing Tab */}
          
          <TabsContent value="billing" className="space-y-6">
            <div className="grid gap-6">
              {/* Premium Hero Card */}
              <Card className="overflow-hidden border-2 border-primary/10 shadow-xl">
                <div className="bg-gradient-to-br from-[#5c2169] to-[#3d1645] p-8 text-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Award className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4 px-3 py-1">
                      {hasActivePremiumSubscription ? 'Current Plan: Premium' : 'Limited Access: Free'}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">
                       {hasActivePremiumSubscription ? 'You are a PerksNest Pro' : 'Unlock Everything'}
                    </h2>
                    <p className="text-purple-100 max-w-md mb-8">
                      {hasActivePremiumSubscription 
                        ? 'Enjoy unlimited access to all 563+ exclusive SaaS deals and priority founder support.' 
                        : 'Get access to our full database of 563+ curated perks and save thousands on your tech stack.'}
                    </p>
                    
                    {!hasActivePremiumSubscription && (
                      <Button 
                        size="lg"
                        className="bg-white text-[#5c2169] hover:bg-gray-100 font-bold px-8 shadow-2xl hover:scale-105 transition-all"
                        onClick={async () => {
                          try {
                            const res = await fetch(`${API_BASE_URL}/api/checkout`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, email: user.email, name: user.name, period: 'annual' }),
                            });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                            else toast.error('Could not start checkout');
                          } catch { toast.error('Checkout unavailable'); }
                        }}
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Upgrade to Premium — $20/mo
                      </Button>
                    )}
                  </div>
                </div>
                {hasActivePremiumSubscription && (
                   <CardContent className="bg-white py-4 px-8 border-t flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}
                      </div>
                      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
                        <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                              disabled={isCancellingSubscription}
                            >
                              {isCancellingSubscription ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                              Cancel Subscription
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                              <AlertDialogDescription>
                                You will lose premium access after cancellation, and the change will be reflected in your billing dashboard right away.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isCancellingSubscription}>Keep Subscription</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleCancelSubscription}
                                disabled={isCancellingSubscription}
                                className="bg-rose-600 hover:bg-rose-700"
                              >
                                {isCancellingSubscription ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {isCancellingSubscription ? 'Cancelling...' : 'Yes, Cancel'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    
                      </div>
                   </CardContent>
                )}
              </Card>

              {isSubscriptionCancelled && (
                <Alert className="border-green-200 bg-green-50 text-green-900">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Subscription Cancelled</AlertTitle>
                  <AlertDescription>
                    Your premium subscription has been cancelled successfully. You can upgrade again anytime from this billing page.
                  </AlertDescription>
                </Alert>
              )}

              {cancellationError && (
                <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Cancellation failed</AlertTitle>
                  <AlertDescription>{cancellationError}</AlertDescription>
                </Alert>
              )}

              {/* Perks Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Member Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { text: 'All 563+ deals unlocked', included: true },
                      { text: 'New premium deals weekly', included: true },
                      { text: 'Priority founder support', included: hasActivePremiumSubscription },
                      { text: 'Private Slack community', included: hasActivePremiumSubscription },
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {benefit.included ? (
                          <div className="bg-green-100 p-1 rounded-full"><CheckCircle className="h-4 w-4 text-green-600" /></div>
                        ) : (
                          <div className="bg-gray-100 p-1 rounded-full"><Clock className="h-4 w-4 text-gray-400" /></div>
                        )}
                        <span className={`text-sm ${benefit.included ? 'text-foreground' : 'text-muted-foreground'}`}>{benefit.text}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Account Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge
                        variant={hasActivePremiumSubscription ? 'default' : 'secondary'}
                        className={
                          hasActivePremiumSubscription
                            ? 'bg-green-500 hover:bg-green-600'
                            : isSubscriptionCancelled
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                              : ''
                        }
                      >
                        {isSubscriptionCancelled ? 'Subscription Cancelled' : hasActivePremiumSubscription ? 'Active' : 'Free Tier'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-sm text-muted-foreground">Billing Period</span>
                       <span className="text-sm font-medium">
                        {hasActivePremiumSubscription ? 'Monthly' : isSubscriptionCancelled ? 'Cancelled' : 'N/A'}
                       </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Full Name</label>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">User ID</label>
                      <Input value={user.id} disabled />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Plan</label>
                      <Input value={getPlanLabel()} disabled />
                    </div>
                    {FEATURES.referrals && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Referral Code</label>
                        <Input value={user.referralCode} disabled />
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Member Since</label>
                      <Input value={new Date(user.createdAt).toLocaleDateString()} disabled />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditedName(user.name);
                        setEditedEmail(user.email);
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveSettings}
                      disabled={isSaving || (editedName === user.name && editedEmail === user.email)}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerPortal;
