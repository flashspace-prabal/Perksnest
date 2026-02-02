import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { PartnerDashboard } from "@/components/partner/PartnerDashboard";
import { PartnerDeals } from "@/components/partner/PartnerDeals";
import { PartnerAnalytics } from "@/components/partner/PartnerAnalytics";
import { PartnerRevenue } from "@/components/partner/PartnerRevenue";
import { PartnerMessages } from "@/components/partner/PartnerMessages";
import { PartnerSettings } from "@/components/partner/PartnerSettings";

const PartnerPortal = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sample Partner Data
  const partnerData = {
    name: "Notion Labs",
    tier: "Premium Partner",
    activeDeals: 8,
    totalClaims: 15234,
    totalRedemptions: 12891,
    revenue: 45680,
    pendingCommission: 3240,
    performanceScore: 92
  };

  const deals = [
    { 
      id: 1, 
      name: "Notion Pro - 6 Months Free", 
      status: "active",
      views: 45234, 
      claims: 3421, 
      redemptions: 2987,
      redemptionRate: 87.3,
      revenue: 12450,
      createdAt: "2024-01-15",
      expiresAt: "2024-12-31"
    },
    { 
      id: 2, 
      name: "Notion Team - 50% Off", 
      status: "active",
      views: 23456, 
      claims: 1876, 
      redemptions: 1654,
      redemptionRate: 88.2,
      revenue: 8230,
      createdAt: "2024-02-01",
      expiresAt: "2024-12-31"
    },
    { 
      id: 3, 
      name: "Notion Enterprise Trial", 
      status: "paused",
      views: 12345, 
      claims: 654, 
      redemptions: 432,
      redemptionRate: 66.1,
      revenue: 2100,
      createdAt: "2024-03-10",
      expiresAt: "2024-11-30"
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <PartnerDashboard partnerData={partnerData} deals={deals} />;
      case "deals":
        return <PartnerDeals />;
      case "analytics":
        return <PartnerAnalytics />;
      case "revenue":
        return <PartnerRevenue />;
      case "messages":
        return <PartnerMessages />;
      case "settings":
        return <PartnerSettings />;
      default:
        return <PartnerDashboard partnerData={partnerData} deals={deals} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="font-bold text-xl">perksnest.</Link>
              <Badge className="bg-primary/10 text-primary border-primary/20">Partner Portal</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl">
                  📝
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{partnerData.name}</p>
                  <p className="text-xs text-muted-foreground">{partnerData.tier}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <PartnerSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          performanceScore={partnerData.performanceScore} 
        />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PartnerPortal;
