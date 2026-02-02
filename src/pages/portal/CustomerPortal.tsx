import { useState } from "react";
import { Link } from "react-router-dom";
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

const CustomerPortal = () => {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  // Sample User Data
  const userData = {
    name: "Sarah Johnson",
    email: "sarah@startup.com",
    company: "TechStart Inc.",
    role: "CEO",
    location: "San Francisco, CA",
    memberSince: "2024-01-15",
    plan: "Premium",
    dealsClaimed: 23,
    totalSavings: 12450,
    referralEarnings: 180
  };

  const claimedDeals = [
    { 
      id: 1, 
      vendor: "Notion", 
      logo: "📝", 
      name: "Notion Pro - 6 Months Free",
      claimedDate: "2024-01-20",
      status: "active",
      expiresDate: "2024-07-20",
      savings: 120,
      redemptionCode: "NOTION-PERK-2024"
    },
    { 
      id: 2, 
      vendor: "Google Cloud", 
      logo: "☁️", 
      name: "Google Cloud - $2000 Credits",
      claimedDate: "2024-01-18",
      status: "redeemed",
      expiresDate: "2024-12-31",
      savings: 2000,
      redemptionCode: "GCP-STARTUP-5678"
    },
    { 
      id: 3, 
      vendor: "Make", 
      logo: "⚡", 
      name: "Make - 10,000 Credits + 40% Off",
      claimedDate: "2024-01-22",
      status: "pending",
      expiresDate: "2024-06-30",
      savings: 500,
      redemptionCode: "MAKE-PERK-9012"
    }
  ];

  const referrals = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "converted", earnedAmount: 20, date: "2024-01-25" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "pending", earnedAmount: 0, date: "2024-01-28" },
    { id: 3, name: "Mike Chen", email: "mike@example.com", status: "converted", earnedAmount: 20, date: "2024-01-20" },
  ];

  const savedDeals = [
    { id: 1, vendor: "Stripe", logo: "💳", name: "Stripe - Waived Fees", savings: "$1,450", category: "Payments" },
    { id: 2, vendor: "AWS", logo: "🌩️", name: "AWS - $5,000 Credits", savings: "$5,000", category: "Cloud" },
    { id: 3, vendor: "Figma", logo: "🎨", name: "Figma Pro - 50% Off", savings: "$180", category: "Design" },
  ];

  const copyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
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
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {userData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl text-primary-foreground font-bold">
            {userData.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <Badge className="bg-gradient-to-r from-primary to-purple-500">{userData.plan}</Badge>
            </div>
            <div className="flex items-center gap-6 mt-2 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building className="h-4 w-4" /> {userData.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {userData.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Member since {new Date(userData.memberSince).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Button variant="outline">
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
                  <p className="text-2xl font-bold text-primary">${userData.totalSavings.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">{userData.dealsClaimed}</p>
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
                  <p className="text-2xl font-bold">${userData.referralEarnings}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saved Deals</p>
                  <p className="text-2xl font-bold">{savedDeals.length}</p>
                </div>
                <Bookmark className="h-8 w-8 text-accent" />
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
            <TabsTrigger value="settings" className="gap-2">
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
                <div className="space-y-4">
                  {claimedDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-background border flex items-center justify-center text-2xl">
                          {deal.logo}
                        </div>
                        <div>
                          <p className="font-medium">{deal.name}</p>
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
                        <p className="text-primary font-semibold">+${deal.savings}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="grid md:grid-cols-3 gap-4">
                  {savedDeals.map((deal) => (
                    <div key={deal.id} className="p-4 bg-muted/50 rounded-lg border hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-background border flex items-center justify-center text-xl">
                          {deal.logo}
                        </div>
                        <div>
                          <p className="font-medium">{deal.vendor}</p>
                          <Badge variant="outline" className="text-xs">{deal.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{deal.name}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-primary font-semibold">{deal.savings} savings</p>
                        <Button size="sm">Claim Deal</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Your Referrals</CardTitle>
                </CardHeader>
                <CardContent>
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
                    <p className="text-sm text-muted-foreground mb-2">Your referral link</p>
                    <div className="flex gap-2">
                      <Input value="perksnest.com/ref/sarah123" readOnly className="text-sm" />
                      <Button size="icon" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
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
                      <Input defaultValue={userData.name} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input defaultValue={userData.email} type="email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Company</label>
                      <Input defaultValue={userData.company} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Input defaultValue={userData.location} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
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
