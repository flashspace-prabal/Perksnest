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

interface WhiteLabelClient {
  id: string;
  company: string;
  domain: string;
  plan: "Starter" | "Growth" | "Enterprise";
  members: number;
  monthlyFee: number;
  status: "Active" | "Pending";
  contactEmail: string;
}

const mockClients: WhiteLabelClient[] = [
  {
    id: "1",
    company: "TechStartup Inc",
    domain: "perks.techstartup.io",
    plan: "Enterprise",
    members: 850,
    monthlyFee: 4999,
    status: "Active",
    contactEmail: "admin@techstartup.io",
  },
  {
    id: "2",
    company: "Y Combinator",
    domain: "deals.ycombinator.com",
    plan: "Enterprise",
    members: 1200,
    monthlyFee: 7999,
    status: "Active",
    contactEmail: "deals@ycombinator.com",
  },
  {
    id: "3",
    company: "Techstars Austin",
    domain: "perks.techstars.com/austin",
    plan: "Growth",
    members: 450,
    monthlyFee: 1999,
    status: "Active",
    contactEmail: "austin@techstars.com",
  },
  {
    id: "4",
    company: "500 Global",
    domain: "benefits.500.co",
    plan: "Enterprise",
    members: 890,
    monthlyFee: 5499,
    status: "Active",
    contactEmail: "ops@500.co",
  },
  {
    id: "5",
    company: "Acme Ventures",
    domain: "perks.acmevc.com",
    plan: "Growth",
    members: 320,
    monthlyFee: 1999,
    status: "Active",
    contactEmail: "team@acmevc.com",
  },
  {
    id: "6",
    company: "Innovation Hub",
    domain: "deals.innovationhub.io",
    plan: "Starter",
    members: 150,
    monthlyFee: 799,
    status: "Pending",
    contactEmail: "admin@innovationhub.io",
  },
];

export const AdminWhiteLabel = () => {
  const [clients, setClients] = useState<WhiteLabelClient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    company: "",
    domain: "",
    contactEmail: "",
    plan: "Starter" as "Starter" | "Growth" | "Enterprise",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load from localStorage and merge with mock data
    const stored = localStorage.getItem("pn_wl_clients");
    const storedClients = stored ? JSON.parse(stored) : [];
    const merged = [...mockClients, ...storedClients];
    setClients(merged);
  }, []);

  const saveClients = (updatedClients: WhiteLabelClient[]) => {
    const customClients = updatedClients.filter(
      (c) => !mockClients.find((m) => m.id === c.id)
    );
    localStorage.setItem("pn_wl_clients", JSON.stringify(customClients));
    setClients(updatedClients);
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
      id: Date.now().toString(),
      company: newClient.company,
      domain: newClient.domain,
      plan: newClient.plan,
      members: 0,
      monthlyFee: newClient.plan === "Starter" ? 799 : newClient.plan === "Growth" ? 1999 : 4999,
      status: "Pending",
      contactEmail: newClient.contactEmail,
    };

    saveClients([...clients, client]);

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
        </CardContent>
      </Card>
    </div>
  );
};
