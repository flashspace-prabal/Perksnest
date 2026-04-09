import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getMessages, sendMessage, getThreadList, markThreadRead, Message } from "@/lib/store";

interface MessagingTabProps {
  portalRole: "partner" | "customer" | "admin";
}

export const MessagingTab = ({ portalRole }: MessagingTabProps) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isAdmin = portalRole === "admin";
  const myThreadId = user ? `${portalRole}_${user.id}_admin` : "";

  const loadThreads = async () => {
    if (!user) return;
    const list = await getThreadList(user.id, portalRole);
    setThreads(list);
    if (!isAdmin) {
      // Always set to own thread — even if no messages yet
      const tid = `${portalRole}_${user.id}_admin`;
      setActiveThread(tid);
    } else if (isAdmin && list.length > 0 && !activeThread) {
      setActiveThread(list[0].threadId);
    }
  };

  const loadMessages = async (threadId: string) => {
    if (!threadId) return;
    const msgs = await getMessages(threadId);
    setMessages(msgs);
    await markThreadRead(threadId, portalRole);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    if (user && !isAdmin) {
      setActiveThread(`${portalRole}_${user.id}_admin`);
    }
    loadThreads();
  }, [user]);
  useEffect(() => { if (activeThread) loadMessages(activeThread); }, [activeThread]);
  useEffect(() => {
    const iv = setInterval(() => { if (activeThread) loadMessages(activeThread); loadThreads(); }, 8000);
    return () => clearInterval(iv);
  }, [activeThread]);

  const handleSend = async () => {
    if (!newMsg.trim() || !user || !activeThread) return;
    setSending(true);
    await sendMessage({ threadId: activeThread, senderId: user.id, senderName: user.name, senderRole: portalRole, content: newMsg.trim() });
    setNewMsg("");
    await loadMessages(activeThread);
    await loadThreads();
    setSending(false);
  };

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[500px] bg-background border rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 border-r flex flex-col shrink-0">
        <div className="p-3 border-b">
          <p className="font-semibold text-sm">{isAdmin ? "All Conversations" : "Messages"}</p>
          {isAdmin && <p className="text-xs text-muted-foreground">{threads.length} thread{threads.length !== 1 ? "s" : ""}</p>}
        </div>
        <div className="flex-1 overflow-y-auto">
          {isAdmin ? (
            threads.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center mt-8">No messages yet</div>
            ) : threads.map(t => (
              <button key={t.threadId} onClick={() => setActiveThread(t.threadId)}
                className={`w-full text-left p-3 hover:bg-muted/50 transition-colors border-b ${activeThread === t.threadId ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{t.senderName}</p>
                  {t.unread > 0 && <Badge className="bg-primary text-primary-foreground text-xs px-1.5 min-w-[18px] text-center">{t.unread}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{t.lastMessage}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-xs px-1.5 py-0 rounded-full font-medium ${t.threadId.startsWith("partner") ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {t.threadId.startsWith("partner") ? "Partner" : "Customer"}
                  </span>
                  <span className="text-xs text-muted-foreground/50">{new Date(t.updatedAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
                </div>
              </button>
            ))
          ) : (
            <button onClick={() => setActiveThread(myThreadId)}
              className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${activeThread === myThreadId ? "bg-primary/10 border-l-2 border-l-primary" : ""}`}>
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

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeThread ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a conversation</p>
            </div>
          </div>
        ) : <>
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm">{isAdmin ? (threads.find(t=>t.threadId===activeThread)?.senderName || "User") : "PerksNest Support"}</p>
            <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeThread.startsWith("partner") ? "bg-blue-100 text-blue-700" : activeThread.startsWith("customer") ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                  {activeThread.startsWith("partner") ? "🤝 Partner" : activeThread.startsWith("customer") ? "🎁 Customer" : "Admin"}
                </span>
                <span className="text-xs text-muted-foreground">support thread</span>
              </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-10">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No messages yet.</p>
                {!isAdmin && <p className="text-xs mt-1 text-muted-foreground/70">Send a message — we typically reply within a few hours.</p>}
              </div>
            )}
            {messages.map(msg => {
              const isMe = msg.senderRole === portalRole;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 shadow-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"}`}>
                    {!isMe && <p className="text-xs font-semibold mb-0.5 opacity-60">{msg.senderName}</p>}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? "opacity-60 text-right" : "opacity-40"}`}>{new Date(msg.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t bg-background">
            <div className="flex gap-2">
              <Input value={newMsg} onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={isAdmin ? "Reply..." : "Message PerksNest support..."} className="flex-1" disabled={sending} />
              <Button onClick={handleSend} disabled={sending || !newMsg.trim()} size="sm" className="gap-1.5 shrink-0">
                <Send className="h-4 w-4" />{sending ? "..." : "Send"}
              </Button>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
};
