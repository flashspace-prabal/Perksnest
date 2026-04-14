import { useEffect, useMemo, useState } from "react";
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAdminWhiteLabelClient,
  deleteAdminWhiteLabelClient,
  getAdminWhiteLabelClients,
  updateAdminWhiteLabelClient,
} from "@/lib/api";
import type { AdminWhiteLabelClient } from "@/lib/admin";

type ClientForm = {
  company: string;
  domain: string;
  contactEmail: string;
  plan: "Starter" | "Growth" | "Enterprise";
  members: number;
  monthlyFee: number;
  status: "Active" | "Pending";
};

const defaultForm: ClientForm = {
  company: "",
  domain: "",
  contactEmail: "",
  plan: "Starter",
  members: 0,
  monthlyFee: 799,
  status: "Pending",
};

const normalizeClient = (row: Record<string, unknown>): AdminWhiteLabelClient => ({
  id: String(row.id || ""),
  company: String(row.company || row.name || "Unnamed client"),
  domain: String(row.domain || ""),
  plan: (String(row.plan || "Starter") as AdminWhiteLabelClient["plan"]),
  members: Number(row.members || 0),
  monthlyFee: Number(row.monthlyFee || row.monthly_fee || row.mrr || 0),
  status: (String(row.status || "Pending") as AdminWhiteLabelClient["status"]),
  contactEmail: String(row.contactEmail || row.contact_email || ""),
  createdAt: String(row.createdAt || row.created_at || ""),
});

export const AdminWhiteLabelLive = () => {
  const [clients, setClients] = useState<AdminWhiteLabelClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<AdminWhiteLabelClient | null>(null);
  const [form, setForm] = useState<ClientForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await getAdminWhiteLabelClients();
      setClients(Array.isArray(response.clients) ? response.clients.map(normalizeClient) : []);
    } catch (err) {
      console.error("Failed to load white-label clients:", err);
      setClients([]);
      toast.error("Failed to load white-label clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter((client) => client.status === "Active").length,
    revenue: clients.filter((client) => client.status === "Active").reduce((sum, client) => sum + client.monthlyFee, 0),
    members: clients.reduce((sum, client) => sum + client.members, 0),
  }), [clients]);

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingClient(null);
    setForm(defaultForm);
  };

  const openCreate = () => {
    setEditingClient(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (client: AdminWhiteLabelClient) => {
    setEditingClient(client);
    setForm({
      company: client.company,
      domain: client.domain,
      contactEmail: client.contactEmail,
      plan: client.plan,
      members: client.members,
      monthlyFee: client.monthlyFee,
      status: client.status,
    });
    setDialogOpen(true);
  };

  const saveClient = async () => {
    if (!form.company.trim() || !form.domain.trim() || !form.contactEmail.trim()) {
      toast.error("Company, domain, and contact email are required");
      return;
    }

    const payload = {
      company: form.company.trim(),
      domain: form.domain.trim(),
      contact_email: form.contactEmail.trim(),
      plan: form.plan,
      members: Number(form.members) || 0,
      monthly_fee: Number(form.monthlyFee) || 0,
      mrr: Number(form.monthlyFee) || 0,
      status: form.status,
    };

    try {
      setSaving(true);
      if (editingClient) {
        await updateAdminWhiteLabelClient(editingClient.id, payload);
        toast.success("Client updated");
      } else {
        await createAdminWhiteLabelClient(payload);
        toast.success("Client created");
      }
      closeDialog();
      await loadClients();
    } catch (err) {
      console.error("Failed to save white-label client:", err);
      toast.error("Failed to save client");
    } finally {
      setSaving(false);
    }
  };

  const removeClient = async (clientId: string) => {
    if (!window.confirm("Delete this white-label client?")) return;
    try {
      setActioningId(clientId);
      await deleteAdminWhiteLabelClient(clientId);
      toast.success("Client deleted");
      await loadClients();
    } catch (err) {
      console.error("Failed to delete white-label client:", err);
      toast.error("Failed to delete client");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">White Label</h2>
          <p className="text-muted-foreground">Real white-label client data with CRUD actions.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" /> Add Client
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Clients</p><p className="text-2xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Active</p><p className="text-2xl font-bold">{stats.active}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Monthly Revenue</p><p className="text-2xl font-bold">${stats.revenue.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Members</p><p className="text-2xl font-bold">{stats.members.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Clients</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Company</th>
                  <th className="py-3 pr-4 font-medium">Domain</th>
                  <th className="py-3 pr-4 font-medium">Plan</th>
                  <th className="py-3 pr-4 font-medium">Members</th>
                  <th className="py-3 pr-4 font-medium">Monthly Fee</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Loading clients...</td></tr>
                ) : clients.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No white-label clients found.</td></tr>
                ) : clients.map((client) => (
                  <tr key={client.id} className="border-b">
                    <td className="py-3 pr-4">
                      <p className="font-medium">{client.company}</p>
                      <p className="text-xs text-muted-foreground">{client.contactEmail}</p>
                    </td>
                    <td className="py-3 pr-4">{client.domain}</td>
                    <td className="py-3 pr-4"><Badge variant="outline">{client.plan}</Badge></td>
                    <td className="py-3 pr-4">{client.members.toLocaleString()}</td>
                    <td className="py-3 pr-4">${client.monthlyFee.toLocaleString()}</td>
                    <td className="py-3 pr-4"><Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge></td>
                    <td className="py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(client)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" disabled={actioningId === client.id} onClick={() => removeClient(client.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={form.company} onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Domain</Label>
              <Input value={form.domain} onChange={(event) => setForm((current) => ({ ...current, domain: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input value={form.contactEmail} onChange={(event) => setForm((current) => ({ ...current, contactEmail: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={form.plan} onValueChange={(value: ClientForm["plan"]) => setForm((current) => ({ ...current, plan: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Growth">Growth</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value: ClientForm["status"]) => setForm((current) => ({ ...current, status: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Members</Label>
                <Input type="number" value={form.members} onChange={(event) => setForm((current) => ({ ...current, members: Number(event.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Fee</Label>
                <Input type="number" value={form.monthlyFee} onChange={(event) => setForm((current) => ({ ...current, monthlyFee: Number(event.target.value) || 0 }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={saveClient} disabled={saving}>{saving ? "Saving..." : editingClient ? "Save Changes" : "Create Client"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
