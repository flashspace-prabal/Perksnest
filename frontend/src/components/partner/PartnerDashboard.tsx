import { 
  Package, Users, CheckCircle, DollarSign, Plus, Download, Eye, Edit, Pause, Play, TrendingUp, Clock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PartnerDashboardProps {
  partnerData: {
    name: string;
    activeDeals: number;
    totalClaims: number;
    totalRedemptions: number;
    revenue: number;
    pendingCommission: number;
    totalViews?: number;
    conversionRate?: number;
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

export const PartnerDashboard = ({ partnerData, deals }: PartnerDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner - Theme colors */}
      <div className="bg-primary rounded-xl p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {partnerData.name}!</h1>
        <p className="text-primary-foreground/80">Your deals have generated ${partnerData.revenue.toLocaleString()} in revenue this month.</p>
        <div className="flex gap-3 mt-4">
          <Button className="bg-background text-foreground hover:bg-background/90" onClick={() => window.location.href="/partner"}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Deal
          </Button>
          <Button variant="outline" className="border-background bg-background/10 text-background hover:bg-background hover:text-foreground">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{partnerData.totalViews?.toLocaleString() || 0}</p>
                <p className="text-xs text-primary mt-1">+12.5% from last month</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{partnerData.totalClaims.toLocaleString()}</p>
                <p className="text-xs text-accent mt-1">+8.3% from last month</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{partnerData.conversionRate?.toFixed(1) || 0}%</p>
                <p className="text-xs text-primary mt-1">+3.2% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${partnerData.revenue.toLocaleString()}</p>
                <p className="text-xs text-primary mt-1">+15.7% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Commission</p>
                <p className="text-2xl font-bold">${partnerData.pendingCommission.toLocaleString()}</p>
                <p className="text-xs text-accent mt-1">Payout on 1st of month</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deals.slice(0, 3).map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{deal.name}</p>
                    <Badge className={deal.status === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>
                      {deal.status === "active" ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Paused</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {deal.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {deal.claims.toLocaleString()} claims
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" /> {deal.redemptionRate}% conversion
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <DollarSign className="h-4 w-4" /> ${deal.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  {deal.status === "active" ? (
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4 mr-1" /> Pause
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-primary">
                      <Play className="h-4 w-4 mr-1" /> Resume
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips to Improve Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Optimize Deal Titles</h4>
              <p className="text-sm text-muted-foreground">Clear, value-focused titles increase claims by 25%</p>
            </div>
            <div className="p-4 bg-accent/5 border border-accent/10 rounded-lg">
              <h4 className="font-medium text-accent mb-2">Add Rich Descriptions</h4>
              <p className="text-sm text-muted-foreground">Detailed descriptions improve conversion rates</p>
            </div>
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Respond Quickly</h4>
              <p className="text-sm text-muted-foreground">Fast response times boost partner scores</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
