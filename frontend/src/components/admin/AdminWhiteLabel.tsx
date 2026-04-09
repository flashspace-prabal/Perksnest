import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, DollarSign, CheckCircle, Building2, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/runtime";

// White label data structure
type WhiteLabelClient = {
  id: string;
  company: string;
  domain: string;
  plan: "Starter" | "Growth" | "Enterprise";
  members: number;
  monthlyFee: number;
  status: "Active" | "Pending";
  contactEmail: string;
};

// Note: MockClients removed - using real API integration only
// When API endpoints are available:
// GET /api/admin/whitelabel/clients
// POST /api/admin/whitelabel/clients
// PATCH /api/admin/whitelabel/clients/:id
// DELETE /api/admin/whitelabel/clients/:id

export const AdminWhiteLabel = () => {
  const [clients, setClients] = useState<WhiteLabelClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    company: "",
    domain: "",
    contactEmail: "",
    plan: "Starter" as "Starter" | "Growth" | "Enterprise",
  });
  const { toast } = useToast();

  // Load clients from API when available, with localStorage fallback
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        // Attempt to fetch from API
        const response = await fetch(`${API_BASE_URL}/api/admin/whitelabel/clients`, {
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('pn_session') || '{}').access_token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setClients(Array.isArray(data.clients) ? data.clients : []);
        } else {
          // Fallback to localStorage
          const stored = localStorage.getItem("pn_wl_clients");
          const storedClients = stored ? JSON.parse(stored) : [];
          setClients(storedClients);
        }
      } catch (error) {
        console.warn('White label API not available, using localStorage:', error);
        // Fallback to localStorage
        const stored = localStorage.getItem("pn_wl_clients");
        const storedClients = stored ? JSON.parse(stored) : [];
        setClients(storedClients);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  const saveClients = async (updatedClients: WhiteLabelClient[], isNew = false) => {
    const newAddedClients = updatedClients.filter(c => c.id.startsWith('temp_'));
    localStorage.setItem("pn_wl_clients", JSON.stringify(newAddedClients));
    setClients(updatedClients);

    // Attempt to sync to API if available
    if (isNew) {
      try {
        const lastClient = updatedClients[updatedClients.length - 1];
        await fetch(`${API_BASE_URL}/api/admin/whitelabel/clients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('pn_session') || '{}').access_token}`,
          },
          body: JSON.stringify(lastClient),
        });
      } catch (error) {
        console.warn('Could not sync to API:', error);
      }
    }
  };

  const handleAddClient = () => {
    if (!newClient.company || !newClient.domain || !newClient.contactEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const client: WhiteLabelClient = {
      id: `temp_${Date.now()}`, // Temporary ID until API confirms
      company: newClient.company,
      domain: newClient.domain,
      plan: newClient.plan,
      members: 0,
      monthlyFee: newClient.plan === "Starter" ? 799 : newClient.plan === "Growth" ? 1999 : 4999,
      status: "Pending",
      contactEmail: newClient.contactEmail,
    };

    saveClients([...clients, client], true);

    toast({
      title: "Client added",
      description: `${newClient.company} has been added successfully`,
    });

    setNewClient({ company: "", domain: "", contactEmail: "", plan: "Starter" });
    setIsDialogOpen(false);
  };

  const handleClientAction = (clientId: string, action: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    if (action === "suspend") {
      const updatedClients = clients.map((c) =>
        c.id === clientId ? { ...c, status: "Pending" as const } : c
      );
      saveClients(updatedClients);
      toast({
        title: "Client suspended",
        description: `${client.company} has been suspended`,
      });
    } else {
      toast({
        title: `${action === "view" ? "View" : "Edit"} client`,
        description: `Opening ${client.company}...`,
      });
    }
  };

  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === "Active").length;
  const totalRevenue = clients
    .filter((c) => c.status === "Active")
    .reduce((sum, c) => sum + c.monthlyFee, 0);
  const avgMembers = Math.round(
    clients.filter((c) => c.status === "Active").reduce((sum, c) => sum + c.members, 0) /
      activeClients || 0
  );

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "default";
      case "Growth":
        return "secondary";
      case "Starter":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">White Label</h2>
          <p className="text-muted-foreground">
            Manage your white label clients and subscriptions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New White Label Client</DialogTitle>
              <DialogDescription>
                Create a new white label instance for your client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  placeholder="perks.acmecorp.com"
                  value={newClient.domain}
                  onChange={(e) => setNewClient({ ...newClient, domain: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@acmecorp.com"
                  value={newClient.contactEmail}
                  onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Select
                  value={newClient.plan}
                  onValueChange={(value: any) => setNewClient({ ...newClient, plan: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter - $799/mo</SelectItem>
                    <SelectItem value="Growth">Growth - $1,999/mo</SelectItem>
                    <SelectItem value="Enterprise">Enterprise - $4,999/mo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient}>Add Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">White label instances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly WL Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Recurring revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Members/Client</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMembers}</div>
            <p className="text-xs text-muted-foreground">Average user count</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>White Label Clients</CardTitle>
          <CardDescription>All white label instances and their details</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Loading white label clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground space-y-4">
              <p className="text-sm">No white label clients yet</p>
              <p className="text-xs">Start by adding your first white label client using the "Add Client" button above</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Members</TableHead>
                  <TableHead className="text-right">Monthly Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.company}</TableCell>
                    <TableCell className="text-muted-foreground">{client.domain}</TableCell>
                    <TableCell>
                      <Badge variant={getPlanBadgeVariant(client.plan)}>{client.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{client.members.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      ${client.monthlyFee.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleClientAction(client.id, "view")}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleClientAction(client.id, "edit")}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleClientAction(client.id, "suspend")}
                            className="text-destructive"
                          >
                            Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
