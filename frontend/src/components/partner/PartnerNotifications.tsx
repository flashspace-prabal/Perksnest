import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNotifications, markAllNotificationsRead, markNotificationRead, Notification } from "@/lib/store";
import { useAuth } from "@/lib/auth";

export const PartnerNotifications = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const load = () => { if (user) getNotifications(user.id).then(setNotifications); };
  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, [user]);
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    if (!user) return;
    markNotificationRead(user.id, id);
    load();
  };

  const handleMarkAll = () => {
    if (!user) return;
    markAllNotificationsRead(user.id);
    load();
  };

  const typeColor = (type: Notification["type"]) =>
    type === "deal_approved" ? "bg-green-100 text-green-800" : type === "deal_rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800";

  const relTime = (ts: string) => {
    const d = (Date.now() - new Date(ts).getTime()) / 1000;
    if (d < 60) return "just now";
    if (d < 3600) return `${Math.floor(d / 60)}m ago`;
    if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
    return `${Math.floor(d / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="sm" className="relative" onClick={() => setOpen(!open)}>
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <span className="font-semibold">Notifications</span>
            {unread > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-primary hover:underline">Mark all read</button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
            ) : (
              notifications.map(n => (
                <div key={n.id}
                  className={`px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{relTime(n.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
