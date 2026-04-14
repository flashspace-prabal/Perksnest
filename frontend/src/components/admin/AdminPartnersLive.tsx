import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Edit, Eye, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAdminDeals, getAdminUsers, updateAdminUser, updatePartnerDealStatusAdmin } from "@/lib/api";
import { normalizeTier, parseMoney, type AdminPartnerDeal, type AdminUser } from "@/lib/admin";

type PartnerForm = {
  name: string;
  email: string;
  status: string;
  plan: string;
};

export const AdminPartnersLive = () => {
  const [partners, setPartners] = useState<AdminUser[]>([]);
  const [partnerDeals, setPartnerDeals] = useState<AdminPartnerDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingPartner, setEditingPartner] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<PartnerForm>({ name: "", email: "", status: "active", plan: "free" });
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const [userResponse, dealsResponse] = await Promise.all([
        getAdminUsers(1, 1000, "", { role: "partner" }),
        getAdminDeals(),
      ]);
      setPartners(Array.isArray(userResponse.users) ? userResponse.users : []);
      setPartnerDeals(Array.isArray(dealsResponse.partnerDeals) ? dealsResponse.partnerDeals : []);
    } catch (err) {
      console.error("Failed to load partners:", err);
      setPartners([]);
      setPartnerDeals([]);
      toast.error("Failed to load partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const partnerRows = useMemo(() => {
    return partners
      .map((partner) => {
        const deals = partnerDeals.filter((deal) => deal.partnerId === partner.id);
        const approvedDeals = deals.filter((deal) => deal.status === "approved");
        const claims = deals.reduce((sum, deal) => sum + Number(deal.claims || 0), 0);
        const views = deals.reduce((sum, deal) => sum + Number(deal.views || 0), 0);
        return {
          ...partner,
          deals,
          approvedDeals,
          claims,
          views,
          revenue: deals.reduce((sum, deal) => sum + parseMoney(deal.savings) * Number(deal.claims || 0), 0),
          redemptionRate: views > 0 ? Math.round((claims / views) * 100) : 0,
          tier: normalizeTier((partner as AdminUser & { subscription_tier?: string }).subscription_tier, approvedDeals.length, claims),
        };
      })
      .filter((partner) => {
        if (!search) return true;
        return [partner.name, partner.email, partner.tier].some((value) => value.toLowerCase().includes(search.toLowerCase()));
      });
  }, [partnerDeals, partners, search]);

  const pendingApplications = useMemo(() => partnerDeals.filter((deal) => deal.status === "pending"), [partnerDeals]);

  const stats = useMemo(() => ({
    total: partnerRows.length,
    active: partnerRows.filter((partner) => (partner.status || "active") === "active").length,
    pending: pendingApplications.length,
    premium: partnerRows.filter((partner) => partner.tier === "Premium").length,
    revenue: partnerRows.reduce((sum, partner) => sum + partner.revenue, 0),
  }), [partnerRows, pendingApplications]);

  const openEdit = (partner: AdminUser) => {
    setEditingPartner(partner);
    setForm({
      name: partner.name,
      email: partner.email,
      status: partner.status || "active",
      plan: partner.plan || "free",
    });
  };

  const savePartner = async () => {
    if (!editingPartner) return;
    try {
      setSaving(true);
      await updateAdminUser(editingPartner.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        status: form.status,
        plan: form.plan,
      });
      toast.success("Partner updated");
      setEditingPartner(null);
      await loadPartners();
    } catch (err) {
      console.error("Failed to update partner:", err);
      toast.error("Failed to update partner");
    } finally {
      setSaving(false);
    }
  };

  const reviewPendingDeal = async (dealId: string, status: "approved" | "rejected") => {
    try {
      setActioningId(dealId);
      await updatePartnerDealStatusAdmin(dealId, status);
      toast.success(`Application ${status}`);
      await loadPartners();
    } catch (err) {
      console.error(`Failed to ${status} partner deal:`, err);
      toast.error(`Failed to ${status} application`);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partner Management</h1>
        <p className="text-muted-foreground">Partner list, stats, tiering, and pending approvals from live data.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Partners</p><p className="text-xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Active</p><p className="text-xl font-bold text-green-600">{stats.active}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending Review</p><p className="text-xl font-bold text-yellow-600">{stats.pending}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Premium Tier</p><p className="text-xl font-bold text-primary">{stats.premium}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Partner Revenue</p><p className="text-xl font-bold">${stats.revenue.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading pending applications...</p>
          ) : pendingApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending partner applications.</p>
          ) : pendingApplications.map((deal) => (
            <div key={deal.id} className="rounded-lg border p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{deal.partnerName}</p>
                <p className="text-sm text-muted-foreground">{deal.name} • {deal.category}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" disabled={actioningId === deal.id} onClick={() => reviewPendingDeal(deal.id, "approved")}>
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="destructive" disabled={actioningId === deal.id} onClick={() => reviewPendingDeal(deal.id, "rejected")}>
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search partners..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Partner</th>
                  <th className="py-3 pr-4 font-medium">Tier</th>
                  <th className="py-3 pr-4 font-medium">Approved Deals</th>
                  <th className="py-3 pr-4 font-medium">Claims</th>
                  <th className="py-3 pr-4 font-medium">Redemption</th>
                  <th className="py-3 pr-4 font-medium">Revenue</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading partners...</td></tr>
                ) : partnerRows.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No partners found.</td></tr>
                ) : partnerRows.map((partner) => (
                  <tr key={partner.id} className="border-b">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{partner.email}</p>
                    </td>
                    <td className="py-3 pr-4"><Badge variant="outline">{partner.tier}</Badge></td>
                    <td className="py-3 pr-4">{partner.approvedDeals.length}</td>
                    <td className="py-3 pr-4">{partner.claims}</td>
                    <td className="py-3 pr-4 min-w-36">
                      <div className="flex items-center gap-2">
                        <Progress value={partner.redemptionRate} className="h-2 w-20" />
                        <span>{partner.redemptionRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">${partner.revenue.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(partner)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => openEdit(partner)}><Eye className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingPartner} onOpenChange={(open) => { if (!open) setEditingPartner(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={form.plan} onValueChange={(value) => setForm((current) => ({ ...current, plan: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPartner(null)}>Cancel</Button>
            <Button onClick={savePartner} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
