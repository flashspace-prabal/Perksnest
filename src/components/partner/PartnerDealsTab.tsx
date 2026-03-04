import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Eye, Edit, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { getPartnerDeals, PartnerDeal } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { PartnerDealForm } from "./PartnerDealForm";

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
};

export const PartnerDealsTab = () => {
  const [allPartnerDeals, setAllPartnerDeals] = useState<PartnerDeal[]>([]);
  useEffect(() => { getPartnerDeals().then(setAllPartnerDeals); }, []);
  const { user } = useAuth();
  const [deals, setDeals] = useState<PartnerDeal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editDeal, setEditDeal] = useState<PartnerDeal | null>(null);

  const load = () => {
    if (!user) return;
    setDeals(allPartnerDeals.filter(d => d.partnerId === user.id));
  };

  useEffect(() => { load(); }, [user, allPartnerDeals]);

  const handleEdit = (deal: PartnerDeal) => { setEditDeal(deal); setShowForm(true); };
  const handleNew = () => { setEditDeal(null); setShowForm(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">My Deals</h2>
          <p className="text-sm text-muted-foreground">{deals.length} deal{deals.length !== 1 ? "s" : ""} submitted</p>
        </div>
        <Button onClick={handleNew} className="gap-2"><Plus className="h-4 w-4" />Submit New Deal</Button>
      </div>

      {deals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No deals yet</h3>
            <p className="text-muted-foreground mb-4">Submit your first deal to start reaching thousands of startups.</p>
            <Button onClick={handleNew}>Submit a Deal</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => {
            const sc = statusConfig[deal.status];
            const Icon = sc.icon;
            return (
              <Card key={deal.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-semibold text-foreground">{deal.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.color}`}>
                          <Icon className="h-3 w-3" />{sc.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{deal.dealText}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Category: <span className="capitalize">{deal.category}</span></span>
                        <span>Savings: {deal.savings}</span>
                        <span>Submitted: {new Date(deal.createdAt).toLocaleDateString()}</span>
                        {deal.status === "approved" && <span>Views: {deal.views} · Claims: {deal.claims}</span>}
                      </div>
                      {deal.status === "rejected" && deal.rejectionReason && (
                        <p className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded">
                          Rejection reason: {deal.rejectionReason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {deal.websiteUrl && (
                        <Button size="sm" variant="ghost" className="gap-1" asChild>
                          <a href={deal.websiteUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      {deal.status === "pending" && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => handleEdit(deal)}>
                          <Edit className="h-3.5 w-3.5" />Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <PartnerDealForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditDeal(null); }}
        editDeal={editDeal}
        onSuccess={load}
      />
    </div>
  );
};
