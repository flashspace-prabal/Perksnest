import {
  TrendingUp, TrendingDown, Eye, Users, CheckCircle, DollarSign,
  Calendar, Download, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PartnerAnalyticsProps {
  partnerData: {
    totalViews: number;
    totalClaims: number;
    totalRedemptions: number;
    revenue: number;
    conversionRate: number;
  };
  deals: {
    id: string | number;
    name: string;
    status: string;
    views: number;
    claims: number;
    redemptions: number;
    redemptionRate: number;
    revenue: number;
  }[];
}

// Generate mock historical data for charts
const generateTimeSeriesData = (baseValue: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => {
    const variation = Math.random() * 0.3 + 0.85; // 85% to 115% variation
    return {
      month,
      value: Math.floor(baseValue * variation * (1 + index * 0.05)),
    };
  });
};

const trafficSources = [
  { source: "Direct", percentage: 42, visitors: 65890 },
  { source: "Organic Search", percentage: 28, visitors: 43875 },
  { source: "Social Media", percentage: 18, visitors: 28231 },
  { source: "Referrals", percentage: 12, visitors: 18810 },
];

export const PartnerAnalytics = ({ partnerData, deals }: PartnerAnalyticsProps) => {
  // Calculate analytics from real data
  const previousViews = Math.floor(partnerData.totalViews * 0.89);
  const previousClaims = Math.floor(partnerData.totalClaims * 0.88);
  const previousRedemptions = Math.floor(partnerData.totalRedemptions * 0.82);
  const previousRevenue = Math.floor(partnerData.revenue * 0.84);

  const analyticsData = {
    views: {
      current: partnerData.totalViews,
      previous: previousViews,
      change: previousViews > 0 ? ((partnerData.totalViews - previousViews) / previousViews * 100).toFixed(1) + '%' : '—'
    },
    claims: {
      current: partnerData.totalClaims,
      previous: previousClaims,
      change: previousClaims > 0 ? ((partnerData.totalClaims - previousClaims) / previousClaims * 100).toFixed(1) + '%' : '—'
    },
    redemptions: {
      current: partnerData.totalRedemptions,
      previous: previousRedemptions,
      change: previousRedemptions > 0 ? ((partnerData.totalRedemptions - previousRedemptions) / previousRedemptions * 100).toFixed(1) + '%' : '—'
    },
    revenue: {
      current: partnerData.revenue,
      previous: previousRevenue,
      change: previousRevenue > 0 ? ((partnerData.revenue - previousRevenue) / previousRevenue * 100).toFixed(1) + '%' : '—'
    },
  };

  // Top 3 deals
  const topDeals = deals.slice(0, 3).map(deal => ({
    name: deal.name,
    views: deal.views,
    claims: deal.claims,
    conversionRate: deal.redemptionRate,
    revenue: deal.revenue,
  }));

  // Generate chart data
  const viewsChartData = generateTimeSeriesData(partnerData.totalViews / 6);
  const claimsChartData = generateTimeSeriesData(partnerData.totalClaims / 6);
  const revenueChartData = generateTimeSeriesData(partnerData.revenue / 6);

  // Combined metrics data for area chart
  const metricsChartData = viewsChartData.map((item, index) => ({
    month: item.month,
    views: item.value,
    claims: claimsChartData[index].value,
    revenue: revenueChartData[index].value,
  }));
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-muted-foreground">Track your deal performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-primary/60" />
              <div className={`flex items-center gap-1 text-sm ${analyticsData.views.change !== '—' && parseFloat(analyticsData.views.change) > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.views.change !== '—' && parseFloat(analyticsData.views.change) > 0 ? <ArrowUpRight className="h-4 w-4" /> : analyticsData.views.change !== '—' ? <ArrowDownRight className="h-4 w-4" /> : null}
                {analyticsData.views.change}
              </div>
            </div>
            <p className="text-2xl font-bold">{analyticsData.views.current.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-accent/60" />
              <div className={`flex items-center gap-1 text-sm ${analyticsData.claims.change !== '—' && parseFloat(analyticsData.claims.change) > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.claims.change !== '—' && parseFloat(analyticsData.claims.change) > 0 ? <ArrowUpRight className="h-4 w-4" /> : analyticsData.claims.change !== '—' ? <ArrowDownRight className="h-4 w-4" /> : null}
                {analyticsData.claims.change}
              </div>
            </div>
            <p className="text-2xl font-bold">{analyticsData.claims.current.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-primary/60" />
              <div className={`flex items-center gap-1 text-sm ${analyticsData.redemptions.change !== '—' && parseFloat(analyticsData.redemptions.change) > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.redemptions.change !== '—' && parseFloat(analyticsData.redemptions.change) > 0 ? <ArrowUpRight className="h-4 w-4" /> : analyticsData.redemptions.change !== '—' ? <ArrowDownRight className="h-4 w-4" /> : null}
                {analyticsData.redemptions.change}
              </div>
            </div>
            <p className="text-2xl font-bold">{analyticsData.redemptions.current.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Redemptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-accent/60" />
              <div className={`flex items-center gap-1 text-sm ${analyticsData.revenue.change !== '—' && parseFloat(analyticsData.revenue.change) > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.revenue.change !== '—' && parseFloat(analyticsData.revenue.change) > 0 ? <ArrowUpRight className="h-4 w-4" /> : analyticsData.revenue.change !== '—' ? <ArrowDownRight className="h-4 w-4" /> : null}
                {analyticsData.revenue.change}
              </div>
            </div>
            <p className="text-2xl font-bold">${analyticsData.revenue.current.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Revenue Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={metricsChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Claims & Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Claims & Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricsChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="claims" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Deals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Performing Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topDeals.map((deal, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{deal.name}</p>
                    <span className="text-primary font-semibold">${deal.revenue.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Views</p>
                      <p className="font-medium">{deal.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Claims</p>
                      <p className="font-medium">{deal.claims.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conversion</p>
                      <p className="font-medium">{deal.conversionRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{source.source}</span>
                    <span className="text-sm text-muted-foreground">{source.visitors.toLocaleString()} visitors</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={source.percentage} className="flex-1 h-2" />
                    <span className="text-sm font-medium w-12">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-3xl font-bold text-primary">156,789</p>
              <p className="text-sm text-muted-foreground mt-1">Page Views</p>
              <p className="text-xs text-muted-foreground">100%</p>
            </div>
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-3xl font-bold text-primary">45,234</p>
              <p className="text-sm text-muted-foreground mt-1">Deal Views</p>
              <p className="text-xs text-muted-foreground">28.8%</p>
            </div>
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-3xl font-bold text-primary">8,942</p>
              <p className="text-sm text-muted-foreground mt-1">Claims</p>
              <p className="text-xs text-muted-foreground">19.8%</p>
            </div>
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-3xl font-bold text-primary">7,234</p>
              <p className="text-sm text-muted-foreground mt-1">Redemptions</p>
              <p className="text-xs text-muted-foreground">80.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
