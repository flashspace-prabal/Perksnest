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

const analyticsData = {
  views: { current: 156789, previous: 142340, change: 10.1 },
  claims: { current: 8942, previous: 7856, change: 13.8 },
  redemptions: { current: 7234, previous: 6123, change: 18.1 },
  revenue: { current: 45680, previous: 38450, change: 18.8 },
};

const topDeals = [
  { name: "Notion Pro - 6 Months Free", views: 45234, claims: 3421, conversionRate: 87.3, revenue: 12450 },
  { name: "Notion Team - 50% Off", views: 23456, claims: 1876, conversionRate: 88.2, revenue: 8230 },
  { name: "Notion AI Add-on", views: 18965, claims: 1432, conversionRate: 75.5, revenue: 5890 },
];

const trafficSources = [
  { source: "Direct", percentage: 42, visitors: 65890 },
  { source: "Organic Search", percentage: 28, visitors: 43875 },
  { source: "Social Media", percentage: 18, visitors: 28231 },
  { source: "Referrals", percentage: 12, visitors: 18810 },
];

export const PartnerAnalytics = () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-primary/60" />
              <div className={`flex items-center gap-1 text-sm ${analyticsData.views.change > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.views.change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(analyticsData.views.change)}%
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
              <div className={`flex items-center gap-1 text-sm ${analyticsData.claims.change > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.claims.change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(analyticsData.claims.change)}%
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
              <div className={`flex items-center gap-1 text-sm ${analyticsData.redemptions.change > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.redemptions.change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(analyticsData.redemptions.change)}%
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
              <div className={`flex items-center gap-1 text-sm ${analyticsData.revenue.change > 0 ? 'text-primary' : 'text-destructive'}`}>
                {analyticsData.revenue.change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(analyticsData.revenue.change)}%
              </div>
            </div>
            <p className="text-2xl font-bold">${analyticsData.revenue.current.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Revenue Generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
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
                    <p className="font-medium">{deal.name}</p>
                    <span className="text-primary font-semibold">${deal.revenue.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
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
                      <p className="font-medium">{deal.conversionRate}%</p>
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
          <div className="grid grid-cols-4 gap-4">
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
