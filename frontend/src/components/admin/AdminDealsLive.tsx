import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Edit, Plus, Search, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createAdminDeal,
  deleteAdminDeal,
  getAdminDeals,
  updateAdminDeal,
  updatePartnerDealStatusAdmin,
} from "@/lib/api";
import type { AdminPartnerDeal, AdminPlatformDeal } from "@/lib/admin";
import { relativeDateLabel } from "@/lib/admin";

type DealForm = {
  id?: string;
  name: string;
  description: string;
  dealText: string;
  savings: string;
  category: string;
  isFree: boolean;
  active: boolean;
  link: string;
  logo: string;
};

const defaultForm: DealForm = {
  name: "",
  description: "",
  dealText: "",
  savings: "",
  category: "other",
  isFree: true,
  active: true,
  link: "",
  logo: "",
};

const normalizePlatformDeal = (deal: AdminPlatformDeal & Record<string, unknown>): AdminPlatformDeal => ({
  ...deal,
  description: String(deal.description || ""),
  dealText: String(deal.dealText || deal.deal_text || ""),
  savings: String(deal.savings || ""),
  category: String(deal.category || "other"),
  isFree: Boolean(deal.isFree ?? deal.is_free ?? true),
  active: Boolean(deal.active ?? true),
  logo: String(deal.logo || deal.logo_url || ""),
  link: String(deal.link || deal.website_url || ""),
});

export const AdminDealsLive = () => {
  const [platformDeals, setPlatformDeals] = useState<AdminPlatformDeal[]>([]);
  const [partnerDeals, setPartnerDeals] = useState<AdminPartnerDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<DealForm>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await getAdminDeals();
      setPlatformDeals(Array.isArray(response.deals) ? response.deals.map((deal) => normalizePlatformDeal(deal as AdminPlatformDeal & Record<string, unknown>)) : []);
      setPartnerDeals(Array.isArray(response.partnerDeals) ? response.partnerDeals : []);
    } catch (err) {
      console.error("Failed to load deals:", err);
      setPlatformDeals([]);
      setPartnerDeals([]);
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const pendingDeals = useMemo(() => partnerDeals.filter((deal) => deal.status === "pending"), [partnerDeals]);

  const allDeals = useMemo(() => {
    return [
      ...platformDeals.map((deal) => ({
        id: deal.id,
        source: "platform" as const,
        name: deal.name,
        description: deal.description || "",
        dealText: deal.dealText || "",
        savings: deal.savings || "",
        category: deal.category || "other",
        active: deal.active !== false,
        isFree: Boolean(deal.isFree),
      })),
      ...partnerDeals.map((deal) => ({
        id: deal.id,
        source: "partner" as const,
        name: deal.name,
        description: deal.description,
        dealText: deal.dealText,
        savings: deal.savings,
        category: deal.category,
        active: deal.status === "approved",
        isFree: true,
        status: deal.status,
        partnerName: deal.partnerName,
      })),
    ];
  }, [partnerDeals, platformDeals]);

  const categories = useMemo(() => ["all", ...Array.from(new Set(allDeals.map((deal) => deal.category || "other")))], [allDeals]);

  const filteredDeals = useMemo(() => allDeals.filter((deal) => {
    const matchesSearch = !search || [deal.name, deal.description, deal.dealText].some((value) => value.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === "all" || deal.category === category;
    return matchesSearch && matchesCategory;
  }), [allDeals, category, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (deal: AdminPlatformDeal) => {
    setEditingId(deal.id);
    setForm({
      id: deal.id,
      name: deal.name,
      description: deal.description || "",
      dealText: deal.dealText || "",
      savings: deal.savings || "",
      category: deal.category || "other",
      isFree: Boolean(deal.isFree),
      active: deal.active !== false,
      link: deal.link || "",
      logo: deal.logo || "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const saveDeal = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.dealText.trim()) {
      toast.error("Name, description, and offer text are required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        dealText: form.dealText.trim(),
        savings: form.savings.trim(),
        category: form.category.trim() || "other",
        isFree: form.isFree,
        active: form.active,
        link: form.link.trim() || null,
        logo: form.logo.trim() || null,
      };
      if (editingId) {
        await updateAdminDeal(editingId, payload);
        toast.success("Deal updated");
      } else {
        await createAdminDeal(payload);
        toast.success("Deal created");
      }
      closeDialog();
      await loadDeals();
    } catch (err) {
      console.error("Failed to save deal:", err);
      toast.error("Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  const removeDeal = async (dealId: string) => {
    if (!window.confirm("Delete this deal?")) return;
    try {
      setActioningId(dealId);
      await deleteAdminDeal(dealId);
      toast.success("Deal deleted");
      await loadDeals();
    } catch (err) {
      console.error("Failed to delete deal:", err);
      toast.error("Failed to delete deal");
    } finally {
      setActioningId(null);
    }
  };

  const updatePendingStatus = async (dealId: string, status: "approved" | "rejected") => {
    try {
      setActioningId(dealId);
      await updatePartnerDealStatusAdmin(dealId, status);
      toast.success(`Deal ${status}`);
      await loadDeals();
    } catch (err) {
      console.error(`Failed to ${status} partner deal:`, err);
      toast.error(`Failed to ${status} deal`);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Deal Approvals</CardTitle>
          <Badge variant="secondary">{pendingDeals.length}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading pending deals...</p>
          ) : pendingDeals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending partner deals.</p>
          ) : pendingDeals.map((deal) => (
            <div key={deal.id} className="rounded-lg border bg-background p-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{deal.name}</p>
                  <Badge variant="outline" className="capitalize">{deal.category}</Badge>
                  <span className="text-xs text-muted-foreground">{relativeDateLabel(deal.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{deal.partnerName}</p>
                <p className="text-sm mt-2">{deal.dealText}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={actioningId === deal.id} onClick={() => updatePendingStatus(deal.id, "approved")}>
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="destructive" disabled={actioningId === deal.id} onClick={() => updatePendingStatus(deal.id, "rejected")}>
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Deals</CardTitle>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" /> Add Deal
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-3 mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search deals..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((entry) => <SelectItem key={entry} value={entry}>{entry === "all" ? "All Categories" : entry}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Deal</th>
                  <th className="py-3 pr-4 font-medium hidden md:table-cell">Offer</th>
                  <th className="py-3 pr-4 font-medium">Source</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">Loading deals...</td></tr>
                ) : filteredDeals.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No deals found.</td></tr>
                ) : filteredDeals.map((deal) => (
                  <tr key={`${deal.source}-${deal.id}`} className="border-b">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{deal.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{deal.category}</p>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground">{deal.dealText}</td>
                    <td className="py-3 pr-4">
                      <Badge variant="outline">{deal.source === "platform" ? "Platform" : "Partner"}</Badge>
                    </td>
                    <td className="py-3 pr-4">
                      {"status" in deal && deal.status ? (
                        <Badge variant={deal.status === "approved" ? "default" : deal.status === "pending" ? "secondary" : "destructive"}>{deal.status}</Badge>
                      ) : (
                        <Badge variant={deal.active ? "default" : "secondary"}>{deal.active ? "active" : "inactive"}</Badge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {deal.source === "platform" ? (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(platformDeals.find((entry) => entry.id === deal.id)!)}><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" className="text-destructive" disabled={actioningId === deal.id} onClick={() => removeDeal(deal.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">{(deal as { partnerName?: string }).partnerName || "Partner deal"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Deal" : "Add Deal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Offer Text</Label>
              <Textarea value={form.dealText} onChange={(event) => setForm((current) => ({ ...current, dealText: event.target.value }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Savings</Label>
                <Input value={form.savings} onChange={(event) => setForm((current) => ({ ...current, savings: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.isFree ? "free" : "premium"} onValueChange={(value) => setForm((current) => ({ ...current, isFree: value === "free" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Link</Label>
                <Input value={form.link} onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input value={form.logo} onChange={(event) => setForm((current) => ({ ...current, logo: event.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={saveDeal} disabled={saving}>{saving ? "Saving..." : editingId ? "Save Changes" : "Create Deal"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
