import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { addPartnerDeal, updatePartnerDealFields, PartnerDeal } from "@/lib/store";
import { useAuth } from "@/lib/auth";

const CATEGORIES = [
  { value: "ai", label: "AI & Machine Learning" },
  { value: "marketing", label: "Marketing" },
  { value: "project", label: "Project Management" },
  { value: "development", label: "Development" },
  { value: "data", label: "Data & Analytics" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "HR & People" },
  { value: "collaboration", label: "Collaboration" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

interface PartnerDealFormProps {
  open: boolean;
  onClose: () => void;
  editDeal?: PartnerDeal | null;
  onSuccess: () => void;
}

export const PartnerDealForm = ({ open, onClose, editDeal, onSuccess }: PartnerDealFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: editDeal?.name || "",
    description: editDeal?.description || "",
    dealText: editDeal?.dealText || "",
    savings: editDeal?.savings || "",
    category: editDeal?.category || "ai",
    websiteUrl: editDeal?.websiteUrl || "",
    logoUrl: editDeal?.logoUrl || "",
    promoCode: editDeal?.promoCode || "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    try {
      if (editDeal) {
        await updatePartnerDealFields(editDeal.id, form);
        toast.success("Deal updated!");
      } else {
        const result = await addPartnerDeal({
          partnerId: user.id,
          partnerName: user.name,
          ...form,
          status: "pending",
        });
        if (result) {
          toast.success("Deal submitted for review! You'll be notified when approved.");
        } else {
          toast.error("Failed to submit deal. Please try again.");
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editDeal ? "Edit Deal" : "Submit a New Deal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Deal / Company Name *</Label>
              <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Notion" required className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Short Description *</Label>
              <Input value={form.description} onChange={e => set("description", e.target.value)} placeholder="One-line description of the tool" required className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Deal Offer *</Label>
              <Input value={form.dealText} onChange={e => set("dealText", e.target.value)} placeholder="e.g. 6 months free on the Pro plan" required className="mt-1" />
            </div>
            <div>
              <Label>Savings Value *</Label>
              <Input value={form.savings} onChange={e => set("savings", e.target.value)} placeholder="e.g. $500" required className="mt-1" />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={v => set("category", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Website URL *</Label>
              <Input value={form.websiteUrl} onChange={e => set("websiteUrl", e.target.value)} placeholder="https://example.com" required className="mt-1" />
            </div>
            <div>
              <Label>Logo URL (optional)</Label>
              <Input value={form.logoUrl} onChange={e => set("logoUrl", e.target.value)} placeholder="https://example.com/logo.png" className="mt-1" />
            </div>
            <div className="col-span-2">
              <Label>Promo Code (optional)</Label>
              <Input value={form.promoCode} onChange={e => set("promoCode", e.target.value)} placeholder="e.g. PERKSNEST20" className="mt-1" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : editDeal ? "Save Changes" : "Submit for Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
