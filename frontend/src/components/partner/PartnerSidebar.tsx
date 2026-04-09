import { 
  BarChart3, Package, TrendingUp, DollarSign, MessageSquare, Settings, Award 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PartnerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  performanceScore: number;
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "deals", label: "My Deals", icon: Package },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

export const PartnerSidebar = ({ activeTab, setActiveTab, performanceScore }: PartnerSidebarProps) => {
  return (
    <aside className="w-64 bg-background border-r min-h-[calc(100vh-73px)] p-4">
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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

      {/* Performance Score */}
      <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-primary" />
          <span className="font-medium">Performance Score</span>
        </div>
        <div className="text-3xl font-bold text-primary mb-2">{performanceScore}%</div>
        <Progress value={performanceScore} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">Excellent! Keep up the great work.</p>
      </div>
    </aside>
  );
};
