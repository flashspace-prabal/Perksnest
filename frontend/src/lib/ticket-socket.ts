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

function getToken() {
  try {
    const session = JSON.parse(localStorage.getItem("pn_session") || "{}");
    return session.access_token || "";
  } catch {
    return "";
  }
}

export function getTicketSocket() {
  const token = getToken();
  if (!token) return null;

  if (socket?.connected && (socket.auth as any)?.token === token) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_BASE_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected to:", SOCKET_BASE_URL);
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
