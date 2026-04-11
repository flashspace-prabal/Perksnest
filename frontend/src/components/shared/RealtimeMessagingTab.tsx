import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getMessages, getMessageThreads, markMessagesRead, sendMessage } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
  read?: boolean;
}

interface ThreadSummary {
  threadId: string;
  lastMessage: string;
  senderName: string;
  unread: number;
  updatedAt: string;
}

interface MessagingTabProps {
  portalRole: "partner" | "customer" | "admin";
}

export const RealtimeMessagingTab = ({ portalRole }: MessagingTabProps) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [activeThread, setActiveThread] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"live" | "syncing">("live");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAdmin = portalRole === "admin";
  const myThreadId = user ? `${portalRole}_${user.id}_admin` : "";

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const loadThreads = useCallback(async () => {
    if (!user) return;
    const response = await getMessageThreads();
    const list: ThreadSummary[] = response.threads || [];
    setThreads(list);

    if (!isAdmin) {
      setActiveThread(`${portalRole}_${user.id}_admin`);
    } else if (list.length > 0) {
      setActiveThread((current) => current || list[0].threadId);
    }
  }, [isAdmin, portalRole, user]);

  const loadMessages = useCallback(async (threadId: string) => {
    if (!threadId) return;
    const response = await getMessages(threadId);
    setMessages(response.messages || []);
    await markMessagesRead(threadId);
    scrollToBottom();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) {
      setActiveThread(`${portalRole}_${user.id}_admin`);
    }
    loadThreads();
  }, [user, isAdmin, portalRole, loadThreads]);

  useEffect(() => {
    if (activeThread) {
      loadMessages(activeThread);
    }
  }, [activeThread, portalRole, loadMessages]);

  useEffect(() => {
    if (!user) return;

    const fallbackPoll = setInterval(async () => {
      setConnectionStatus("syncing");
      await loadThreads();
      if (activeThread) {
        await loadMessages(activeThread);
      }
      setConnectionStatus("live");
    }, 30000);

    return () => clearInterval(fallbackPoll);
  }, [activeThread, user, loadMessages, loadThreads]);

  const handleSend = async () => {
    if (!newMsg.trim() || !user || !activeThread) return;

    setSending(true);
    try {
      const response = await sendMessage(activeThread, newMsg.trim());
      const message = response.message as Message;
      setMessages((prev) => prev.some((msg) => msg.id === message.id) ? prev : [...prev, message]);
      setNewMsg("");
      await loadThreads();
      setConnectionStatus("live");
      scrollToBottom();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[500px] bg-background border rounded-xl overflow-hidden">
      <div className="w-52 border-r flex flex-col shrink-0">
        <div className="p-3 border-b">
          <p className="font-semibold text-sm">{isAdmin ? "All Conversations" : "Messages"}</p>
          {isAdmin && <p className="text-xs text-muted-foreground">{threads.length} thread{threads.length !== 1 ? "s" : ""}</p>}
        </div>
        <div className="flex-1 overflow-y-auto">
          {isAdmin ? (
            threads.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center mt-8">No messages yet</div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.threadId}
                  onClick={() => setActiveThread(thread.threadId)}
                  className={`w-full text-left p-3 hover:bg-muted/50 transition-colors border-b ${activeThread === thread.threadId ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{thread.senderName}</p>
                    {thread.unread > 0 && <Badge className="bg-primary text-primary-foreground text-xs px-1.5 min-w-[18px] text-center">{thread.unread}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-xs px-1.5 py-0 rounded-full font-medium ${thread.threadId.startsWith("partner") ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                      {thread.threadId.startsWith("partner") ? "Partner" : "Customer"}
                    </span>
                    <span className="text-xs text-muted-foreground/50">{new Date(thread.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </button>
              ))
            )
          ) : (
            <button
              onClick={() => setActiveThread(myThreadId)}
              className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${activeThread === myThreadId ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">PN</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">PerksNest Support</p>
                  <p className="text-xs text-muted-foreground">Admin team</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {!activeThread ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-sm">{isAdmin ? (threads.find((thread) => thread.threadId === activeThread)?.senderName || "User") : "PerksNest Support"}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeThread.startsWith("partner") ? "bg-blue-100 text-blue-700" : activeThread.startsWith("customer") ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {activeThread.startsWith("partner") ? "Partner" : activeThread.startsWith("customer") ? "Customer" : "Admin"}
                </span>
                <span className="text-xs text-muted-foreground">support thread</span>
                <span className={`text-xs ${connectionStatus === "live" ? "text-green-600" : "text-amber-600"}`}>
                  {connectionStatus === "live" ? "Live" : "Syncing"}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No messages yet.</p>
                  {!isAdmin && <p className="text-xs mt-1 text-muted-foreground/70">Send a message. We typically reply within a few hours.</p>}
                </div>
              )}
              {messages.map((message) => {
                const isMe = message.sender_role === portalRole;
                return (
                  <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 shadow-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"}`}>
                      {!isMe && <p className="text-xs font-semibold mb-0.5 opacity-60">{message.sender_name}</p>}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${isMe ? "opacity-60 text-right" : "opacity-40"}`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  value={newMsg}
                  onChange={(event) => setNewMsg(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && !event.shiftKey && handleSend()}
                  placeholder={isAdmin ? "Reply..." : "Message PerksNest support..."}
                  className="flex-1"
                  disabled={sending}
                />
                <Button onClick={handleSend} disabled={sending || !newMsg.trim()} size="sm" className="gap-1.5 shrink-0">
                  <Send className="h-4 w-4" />{sending ? "..." : "Send"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
