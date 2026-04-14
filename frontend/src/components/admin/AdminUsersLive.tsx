import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  MoreVertical,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from "@/lib/api";
import type { AdminUser } from "@/lib/admin";
import { relativeDateLabel } from "@/lib/admin";

const ITEMS_PER_PAGE = 10;

type UserForm = {
  name: string;
  email: string;
  password: string;
  role: string;
  plan: string;
  status: string;
};

const defaultForm: UserForm = {
  name: "",
  email: "",
  password: "",
  role: "customer",
  plan: "free",
  status: "active",
};

const emptyStats = {
  total: 0,
  active: 0,
  premium: 0,
  free: 0,
  newThisMonth: 0,
  pendingVerification: 0,
};

export const AdminUsersLive = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminUsers(page, ITEMS_PER_PAGE, debouncedSearch, { plan, role, status });
      setUsers(Array.isArray(response.users) ? response.users : []);
      setTotal(Number(response.total || 0));
      setStats({ ...emptyStats, ...(response.stats || {}) });
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
      setTotal(0);
      setStats(emptyStats);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch, plan, role, status]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const rows = useMemo(() => users.map((user) => ({
    ...user,
    claims: Array.isArray(user.claimedDeals) ? user.claimedDeals.length : 0,
    joined: relativeDateLabel(user.createdAt || user.created_at),
  })), [users]);

  const resetDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setForm(defaultForm);
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "customer",
      plan: user.plan || "free",
      status: user.status || "active",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!editingUser && !form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setSaving(true);
      if (editingUser) {
        await updateAdminUser(editingUser.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          roles: [form.role],
          plan: form.plan,
          status: form.status,
        });
        toast.success("User updated");
      } else {
        await createAdminUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          roles: [form.role],
          plan: form.plan,
          status: form.status,
        });
        toast.success("User created");
      }
      resetDialog();
      await loadUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
      toast.error("Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (user: AdminUser) => {
    try {
      setActioningId(user.id);
      const nextStatus = user.status === "suspended" ? "active" : "suspended";
      await updateAdminUser(user.id, { status: nextStatus });
      toast.success(`User ${nextStatus}`);
      await loadUsers();
    } catch (err) {
      console.error("Failed to update user status:", err);
      toast.error("Failed to update user");
    } finally {
      setActioningId(null);
    }
  };

  const removeUser = async (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.email}?`)) return;
    try {
      setActioningId(user.id);
      await deleteAdminUser(user.id);
      toast.success("User deleted");
      if (page > 1 && rows.length === 1) {
        setPage((current) => Math.max(1, current - 1));
      } else {
        await loadUsers();
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user");
    } finally {
      setActioningId(null);
    }
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Role", "Plan", "Status", "Claimed Deals", "Referral Count"];
    const csv = [header, ...rows.map((user) => [
      user.name,
      user.email,
      user.role,
      user.plan,
      user.status || "active",
      String(user.claims),
      String(user.referralCount || 0),
    ])]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perksnest-admin-users-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (value?: string) => {
    if (value === "active") return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
    if (value === "pending") return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
    if (value === "suspended") return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Suspended</Badge>;
    return <Badge variant="secondary">{value || "unknown"}</Badge>;
  };

  const getPlanBadge = (value: string) => {
    if (value === "premium") return <Badge className="bg-primary text-primary-foreground">Premium</Badge>;
    if (value === "enterprise") return <Badge className="bg-slate-900 text-white hover:bg-slate-900">Enterprise</Badge>;
    return <Badge variant="secondary">Free</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Live user search, filters, pagination, and CRUD.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={loading || rows.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={openCreate}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Users</p><p className="text-xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Active</p><p className="text-xl font-bold text-green-600">{stats.active}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pro/Enterprise</p><p className="text-xl font-bold text-primary">{stats.premium}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Free</p><p className="text-xl font-bold">{stats.free}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">New This Month</p><p className="text-xl font-bold text-blue-600">{stats.newThisMonth}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending Verify</p><p className="text-xl font-bold text-yellow-600">{stats.pendingVerification}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search by name or email..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={plan} onValueChange={(value) => { setPlan(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={role} onValueChange={(value) => { setRole(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Plan</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium hidden md:table-cell">Claims</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Referrals</th>
                  <th className="p-4 font-medium hidden xl:table-cell">Joined</th>
                  <th className="p-4 w-12" />
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">Loading users...</td></tr>}
                {!loading && error && <tr><td colSpan={8} className="p-8 text-center text-sm text-destructive">{error}</td></tr>}
                {!loading && !error && rows.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">No users found.</td></tr>}
                {!loading && !error && rows.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{getPlanBadge(user.plan)}</td>
                    <td className="p-4"><Badge variant="outline" className="capitalize">{user.role}</Badge></td>
                    <td className="p-4">{getStatusBadge(user.status)}</td>
                    <td className="p-4 hidden md:table-cell">{user.claims}</td>
                    <td className="p-4 hidden lg:table-cell">{user.referralCount || 0}</td>
                    <td className="p-4 hidden xl:table-cell text-sm text-muted-foreground">{user.joined}</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(user)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(user)} disabled={actioningId === user.id}>
                            <Edit className="h-4 w-4 mr-2" /> {user.status === "suspended" ? "Activate" : "Suspend"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => removeUser(user)} disabled={actioningId === user.id}>
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

          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {total === 0 ? 0 : ((page - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(page * ITEMS_PER_PAGE, total)} of {total} users
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1 || loading} onClick={() => setPage((current) => current - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) resetDialog(); else setDialogOpen(true); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Update role, plan, and account status." : "Create a new user using the existing admin API."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-user-name">Name</Label>
              <Input id="admin-user-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-user-email">Email</Label>
              <Input id="admin-user-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="admin-user-password">Password</Label>
                <Input id="admin-user-password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(value) => setForm((current) => ({ ...current, role: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
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
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingUser ? "Save Changes" : "Create User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
