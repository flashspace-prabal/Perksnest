import { useState, useEffect } from "react";
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, User, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

interface Message {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

interface Ticket {
  id: string;
  user_id: string;
  subject: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  type: "billing" | "technical" | "general";
  description: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
  user_email?: string;
  user_name?: string;
}

export const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "pending" | "closed">("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/api/admin/tickets");
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to load tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetail = async (ticketId: string) => {
    try {
      const data = await apiCall(`/api/admin/tickets/${ticketId}`);
      setSelectedTicket(data.ticket);
    } catch (error) {
      console.error("Failed to load ticket details:", error);
      toast.error("Failed to load ticket details");
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    try {
      setSending(true);
      await apiCall(`/api/admin/tickets/${selectedTicket.id}/reply`, "POST", {
        message: replyText.trim(),
        is_admin: true,
      });

      toast.success("Reply sent successfully!");
      setReplyText("");
      loadTicketDetail(selectedTicket.id);
      loadTickets();
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (status: Ticket["status"]) => {
    if (!selectedTicket) return;

    try {
      setUpdating(true);
      await apiCall(`/api/admin/tickets/${selectedTicket.id}`, "PUT", { status });
      toast.success(`Ticket ${status}`);
      setSelectedTicket({ ...selectedTicket, status });
      loadTickets();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePriority = async (priority: Ticket["priority"]) => {
    if (!selectedTicket) return;

    try {
      setUpdating(true);
      await apiCall(`/api/admin/tickets/${selectedTicket.id}`, "PUT", { priority });
      toast.success("Priority updated");
      setSelectedTicket({ ...selectedTicket, priority });
      loadTickets();
    } catch (error) {
      console.error("Failed to update priority:", error);
      toast.error("Failed to update priority");
    } finally {
      setUpdating(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      ticket.user_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    pending: tickets.filter(t => t.status === "pending").length,
    closed: tickets.filter(t => t.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search tickets by subject, user email, or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="open">Open ({statusCounts.open})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({statusCounts.closed})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
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
                  <p className="text-muted-foreground">
                    {search ? "Try a different search term" : `No ${statusFilter === "all" ? "" : statusFilter} tickets`}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left py-3 pr-4 font-medium">Subject</th>
                        <th className="text-left py-3 pr-4 font-medium hidden md:table-cell">User</th>
                        <th className="text-left py-3 pr-4 font-medium hidden lg:table-cell">Type</th>
                        <th className="text-left py-3 pr-4 font-medium">Status</th>
                        <th className="text-left py-3 pr-4 font-medium hidden sm:table-cell">Priority</th>
                        <th className="text-left py-3 font-medium hidden xl:table-cell">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            loadTicketDetail(ticket.id);
                          }}
                        >
                          <td className="py-3 pr-4">
                            <p className="font-medium">{ticket.subject}</p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {ticket.user_email || "Unknown"}
                            </p>
                          </td>
                          <td className="py-3 pr-4 hidden md:table-cell">
                            <p className="text-sm">{ticket.user_name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{ticket.user_email || ""}</p>
                          </td>
                          <td className="py-3 pr-4 hidden lg:table-cell">
                            <span className="capitalize text-muted-foreground">{ticket.type}</span>
                          </td>
                          <td className="py-3 pr-4">{getStatusBadge(ticket.status)}</td>
                          <td className="py-3 pr-4 hidden sm:table-cell">{getPriorityBadge(ticket.priority)}</td>
                          <td className="py-3 text-muted-foreground hidden xl:table-cell">
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
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Drawer */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedTicket && (
            <>
              <SheetHeader>
                <SheetTitle>Ticket #{selectedTicket.id.slice(0, 8)}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Ticket Header */}
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedTicket.subject}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span>{selectedTicket.user_name || "Unknown User"}</span>
                    <span>•</span>
                    <span>{selectedTicket.user_email || ""}</span>
                    <span>•</span>
                    <span className="capitalize">{selectedTicket.type}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>

                {/* Status & Priority Controls */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(v: any) => handleUpdateStatus(v)}
                      disabled={updating}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select
                      value={selectedTicket.priority}
                      onValueChange={(v: any) => handleUpdatePriority(v)}
                      disabled={updating}
                    >
                      <SelectTrigger>
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

                {/* Initial Request */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Initial Request:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Messages Thread */}
                <div>
                  <p className="text-sm font-medium mb-3">Messages</p>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {!selectedTicket.messages || selectedTicket.messages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No messages yet
                      </p>
                    ) : (
                      selectedTicket.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.is_admin ? "flex-row" : "flex-row-reverse"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.is_admin
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent text-accent-foreground"
                            }`}
                          >
                            <User className="h-5 w-5" />
                          </div>
                          <div className={`flex-1 ${message.is_admin ? "" : "flex flex-col items-end"}`}>
                            <div
                              className={`inline-block max-w-[85%] rounded-lg px-4 py-2 ${
                                message.is_admin
                                  ? "bg-primary/10 text-foreground"
                                  : "bg-accent text-accent-foreground"
                              }`}
                            >
                              <p className="text-xs font-medium mb-1">
                                {message.is_admin ? "Support Team" : "Customer"}
                              </p>
                              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(message.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Reply Box */}
                {selectedTicket.status !== "closed" && (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus("closed")}
                        disabled={updating}
                        size="sm"
                      >
                        Close Ticket
                      </Button>
                      <Button onClick={handleSendReply} disabled={sending} size="sm" className="gap-2">
                        <Send className="h-4 w-4" />
                        {sending ? "Sending..." : "Send Reply"}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedTicket.status === "closed" && (
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <CheckCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">This ticket is closed</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => handleUpdateStatus("open")}
                      disabled={updating}
                    >
                      Reopen Ticket
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
