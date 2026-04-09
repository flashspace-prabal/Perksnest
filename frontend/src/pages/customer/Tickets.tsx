import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  type: "billing" | "technical" | "general";
  created_at: string;
  updated_at: string;
}

const Tickets = () => {
  document.title = "My Tickets | PerksNest";

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // New ticket form
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<"billing" | "technical" | "general">("general");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access tickets");
      navigate("/login?returnUrl=/customer/tickets");
      return;
    }
    loadTickets();
  }, [isAuthenticated, navigate]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/api/tickets");
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setCreating(true);
      await apiCall("/api/tickets", "POST", {
        subject: subject.trim(),
        type,
        priority,
        description: description.trim(),
      });

      toast.success("Ticket created successfully!");
      setNewTicketOpen(false);
      setSubject("");
      setType("general");
      setPriority("medium");
      setDescription("");
      loadTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast.error("Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" />Open</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800"><CheckCircle className="h-3 w-3 mr-1" />Closed</Badge>;
    }
  };

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-xs">Medium</Badge>;
      case "low":
        return <Badge variant="secondary" className="text-xs">Low</Badge>;
    }
  };

  if (!user || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/" className="font-bold text-lg sm:text-xl">perksnest.</Link>
              <Badge className="bg-primary/10 text-primary border-primary/20">Support Tickets</Badge>
            </div>
            <Link to="/customer">
              <Button variant="outline" size="sm">
                <X className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Portal</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              My Tickets
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              View and manage your support tickets
            </p>
          </div>
          <Button onClick={() => setNewTicketOpen(true)} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No tickets found</p>
                <p className="text-muted-foreground mb-6">
                  {search ? "Try a different search term" : "Create your first support ticket"}
                </p>
                {!search && (
                  <Button onClick={() => setNewTicketOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left py-3 pr-4 font-medium">Subject</th>
                      <th className="text-left py-3 pr-4 font-medium hidden md:table-cell">Type</th>
                      <th className="text-left py-3 pr-4 font-medium">Status</th>
                      <th className="text-left py-3 pr-4 font-medium hidden sm:table-cell">Priority</th>
                      <th className="text-left py-3 font-medium hidden lg:table-cell">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/customer/tickets/${ticket.id}`)}
                      >
                        <td className="py-3 pr-4">
                          <p className="font-medium">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground md:hidden capitalize">
                            {ticket.type}
                          </p>
                        </td>
                        <td className="py-3 pr-4 hidden md:table-cell">
                          <span className="capitalize text-muted-foreground">{ticket.type}</span>
                        </td>
                        <td className="py-3 pr-4">{getStatusBadge(ticket.status)}</td>
                        <td className="py-3 pr-4 hidden sm:table-cell">{getPriorityBadge(ticket.priority)}</td>
                        <td className="py-3 text-muted-foreground hidden lg:table-cell">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Ticket Dialog */}
      <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject *</Label>
              <Input
                className="mt-1"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type *</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority *</Label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                className="mt-1 min-h-[120px]"
                placeholder="Provide details about your issue or question..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setNewTicketOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} disabled={creating}>
              {creating ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets;
