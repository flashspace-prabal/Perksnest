import { getAllUsers } from '@/lib/auth';
import { getPartnerDeals } from '@/lib/store';
import { useState, useMemo } from "react";
import { 
  Search, Filter, Download, Eye, Edit, MoreVertical, Plus, Mail,
  CheckCircle, XCircle, Star, TrendingUp, DollarSign, ArrowUpDown,
  ChevronLeft, ChevronRight, Building2, Users, Package, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const partners = [
  { id: 1, name: "Notion Labs", logo: "N", tier: "Premium", deals: 3, totalClaims: 45230, totalRedemptions: 39350, redemptionRate: 87, revenue: 89500, commission: 17900, status: "active", since: "2022-03-15" },
  { id: 2, name: "Google Cloud", logo: "G", tier: "Premium", deals: 5, totalClaims: 38900, totalRedemptions: 35820, redemptionRate: 92, revenue: 156000, commission: 31200, status: "active", since: "2021-08-20" },
  { id: 3, name: "Stripe", logo: "S", tier: "Premium", deals: 2, totalClaims: 28400, totalRedemptions: 22150, redemptionRate: 78, revenue: 67800, commission: 13560, status: "active", since: "2021-11-10" },
  { id: 4, name: "HubSpot", logo: "H", tier: "Growth", deals: 4, totalClaims: 21500, totalRedemptions: 17415, redemptionRate: 81, revenue: 45600, commission: 9120, status: "active", since: "2022-06-05" },
  { id: 5, name: "Make", logo: "M", tier: "Starter", deals: 2, totalClaims: 18600, totalRedemptions: 15810, redemptionRate: 85, revenue: 24300, commission: 4860, status: "active", since: "2023-01-12" },
  { id: 6, name: "Figma", logo: "F", tier: "Growth", deals: 3, totalClaims: 16400, totalRedemptions: 14100, redemptionRate: 86, revenue: 38900, commission: 7780, status: "pending", since: "2024-01-20" },
];

const pendingPartners = [
  { id: 1, name: "Vercel", website: "vercel.com", category: "Development", submittedAt: "2024-01-28", proposedDeals: 2, estimatedValue: "$25,000" },
  { id: 2, name: "Linear", website: "linear.app", category: "Project Management", submittedAt: "2024-01-27", proposedDeals: 1, estimatedValue: "$15,000" },
  { id: 3, name: "Retool", website: "retool.com", category: "Development", submittedAt: "2024-01-26", proposedDeals: 3, estimatedValue: "$45,000" },
];

const partnerStats = {
  total: 975,
  active: 892,
  pending: 45,
  premium: 234,
  growth: 456,
  starter: 285,
  totalRevenue: 4567890,
  totalCommission: 913578,
  avgRedemptionRate: 84.2
};

export const AdminPartners = () => {
  const realPartners = useMemo(() => {
    const users = getAllUsers().filter(u => u.role === 'partner');
    const allDeals = getPartnerDeals();
    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      dealCount: allDeals.filter(d => d.partnerId === u.id).length,
      approvedCount: allDeals.filter(d => d.partnerId === u.id && d.status === 'approved').length,
      joinedDate: u.createdAt || new Date().toISOString(),
    }));
  }, []);

  const [activeTab, setActiveTab] = useState("all");

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "Premium":
        return <Badge className="bg-primary text-primary-foreground hover:bg-primary">Premium</Badge>;
      case "Growth":
        return <Badge className="bg-accent text-accent-foreground hover:bg-accent">Growth</Badge>;
      default:
        return <Badge variant="secondary">Starter</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Active</Badge>;
      case "pending":
        return <Badge className="bg-accent/10 text-accent hover:bg-accent/10">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Partner Management</h1>
          <p className="text-muted-foreground">Manage vendor partners, deals, and commissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Partners</p>
            <p className="text-xl font-bold">{partnerStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-xl font-bold text-primary">{partnerStats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending Review</p>
            <p className="text-xl font-bold text-accent">{partnerStats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Premium Tier</p>
            <p className="text-xl font-bold text-primary">{partnerStats.premium}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold">${(partnerStats.totalRevenue / 1000000).toFixed(1)}M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Commissions Paid</p>
            <p className="text-xl font-bold text-primary">${(partnerStats.totalCommission / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Partners</TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending Applications
            <Badge variant="destructive" className="h-5 px-1.5">{pendingPartners.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search partners..." className="pl-10" />
                </div>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Partners Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4">Partner</th>
                      <th className="text-left p-4">Tier</th>
                      <th className="text-left p-4">Deals</th>
                      <th className="text-left p-4">Total Claims</th>
                      <th className="text-left p-4">Redemption Rate</th>
                      <th className="text-left p-4">Revenue</th>
                      <th className="text-left p-4">Commission</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr key={partner.id} className="border-b hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {partner.logo}
                            </div>
                            <div>
                              <p className="font-medium">{partner.name}</p>
                              <p className="text-xs text-muted-foreground">Since {partner.since}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{getTierBadge(partner.tier)}</td>
                        <td className="p-4 text-sm">{partner.deals}</td>
                        <td className="p-4 text-sm">{partner.totalClaims.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Progress value={partner.redemptionRate} className="w-16 h-2" />
                            <span className="text-sm">{partner.redemptionRate}%</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium">${partner.revenue.toLocaleString()}</td>
                        <td className="p-4 text-sm font-medium text-primary">${partner.commission.toLocaleString()}</td>
                        <td className="p-4">{getStatusBadge(partner.status)}</td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> View Profile</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="h-4 w-4 mr-2" /> Edit Partner</DropdownMenuItem>
                              <DropdownMenuItem><Package className="h-4 w-4 mr-2" /> View Deals</DropdownMenuItem>
                              <DropdownMenuItem><Mail className="h-4 w-4 mr-2" /> Contact</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">Showing 1-6 of {partnerStats.total} partners</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm"><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-yellow-500" />
                Partner Applications ({pendingPartners.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPartners.map((partner) => (
                  <div key={partner.id} className="flex items-start justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-lg">{partner.name}</p>
                      <p className="text-sm text-muted-foreground mb-3">{partner.website}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-medium">{partner.category}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Proposed Deals</p>
                          <p className="font-medium">{partner.proposedDeals}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Est. Value</p>
                          <p className="font-medium text-primary">{partner.estimatedValue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p className="font-medium">{partner.submittedAt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive border-destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Top Performing Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners.slice(0, 5).map((partner, index) => (
                    <div key={partner.id} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-bold text-sm">
                        {partner.logo}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">{partner.deals} deals</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${partner.revenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Partner Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm font-medium">Premium Partners</span>
                      </div>
                      <span className="text-sm font-medium">{partnerStats.premium}</span>
                    </div>
                    <Progress value={(partnerStats.premium / partnerStats.total) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span className="text-sm font-medium">Growth Partners</span>
                      </div>
                      <span className="text-sm font-medium">{partnerStats.growth}</span>
                    </div>
                    <Progress value={(partnerStats.growth / partnerStats.total) * 100} className="h-2 [&>div]:bg-accent" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span className="text-sm font-medium">Starter Partners</span>
                      </div>
                      <span className="text-sm font-medium">{partnerStats.starter}</span>
                    </div>
                    <Progress value={(partnerStats.starter / partnerStats.total) * 100} className="h-2 [&>div]:bg-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Commission Payouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4">Partner</th>
                      <th className="text-left p-4">Tier</th>
                      <th className="text-left p-4">Commission Rate</th>
                      <th className="text-left p-4">Gross Revenue</th>
                      <th className="text-left p-4">Commission Earned</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr key={partner.id} className="border-b hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-bold text-sm">
                              {partner.logo}
                            </div>
                            <span className="font-medium">{partner.name}</span>
                          </div>
                        </td>
                        <td className="p-4">{getTierBadge(partner.tier)}</td>
                        <td className="p-4 text-sm">20%</td>
                        <td className="p-4 text-sm">${partner.revenue.toLocaleString()}</td>
                        <td className="p-4 text-sm font-medium text-primary">${partner.commission.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Paid</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
