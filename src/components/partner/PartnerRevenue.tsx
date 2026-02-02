import { 
  DollarSign, TrendingUp, Calendar, Download, CreditCard, 
  ArrowUpRight, CheckCircle, Clock, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const revenueData = {
  totalRevenue: 45680,
  pendingCommission: 3240,
  paidCommission: 42440,
  commissionRate: 20,
  avgDealValue: 85,
};

const transactions = [
  { id: 1, description: "Notion Pro - 6 Months Free", amount: 2450, type: "commission", status: "paid", date: "2024-01-28" },
  { id: 2, description: "Notion Team - 50% Off", amount: 1230, type: "commission", status: "paid", date: "2024-01-25" },
  { id: 3, description: "January Commission Payout", amount: 3680, type: "payout", status: "paid", date: "2024-01-20" },
  { id: 4, description: "Notion Enterprise Trial", amount: 890, type: "commission", status: "pending", date: "2024-01-18" },
  { id: 5, description: "Notion AI Add-on", amount: 560, type: "commission", status: "pending", date: "2024-01-15" },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 45680, commission: 9136 },
  { month: "Feb", revenue: 42350, commission: 8470 },
  { month: "Mar", revenue: 38900, commission: 7780 },
  { month: "Apr", revenue: 35200, commission: 7040 },
  { month: "May", revenue: 41500, commission: 8300 },
  { month: "Jun", revenue: 48900, commission: 9780 },
];

export const PartnerRevenue = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-primary text-primary-foreground"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
      case "pending":
        return <Badge className="bg-accent/10 text-accent"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Revenue & Commissions</h2>
          <p className="text-muted-foreground">Track your earnings and payment history</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">${revenueData.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
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
                <p className="text-2xl font-bold text-accent">${revenueData.pendingCommission.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting payout</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid Commission</p>
                <p className="text-2xl font-bold">${revenueData.paidCommission.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
                <p className="text-2xl font-bold">{revenueData.commissionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Per deal</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyRevenue.map((month, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-12 font-medium">{month.month}</span>
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Revenue</span>
                      <span className="text-sm font-medium">${month.revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(month.revenue / 50000) * 100} className="h-2" />
                  </div>
                  <div className="w-32 text-right">
                    <span className="text-sm text-primary font-medium">+${month.commission.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">commission</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Transaction History</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "payout" ? "bg-primary/10" : "bg-accent/10"
                  }`}>
                    {transaction.type === "payout" ? (
                      <CreditCard className="h-5 w-5 text-primary" />
                    ) : (
                      <DollarSign className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.type === "payout" ? "Payout" : "Commission"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(transaction.status)}
                  <p className={`font-semibold ${transaction.type === "payout" ? "text-primary" : ""}`}>
                    +${transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payout Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-medium">Bank Account</span>
                <Badge className="bg-primary text-primary-foreground">Primary</Badge>
              </div>
              <p className="text-muted-foreground">•••• •••• •••• 4532</p>
              <p className="text-sm text-muted-foreground">Chase Business Checking</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-5 w-5 text-accent" />
                <span className="font-medium">Payout Schedule</span>
              </div>
              <p className="text-muted-foreground">Monthly on the 1st</p>
              <p className="text-sm text-muted-foreground">Minimum payout: $100</p>
            </div>
          </div>
          <Button className="mt-4" variant="outline">
            Update Payment Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
