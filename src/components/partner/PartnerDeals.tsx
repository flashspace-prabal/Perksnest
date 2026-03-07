import { useState } from "react";
import { 
  Package, Plus, Search, Filter, Eye, Edit, Pause, Play, Trash2, 
  CheckCircle, Clock, AlertCircle, TrendingUp, Users, DollarSign, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPartnerDeals, PartnerDeal } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

const deals = [
  { 
    id: 1, 
    name: "Notion Pro - 6 Months Free", 
    status: "active",
    views: 45234, 
    claims: 3421, 
    redemptions: 2987,
    redemptionRate: 87.3,
    revenue: 12450,
    createdAt: "2024-01-15",
    expiresAt: "2024-12-31",
    category: "Productivity"
  },
  { 
    id: 2, 
    name: "Notion Team - 50% Off", 
    status: "active",
    views: 23456, 
    claims: 1876, 
    redemptions: 1654,
    redemptionRate: 88.2,
    revenue: 8230,
    createdAt: "2024-02-01",
    expiresAt: "2024-12-31",
    category: "Productivity"
  },
  { 
    id: 3, 
    name: "Notion Enterprise Trial", 
    status: "paused",
    views: 12345, 
    claims: 654, 
    redemptions: 432,
    redemptionRate: 66.1,
    revenue: 2100,
    createdAt: "2024-03-10",
    expiresAt: "2024-11-30",
    category: "Enterprise"
  },
  { 
    id: 4, 
    name: "Notion AI Add-on - 30% Off", 
    status: "expired",
    views: 8765, 
    claims: 432, 
    redemptions: 321,
    redemptionRate: 74.3,
    revenue: 1560,
    createdAt: "2023-06-01",
    expiresAt: "2024-01-31",
    category: "AI"
  },
];

export const PartnerDeals = () => {
  const { user } = useAuth();
  const [allDeals, setAllDeals] = useState<PartnerDeal[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getPartnerDeals().then(all => {
      if (user) setAllDeals(all.filter(d => d.partnerId === user.id));
      else setAllDeals(all);
    });
  }, [user]);

  // Map PartnerDeal to display format
  const deals = allDeals.map(d => ({
    id: d.id,
    name: d.name,
    status: d.status === "approved" ? "active" : d.status === "pending" ? "paused" : "expired",
    views: d.views || 0,
    claims: d.claims || 0,
    redemptions: Math.floor((d.claims || 0) * 0.7),
    redemptionRate: d.views ? parseFloat(((d.claims / d.views) * 100).toFixed(1)) : 0,
    revenue: (d.claims || 0) * 25,
    createdAt: d.createdAt || new Date().toISOString().split('T')[0],
    expiresAt: d.expiresAt || "2025-12-31",
    category: d.category || "Other",
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary text-primary-foreground"><CheckCircle className="h-3 w-3 mr-1" /> Active</Badge>;
      case "paused":
        return <Badge className="bg-muted text-muted-foreground"><Clock className="h-3 w-3 mr-1" /> Paused</Badge>;
      case "expired":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (statusFilter !== "all" && deal.status !== statusFilter) return false;
    if (searchQuery && !deal.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">My Deals</h2>
          <p className="text-muted-foreground">Manage and track all your deals</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
              <DialogDescription>
                Set up a new deal for your product. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="deal-name">Deal Name</Label>
                <Input id="deal-name" placeholder="e.g., 6 Months Free Pro Plan" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your deal..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="productivity">Productivity</SelectItem>
                      <SelectItem value="ai">AI</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="promo-code">Promo Code</Label>
                <Input id="promo-code" placeholder="e.g., NOTION-STARTUP-2024" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Deal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active Deals</p>
            <p className="text-2xl font-bold text-primary">{deals.filter(d => d.status === "active").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Paused</p>
            <p className="text-2xl font-bold">{deals.filter(d => d.status === "paused").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Expired</p>
            <p className="text-2xl font-bold text-muted-foreground">{deals.filter(d => d.status === "expired").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">${deals.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search deals..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deals List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredDeals.map((deal) => (
              <div key={deal.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium text-lg">{deal.name}</p>
                      {getStatusBadge(deal.status)}
                      <Badge variant="outline">{deal.category}</Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
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
                        <DollarSign className="h-4 w-4" /> ${deal.revenue.toLocaleString()} revenue
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Expires {new Date(deal.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {deal.status === "active" ? (
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : deal.status === "paused" ? (
                      <Button size="sm" variant="outline" className="text-primary">
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button size="sm" variant="outline" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
