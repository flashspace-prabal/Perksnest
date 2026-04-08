import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { PartnerDashboard } from "@/components/partner/PartnerDashboard";
import { PartnerAnalytics } from "@/components/partner/PartnerAnalytics";
import { PartnerDealsTab } from "@/components/partner/PartnerDealsTab";
import { RealtimeMessagingTab } from "@/components/shared/RealtimeMessagingTab";
import { PartnerSettingsTab } from "@/components/partner/PartnerSettingsTab";
import { PartnerNotifications } from "@/components/partner/PartnerNotifications";
import { getPartnerDeals } from "@/lib/store";
import {
  LayoutDashboard, Package, BarChart3, MessageSquare, Settings,
  LogOut, ExternalLink, Download, Headset, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getTickets, createTicket } from "@/lib/api";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "deals", label: "My Deals", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "tickets", label: "Tickets", icon: Headset },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

const PartnerPortal = () => {
  // SEO: unique page title
  document.title = "Partner Portal | PerksNest";

  const [allPartnerDeals, setAllPartnerDeals] = useState<PartnerDeal[]>([]);
  useEffect(() => { getPartnerDeals().then(setAllPartnerDeals); }, []);
  const { user, isPartner, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login?returnUrl=/partner");
  }, [isAuthenticated, navigate]);

  // Fetch tickets from API
  useEffect(() => {
    if (user) {
      getTickets()
        .then(data => setTickets(data.tickets || []))
        .catch(err => console.error('Failed to fetch tickets:', err));
    }
  }, [user]);

  // Show apply page for authenticated non-partners
  if (isAuthenticated && !isPartner) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-6">🤝</div>
          <h1 className="text-2xl font-bold mb-3">Become a PerksNest Partner</h1>
          <p className="text-muted-foreground mb-6">Join 500+ companies offering exclusive deals to startups worldwide. Apply to list your product on PerksNest.</p>
          <a href="mailto:partners@perksnest.co?subject=Partner Application"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
            Apply to become a partner →
          </a>
          <p className="text-xs text-muted-foreground mt-4">We review applications within 2 business days.</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const myDeals = allPartnerDeals.filter(d => d.partnerId === user.id);
  const approvedDeals = myDeals.filter(d => d.status === "approved");
  const totalViews = approvedDeals.reduce((a, d) => a + d.views, 0);
  const totalClaims = approvedDeals.reduce((a, d) => a + d.claims, 0);
  const revenue = totalClaims * 25; // $25 per claim (mock commission)

  const partnerData = {
    name: user.name,
    activeDeals: approvedDeals.length,
    totalClaims,
    totalRedemptions: Math.floor(totalClaims * 0.7),
    revenue,
    pendingCommission: Math.floor(revenue * 0.3),
    totalViews,
    conversionRate: totalViews > 0 ? parseFloat(((totalClaims / totalViews) * 100).toFixed(1)) : 0,
  };

  const dealRows = myDeals.slice(0, 5).map(d => ({
    id: d.id, name: d.name, status: d.status,
    views: d.views, claims: d.claims,
    redemptions: Math.floor(d.claims * 0.7),
    redemptionRate: d.claims > 0 ? parseFloat(((d.claims / Math.max(d.views, 1)) * 100).toFixed(1)) : 0,
    revenue: d.claims * 25,
  }));

  const handleDownloadReport = () => {
    const report = { partner: user.name, generatedAt: new Date().toISOString(), deals: myDeals, stats: partnerData };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `perksnest-partner-report-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  const handleCreateTicket = async () => {
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    setIsCreatingTicket(true);
    try {
      await createTicket({
        subject: newTicketSubject,
        message: newTicketMessage,
        priority: 'medium'
      });

      toast.success("Ticket created successfully!");
      setNewTicketSubject("");
      setNewTicketMessage("");

      // Refresh tickets
      const data = await getTickets();
      setTickets(data.tickets || []);
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setIsCreatingTicket(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-bold">perksnest<span className="text-primary">.</span></Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-muted-foreground">Partner Portal</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <PartnerNotifications />
            <Button variant="outline" size="sm" className="gap-1.5 text-sm" onClick={handleDownloadReport}>
              <Download className="h-4 w-4" /><span className="hidden sm:inline">Report</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm" asChild>
              <Link to="/deals"><ExternalLink className="h-4 w-4" /><span className="hidden sm:inline">View Marketplace</span></Link>
            </Button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold hover:opacity-90">
                {user?.avatar ? <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase() || 'P'}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-10 w-52 bg-background border border-border rounded-xl shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium text-sm truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/customer" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary">🎁 Customer Portal</Link>
                    {(user?.roles?.includes('admin') || user?.role === 'admin') && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary">🛡️ Admin Portal</Link>
                    )}
                    <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary text-red-600">🚪 Sign out</button>
                  </div>
                </div>
              )}
              {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Sidebar */}
        <aside className="w-full sm:w-52 sm:shrink-0">
          <nav className="flex sm:flex-col gap-1 overflow-x-auto pb-2 sm:pb-0">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors text-left whitespace-nowrap ${
                    activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}>
                  <Icon className="h-4 w-4 shrink-0" />{tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {activeTab === "dashboard" && <PartnerDashboard partnerData={partnerData} deals={dealRows} />}
          {activeTab === "deals" && <PartnerDealsTab />}
          {activeTab === "analytics" && <PartnerAnalytics partnerData={partnerData} deals={dealRows} />}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input
                        placeholder="Brief description of your issue"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <textarea
                        className="w-full min-h-[120px] px-3 py-2 border border-border rounded-lg resize-none"
                        placeholder="Provide details about your issue or question..."
                        value={newTicketMessage}
                        onChange={(e) => setNewTicketMessage(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleCreateTicket}
                      disabled={isCreatingTicket}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {isCreatingTicket ? "Creating..." : "Submit Ticket"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  {tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <Headset className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">No tickets yet</p>
                      <p className="text-muted-foreground">Create a ticket above if you need help</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => (
                        <div key={ticket.id} className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{ticket.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                Created {new Date(ticket.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={
                              ticket.status === 'open' ? 'default' :
                              ticket.status === 'closed' ? 'secondary' : 'outline'
                            }>
                              {ticket.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {activeTab === "messages" && <RealtimeMessagingTab portalRole="partner" />}
          {activeTab === "settings" && <PartnerSettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default PartnerPortal;
