import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, Package, DollarSign, TrendingUp, CheckCircle, XCircle, 
  Clock, AlertTriangle, Search, Filter, Download, Eye, Edit, Ban, Mail, 
  Shield, Settings, BarChart3, Bell, UserCheck, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample Admin Data
  const adminStats = {
    totalUsers: 212980,
    activeUsers: 156432,
    premiumUsers: 34567,
    totalDeals: 563,
    activeDeals: 487,
    pendingApproval: 23,
    totalRevenue: 5495688,
    mrr: 234500,
    partners: 975,
    totalSavings: 5495688436
  };

  const pendingDeals = [
    {
      id: 1,
      name: "Figma Professional - 50% Off",
      partner: "Figma Inc.",
      category: "Design",
      submittedAt: "2024-01-28",
      discount: "50% off for 12 months",
      estimatedSavings: "$600",
      status: "pending_review"
    },
    {
      id: 2,
      name: "MongoDB Atlas Credits",
      partner: "MongoDB",
      category: "Database",
      submittedAt: "2024-01-27",
      discount: "$500 in credits",
      estimatedSavings: "$500",
      status: "pending_review"
    },
    {
      id: 3,
      name: "Stripe Fee Waiver",
      partner: "Stripe",
      category: "Payments",
      submittedAt: "2024-01-26",
      discount: "Waived fees on first $50K",
      estimatedSavings: "$1,450",
      status: "pending_review"
    }
  ];

  const recentUsers = [
    { id: 1, name: "Sarah Johnson", email: "sarah@startup.com", company: "TechStart Inc.", plan: "Premium", signupDate: "2024-01-28", status: "active" },
    { id: 2, name: "Michael Chen", email: "michael@innovate.io", company: "Innovate Labs", plan: "Free", signupDate: "2024-01-28", status: "active" },
    { id: 3, name: "Emily Rodriguez", email: "emily@growth.co", company: "GrowthCo", plan: "Premium", signupDate: "2024-01-27", status: "active" },
    { id: 4, name: "James Wilson", email: "james@dev.io", company: "DevStudio", plan: "Free", signupDate: "2024-01-27", status: "pending" },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "deals", label: "Deals", icon: Package },
    { id: "partners", label: "Partners", icon: UserCheck },
    { id: "revenue", label: "Revenue", icon: DollarSign },
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
              <Badge variant="secondary" className="bg-primary/10 text-primary">Admin Portal</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users, deals, partners..." className="pl-10 w-80" />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                A
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +12.5% this month
                    </p>
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
                    <p className="text-2xl font-bold">{adminStats.activeDeals}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {adminStats.pendingApproval} pending approval
                    </p>
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
                    <p className="text-2xl font-bold">${adminStats.mrr.toLocaleString()}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" /> +8.2% vs last month
                    </p>
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
                    <p className="text-2xl font-bold">${(adminStats.totalSavings / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Delivered to users
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Deals Approval */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Pending Deal Approvals
                </CardTitle>
                <Badge variant="secondary">{pendingDeals.length} pending</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{deal.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">{deal.partner}</span>
                          <Badge variant="outline" className="text-xs">{deal.category}</Badge>
                        </div>
                        <p className="text-sm text-green-600 mt-1">{deal.discount}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Users</CardTitle>
                <Button variant="ghost" size="sm">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={user.plan === "Premium" ? "default" : "secondary"}>
                          {user.plan}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Users className="h-5 w-5" />
                  <span>Manage Users</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Package className="h-5 w-5" />
                  <span>Add New Deal</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Download className="h-5 w-5" />
                  <span>Export Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
