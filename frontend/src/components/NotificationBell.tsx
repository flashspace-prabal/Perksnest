import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAllNotificationsRead, markNotificationRead, type NotificationEntry } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { getTicketSocket } from "@/lib/ticket-socket";

function formatRelativeTime(timestamp: string) {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
  if (diffSeconds < 60) return "Just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function normalizeNotification(row: Record<string, unknown>): NotificationEntry {
  return {
    id: String(row.id || ""),
    userId: String(row.userId || row.user_id || ""),
    type: String(row.type || "system"),
    title: String(row.title || "Notification"),
    message: String(row.message || ""),
    read: Boolean(row.read),
    createdAt: String(row.createdAt || row.created_at || new Date().toISOString()),
  };
}

export default function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const loadNotifications = async ({ silent = false } = {}) => {
    if (!isAuthenticated || !user) return;

    if (!silent) {
      setIsLoading(true);
    }

    try {
      const response = await getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error("[Notifications] Failed to load notifications", error);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    loadNotifications();
    const intervalId = window.setInterval(() => {
      loadNotifications({ silent: true });
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const socket = getTicketSocket();
    if (!socket) {
      return;
    }

    const handleNotificationsUpdate = (payload: {
      notifications?: Record<string, unknown>[];
      unreadCount?: number;
      success?: boolean;
    }) => {
      if (Array.isArray(payload?.notifications)) {
        setNotifications(payload.notifications.map((notification) => normalizeNotification(notification)));
      }
    };

    const handleReconnect = () => {
      loadNotifications({ silent: true });
    };

    socket.on("notifications:update", handleNotificationsUpdate);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("notifications:update", handleNotificationsUpdate);
      socket.off("connect", handleReconnect);
    };
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && notifications.length === 0) {
      await loadNotifications();
    }
  };

  const handleMarkRead = async (notification: NotificationEntry) => {
    if (notification.read || isUpdating) return;

    setIsUpdating(true);
    try {
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) => (item.id === notification.id ? { ...item, read: true } : item))
      );
    } catch (error) {
      console.error("[Notifications] Failed to mark notification as read", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAllRead = async () => {
    if (!unreadCount || isUpdating) return;

    setIsUpdating(true);
    try {
      await markAllNotificationsRead();
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    } catch (error) {
      console.error("[Notifications] Failed to mark all notifications as read", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm shadow-gray-900/5 transition-all duration-200 hover:border-gray-300 hover:text-[#5c2169]"
        aria-label="Open notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5c2169] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+12px)] z-[70] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-[#eadcf0] bg-white shadow-[0_28px_80px_rgba(92,33,105,0.16)]">
          <div className="flex items-center justify-between border-b border-[#f0e5f4] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Notifications</p>
              <p className="text-xs text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={!unreadCount || isUpdating}
              className="text-xs font-semibold text-[#5c2169] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {isLoading ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">No notifications yet</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  We&apos;ll show important account and deal updates here.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleMarkRead(notification)}
                  className={`block w-full border-b border-[#f6edf8] px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-[#faf5fc] ${
                    notification.read ? "bg-white" : "bg-[#f8f2fb]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                        notification.read ? "bg-transparent" : "bg-[#5c2169]"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                        <span className="shrink-0 text-[11px] text-slate-500">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{notification.message}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
