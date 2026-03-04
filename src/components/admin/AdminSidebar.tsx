import { Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Package, UserCheck, DollarSign, Settings, Bell, Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "deals", label: "Deals", icon: Package },
  { id: "partners", label: "Partners", icon: UserCheck },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "whitelabel", label: "White Label", icon: Globe },
  { id: "settings", label: "Settings", icon: Settings },
];

export const AdminHeader = () => (
  <header className="bg-background border-b sticky top-0 z-50">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl">perksnest.</Link>
          <Badge variant="secondary" className="bg-primary/10 text-primary">Admin Portal</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users, deals, partners..." className="pl-10 w-80" />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            A
          </div>
        </div>
      </div>
    </div>
  </header>
);

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  return (
    <aside className="w-64 bg-background border-r min-h-[calc(100vh-73px)] p-4">
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
