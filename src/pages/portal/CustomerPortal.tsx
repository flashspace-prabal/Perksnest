import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Building, MapPin, Settings, Bell, CreditCard, Gift,
  Wallet, Calendar, Download, Share2, Copy, TrendingUp, Users,
  DollarSign, Award, CheckCircle, Clock, Bookmark, Star, Tag,
  Search, ChevronRight, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagingTab } from "@/components/shared/MessagingTab";
import { useAuth } from "@/lib/auth";
import { getBookmarkedDealIds, toggleBookmark } from '@/lib/store';
import { dealsData } from "@/data/deals";
import { toast } from "sonner";

const CustomerPortal = () => {
  // SEO: unique page title
  document.title = "My Account | PerksNest";

  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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

  // If not authenticated, don't render anything (will redirect)
  if (!user || !isAuthenticated) {
    return null;
  }

  // Get claimed deals with full details from dealsData
  const claimedDealsWithDetails = user.claimedDeals
    .map(dealId => {
      const deal = dealsData.find(d => d.id === dealId);
      if (!deal) return null;
      return {
        id: deal.id,
        vendor: deal.name,
        logo: deal.logo,
        name: deal.dealText,
        claimedDate: user.createdAt, // Using user creation date as placeholder
        status: "active" as const,
        expiresDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
        savings: parseInt(deal.savings.replace(/[$,]/g, '')) || 0,
        redemptionCode: `${deal.id.toUpperCase()}-${user.referralCode}`
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

  // Mock referrals data (would come from backend in real app)
  const referrals = Array.from({ length: user.referralCount }, (_, i) => ({
    id: i + 1,
    name: `Referral ${i + 1}`,
    email: `referral${i + 1}@example.com`,
    status: "converted" as const,
    earnedAmount: 20,
    date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString()
  }));

  const referralEarnings = referrals.reduce((acc, ref) => acc + ref.earnedAmount, 0);

  // Mock saved deals (would come from backend in real app)
  const [savedDeals, setSavedDeals] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    getBookmarkedDealIds(user.id).then(bookmarkedIds => {
      setSavedDeals(
        bookmarkedIds
          .map(id => dealsData.find(d => d.id === id))
          .filter(Boolean)
          .map(d => ({
            id: d!.id,
            vendor: d!.name,
            logo: d!.logo,
            name: d!.dealText,
            savings: d!.savings,
            isPremium: d!.isPremium,
            isFree: d!.isFree,
          }))
      );
    });
  }, [user?.id]);

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Code copied to clipboard!");
  };

  const copyReferralLink = () => {
    const referralLink = `perksnest.com/ref/${user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const success = updateUser({
        name: editedName,
        email: editedEmail,
      });

      if (success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Get plan badge variant
  const getPlanBadgeClass = () => {
    switch (user.plan) {
      case 'pro':
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
      {/* Top Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="font-bold text-xl">perksnest.</Link>
              <Badge className="bg-primary/10 text-primary border-primary/20">My Account</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/deals">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Deals
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                  {user.avatar 
                    ? <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                    : user.name.charAt(0)
                  }
                </button>
                {/* Dropdown */}
                {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-background border border-border rounded-xl shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">{user.plan}</span>
                  </div>
                  <div className="p-1">
                    {(user.roles?.includes('admin') || user.role === 'admin') && (
                      <a href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors">
                        🛡️ Admin Portal
                      </a>
                    )}
                    {(user.roles?.includes('partner') || user.role === 'partner') && (
                      <a href="/partner" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors">
                        🤝 Partner Portal
                      </a>
                    )}
                    <button
                      onClick={() => { logout(); window.location.href = '/'; }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-red-600"
                    >
                      🚪 Sign out
                    </button>
                  </div>
                </div>
                )}
                {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
              </div>
            </div>
          </div>
        </div>
      </header>

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
                  <p className="text-2xl font-bold">{user.referralCount}</p>
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
                  <Button onClick={() => window.location.href="/deals"}>Browse More Deals</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {claimedDealsWithDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">No deals claimed yet</p>
                    <p className="text-muted-foreground mb-6">Start claiming deals to see them here</p>
                    <Link to="/deals">
                      <Button onClick={() => window.location.href="/deals"}>Browse Deals</Button>
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
                <CardTitle>Saved Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No saved deals yet</p>
                  <p className="text-muted-foreground mb-6">Save deals you're interested in for later</p>
                  <Link to="/deals">
                    <Button onClick={() => window.location.href="/deals"}>Browse Deals</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Your Referrals ({user.referralCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">No referrals yet</p>
                      <p className="text-muted-foreground">Share your referral link to start earning!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {referrals.map((referral) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {referral.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{referral.name}</p>
                              <p className="text-sm text-muted-foreground">{referral.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined {new Date(referral.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant={referral.status === "converted" ? "default" : "secondary"}>
                              {referral.status}
                            </Badge>
                            {referral.earnedAmount > 0 && (
                              <p className="text-primary font-semibold">+${referral.earnedAmount}</p>
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
                      <Input value={`perksnest.com/ref/${user.referralCode}`} readOnly className="text-sm" />
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
                      From {user.referralCount} referral{user.referralCount !== 1 ? 's' : ''}
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

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <MessagingTab portalRole="customer" />
          </TabsContent>

          {/* Settings Tab */}

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-4">
              {/* Current Plan Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Subscription & Billing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-secondary/40 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
                      <p className="text-xl font-bold text-foreground capitalize">{getPlanLabel()}</p>
                      {user.plan === 'premium' && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          ✓ Active
                        </span>
                      )}
                    </div>
                    <div className="bg-secondary/40 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                      <p className="text-lg font-semibold">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {user.plan === 'premium' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div>
                          <p className="font-medium text-green-800">Premium Plan — Active</p>
                          <p className="text-sm text-green-600">Access to all 563+ deals</p>
                        </div>
                        <span className="text-green-600 text-xl">✓</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          try {
                            const res = await fetch('https://api.perksnest.co/api/billing/portal', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId: user.id, email: user.email }),
                            });
                            const data = await res.json();
                            if (data.url) window.location.href = data.url;
                            else toast.error('Could not open billing portal');
                          } catch { toast.error('Billing portal unavailable'); }
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Billing / Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                        <p className="font-medium mb-1">Free Plan</p>
                        <p className="text-sm text-muted-foreground mb-3">Access to 50 free deals. Upgrade to unlock all 563+ deals.</p>
                        <Button
                          className="w-full"
                          onClick={async () => {
                            try {
                              const res = await fetch('https://api.perksnest.co/api/checkout', {
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
                          Upgrade to Premium — $2/mo
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* What's included */}
              <Card>
                <CardHeader><CardTitle className="text-base">What's included in your plan</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {(user.plan === 'premium' ? [
                      '✓ All 563+ deals unlocked',
                      '✓ New premium deals weekly',
                      '✓ Deal comparison tools',
                      '✓ Priority support',
                      '✓ Private Slack community',
                      '✓ Advanced analytics',
                    ] : [
                      '✓ 50 free deals',
                      '✓ Basic deal search',
                      '✓ Bookmarks & saves',
                      '✗ Premium deals locked',
                      '✗ No community access',
                      '✗ No priority support',
                    ]).map((f, i) => (
                      <div key={i} className={`text-sm py-1 ${f.startsWith('✗') ? 'text-muted-foreground' : 'text-foreground'}`}>{f}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
