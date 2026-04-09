import { getAllUsers } from '@/lib/auth';
import { getPartnerDeals, type PartnerDeal } from '@/lib/store';
import { useEffect, useMemo, useState } from 'react';
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

// Note: Partner data is calculated from real user/deal data below
// Dummy arrays removed - using real data only

export const AdminPartners = () => {
  const [allPartnerDeals, setAllPartnerDeals] = useState<PartnerDeal[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all partner deals and users
  useEffect(() => { 
    getPartnerDeals().then(deals => {
      setAllPartnerDeals(deals);
    }).catch(err => console.error('Failed to fetch partner deals:', err));
  }, []);

  useEffect(() => { 
    getAllUsers().then(users => {
      setAllUsers(users);
    }).catch(err => console.error('Failed to fetch users:', err));
  }, []);

  // Calculate real partners from users with role='partner'
  const partners = useMemo(() => {
    return allUsers
      .filter(u => u.role === 'partner')
      .map((partner) => {
        const partnerDeals = allPartnerDeals.filter(d => d.partnerId === partner.id);
        const approvedDeals = partnerDeals.filter(d => d.status === 'approved');
        const totalClaims = partnerDeals.reduce((sum, d) => sum + (d.claims || 0), 0);
        const totalViews = partnerDeals.reduce((sum, d) => sum + (d.views || 0), 0);
        
        return {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          logo: partner.name?.charAt(0).toUpperCase() || 'P',
          tier: partner.subscription_tier || 'Starter',
          deals: partnerDeals.length,
          approvedDeals: approvedDeals.length,
          totalClaims: totalClaims,
          totalRedemptions: Math.floor(totalClaims * 0.85), // Estimate
          redemptionRate: totalViews > 0 ? Math.round((totalClaims / totalViews) * 100) : 0,
          revenue: totalClaims * 50, // Placeholder calculation
          commission: totalClaims * 10, // Placeholder calculation
          status: 'active',
          since: partner.createdAt || new Date().toISOString(),
          views: totalViews,
        };
      })
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTier = tierFilter === 'all' || p.tier.toLowerCase() === tierFilter.toLowerCase();
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesTier && matchesStatus;
      });
  }, [allUsers, allPartnerDeals, searchTerm, tierFilter, statusFilter]);

  // Get pending partner deals (applications)
  const pendingPartners = useMemo(() => {
    return allPartnerDeals
      .filter(d => d.status === 'pending')
      .map((deal, idx) => ({
        id: deal.id,
        name: deal.partnerName || 'Unknown Partner',
        website: deal.websiteUrl || '',
        category: deal.category || 'Other',
        submittedAt: new Date(deal.createdAt).toLocaleDateString(),
        proposedDeals: 1,
        estimatedValue: `$${deal.savings || 0}`,
      }));
  }, [allPartnerDeals]);

  // Calculate real stats
  const partnerStats = useMemo(() => {
    const total = partners.length;
    const active = partners.filter(p => p.status === 'active').length;
    const pending = pendingPartners.length;
    const totalRevenue = partners.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalCommission = partners.reduce((sum, p) => sum + (p.commission || 0), 0);
    const avgRedemptionRate = partners.length > 0 
      ? Math.round(partners.reduce((sum, p) => sum + p.redemptionRate, 0) / partners.length)
      : 0;

    return {
      total: total,
      active: active,
      pending: pending,
      premium: partners.filter(p => p.tier === 'Premium').length,
      growth: partners.filter(p => p.tier === 'Growth').length,
      starter: partners.filter(p => p.tier === 'Starter').length,
      totalRevenue: totalRevenue,
      totalCommission: totalCommission,
      avgRedemptionRate: avgRedemptionRate,
    };
  }, [partners, pendingPartners]);

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
                  <Input 
                    placeholder="Search partners..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={tierFilter} onValueChange={setTierFilter}>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              {partners.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No partners found matching your criteria</p>
                </div>
              ) : (
                <>
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
                                  <p className="text-xs text-muted-foreground">Since {new Date(partner.since).toLocaleDateString()}</p>
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
                    <p className="text-sm text-muted-foreground">Showing 1-{partners.length} of {partnerStats.total} partners</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled><ChevronLeft className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                      <Button variant="outline" size="sm"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-yellow-500" />
                Pending Partner Applications ({pendingPartners.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPartners.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No pending partner applications</p>
                </div>
              ) : (
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
                            <p className="text-muted-foreground">Deals Proposed</p>
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
              )}
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
                {partners.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">No partners to display</div>
                ) : (
                  <div className="space-y-4">
                    {partners
                      .sort((a, b) => b.revenue - a.revenue)
                      .slice(0, 5)
                      .map((partner, index) => (
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
                )}
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
                    <Progress value={(partnerStats.premium / (partnerStats.total || 1)) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span className="text-sm font-medium">Growth Partners</span>
                      </div>
                      <span className="text-sm font-medium">{partnerStats.growth}</span>
                    </div>
                    <Progress value={(partnerStats.growth / (partnerStats.total || 1)) * 100} className="h-2 [&>div]:bg-accent" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400" />
                        <span className="text-sm font-medium">Starter Partners</span>
                      </div>
                      <span className="text-sm font-medium">{partnerStats.starter}</span>
                    </div>
                    <Progress value={(partnerStats.starter / (partnerStats.total || 1)) * 100} className="h-2 [&>div]:bg-gray-400" />
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
              {partners.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No commission data to display</p>
                </div>
              ) : (
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
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Pending</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
