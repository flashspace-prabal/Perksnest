import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Eye, ExternalLink, Clock } from "lucide-react";
import { toast } from "sonner";
import { getPartnerDeals, updatePartnerDeal, addNotification, sendEmail } from "@/lib/store";
import { PartnerDeal } from "@/lib/store";
import { getAllUsers } from "@/lib/auth";

export const AdminPendingDeals = () => {
  const [deals, setDeals] = useState<PartnerDeal[]>([]);
  const [previewDeal, setPreviewDeal] = useState<PartnerDeal | null>(null);
  const [rejectDialog, setRejectDialog] = useState<PartnerDeal | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = () => setDeals(getPartnerDeals().filter(d => d.status === "pending"));
  useEffect(() => { load(); }, []);

  const handleApprove = (deal: PartnerDeal) => {
    updatePartnerDeal(deal.id, { status: "approved", approvedAt: new Date().toISOString() });
    addNotification({
      id: `notif_${Date.now()}`,
      userId: deal.partnerId,
      title: "Deal Approved! 🎉",
      message: `Your deal "${deal.name}" has been approved and is now live on the marketplace.`,
      type: "deal_approved",
      read: false,
      createdAt: new Date().toISOString(),
      dealId: deal.id,
    });
    // Send approval email to partner
    const users = getAllUsers();
    const partner = users.find(u => u.id === deal.partnerId);
    if (partner?.email) {
      sendEmail({ type: 'deal_approved', to: partner.email, name: partner.name, dealName: deal.name, dealCategory: deal.category });
    }
    toast.success(`"${deal.name}" approved and now live!`);
    load();
  };

  const handleReject = () => {
    if (!rejectDialog) return;
    updatePartnerDeal(rejectDialog.id, { status: "rejected", rejectionReason: rejectReason || "Does not meet requirements" });
    addNotification({
      id: `notif_${Date.now()}`,
      userId: rejectDialog.partnerId,
      title: "Deal Not Approved",
      message: `Your deal "${rejectDialog.name}" was not approved. Reason: ${rejectReason || "Does not meet requirements"}`,
      type: "deal_rejected",
      read: false,
      createdAt: new Date().toISOString(),
      dealId: rejectDialog.id,
    });
    // Send rejection email to partner
    const users = getAllUsers();
    const partner = users.find(u => u.id === rejectDialog.id || u.id === rejectDialog.partnerId);
    if (partner?.email) {
      sendEmail({ type: 'deal_rejected', to: partner.email, name: partner.name, dealName: rejectDialog.name, reason: rejectReason || undefined });
    }
    toast.success(`"${rejectDialog.name}" rejected.`);
    setRejectDialog(null);
    setRejectReason("");
    load();
  };

  if (deals.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-muted-foreground" />Pending Reviews</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">No deals pending review. ✓</p></CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6 border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Pending Review
            <Badge className="bg-yellow-100 text-yellow-800 ml-1">{deals.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {deals.map(deal => (
            <div key={deal.id} className="bg-white border rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{deal.name}</span>
                    <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">{deal.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{deal.dealText}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span>By: <span className="font-medium text-foreground">{deal.partnerName}</span></span>
                    <span>Savings: <span className="font-medium text-foreground">{deal.savings}</span></span>
                    <span>Submitted: {new Date(deal.createdAt).toLocaleDateString()}</span>
                    {deal.promoCode && <span>Code: <span className="font-mono font-medium text-foreground">{deal.promoCode}</span></span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => setPreviewDeal(deal)}>
                    <Eye className="h-3.5 w-3.5" />Preview
                  </Button>
                  {deal.websiteUrl && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={deal.websiteUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                    </Button>
                  )}
                  <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(deal)}>
                    <CheckCircle className="h-3.5 w-3.5" />Approve
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => setRejectDialog(deal)}>
                    <XCircle className="h-3.5 w-3.5" />Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewDeal} onOpenChange={() => setPreviewDeal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Deal Preview — {previewDeal?.name}</DialogTitle></DialogHeader>
          {previewDeal && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Company</p><p className="font-medium">{previewDeal.name}</p></div>
                <div><p className="text-muted-foreground">Category</p><p className="font-medium capitalize">{previewDeal.category}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground">Offer</p><p className="font-medium">{previewDeal.dealText}</p></div>
                <div><p className="text-muted-foreground">Savings</p><p className="font-medium">{previewDeal.savings}</p></div>
                {previewDeal.promoCode && <div><p className="text-muted-foreground">Promo Code</p><p className="font-mono font-medium">{previewDeal.promoCode}</p></div>}
                <div className="col-span-2"><p className="text-muted-foreground">Description</p><p>{previewDeal.description}</p></div>
                {previewDeal.websiteUrl && <div className="col-span-2"><p className="text-muted-foreground">Website</p><a href={previewDeal.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{previewDeal.websiteUrl}</a></div>}
              </div>
              <div className="pt-2 border-t flex gap-3">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => { handleApprove(previewDeal); setPreviewDeal(null); }}>
                  <CheckCircle className="h-4 w-4 mr-2" />Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => { setPreviewDeal(null); setRejectDialog(previewDeal); }}>
                  <XCircle className="h-4 w-4 mr-2" />Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectDialog} onOpenChange={() => { setRejectDialog(null); setRejectReason(""); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Deal — {rejectDialog?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Rejection reason (optional — sent to partner)</Label>
            <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Deal terms need clarification, logo is missing..." rows={3} />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setRejectDialog(null); setRejectReason(""); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
