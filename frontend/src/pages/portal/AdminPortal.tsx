import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AdminHeader, AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminDashboardLive } from "@/components/admin/AdminDashboardLive";
import { AdminUsersLive } from "@/components/admin/AdminUsersLive";
import { AdminDealsLive } from "@/components/admin/AdminDealsLive";
import { AdminPartnersLive } from "@/components/admin/AdminPartnersLive";
import { AdminTickets } from "@/components/admin/AdminTickets";
import { AdminRevenueLive } from "@/components/admin/AdminRevenueLive";
import { AdminWhiteLabelLive } from "@/components/admin/AdminWhiteLabelLive";
import { AdminSettings } from "@/components/admin/AdminSettings";
import { useAuth } from "@/lib/auth";

const AdminPortal = () => {
  // SEO: unique page title
  document.title = "Admin Portal | PerksNest";

  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Authentication guard - only admin role can access
  if (!user) {
    return <Navigate to="/login?returnUrl=/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You must have an admin role to access the admin portal. Please contact your system
            administrator if you believe this is an error.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboardLive onTabChange={setActiveTab} />;
      case "users":
        return <AdminUsersLive />;
      case "deals":
        return <AdminDealsLive />;
      case "partners":
        return <AdminPartnersLive />;
      case "tickets":
        return <AdminTickets />;
      case "revenue":
        return <AdminRevenueLive />;
      case "whitelabel":
        return <AdminWhiteLabelLive />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboardLive onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPortal;
