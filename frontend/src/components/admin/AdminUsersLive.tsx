import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  ExternalLink,
  Eye,
  MoreVertical,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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
import { createAdminUser, deleteAdminUser, getAdminUser, getAdminUserClaimedDeals, getAdminUsers, updateAdminUser } from "@/lib/api";
import type { AdminClaimedDeal, AdminUser } from "@/lib/admin";
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
  withActivity: 0,
  noActivity: 0,
};

function AdminUserDetailView({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [claimedDeals, setClaimedDeals] = useState<AdminClaimedDeal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [dealType, setDealType] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [error, setError] = useState("");
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminUser(userId);
        setUser(response.user || null);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [userId]);

  useEffect(() => {
    const loadClaims = async () => {
      try {
        setClaimsLoading(true);
        const response = await getAdminUserClaimedDeals(userId, page, ITEMS_PER_PAGE, { sort, dealType, status });
        setClaimedDeals(Array.isArray(response.claimedDeals) ? response.claimedDeals : []);
        setTotal(Number(response.total || 0));
      } catch (err) {
        console.error("Failed to load claimed deals:", err);
        setClaimedDeals([]);
        setTotal(0);
      } finally {
        setClaimsLoading(false);
      }
    };
    loadClaims();
  }, [userId, page, sort, dealType, status]);

  const exportCsv = () => {
    const header = ["Deal Name", "Deal ID", "Deal Type", "Date Claimed", "Status"];
    const csv = [header, ...claimedDeals.map((claim) => [
      claim.dealName,
      claim.dealId,
      claim.dealType,
      claim.claimedAt ? new Date(claim.claimedAt).toLocaleString() : "",
      claim.status,
    ])]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perksnest-user-${userId}-claimed-deals.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getRoleBadge = (value?: string, plan?: string) => {
    if (value === "admin") return <Badge className="bg-slate-900 text-white hover:bg-slate-900">Admin</Badge>;
    if (plan === "premium" || plan === "enterprise") return <Badge className="bg-primary text-primary-foreground">Premium</Badge>;
    return <Badge variant="secondary">Free</Badge>;
  };

  const getClaimStatusBadge = (value?: string) => {
    if (value === "redeemed") return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Redeemed</Badge>;
    if (value === "expired") return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>;
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
  };

  if (loading) {
    return <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading user profile...</CardContent></Card>;
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <p className="text-sm text-destructive">{error || "User not found."}</p>
          <Button variant="outline" onClick={onBack}>Back to Users</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 px-0" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Users
          </Button>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={claimsLoading || claimedDeals.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Role</p><div className="mt-2">{getRoleBadge(user.role, user.plan)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Subscription</p><p className="mt-2 font-semibold capitalize">{user.subscriptionStatus || (user.plan === "free" ? "inactive" : "active")}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Join Date</p><p className="mt-2 font-semibold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Claimed</p><p className="mt-2 font-semibold">{user.totalDealsClaimed || total}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={sort} onValueChange={(value) => { setSort(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest first</SelectItem>
              <SelectItem value="deal-type">By deal type</SelectItem>
              <SelectItem value="date-asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dealType} onValueChange={(value) => { setDealType(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Deal type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(value) => { setStatus(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="redeemed">Redeemed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Claimed Deals History</h2>
          <p className="text-sm text-muted-foreground">{total} claims</p>
        </div>
        {claimsLoading && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">Loading claimed deals...</CardContent></Card>}
        {!claimsLoading && claimedDeals.length === 0 && <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">No claimed deals found.</CardContent></Card>}
        {!claimsLoading && claimedDeals.map((claim) => (
          <Card key={claim.id}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{claim.dealName}</h3>
                    <Badge variant={claim.dealType === "premium" ? "default" : "secondary"} className="capitalize">{claim.dealType}</Badge>
                    {getClaimStatusBadge(claim.status)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" />{claim.dealId}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{claim.claimedAt ? new Date(claim.claimedAt).toLocaleString() : "N/A"}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.open(`/deals/${encodeURIComponent(claim.dealId)}`, "_blank", "noopener,noreferrer")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Deal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Showing {total === 0 ? 0 : ((page - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(page * ITEMS_PER_PAGE, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1 || claimsLoading} onClick={() => setPage((current) => current - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages || claimsLoading} onClick={() => setPage((current) => current + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export const AdminUsersLive = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [plan, setPlan] = useState("all");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [activity, setActivity] = useState("all");
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
      const response = await getAdminUsers(page, ITEMS_PER_PAGE, debouncedSearch, { plan, role, status, date: dateFilter, activity });
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
  }, [page, debouncedSearch, plan, role, status, dateFilter, activity]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  const rows = useMemo(() => users.map((user) => ({
    ...user,
    claims: Number(user.totalDealsClaimed ?? (Array.isArray(user.claimedDeals) ? user.claimedDeals.length : 0)),
    joined: relativeDateLabel(user.createdAt || user.created_at),
    joinedDate: user.createdAt || user.created_at,
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
    const header = ["Name", "Email", "Role", "Signup Date", "Plan", "Status", "Claimed Deals", "Referral Count"];
    const csv = [header, ...rows.map((user) => [
      user.name,
      user.email,
      user.role,
      user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "",
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

  if (userId) {
    return <AdminUserDetailView userId={userId} onBack={() => navigate("/admin/users")} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Track users, signup activity, subscriptions, and claimed deals.</p>
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
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Premium</p><p className="text-xl font-bold text-primary">{stats.premium}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Free</p><p className="text-xl font-bold">{stats.free}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">With Claims</p><p className="text-xl font-bold text-blue-600">{stats.withActivity}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">No Activity</p><p className="text-xl font-bold text-yellow-600">{stats.noActivity}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search by name or email..." value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <Select value={role} onValueChange={(value) => { setRole(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={(value) => { setDateFilter(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Signup date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Signup</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={activity} onValueChange={(value) => { setActivity(value); setPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Activity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activity</SelectItem>
              <SelectItem value="most-active">Most Active</SelectItem>
              <SelectItem value="claimed">Has Claims</SelectItem>
              <SelectItem value="no-activity">No Activity</SelectItem>
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
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium hidden md:table-cell">Signup Date</th>
                  <th className="p-4 font-medium hidden lg:table-cell">
                    <span className="inline-flex items-center gap-1">Deals Claimed <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
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
                        <button className="text-left" onClick={() => navigate(`/admin/users/${user.id}`)}>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-4">{user.role === "admin" ? <Badge className="bg-slate-900 text-white hover:bg-slate-900">Admin</Badge> : getPlanBadge(user.plan)}</td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : user.joined}</td>
                    <td className="p-4 hidden lg:table-cell font-medium">{user.claims}</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                            <Eye className="h-4 w-4 mr-2" /> View Profile
                          </DropdownMenuItem>
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
