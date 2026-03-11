import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { PartnerDashboard } from "@/components/partner/PartnerDashboard";
import { PartnerAnalytics } from "@/components/partner/PartnerAnalytics";
import { PartnerDealsTab } from "@/components/partner/PartnerDealsTab";
import { MessagingTab } from "@/components/shared/MessagingTab";
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
  // SEO: unique page title
  document.title = "Partner Portal | PerksNest";

  const [allPartnerDeals, setAllPartnerDeals] = useState<PartnerDeal[]>([]);
  useEffect(() => { getPartnerDeals().then(setAllPartnerDeals); }, []);
  const { user, isPartner, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login?returnUrl=/partner");
  }, [isAuthenticated, navigate]);

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
          {activeTab === "messages" && <MessagingTab portalRole="partner" />}
          {activeTab === "settings" && <PartnerSettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default PartnerPortal;
