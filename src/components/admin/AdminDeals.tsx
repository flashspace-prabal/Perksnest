import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Tag } from "lucide-react";
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

interface DealEdit {
  id: string; name: string; description: string; dealText: string;
  savings: string; category: string; isFree: boolean;
}

export const AdminDeals = () => {
  const [allPartnerDeals, setAllPartnerDeals] = useState<PartnerDeal[]>([]);
  useEffect(() => { getPartnerDeals().then(setAllPartnerDeals); }, []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editDeal, setEditDeal] = useState<DealEdit | null>(null);
  const [editForm, setEditForm] = useState<DealEdit | null>(null);
  const [saving, setSaving] = useState(false);

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

  const handleEdit = (deal: typeof filtered[0]) => {
    const d: DealEdit = { id: deal.id, name: deal.name, description: deal.description, dealText: deal.dealText, savings: deal.savings, category: deal.category, isFree: deal.isFree };
    setEditDeal(d); setEditForm(d);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    // Save to localStorage overrides
    const overrides = JSON.parse(localStorage.getItem("pn_deals_override") || "{}");
    overrides[editForm.id] = editForm;
    localStorage.setItem("pn_deals_override", JSON.stringify(overrides));
    setSaving(false);
    setEditDeal(null);
    setEditForm(null);
    toast.success("Deal updated!");
  };

  return (
    <div className="space-y-6">
      {/* Pending partner deals at the top */}
      <AdminPendingDeals />

      {/* All deals */}
      <Card>
        <CardHeader>
          <CardTitle>All Deals ({filtered.length})</CardTitle>
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
                  <th className="text-right py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(deal => (
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
                    <td className="py-3 text-right">
                      <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleEdit(deal)}>
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Deal Dialog */}
      <Dialog open={!!editDeal} onOpenChange={() => { setEditDeal(null); setEditForm(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Deal — {editDeal?.name}</DialogTitle></DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div><Label>Deal Name</Label><Input value={editForm.name} onChange={e => setEditForm(f => f ? { ...f, name: e.target.value } : f)} className="mt-1" /></div>
              <div><Label>Short Description</Label><Input value={editForm.description} onChange={e => setEditForm(f => f ? { ...f, description: e.target.value } : f)} className="mt-1" /></div>
              <div><Label>Offer Text</Label><Input value={editForm.dealText} onChange={e => setEditForm(f => f ? { ...f, dealText: e.target.value } : f)} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Savings Value</Label><Input value={editForm.savings} onChange={e => setEditForm(f => f ? { ...f, savings: e.target.value } : f)} className="mt-1" /></div>
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
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setEditDeal(null); setEditForm(null); }}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
