import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, AlertCircle, RefreshCw } from "lucide-react";
import { getAllUsers } from "@/lib/auth";

interface StripeCharge {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  billing_details: { email: string; name: string };
  description?: string;
}

interface StripeSub {
  id: string;
  status: string;
  customer: string;
  current_period_end: number;
  items: { data: { price: { unit_amount: number; recurring: { interval: string } } }[] };
}



async function fetchStripe(path: string) {
  // Route through our API server to keep Stripe key server-side
  const res = await fetch(`https://api.perksnest.co/api/stripe${path}`);
  if (!res.ok) throw new Error('Stripe API error');
  return res.json();
}

export const AdminRevenue = () => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [charges, setCharges] = useState<StripeCharge[]>([]);
  const [subscriptions, setSubscriptions] = useState<StripeSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'subscriptions'>('transactions');

  useEffect(() => {
    Promise.all([
      getAllUsers().then(setAllUsers),
      fetchStripe('/charges?limit=20&expand[]=data.customer').then(d => setCharges(d.data || [])),
      fetchStripe('/subscriptions?limit=20&status=all').then(d => setSubscriptions(d.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const premiumUsers = allUsers.filter(u => u.plan === 'premium' || u.plan === 'enterprise').length;
    const freeUsers = allUsers.filter(u => u.plan === 'free').length;

    // Real MRR from active subscriptions
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const mrr = activeSubs.reduce((sum, s) => {
      const price = s.items.data[0]?.price;
      if (!price) return sum;
      const amount = price.unit_amount / 100;
      return sum + (price.recurring?.interval === 'year' ? amount / 12 : amount);
    }, 0);

    // Real revenue from charges
    const successfulCharges = charges.filter(c => c.status === 'succeeded');
    const totalRevenue = successfulCharges.reduce((sum, c) => sum + c.amount / 100, 0);
    const failedCount = charges.filter(c => c.status === 'failed').length;

    return {
      mrr: mrr || (premiumUsers * 12),
      arr: (mrr || (premiumUsers * 12)) * 12,
      totalRevenue,
      activeSubscriptions: activeSubs.length || premiumUsers,
      freeUsers,
      premiumUsers,
      totalUsers: allUsers.length,
      failedPayments: failedCount,
      successfulCharges: successfulCharges.length,
      conversionRate: allUsers.length > 0 ? (premiumUsers / allUsers.length * 100) : 0,
    };
  }, [allUsers, charges, subscriptions]);

  const statCards = [
    { label: 'Monthly Recurring Revenue', value: `$${stats.mrr.toFixed(2)}`, sub: `${stats.activeSubscriptions} active subscription${stats.activeSubscriptions !== 1 ? 's' : ''}`, icon: DollarSign, color: 'text-green-600', trend: '+' },
    { label: 'Annual Recurring Revenue', value: `$${stats.arr.toFixed(0)}`, sub: 'Projected from MRR', icon: TrendingUp, color: 'text-blue-600', trend: '+' },
    { label: 'Total Collected', value: `$${stats.totalRevenue.toFixed(2)}`, sub: `${stats.successfulCharges} successful charge${stats.successfulCharges !== 1 ? 's' : ''}`, icon: CreditCard, color: 'text-purple-600', trend: '+' },
    { label: 'Failed Payments', value: `${stats.failedPayments}`, sub: 'Requires attention', icon: AlertCircle, color: 'text-red-500', trend: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revenue & Analytics</h2>
          <p className="text-muted-foreground">Live data from Stripe</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setLoading(true); Promise.all([fetchStripe('/charges?limit=20').then(d => setCharges(d.data||[])), fetchStripe('/subscriptions?limit=20&status=all').then(d => setSubscriptions(d.data||[]))]).finally(()=>setLoading(false)); }} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold">{loading ? '...' : s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Total Users</p><p className="text-xl font-bold mt-1">{stats.totalUsers}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Premium Users</p><p className="text-xl font-bold mt-1 text-purple-600">{stats.premiumUsers}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Free Users</p><p className="text-xl font-bold mt-1">{stats.freeUsers}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Conversion Rate</p><p className="text-xl font-bold mt-1 text-green-600">{stats.conversionRate.toFixed(1)}%</p></CardContent></Card>
      </div>

      {/* Tabs: Transactions | Subscriptions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab('transactions')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'transactions' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>Transactions ({charges.length})</button>
            <button onClick={() => setActiveTab('subscriptions')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>Subscriptions ({subscriptions.length})</button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground py-4 text-center">Loading from Stripe...</p> : activeTab === 'transactions' ? (
            <div className="space-y-2">
              {charges.length === 0 ? <p className="text-sm text-muted-foreground">No charges found.</p> : charges.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.billing_details?.email || c.billing_details?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{new Date(c.created * 1000).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})} · {c.id.slice(0,20)}...</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="font-semibold text-sm">${(c.amount/100).toFixed(2)} {c.currency.toUpperCase()}</span>
                    <Badge className={c.status === 'succeeded' ? 'bg-green-100 text-green-700 border-0' : 'bg-red-100 text-red-700 border-0'}>{c.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {subscriptions.length === 0 ? <p className="text-sm text-muted-foreground">No subscriptions found.</p> : subscriptions.map(s => {
                const price = s.items.data[0]?.price;
                const amount = price ? price.unit_amount / 100 : 0;
                const interval = price?.recurring?.interval || 'mo';
                return (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.customer}</p>
                      <p className="text-xs text-muted-foreground">Renews: {new Date(s.current_period_end * 1000).toLocaleDateString()} · {s.id.slice(0,20)}...</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="font-semibold text-sm">${amount.toFixed(2)}/{interval}</span>
                      <Badge className={s.status === 'active' ? 'bg-green-100 text-green-700 border-0' : 'bg-yellow-100 text-yellow-700 border-0'}>{s.status}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
