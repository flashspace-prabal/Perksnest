import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle, Clock, AlertCircle, User, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
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
  subject: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  type: "billing" | "technical" | "general";
  description: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access tickets");
      navigate("/login?returnUrl=/customer/tickets");
      return;
    }
    loadTicket();
  }, [isAuthenticated, navigate, ticketId]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/api/tickets/${ticketId}`);
      setTicket(data.ticket);
    } catch (error) {
      console.error("Failed to load ticket:", error);
      toast.error("Failed to load ticket");
      navigate("/customer/tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setSending(true);
      await apiCall(`/api/tickets/${ticketId}/reply`, "POST", {
        message: replyText.trim(),
      });

      toast.success("Reply sent successfully!");
      setReplyText("");
      loadTicket();
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
      setClosing(true);
      await apiCall(`/api/tickets/${ticketId}/close`, "PUT");
      toast.success("Ticket closed successfully!");
      loadTicket();
    } catch (error) {
      console.error("Failed to close ticket:", error);
      toast.error("Failed to close ticket");
    } finally {
      setClosing(false);
    }
  };

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
        return <Badge variant="destructive" className="text-xs">High Priority</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-xs">Medium Priority</Badge>;
      case "low":
        return <Badge variant="secondary" className="text-xs">Low Priority</Badge>;
    }
  };

  if (!user || !isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Loading ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">Ticket not found</p>
          <Link to="/customer/tickets">
            <Button variant="outline">Back to Tickets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/" className="font-bold text-lg sm:text-xl">perksnest.</Link>
              <Badge className="bg-primary/10 text-primary border-primary/20">Ticket #{ticket.id.slice(0, 8)}</Badge>
            </div>
            <Link to="/customer/tickets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">All Tickets</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Ticket Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl sm:text-2xl mb-2">{ticket.subject}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="capitalize">{ticket.type}</span>
                  <span>•</span>
                  <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Updated {new Date(ticket.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Initial Request:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Messages Thread */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {!ticket.messages || ticket.messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No messages yet. Start the conversation below.</p>
                </div>
              ) : (
                <>
                  {ticket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.is_admin ? "flex-row" : "flex-row-reverse"}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.is_admin ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
                      }`}>
                        {message.is_admin ? (
                          <UserCircle className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.is_admin ? "" : "flex flex-col items-end"}`}>
                        <div className={`inline-block max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-2 ${
                          message.is_admin
                            ? "bg-primary/10 text-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}>
                          <p className="text-xs font-medium mb-1">
                            {message.is_admin ? "Support Team" : "You"}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reply Box */}
        {ticket.status !== "closed" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Add Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleSendReply();
                    }
                  }}
                />
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCloseTicket}
                    disabled={closing}
                    className="w-full sm:w-auto"
                  >
                    {closing ? "Closing..." : "Close Ticket"}
                  </Button>
                  <Button onClick={handleSendReply} disabled={sending} className="gap-2 w-full sm:w-auto">
                    <Send className="h-4 w-4" />
                    {sending ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: Press Cmd/Ctrl + Enter to send
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {ticket.status === "closed" && (
          <Card className="bg-muted/50">
            <CardContent className="py-6 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">This ticket is closed</p>
              <p className="text-sm text-muted-foreground">Create a new ticket if you need further assistance</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
