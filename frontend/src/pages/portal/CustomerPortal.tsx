import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Building, MapPin, Settings, Bell, CreditCard, Gift,
  Wallet, Calendar, Download, Share2, Copy, TrendingUp, Users,
  DollarSign, Clock, Bookmark, Star, Tag,
  Search, ChevronRight, ExternalLink, MessageSquare, Send, X, Sparkles, Award, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RealtimeMessagingTab } from "@/components/shared/RealtimeMessagingTab";
import { useAuth } from "@/lib/auth";
import { useBookmarks } from "@/lib/bookmarks";
import { dealsData, type Deal } from "@/data/deals";
import { toast } from "sonner";
import { getTickets, createTicket, claimDeal as apiClaimDeal, getReferralSummary, type ReferralEntry } from "@/lib/api";
import { getDeals } from "@/lib/deals";
import { getPartnerDeals, type PartnerDeal } from "@/lib/store";
import { buildReferralLink } from "@/lib/referrals";
import { API_BASE_URL } from "@/lib/runtime";

interface TicketSummary {
  id: string;
  subject: string;
  message: string;
  status: "open" | "closed" | "pending";
  createdAt: string;
}

const CustomerPortal = () => {
  // SEO: unique page title
  document.title = "My Account | PerksNest";

  const navigate = useNavigate();
  const { user, isAuthenticated, updatePlan, logout, claimDeal } = useAuth();
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

  // Fetch tickets from API
  useEffect(() => {
    if (user) {
      getTickets()
        .then(data => setTickets(data.tickets || []))
        .catch(err => console.error('Failed to fetch tickets:', err));
    }
  }, [user]);

  // Get claimed deals with full details from dealsData
  const claimedDealsWithDetails = (user?.claimedDeals ?? [])
    .map(dealId => {
      const deal = dealsData.find(d => d.id === dealId);
      if (!deal) return null;
      return {
        id: deal.id,
        vendor: deal.name,
        logo: deal.logo,
        name: deal.dealText,
        claimedDate: user?.createdAt || new Date().toISOString(), // Using user creation date as placeholder
        status: "active" as const,
        expiresDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
        savings: parseInt(deal.savings.replace(/[$,]/g, '')) || 0,
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

  // Calculate total savings from claimed deals
  const totalSavings = claimedDealsWithDetails.reduce((acc, deal) => acc + deal.savings, 0);

  useEffect(() => {
    if (!user?.id) return;

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

  const savedDeals = useMemo(() => {
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

    const dealLookup = new Map<string, Deal>();
    [...partnerDealsMapped, ...catalogDeals].forEach(deal => {
      if (!dealLookup.has(deal.id)) {
        dealLookup.set(deal.id, deal);
      }
    });

    return bookmarkedDealIds
      .map(dealId => dealLookup.get(dealId))
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
  }, [bookmarkedDealIds, catalogDeals, partnerDeals]);

  // If not authenticated, don't render anything (will redirect)
  if (!user || !isAuthenticated) {
    return null;
  }

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
      // Call API to claim deal
      await apiClaimDeal(dealId);
      
      // Also update local auth context
      await claimDeal(dealId);
      
      toast.success("Deal claimed successfully!");
    } catch (error) {
      console.error('Failed to claim deal:', error);
      toast.error("Failed to claim deal");
    }
  };

  // Get plan badge variant
  const getPlanBadgeClass = () => {
    switch (user.plan) {
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
    return user.plan.charAt(0).toUpperCase() + user.plan.slice(1);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            <TabsTrigger value="referrals" className="gap-2">
              <Share2 className="h-4 w-4" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="tickets" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.96 9.96 0 01-4.462-1.034L3 20l1.338-3.123C3.493 15.646 3 13.87 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Messages
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
                            <p className="text-sm text-muted-foreground">{deal.name}</p>
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

          {/* Referrals Tab */}
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
                <CardHeader>
                  <CardTitle>My Tickets</CardTitle>
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
                      {tickets.map((ticket) => (
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

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <RealtimeMessagingTab portalRole="customer" />
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
                      {user.plan === 'premium' ? 'Current Plan: Premium' : 'Limited Access: Free'}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">
                       {user.plan === 'premium' ? 'You are a PerksNest Pro' : 'Unlock Everything'}
                    </h2>
                    <p className="text-purple-100 max-w-md mb-8">
                      {user.plan === 'premium' 
                        ? 'Enjoy unlimited access to all 563+ exclusive SaaS deals and priority founder support.' 
                        : 'Get access to our full database of 563+ curated perks and save thousands on your tech stack.'}
                    </p>
                    
                    {user.plan !== 'premium' && (
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
                {user.plan === 'premium' && (
                   <CardContent className="bg-white py-4 flex justify-between items-center px-8 border-t">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}
                      </div>
                      <Button variant="ghost" size="sm" onClick={async () => {
                         try {
                            const res = await fetch(`${API_BASE_URL}/api/billing/portal`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, email: user.email }),
                            });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                            else toast.error('Could not open billing portal');
                          } catch { toast.error('Billing portal unavailable'); }
                      }}>
                        Manage Subscription
                      </Button>
                   </CardContent>
                )}
              </Card>

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
                      { text: 'Priority founder support', included: user.plan === 'premium' },
                      { text: 'Private Slack community', included: user.plan === 'premium' },
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
                      <Badge variant={user.plan === 'premium' ? 'default' : 'secondary'} className={user.plan === 'premium' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {user.plan === 'premium' ? 'Active' : 'Free Tier'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                       <span className="text-sm text-muted-foreground">Billing Period</span>
                       <span className="text-sm font-medium">Monthly</span>
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
                    <div>
                      <label className="text-sm font-medium mb-2 block">Referral Code</label>
                      <Input value={user.referralCode} disabled />
                    </div>
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
