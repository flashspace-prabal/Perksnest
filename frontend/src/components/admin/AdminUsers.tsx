import { useEffect, useMemo, useState } from 'react';
import {
  Search, Filter, Download, Eye, Edit, Ban, Mail, MoreVertical,
  UserPlus, CheckCircle, XCircle, ArrowUpDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Checkbox } from "@/components/ui/checkbox";
import { getAllUsers } from "@/lib/auth";
import { dealsData } from "@/data/deals";
import { getAdminUsers } from "@/lib/api";

export const AdminUsers = () => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [apiUsers, setApiUsers] = useState<any>(null);

  // Fetch from local storage (fallback)
  useEffect(() => { getAllUsers().then(setAllUsers); }, []);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search query (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users from backend API (using debounced search)
  useEffect(() => {
    getAdminUsers(currentPage, itemsPerPage, debouncedSearch)
      .then(data => setApiUsers(data))
      .catch(err => {
        console.error('Failed to fetch users from API:', err);
        // Fallback to local data
      });
  }, [currentPage, debouncedSearch]);

  // Use API users if available, otherwise fallback to local users
  const usersSource = apiUsers?.users || allUsers;

  // Calculate user stats
  const userStats = useMemo(() => {
    // Use API stats if available
    if (apiUsers?.stats) {
      return apiUsers.stats;
    }

    // Fallback to local calculation
    const total = allUsers.length;
    const premium = allUsers.filter(u => u.plan === 'premium' || u.plan === 'enterprise').length;
    const free = allUsers.filter(u => u.plan === 'free').length;
    const enterprise = allUsers.filter(u => u.plan === 'enterprise').length;

    return {
      total,
      active: Math.floor(total * 0.85), // ~85% active
      premium,
      free,
      enterprise,
      newThisMonth: Math.floor(total * 0.15), // ~15% new this month
      pendingVerification: 0
    };
  }, [allUsers, apiUsers]);

  // Transform users for display
  const displayUsers = useMemo(() => {
    return usersSource.map(user => {
      // Calculate total savings from claimed deals
      const totalSavings = user.claimedDeals.reduce((sum, dealId) => {
        const deal = dealsData.find(d => d.id === dealId);
        if (deal) {
          const savings = parseFloat(deal.savings.replace(/[$,]/g, ''));
          return sum + savings;
        }
        return sum;
      }, 0);

      // Calculate last login time (mock)
      const lastLoginOptions = ['1 hour ago', '2 hours ago', '1 day ago', '2 days ago', '1 week ago'];
      const lastLogin = lastLoginOptions[Math.floor(Math.random() * lastLoginOptions.length)];

      return {
        ...user,
        claimedDealsCount: user.claimedDeals.length,
        totalSavings,
        lastLogin,
        status: 'active' as const,
        company: user.name + ' Corp' // Mock company name
      };
    });
  }, [usersSource]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return displayUsers.filter(user => {
      const matchesSearch = searchQuery === "" ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlan = planFilter === "all" || user.plan === planFilter;

      return matchesSearch && matchesPlan;
    });
  }, [displayUsers, searchQuery, planFilter]);

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Suspended</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Badge className="bg-primary text-primary-foreground">Premium</Badge>;
      case "enterprise":
        return <Badge className="bg-purple-600 text-white hover:bg-purple-600">Enterprise</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users and their accounts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="text-xl font-bold">{userStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-xl font-bold text-green-600">{userStats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pro/Enterprise</p>
            <p className="text-xl font-bold text-primary">{userStats.premium}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Free</p>
            <p className="text-xl font-bold">{userStats.free}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">New This Month</p>
            <p className="text-xl font-bold text-blue-600">+{userStats.newThisMonth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Pending Verify</p>
            <p className="text-xl font-bold text-yellow-600">{userStats.pendingVerification}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setPlanFilter("all");
                setCurrentPage(1);
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{selectedUsers.length} users selected</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Bulk Edit
                </Button>
                <Button size="sm" variant="outline" className="text-destructive">
                  <Ban className="h-4 w-4 mr-1" />
                  Suspend
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 w-12">
                    <Checkbox
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4">
                    <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold">
                      User <ArrowUpDown className="h-3 w-3 ml-1" />
                    </Button>
                  </th>
                  <th className="text-left p-4">Company</th>
                  <th className="text-left p-4">Plan</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Claimed Deals</th>
                  <th className="text-left p-4">Total Savings</th>
                  <th className="text-left p-4">Last Login</th>
                  <th className="text-left p-4 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{user.company}</td>
                    <td className="p-4">{getPlanBadge(user.plan)}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </td>
                    <td className="p-4 text-sm">{user.claimedDealsCount}</td>
                    <td className="p-4 text-sm font-medium text-green-600">
                      ${user.totalSavings.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.lastLogin}</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="h-4 w-4 mr-2" /> Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant="outline"
                    size="sm"
                    className={currentPage === pageNum ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="text-muted-foreground">...</span>}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
