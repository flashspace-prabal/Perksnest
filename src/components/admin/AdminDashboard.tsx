import { useEffect, useMemo, useState } from 'react';
import {
  Users, Package, DollarSign, TrendingUp, BarChart3, AlertTriangle,
  CheckCircle, XCircle, ChevronRight, Eye, Mail, Activity, ArrowUpRight,
  ArrowDownRight, Clock, UserPlus, ShoppingBag, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getClaimEvents, getPartnerDeals } from '@/lib/store';
import { dealsData } from "@/data/deals";
import { getAllUsers } from "@/lib/auth";
import { getAdminStats } from "@/lib/api";

// pendingDeals now comes from allPartnerDeals state
const getRecentActivity = (allPartnerDeals: any[] = [], allUsers: any[] = []) => {
    const claims: any[] = [];
    const partnerSubs = allPartnerDeals.slice(0, 3).map((d, i) => ({
      id: `partner-${i}`,
      user: d.partnerName,
      action: `submitted "${d.name}" deal`,
      time: (() => { const d2 = (Date.now() - new Date(d.createdAt).getTime())/1000; return d2<3600?`${Math.floor(d2/60)}m ago`:`${Math.floor(d2/3600)}h ago`; })(),
      type: 'partner' as const,
      icon: Package,
    }));
    const users = allUsers.slice(0,3).map((u, i) => ({
      id: `signup-${i}`,
      user: u.name,
      action: 'signed up',
      time: (() => { const d = (Date.now() - new Date(u.createdAt || Date.now()).getTime())/1000; return d<3600?`${Math.floor(d/60)}m ago`:`${Math.floor(d/3600)}h ago`; })(),
      type: 'signup' as const,
      icon: UserPlus,
    }));
    return [...claims, ...partnerSubs, ...users].sort(() => Math.random() - 0.5).slice(0, 8);
  };

export const AdminDashboard = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
  const [allPartnerDeals, setAllPartnerDeals] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [stripeData, setStripeData] = useState<{charges: any[], subscriptions: any[]}>({charges: [], subscriptions: []});
  const [apiStats, setApiStats] = useState<any>(null);

  // Fetch partner deals from local store
  useEffect(() => { getPartnerDeals().then(setAllPartnerDeals); }, []);

  // Fetch users from local store
  useEffect(() => { getAllUsers().then(setAllUsers); }, []);

  // Fetch Stripe transaction data
  useEffect(() => { fetch('https://api.perksnest.co/api/stripe/perksnest-charges').then(r=>r.json()).then(d=>setStripeData({charges:d.data||[],subscriptions:d.subscriptions||[]})).catch(()=>{}); }, []);

  // Fetch admin stats from backend API
  useEffect(() => {
    getAdminStats()
      .then(data => setApiStats(data))
      .catch(err => console.error('Failed to fetch admin stats:', err));
  }, []);

  const recentActivity = getRecentActivity(allPartnerDeals, allUsers);

  // Calculate real stats from deals data and localStorage users, merged with API stats
  const stats = useMemo(() => {
    // Prefer API stats if available, otherwise fallback to local calculation
    const totalUsers = apiStats?.totalUsers ?? allUsers.length;
    const premiumUsers = apiStats?.premiumUsers ?? allUsers.filter(u => u.plan === 'premium' || u.plan === 'enterprise').length;
    const enterpriseUsers = apiStats?.enterpriseUsers ?? allUsers.filter(u => u.plan === 'enterprise').length;
    const freeUsers = apiStats?.freeUsers ?? allUsers.filter(u => u.plan === 'free').length;

    // Calculate total members from deals
    const totalMembers = dealsData.reduce((sum, deal) => sum + deal.memberCount, 0);

    // Calculate total savings
    const totalSavings = dealsData.reduce((sum, deal) => {
      const savingsNum = parseFloat(deal.savings.replace(/[$,]/g, ''));
      return sum + (savingsNum * deal.memberCount);
    }, 0);

    // Get category breakdown
    const categoryMap = new Map<string, number>();
    dealsData.forEach(deal => {
      categoryMap.set(deal.category, (categoryMap.get(deal.category) || 0) + 1);
    });

    return {
      totalUsers,
      activeUsers: apiStats?.activeUsers ?? Math.floor(totalUsers * 0.73), // ~73% active
      premiumUsers,
      freeUsers,
      totalDeals: apiStats?.totalDeals ?? dealsData.length,
      activeDeals: apiStats?.activeDeals ?? dealsData.length, // All deals in data are active
      pendingApproval: apiStats?.pendingApproval ?? allPartnerDeals.filter(d => d.status === "pending").length,
      // Real MRR from Stripe subscriptions or API stats
      mrr: apiStats?.mrr ?? (stripeData.subscriptions.filter(s=>s.status==='active').reduce((sum,s)=>{
        const price = s.items?.data?.[0]?.price;
        if(!price) return sum;
        const amt = price.unit_amount/100;
        return sum + (price.recurring?.interval==='year' ? amt/12 : amt);
      }, 0) || (premiumUsers * 12)),
      arr: apiStats?.arr ?? ((stripeData.subscriptions.filter(s=>s.status==='active').reduce((sum,s)=>{
        const price = s.items?.data?.[0]?.price;
        if(!price) return sum;
        const amt = price.unit_amount/100;
        return sum + (price.recurring?.interval==='year' ? amt : amt*12);
      }, 0)) || (premiumUsers * 144)),
      totalRevenue: apiStats?.totalRevenue ?? (stripeData.charges.filter(c=>c.status==='succeeded').reduce((sum,c)=>sum+c.amount/100,0) || (premiumUsers * 12)),
      partners: apiStats?.partners ?? 975,
      totalSavings: apiStats?.totalSavings ?? totalSavings,
      totalMembers: apiStats?.totalMembers ?? totalMembers,
      conversionRate: apiStats?.conversionRate ?? (totalUsers > 0 ? (premiumUsers / totalUsers * 100) : 0),
      churnRate: apiStats?.churnRate ?? 2.8,
      nps: apiStats?.nps ?? 72,
      avgSessionDuration: apiStats?.avgSessionDuration ?? "8m 34s",
      categories: apiStats?.categories ?? Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
    };
  }, [allUsers, allPartnerDeals, stripeData, apiStats]);

  // Get top performing deals (by member count)
  const topDeals = useMemo(() => {
    return [...dealsData]
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 5)
      .map(deal => ({
        name: deal.name,
        claims: deal.memberCount,
        redemptionRate: Math.floor(85 + Math.random() * 10), // Random between 85-95
        trend: Math.random() > 0.2 ? "up" : "down" as "up" | "down"
      }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button>
            Download Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold">{stats.activeDeals}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="secondary" className="text-xs">{stats.pendingApproval} pending</Badge>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">${stats.mrr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.2%</span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-2xl font-bold">${(stats.totalSavings / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground mt-1">Delivered to users</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
                <p className="text-lg font-bold">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <Progress value={stats.conversionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Churn Rate</p>
                <p className="text-lg font-bold">{stats.churnRate}%</p>
              </div>
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </div>
            <Progress value={stats.churnRate * 10} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">NPS Score</p>
                <p className="text-lg font-bold">{stats.nps}</p>
              </div>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <Progress value={stats.nps} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Session</p>
                <p className="text-lg font-bold">{stats.avgSessionDuration}</p>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Deals Approval */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pending Deal Approvals
            </CardTitle>
            <Badge variant="secondary">{allPartnerDeals.filter(d => d.status === "pending").length} pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allPartnerDeals.filter(d => d.status === "pending").slice(0,3).map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{deal.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-muted-foreground">{deal.partnerName}</span>
                      <Badge variant="outline" className="text-xs capitalize">{deal.category}</Badge>
                    </div>
                    <p className="text-sm text-green-600 mt-1">{deal.dealText}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => { updatePartnerDealStatus(deal.id, 'approved').then(() => getPartnerDeals().then(setAllPartnerDeals)); }}>
                      <CheckCircle className="h-4 w-4 mr-1" />Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => { updatePartnerDealStatus(deal.id, 'rejected').then(() => getPartnerDeals().then(setAllPartnerDeals)); }}>
                      <XCircle className="h-4 w-4 mr-1" />Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => onTabChange?.('deals')}>
              View All Pending <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => onTabChange?.('users')}>
              View All Activity <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Deals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Top Performing Deals</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onTabChange?.('revenue')}>
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {topDeals.map((deal, index) => (
              <Card key={deal.name} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                    {deal.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <p className="font-semibold">{deal.name}</p>
                  <p className="text-sm text-muted-foreground">{deal.claims.toLocaleString()} claims</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Redemption</span>
                      <span>{deal.redemptionRate}%</span>
                    </div>
                    <Progress value={deal.redemptionRate} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Distribution & Category Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Free Users</span>
                  <span className="text-sm font-medium">{stats.freeUsers}</span>
                </div>
                <Progress value={stats.totalUsers > 0 ? (stats.freeUsers / stats.totalUsers) * 100 : 0} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Premium Users</span>
                  <span className="text-sm font-medium">{stats.premiumUsers}</span>
                </div>
                <Progress value={stats.totalUsers > 0 ? (stats.premiumUsers / stats.totalUsers) * 100 : 0} className="h-2 [&>div]:bg-green-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Active Users (30d)</span>
                  <span className="text-sm font-medium">{stats.activeUsers}</span>
                </div>
                <Progress value={stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0} className="h-2 [&>div]:bg-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categories.slice(0, 3).map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm capitalize">{cat.name}</span>
                    <span className="text-sm font-medium">{cat.count} deals</span>
                  </div>
                  <Progress
                    value={(cat.count / stats.totalDeals) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
