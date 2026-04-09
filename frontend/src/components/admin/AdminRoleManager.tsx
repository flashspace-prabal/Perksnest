import { useState, useEffect } from "react";
import { db } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Shield, User, Users, ChevronDown, Plus, X, Check, Search, Mail, Clock, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

type UserRole = 'customer' | 'partner' | 'admin';
type UserStatus = 'active' | 'pending' | 'suspended';

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;         // primary role
  roles: string[];        // all roles (multi-role support)
  status: UserStatus;
  plan: string;
  created_at: string;
  email_verified: boolean;
  notes?: string;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: typeof Shield; portals: string[] }> = {
  customer: { label: 'Customer', color: 'bg-blue-100 text-blue-700', icon: User, portals: ['/customer'] },
  partner:  { label: 'Partner',  color: 'bg-purple-100 text-purple-700', icon: Users, portals: ['/partner'] },
  admin:    { label: 'Admin',    color: 'bg-red-100 text-red-700', icon: Shield, portals: ['/admin', '/partner', '/customer'] },
};

export default function AdminRoleManager() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const { data } = await db.from('users').select('*').order('created_at', { ascending: false });
    setUsers((data || []) as ManagedUser[]);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.name?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole || u.roles?.includes(filterRole);
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const updateUser = async (userId: string, updates: Partial<ManagedUser>) => {
    setSaving(true);
    const { error } = await db.from('users').update({
      ...updates,
      approved_by: currentAdmin?.email,
      approved_at: new Date().toISOString(),
    }).eq('id', userId);
    setSaving(false);
    if (error) { toast.error('Failed to update user'); return; }
    toast.success('User updated');
    setEditingId(null);
    loadUsers();
  };

  const toggleRole = async (u: ManagedUser, role: UserRole) => {
    const currentRoles = u.roles || [u.role];
    let newRoles: string[];
    if (currentRoles.includes(role)) {
      if (currentRoles.length === 1) { toast.error("User must have at least one role"); return; }
      newRoles = currentRoles.filter(r => r !== role);
    } else {
      newRoles = [...currentRoles, role];
    }
    // Primary role = highest privilege
    const priority = ['admin', 'partner', 'customer'];
    const primaryRole = priority.find(r => newRoles.includes(r)) || 'customer';
    await updateUser(u.id, { roles: newRoles as string[], role: primaryRole as UserRole });
  };

  const setStatus = async (u: ManagedUser, status: UserStatus) => {
    await updateUser(u.id, { status });
  };

  const pendingPartners = users.filter(u => 
    (u.roles?.includes('partner') || u.role === 'partner') && u.status === 'pending'
  );

  return (
    <div className="space-y-6">
      {/* Pending approvals banner */}
      {pendingPartners.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">{pendingPartners.length} partner{pendingPartners.length > 1 ? 's' : ''} awaiting approval</p>
              <p className="text-sm text-amber-600">Review and approve before they can submit deals</p>
            </div>
          </div>
          <button onClick={() => setFilterStatus('pending')} className="text-sm text-amber-700 font-medium hover:underline">
            View pending →
          </button>
        </div>
      )}

      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none">
          <option value="all">All roles</option>
          <option value="customer">Customer</option>
          <option value="partner">Partner</option>
          <option value="admin">Admin</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none">
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: users.length, color: 'text-foreground' },
          { label: 'Partners', value: users.filter(u => u.role === 'partner' || u.roles?.includes('partner')).length, color: 'text-purple-600' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin' || u.roles?.includes('admin')).length, color: 'text-red-600' },
          { label: 'Pending', value: users.filter(u => u.status === 'pending').length, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
          <span className="text-sm font-medium">{filtered.length} users</span>
          <button onClick={loadUsers} className="text-xs text-muted-foreground hover:text-primary">↻ Refresh</button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users found</div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(u => {
              const isEditing = editingId === u.id;
              const userRoles = u.roles?.length ? u.roles : [u.role || 'customer'];

              return (
                <div key={u.id} className={`p-4 ${isEditing ? 'bg-primary/5' : 'hover:bg-secondary/30'} transition-colors`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Avatar + info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                        {(u.name || u.email)[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{u.name || '—'}</p>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />{u.email}
                          {u.email_verified ? <CheckCircle className="w-3 h-3 text-green-500" /> : <span className="text-amber-500">(unverified)</span>}
                        </p>
                      </div>
                    </div>

                    {/* Role badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {(['customer', 'partner', 'admin'] as UserRole[]).map(role => {
                        const cfg = ROLE_CONFIG[role];
                        const hasRole = userRoles.includes(role);
                        return (
                          <button
                            key={role}
                            onClick={() => isEditing && toggleRole(u, role)}
                            disabled={!isEditing || saving}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all
                              ${hasRole ? cfg.color : 'bg-secondary text-muted-foreground opacity-50'}
                              ${isEditing ? 'cursor-pointer hover:opacity-80 ring-2 ring-offset-1 ' + (hasRole ? 'ring-primary' : 'ring-transparent') : 'cursor-default'}
                            `}
                          >
                            {hasRole && <Check className="w-3 h-3" />}
                            {role}
                          </button>
                        );
                      })}
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0">
                      {isEditing ? (
                        <select
                          value={u.status || 'active'}
                          onChange={e => setStatus(u, e.target.value as UserStatus)}
                          className="text-xs border border-border rounded px-2 py-1 bg-background"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                          ${u.status === 'active' ? 'bg-green-100 text-green-700' :
                            u.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'}`}>
                          {u.status === 'active' ? <CheckCircle className="w-3 h-3" /> :
                           u.status === 'suspended' ? <Ban className="w-3 h-3" /> :
                           <Clock className="w-3 h-3" />}
                          {u.status || 'active'}
                        </span>
                      )}
                    </div>

                    {/* Plan */}
                    <span className="text-xs text-muted-foreground shrink-0">{u.plan}</span>

                    {/* Edit / Save buttons */}
                    <div className="flex gap-2 shrink-0">
                      {isEditing ? (
                        <>
                          <button onClick={() => setEditingId(null)}
                            className="px-3 py-1 text-xs border border-border rounded-lg hover:bg-secondary transition-colors">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditingId(u.id)}
                          className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                          Manage
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Portals access info (shown when editing) */}
                  {isEditing && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">Portal access granted by current roles:</p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(userRoles.flatMap(r => ROLE_CONFIG[r]?.portals || []))].map(portal => (
                          <span key={portal} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-mono">
                            {portal}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Click role badges above to toggle access. Changes save immediately.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Role guide */}
      <div className="bg-secondary/30 rounded-xl p-4">
        <p className="text-sm font-medium mb-3">Portal Access Guide</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
            <div key={role} className="flex items-start gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
              <div>
                <p className="text-xs text-muted-foreground">Access to:</p>
                {cfg.portals.map(p => (
                  <p key={p} className="text-xs font-mono text-foreground">{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          💡 Users can have multiple roles. An admin automatically gets customer + partner access too.
          A partner can be given customer access without being a full admin.
        </p>
      </div>
    </div>
  );
}
