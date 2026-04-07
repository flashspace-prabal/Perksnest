import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Tag, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { dealsData } from "@/data/deals";
import { AdminPendingDeals } from "./AdminPendingDeals";
import { getPartnerDeals } from "@/lib/store";
import { apiCall } from "@/lib/api";

interface DealEdit {
  id: string; name: string; description: string; dealText: string;
  savings: string; category: string; isFree: boolean; logo?: string; link?: string; active?: boolean;
}

export const AdminDeals = () => {
  const [allPartnerDeals, setAllPartnerDeals] = useState<PartnerDeal[]>([]);
  useEffect(() => { getPartnerDeals().then(setAllPartnerDeals); }, []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editDeal, setEditDeal] = useState<DealEdit | null>(null);
  const [editForm, setEditForm] = useState<DealEdit | null>(null);
  const [saving, setSaving] = useState(false);
  const [isNewDeal, setIsNewDeal] = useState(false);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);

  // Approved partner deals
  const approvedPartnerDeals = useMemo(() => allPartnerDeals.filter(d => d.status === "approved"), [allPartnerDeals]);

  const allDeals = useMemo(() => [
    ...dealsData.map(d => ({ id: d.id, name: d.name, description: d.description, dealText: d.dealText, savings: d.savings, category: d.category || "other", isFree: d.isFree, source: "platform" as const })),
    ...approvedPartnerDeals.map(d => ({ id: d.id, name: d.name, description: d.description, dealText: d.dealText, savings: d.savings, category: d.category, isFree: true, source: "partner" as const })),
  ], [approvedPartnerDeals]);

  const categories = useMemo(() => {
    const cats = [...new Set(allDeals.map(d => d.category))].filter(Boolean).sort();
    return ["all", ...cats];
  }, [allDeals]);

  const filtered = allDeals.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Reset page when searching
  useEffect(() => { setCurrentPage(1); }, [search, categoryFilter]);

  // Add pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedDeals = filtered.slice(startIdx, startIdx + itemsPerPage);

  const handleEdit = (deal: typeof filtered[0]) => {
    const d: DealEdit = {
      id: deal.id,
      name: deal.name,
      description: deal.description,
      dealText: deal.dealText,
      savings: deal.savings,
      category: deal.category,
      isFree: deal.isFree,
      active: true
    };
    setEditDeal(d);
    setEditForm(d);
    setIsNewDeal(false);
  };

  const handleAddNew = () => {
    const newDeal: DealEdit = {
      id: `deal_${Date.now()}`,
      name: "",
      description: "",
      dealText: "",
      savings: "$0",
      category: "other",
      isFree: true,
      logo: "",
      link: "",
      active: true
    };
    setEditDeal(newDeal);
    setEditForm(newDeal);
    setIsNewDeal(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    if (!editForm.name.trim() || !editForm.description.trim() || !editForm.dealText.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      if (isNewDeal) {
        // Call API to create new deal
        await apiCall('/api/admin/deals', 'POST', editForm);
        toast.success("Deal created successfully!");
      } else {
        // Call API to update deal
        await apiCall(`/api/admin/deals/${editForm.id}`, 'PUT', editForm);
        toast.success("Deal updated successfully!");
      }

      // For now, also save to localStorage as fallback
      const overrides = JSON.parse(localStorage.getItem("pn_deals_override") || "{}");
      overrides[editForm.id] = editForm;
      localStorage.setItem("pn_deals_override", JSON.stringify(overrides));
    } catch (error) {
      console.error("Failed to save deal:", error);
      toast.error("Failed to save deal");
    } finally {
      setSaving(false);
      setEditDeal(null);
      setEditForm(null);
      setIsNewDeal(false);
    }
  };

  const handleDelete = async (dealId: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;

    setDeletingDealId(dealId);
    try {
      await apiCall(`/api/admin/deals/${dealId}`, 'DELETE');
      toast.success("Deal deleted successfully!");

      // Also remove from localStorage
      const overrides = JSON.parse(localStorage.getItem("pn_deals_override") || "{}");
      delete overrides[dealId];
      localStorage.setItem("pn_deals_override", JSON.stringify(overrides));
    } catch (error) {
      console.error("Failed to delete deal:", error);
      toast.error("Failed to delete deal");
    } finally {
      setDeletingDealId(null);
    }
  };

  const handleToggleActive = async (dealId: string, currentActive: boolean) => {
    try {
      await apiCall(`/api/admin/deals/${dealId}`, 'PUT', { active: !currentActive });
      toast.success(`Deal ${!currentActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error("Failed to toggle deal:", error);
      toast.error("Failed to update deal");
    }
  };

  return (
    <div className="space-y-6">
      {/* Pending partner deals at the top */}
      <AdminPendingDeals />

      {/* All deals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Deals ({filtered.length})</CardTitle>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Deal
            </Button>
          </div>
          <div className="flex gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-3 pr-4 font-medium">Deal</th>
                  <th className="text-left py-3 pr-4 font-medium hidden md:table-cell">Offer</th>
                  <th className="text-left py-3 pr-4 font-medium hidden sm:table-cell">Savings</th>
                  <th className="text-left py-3 pr-4 font-medium">Type</th>
                  <th className="text-left py-3 pr-4 font-medium hidden lg:table-cell">Active</th>
                  <th className="text-right py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeals.map(deal => (
                  <tr key={deal.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{deal.name}</span>
                        {"source" in deal && deal.source === "partner" && (
                          <Badge variant="outline" className="text-[10px] py-0">Partner</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{deal.category}</p>
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell">
                      <p className="text-xs text-muted-foreground max-w-48 truncate">{deal.dealText}</p>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell font-medium text-primary">{deal.savings}</td>
                    <td className="py-3 pr-4">
                      {deal.isFree ? (
                        <Badge className="bg-green-100 text-green-800 text-[10px]">Free</Badge>
                      ) : (
                        <Badge className="bg-purple-100 text-purple-800 text-[10px]">Premium</Badge>
                      )}
                    </td>
                    <td className="py-3 pr-4 hidden lg:table-cell">
                      <button
                        onClick={() => handleToggleActive(deal.id, true)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <ToggleRight className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleEdit(deal)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(deal.id)}
                          disabled={deletingDealId === deal.id}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages} ({filtered.length} total deals)</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => { const p = currentPage > 3 ? currentPage - 2 + i : i + 1; return p <= totalPages ? <Button key={p} size="sm" variant={currentPage === p ? "default" : "outline"} onClick={() => setCurrentPage(p)}>{p}</Button> : null; })}
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Deal Dialog */}
      <Dialog open={!!editDeal} onOpenChange={() => { setEditDeal(null); setEditForm(null); setIsNewDeal(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewDeal ? "Add New Deal" : `Edit Deal — ${editDeal?.name}`}</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Deal Name *</Label><Input value={editForm.name} onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)} className="mt-1" placeholder="e.g., Notion" /></div>
                <div><Label>Category</Label><Input value={editForm.category} onChange={e => setEditForm(f => f ? { ...f, category: e.target.value } : f)} className="mt-1" placeholder="e.g., productivity" /></div>
              </div>
              <div><Label>Short Description *</Label><Input value={editForm.description} onChange={e => setEditForm(f => f ? { ...f, description: e.target.value } : f)} className="mt-1" placeholder="Brief one-line description" /></div>
              <div><Label>Offer Text *</Label><Textarea value={editForm.dealText} onChange={e => setEditForm(f => f ? { ...f, dealText: e.target.value } : f)} className="mt-1 min-h-[80px]" placeholder="Full details of the deal offer" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Savings Value</Label><Input value={editForm.savings} onChange={e => setEditForm(f => f ? { ...f, savings: e.target.value } : f)} className="mt-1" placeholder="e.g., $1,000" /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={editForm.isFree ? "free" : "premium"} onValueChange={v => setEditForm(f => f ? { ...f, isFree: v === "free" } : f)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Logo URL</Label><Input value={editForm.logo || ""} onChange={e => setEditForm(f => f ? { ...f, logo: e.target.value } : f)} className="mt-1" placeholder="https://..." /></div>
                <div><Label>Deal Link</Label><Input value={editForm.link || ""} onChange={e => setEditForm(f => f ? { ...f, link: e.target.value } : f)} className="mt-1" placeholder="https://..." /></div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setEditDeal(null); setEditForm(null); setIsNewDeal(false); }}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? "Saving..." : isNewDeal ? "Create Deal" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
