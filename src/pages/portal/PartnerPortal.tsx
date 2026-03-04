import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { PartnerDashboard } from "@/components/partner/PartnerDashboard";
import { PartnerAnalytics } from "@/components/partner/PartnerAnalytics";
import { PartnerDealsTab } from "@/components/partner/PartnerDealsTab";
import { PartnerMessagesTab } from "@/components/partner/PartnerMessagesTab";
import { PartnerSettingsTab } from "@/components/partner/PartnerSettingsTab";
import { PartnerNotifications } from "@/components/partner/PartnerNotifications";
import { getPartnerDeals } from "@/lib/store";
import {
  LayoutDashboard, Package, BarChart3, MessageSquare, Settings,
  LogOut, ExternalLink, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "deals", label: "My Deals", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

const PartnerPortal = () => {
  const { user, isPartner, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated) navigate("/login?returnUrl=/partner");
    else if (!isPartner) navigate("/login?returnUrl=/partner");
  }, [isAuthenticated, isPartner, navigate]);

  if (!user || !isPartner) return null;

  const myDeals = getPartnerDeals().filter(d => d.partnerId === user.id);
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-bold">perksnest<span className="text-primary">.</span></Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium text-muted-foreground">Partner Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <PartnerNotifications />
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm" onClick={handleDownloadReport}>
              <Download className="h-4 w-4" />Report
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm" asChild>
              <Link to="/deals"><ExternalLink className="h-4 w-4" />View Marketplace</Link>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm text-muted-foreground" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="h-4 w-4" />Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
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
          {activeTab === "messages" && <PartnerMessagesTab />}
          {activeTab === "settings" && <PartnerSettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default PartnerPortal;
