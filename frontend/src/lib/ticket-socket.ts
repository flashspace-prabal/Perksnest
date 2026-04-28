import { io, type Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/lib/runtime";

type TicketMessagePayload = {
  success?: boolean;
  message?: {
    id: string;
    ticket_id: string;
    user_id: string;
    user_name: string;
    message: string;
    is_admin: boolean;
    created_at: string;
  };
  error?: string;
};

type TicketMessage = NonNullable<TicketMessagePayload["message"]>;

let socket: Socket | null = null;

function getCookie(name: string) {
  const nameEq = `${name}=`;
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(nameEq))
    ?.slice(nameEq.length);
}

function getToken() {
  try {
    const rawSession = localStorage.getItem("pn_session") || decodeURIComponent(getCookie("pn_session") || "");
    const session = rawSession ? JSON.parse(rawSession) : {};
    return session.access_token || "";
  } catch {
    return "";
  }
}

function getUserId() {
  return localStorage.getItem("perksnest_user_id") || "";
}

export function getTicketSocket() {
  const token = getToken();
  const userId = getUserId();
  if (!token && !userId) return null;

  if (socket?.connected && (socket.auth as any)?.token === token && (socket.auth as any)?.userId === userId) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_BASE_URL, {
    auth: { token, userId },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("socket connected");
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("ℹ️ Socket disconnected:", reason);
  });

  return socket;
}

export function subscribeToTicketRoom(
  ticketId: string,
  handlers: {
    onJoined?: () => void;
    onMessage?: (payload: TicketMessagePayload) => void;
    onError?: (message: string) => void;
  }
) {
  const socketInstance = getTicketSocket();
  if (!socketInstance) {
    handlers.onError?.("Authentication required");
    return () => {};
  }

  const handleJoined = () => handlers.onJoined?.();
  const handleMessage = (payload: TicketMessagePayload) => handlers.onMessage?.(payload);
  const handleTicketMessage = (message: TicketMessage) => handlers.onMessage?.({ success: true, message });
  const handleError = (payload: TicketMessagePayload) => handlers.onError?.(payload.error || "Ticket connection failed");

  socketInstance.on("joined_ticket", handleJoined);
  socketInstance.on("receive_message", handleMessage);
  socketInstance.on("ticket:message", handleTicketMessage);
  socketInstance.on("ticket_error", handleError);
  socketInstance.emit("join_ticket", { ticketId });

  return () => {
    socketInstance.off("joined_ticket", handleJoined);
    socketInstance.off("receive_message", handleMessage);
    socketInstance.off("ticket:message", handleTicketMessage);
    socketInstance.off("ticket_error", handleError);
  };
}

export function sendTicketSocketMessage(ticketId: string, message: string) {
  const socketInstance = getTicketSocket();
  if (!socketInstance) {
    throw new Error("Authentication required");
  }

  socketInstance.emit("send_message", { ticketId, message });
}

export function subscribeToTicketEvents(handlers: {
  onCreated?: (ticket: unknown) => void;
  onUpdated?: (ticket: unknown) => void;
  onError?: (message: string) => void;
}) {
  const socketInstance = getTicketSocket();
  if (!socketInstance) {
    handlers.onError?.("Authentication required");
    return () => {};
  }

  const handleCreated = (ticket: unknown) => handlers.onCreated?.(ticket);
  const handleUpdated = (ticket: unknown) => handlers.onUpdated?.(ticket);
  const handleError = (payload: TicketMessagePayload) => handlers.onError?.(payload.error || "Ticket connection failed");

  socketInstance.on("ticket:created", handleCreated);
  socketInstance.on("ticket:updated", handleUpdated);
  socketInstance.on("ticket_error", handleError);

  return () => {
    socketInstance.off("ticket:created", handleCreated);
    socketInstance.off("ticket:updated", handleUpdated);
    socketInstance.off("ticket_error", handleError);
  };
}
