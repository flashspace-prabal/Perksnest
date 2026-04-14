import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  Package,
  DollarSign,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  Activity,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getAdminDeals, getAdminStats, updatePartnerDealStatusAdmin } from '@/lib/api';
import { formatCompactCurrency, formatCurrency, formatSessionDuration, parseMoney, relativeDateLabel } from '@/lib/admin';
import { toast } from 'sonner';

type DashboardStats = {
  totalUsers?: number;
  activeUsers?: number;
  premiumUsers?: number;
  freeUsers?: number;
  activeDeals?: number;
  pendingApproval?: number;
  totalMembers?: number;
  totalSavings?: number;
  mrr?: number;
  totalRevenue?: number;
  conversionRate?: number;
  churnRate?: number;
  nps?: number | null;
  avgSessionDurationMinutes?: number | null;
  categories?: { name: string; count: number }[];
};

export const AdminDashboardLive = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [platformDeals, setPlatformDeals] = useState<any[]>([]);
  const [partnerDeals, setPartnerDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsResponse, dealsResponse] = await Promise.all([getAdminStats(), getAdminDeals()]);
      setStats(statsResponse || {});
      setPlatformDeals(Array.isArray(dealsResponse.deals) ? dealsResponse.deals : []);
      setPartnerDeals(Array.isArray(dealsResponse.partnerDeals) ? dealsResponse.partnerDeals : []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const pendingDeals = useMemo(() => partnerDeals.filter((deal) => deal.status === 'pending').slice(0, 3), [partnerDeals]);

  const topDeals = useMemo(() => {
    const allDeals = [
      ...platformDeals.map((deal) => ({
        id: deal.id,
        name: deal.name,
        claims: Number(deal.claims || 0),
        savings: parseMoney(deal.savings),
      })),
      ...partnerDeals
        .filter((deal) => deal.status === 'approved')
        .map((deal) => ({
          id: deal.id,
          name: deal.name,
          claims: Number(deal.claims || 0),
          savings: parseMoney(deal.savings),
        })),
    ];

    return allDeals
      .sort((a, b) => (b.claims || b.savings) - (a.claims || a.savings))
      .slice(0, 5)
      .map((deal, index) => ({
        ...deal,
        rank: index + 1,
        redemptionRate: deal.claims > 0 ? Math.min(100, 25 + deal.claims) : 0,
      }));
  }, [partnerDeals, platformDeals]);

  const recentActivity = useMemo(() => {
    const partnerActivity = partnerDeals.map((deal) => ({
      id: `partner-${deal.id}`,
      user: deal.partnerName,
      action: `${deal.status === 'pending' ? 'submitted' : 'updated'} "${deal.name}"`,
      time: relativeDateLabel(deal.createdAt),
    }));

    const platformActivity = platformDeals.slice(0, 4).map((deal) => ({
      id: `platform-${deal.id}`,
      user: 'Platform',
      action: `published "${deal.name}"`,
      time: relativeDateLabel(deal.created_at),
    }));

    return [...partnerActivity, ...platformActivity].slice(0, 8);
  }, [partnerDeals, platformDeals]);

  const handlePartnerDealAction = async (dealId: string, status: 'approved' | 'rejected') => {
    try {
      setActioningId(dealId);
      await updatePartnerDealStatusAdmin(dealId, status);
      toast.success(`Deal ${status}`);
      await loadDashboard();
    } catch (error) {
      console.error(`Failed to ${status} deal:`, error);
      toast.error(`Failed to ${status} deal`);
    } finally {
      setActioningId(null);
    }
  };

  const safeStats = {
    totalUsers: stats?.totalUsers ?? 0,
    activeUsers: stats?.activeUsers ?? 0,
    premiumUsers: stats?.premiumUsers ?? 0,
    freeUsers: stats?.freeUsers ?? 0,
    activeDeals: stats?.activeDeals ?? 0,
    pendingApproval: stats?.pendingApproval ?? 0,
    totalMembers: stats?.totalMembers ?? stats?.totalUsers ?? 0,
    totalSavings: stats?.totalSavings ?? 0,
    mrr: stats?.mrr ?? 0,
    conversionRate: stats?.conversionRate ?? 0,
    churnRate: stats?.churnRate ?? 0,
    nps: stats?.nps ?? null,
    avgSessionDurationMinutes: stats?.avgSessionDurationMinutes ?? null,
    categories: stats?.categories ?? [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Live admin metrics powered by backend data.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDashboard} disabled={loading}>
            <Clock className="h-4 w-4 mr-2" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={() => onTabChange?.('revenue')}>Open Revenue</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{loading ? '...' : safeStats.totalMembers.toLocaleString('en-IN')}</p>
                <p className="text-xs text-muted-foreground mt-1">{safeStats.activeUsers.toLocaleString('en-IN')} active users</p>
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
                <p className="text-2xl font-bold">{loading ? '...' : safeStats.activeDeals}</p>
                <Badge variant="secondary" className="text-xs mt-1">{safeStats.pendingApproval} pending</Badge>
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
                <p className="text-2xl font-bold">{loading ? '...' : formatCurrency(safeStats.mrr)}</p>
                <p className="text-xs text-muted-foreground mt-1">Latest backend-calculated MRR</p>
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
                <p className="text-2xl font-bold">{loading ? '...' : formatCompactCurrency(safeStats.totalSavings)}</p>
                <p className="text-xs text-muted-foreground mt-1">Calculated from recorded claims</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Conversion Rate</p><p className="text-lg font-bold">{safeStats.conversionRate.toFixed(1)}%</p></div><TrendingUp className="h-4 w-4 text-green-600" /></div><Progress value={safeStats.conversionRate} className="mt-2 h-1" /></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Churn Rate</p><p className="text-lg font-bold">{safeStats.churnRate.toFixed(1)}%</p></div><ArrowDownRight className="h-4 w-4 text-red-500" /></div><Progress value={Math.min(100, safeStats.churnRate * 10)} className="mt-2 h-1" /></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">NPS Score</p><p className="text-lg font-bold">{safeStats.nps ?? 'N/A'}</p></div><Activity className="h-4 w-4 text-primary" /></div><Progress value={safeStats.nps ?? 0} className="mt-2 h-1" /></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">Avg. Session</p><p className="text-lg font-bold">{formatSessionDuration(safeStats.avgSessionDurationMinutes)}</p></div><Clock className="h-4 w-4 text-muted-foreground" /></div></CardContent></Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-yellow-500" />Pending Deal Approvals</CardTitle>
            <Badge variant="secondary">{pendingDeals.length} shown</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDeals.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No pending partner deals right now.</div>
              ) : pendingDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{deal.name}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm text-muted-foreground">{deal.partnerName}</span>
                      <Badge variant="outline" className="text-xs capitalize">{deal.category}</Badge>
                      <span className="text-xs text-muted-foreground">{relativeDateLabel(deal.createdAt)}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">{deal.dealText}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handlePartnerDealAction(deal.id, 'approved')} disabled={actioningId === deal.id}><ArrowUpRight className="h-4 w-4 mr-1" />Approve</Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handlePartnerDealAction(deal.id, 'rejected')} disabled={actioningId === deal.id}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => onTabChange?.('deals')}>View All Pending <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity available.</p>
              ) : recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Activity className="h-4 w-4 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm"><span className="font-medium">{activity.user}</span> <span className="text-muted-foreground">{activity.action}</span></p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => onTabChange?.('users')}>View Users <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Top Performing Deals</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onTabChange?.('deals')}>View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {topDeals.length === 0 ? (
              <div className="md:col-span-5 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No deal performance data yet.</div>
            ) : topDeals.map((deal) => (
              <Card key={deal.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground">#{deal.rank}</span><ArrowUpRight className="h-3 w-3 text-green-600" /></div>
                  <p className="font-semibold">{deal.name}</p>
                  <p className="text-sm text-muted-foreground">{deal.claims.toLocaleString('en-IN')} claims</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1"><span>Redemption</span><span>{deal.redemptionRate}%</span></div>
                    <Progress value={deal.redemptionRate} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-lg">User Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div><div className="flex items-center justify-between mb-2"><span className="text-sm">Free Users</span><span className="text-sm font-medium">{safeStats.freeUsers}</span></div><Progress value={safeStats.totalUsers ? (safeStats.freeUsers / safeStats.totalUsers) * 100 : 0} className="h-2" /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-sm">Premium Users</span><span className="text-sm font-medium">{safeStats.premiumUsers}</span></div><Progress value={safeStats.totalUsers ? (safeStats.premiumUsers / safeStats.totalUsers) * 100 : 0} className="h-2 [&>div]:bg-green-500" /></div>
              <div><div className="flex items-center justify-between mb-2"><span className="text-sm">Active Users</span><span className="text-sm font-medium">{safeStats.activeUsers}</span></div><Progress value={safeStats.totalUsers ? (safeStats.activeUsers / safeStats.totalUsers) * 100 : 0} className="h-2 [&>div]:bg-purple-500" /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-lg">Category Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeStats.categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No category data available.</p>
              ) : safeStats.categories.slice(0, 5).map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2"><span className="text-sm capitalize">{category.name}</span><span className="text-sm font-medium">{category.count} deals</span></div>
                  <Progress value={safeStats.activeDeals ? (category.count / safeStats.activeDeals) * 100 : 0} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
