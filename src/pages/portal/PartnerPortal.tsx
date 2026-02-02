import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart3, TrendingUp, DollarSign, Users, Package, Plus, Edit, Pause, Play, 
  Trash2, Eye, MessageSquare, Calendar, Award, CheckCircle, Clock, Download, 
  Filter, Search, Bell, Settings, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const PartnerPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample Partner Data
  const partnerData = {
    name: "Notion Labs",
    tier: "Premium Partner",
    activeDeals: 8,
    totalClaims: 15234,
    totalRedemptions: 12891,
    revenue: 45680,
    pendingCommission: 3240,
    performanceScore: 92
  };

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
      expiresAt: "2024-12-31"
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
      expiresAt: "2024-12-31"
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
      expiresAt: "2024-11-30"
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "deals", label: "My Deals", icon: Package },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="font-bold text-xl">perksnest.</Link>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Partner Portal</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl">
                  📝
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{partnerData.name}</p>
                  <p className="text-xs text-muted-foreground">{partnerData.tier}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-background border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Performance Score */}
          <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-medium">Performance Score</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">{partnerData.performanceScore}%</div>
            <Progress value={partnerData.performanceScore} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">Excellent! Keep up the great work.</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white mb-6">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {partnerData.name}!</h1>
            <p className="text-white/80">Your deals have generated ${partnerData.revenue.toLocaleString()} in revenue this month.</p>
            <div className="flex gap-3 mt-4">
              <Button className="bg-white text-green-700 hover:bg-white/90">
                <Plus className="h-4 w-4 mr-2" />
                Create New Deal
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Deals</p>
                    <p className="text-2xl font-bold">{partnerData.activeDeals}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Claims</p>
                    <p className="text-2xl font-bold">{partnerData.totalClaims.toLocaleString()}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Redemptions</p>
                    <p className="text-2xl font-bold">{partnerData.totalRedemptions.toLocaleString()}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Commission</p>
                    <p className="text-2xl font-bold">${partnerData.pendingCommission.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deals Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">My Deals</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search deals..." className="pl-10 w-60" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{deal.name}</p>
                        <Badge variant={deal.status === "active" ? "default" : "secondary"}>
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
                        <span className="flex items-center gap-1 text-green-600">
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
                        <Button size="sm" variant="outline" className="text-green-600">
                          <Play className="h-4 w-4 mr-1" /> Resume
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Tips to Improve Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Optimize Deal Titles</h4>
                  <p className="text-sm text-blue-600">Clear, value-focused titles increase claims by 25%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Add Rich Descriptions</h4>
                  <p className="text-sm text-green-600">Detailed descriptions improve conversion rates</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-700 mb-2">Respond Quickly</h4>
                  <p className="text-sm text-purple-600">Fast response times boost partner scores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PartnerPortal;
