import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CreditCard, DollarSign, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminStats } from "@/lib/api";
import { API_BASE_URL } from "@/lib/runtime";
import { formatCurrency } from "@/lib/admin";

type StripeCharge = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  billing_details?: { email?: string; name?: string };
};

type StripeSub = {
  id: string;
  status: string;
  customer: string;
  current_period_end: number;
  items: { data: { price: { unit_amount: number; recurring?: { interval?: string } } }[] };
};

async function fetchStripe() {
  const response = await fetch(`${API_BASE_URL}/api/stripe/perksnest-charges`);
  if (!response.ok) return { data: [], subscriptions: [] };
  return response.json();
}

export const AdminRevenueLive = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<string, unknown>>({});
  const [charges, setCharges] = useState<StripeCharge[]>([]);
  const [subscriptions, setSubscriptions] = useState<StripeSub[]>([]);
  const [tab, setTab] = useState<"transactions" | "subscriptions">("transactions");

  const loadRevenue = async () => {
    try {
      setLoading(true);
      const [statsResponse, stripeResponse] = await Promise.all([getAdminStats(), fetchStripe()]);
      setStats(statsResponse || {});
      setCharges(Array.isArray(stripeResponse.data) ? stripeResponse.data : []);
      setSubscriptions(Array.isArray(stripeResponse.subscriptions) ? stripeResponse.subscriptions : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRevenue();
  }, []);

  const totals = useMemo(() => {
    const successfulCharges = charges.filter((charge) => charge.status === "succeeded");
    const activeSubscriptions = subscriptions.filter((subscription) => subscription.status === "active");
    const stripeMrr = activeSubscriptions.reduce((sum, subscription) => {
      const price = subscription.items?.data?.[0]?.price;
      if (!price) return sum;
      const amount = price.unit_amount / 100;
      return sum + (price.recurring?.interval === "year" ? amount / 12 : amount);
    }, 0);
    return {
      mrr: Number(stats.mrr || stripeMrr || 0),
      arr: Number(stats.arr || (stripeMrr * 12) || 0),
      totalRevenue: Number(stats.totalRevenue || successfulCharges.reduce((sum, charge) => sum + (charge.amount / 100), 0)),
      activeSubscriptions: activeSubscriptions.length,
      failedPayments: charges.filter((charge) => charge.status === "failed").length,
    };
  }, [charges, stats, subscriptions]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Revenue & Stripe</h2>
          <p className="text-muted-foreground">Backend-calculated totals with Stripe transaction rendering.</p>
        </div>
        <Button variant="outline" onClick={loadRevenue} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">MRR</p><DollarSign className="h-4 w-4 text-green-600" /></div><p className="text-2xl font-bold mt-2">{loading ? "..." : formatCurrency(totals.mrr)}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">ARR</p><TrendingUp className="h-4 w-4 text-blue-600" /></div><p className="text-2xl font-bold mt-2">{loading ? "..." : formatCurrency(totals.arr)}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Total Revenue</p><CreditCard className="h-4 w-4 text-purple-600" /></div><p className="text-2xl font-bold mt-2">{loading ? "..." : formatCurrency(totals.totalRevenue)}</p></CardContent></Card>
        <Card><CardContent className="pt-5"><div className="flex items-center justify-between"><p className="text-xs text-muted-foreground">Failed Payments</p><AlertCircle className="h-4 w-4 text-red-500" /></div><p className="text-2xl font-bold mt-2">{loading ? "..." : totals.failedPayments}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-4">
            <button className={`px-4 py-2 rounded-lg text-sm ${tab === "transactions" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`} onClick={() => setTab("transactions")}>
              Transactions ({charges.length})
            </button>
            <button className={`px-4 py-2 rounded-lg text-sm ${tab === "subscriptions" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`} onClick={() => setTab("subscriptions")}>
              Subscriptions ({subscriptions.length})
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-10">Loading revenue data...</p>
          ) : tab === "transactions" ? (
            charges.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">No Stripe transactions available.</p>
            ) : (
              <div className="space-y-2">
                {charges.map((charge) => (
                  <div key={charge.id} className="rounded-lg bg-muted/40 p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{charge.billing_details?.email || charge.billing_details?.name || "Unknown customer"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(charge.created * 1000).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${(charge.amount / 100).toFixed(2)} {charge.currency.toUpperCase()}</span>
                      <Badge variant={charge.status === "succeeded" ? "default" : "destructive"}>{charge.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No Stripe subscriptions available.</p>
          ) : (
            <div className="space-y-2">
              {subscriptions.map((subscription) => {
                const price = subscription.items?.data?.[0]?.price;
                const amount = price ? price.unit_amount / 100 : 0;
                const interval = price?.recurring?.interval || "month";
                return (
                  <div key={subscription.id} className="rounded-lg bg-muted/40 p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{subscription.customer}</p>
                      <p className="text-xs text-muted-foreground">Renews {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${amount.toFixed(2)}/{interval}</span>
                      <Badge variant={subscription.status === "active" ? "default" : "secondary"}>{subscription.status}</Badge>
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
