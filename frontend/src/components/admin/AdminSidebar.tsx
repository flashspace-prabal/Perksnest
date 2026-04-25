import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard, Users, Package, UserCheck, DollarSign, Settings, Bell, Globe, Search, LifeBuoy
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "deals", label: "Deals", icon: Package },
  { id: "partners", label: "Partners", icon: UserCheck },
  { id: "tickets", label: "Tickets", icon: LifeBuoy },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "whitelabel", label: "White Label", icon: Globe },
  { id: "settings", label: "Settings", icon: Settings },
];

export const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'A';
  return (
  <header className="bg-background border-b sticky top-0 z-50">
    <div className="px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <Link to="/" className="font-bold text-lg sm:text-xl flex-shrink-0">perksnest.</Link>
          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs sm:text-sm flex-shrink-0">Admin Portal</Badge>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 w-64 md:w-80 text-sm" />
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold hover:opacity-90 flex-shrink-0"
            >
              {user?.avatar ? <img src={user.avatar} alt={initial} className="w-full h-full rounded-full object-cover" /> : initial}
            </button>
            {open && (
              <div className="absolute right-0 top-10 w-48 sm:w-52 bg-background border border-border rounded-xl shadow-lg z-50">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm truncate">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link to="/customer" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary">🎁 Customer Portal</Link>
                  {(user?.roles?.includes('partner') || user?.role === 'partner') && (
                    <Link to="/partner" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary">🤝 Partner Portal</Link>
                  )}
                  <button onClick={() => { logout(); window.location.href = '/'; }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary text-red-600">🚪 Sign out</button>
                </div>
              </div>
            )}
            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
          </div>
        </div>
      </div>
    </div>
  </header>
  );
};

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  return (
    <aside className="w-full md:w-48 lg:w-64 bg-background border-b md:border-b-0 md:border-r md:min-h-[calc(100vh-73px)] p-3 sm:p-4">
      <nav className="flex gap-2 overflow-x-auto pb-1 md:block md:space-y-1 md:overflow-visible md:pb-0 scrollbar-hide">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex min-h-10 shrink-0 items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors md:w-full ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
