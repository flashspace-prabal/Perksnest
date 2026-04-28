import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, Search, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
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
import { apiCall, getAllDeals, getTickets, getUserClaims } from "@/lib/api";

interface Ticket {
  id: string;
  subject: string;
  deal_id?: string | null;
  message: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  type: "billing" | "technical" | "general";
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
}

interface DealOption {
  id: string;
  slug?: string;
  name: string;
}

const TICKETS_PER_PAGE = 10;

const Tickets = () => {
  document.title = "My Tickets | PerksNest";

  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [deals, setDeals] = useState<DealOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // New ticket form
  const [subject, setSubject] = useState("");
  const [dealId, setDealId] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access tickets");
      navigate("/login?returnUrl=/customer/tickets");
      return;
    }
    loadTickets();
    loadDeals();
  }, [isAuthenticated, navigate]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const loadDeals = async () => {
    try {
      const [dealsResponse, claimsResponse] = await Promise.all([getAllDeals(), getUserClaims()]);
      const claimRows = Array.isArray((claimsResponse as { claims?: unknown[] })?.claims)
        ? (claimsResponse as { claims: Array<{ deal_id?: unknown }> }).claims
        : Array.isArray(claimsResponse)
          ? claimsResponse
          : [];
      const claimedDealIds = new Set([
        ...(user?.claimedDeals || []),
        ...claimRows
          .map((claim) => String((claim as { deal_id?: unknown })?.deal_id || ""))
          .filter(Boolean),
      ]);

      const nextDeals = Array.isArray(dealsResponse.deals)
        ? dealsResponse.deals
            .map((deal: Record<string, unknown>) => ({
              id: String(deal.id || deal.slug || ""),
              slug: deal.slug ? String(deal.slug) : undefined,
              name: String(deal.name || deal.company || deal.id || "Untitled deal"),
            }))
            .filter((deal: DealOption) => deal.id && deal.name && claimedDealIds.has(deal.id))
        : [];
      setDeals(nextDeals);
    } catch (error) {
      console.error("Failed to load deals:", error);
      toast.error("Failed to load deals");
    }
  };

  const handleCreateTicket = async () => {
    if (!subject.trim() || !dealId || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setCreating(true);
      const response = await apiCall("/api/tickets", "POST", {
        subject: subject.trim(),
        dealId,
        message: description.trim(),
      });

      toast.success("Ticket created successfully!");
      setNewTicketOpen(false);
      setSubject("");
      setDealId("");
      setDescription("");
      if (response?.ticket) {
        setTickets((current) => [
          response.ticket as Ticket,
          ...current.filter((ticket) => ticket.id !== response.ticket.id),
        ]);
      }
      void loadTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
      toast.error("Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((ticket) =>
        query.length === 0
          ? true
          : ticket.subject.toLowerCase().includes(query) ||
            ticket.message.toLowerCase().includes(query)
      );
  }, [search, tickets]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / TICKETS_PER_PAGE));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * TICKETS_PER_PAGE;
    return filteredTickets.slice(start, start + TICKETS_PER_PAGE);
  }, [currentPage, filteredTickets]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="space-y-4 mb-6">
          <Link to="/customer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Portal
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
            {!loading && filteredTickets.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * TICKETS_PER_PAGE + 1}
                {" "}to{" "}
                {Math.min(currentPage * TICKETS_PER_PAGE, filteredTickets.length)}
                {" "}of {filteredTickets.length} recent tickets
              </p>
            )}
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
                    {paginatedTickets.map((ticket) => (
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

            {!loading && filteredTickets.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
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
            <div>
              <Label>Deal *</Label>
              <Select value={dealId} onValueChange={setDealId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a deal" />
                </SelectTrigger>
                <SelectContent>
                  {deals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>{deal.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message *</Label>
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
