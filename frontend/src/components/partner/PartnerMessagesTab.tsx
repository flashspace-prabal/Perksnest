import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { getMessageThread, saveMessageThread } from "@/lib/store";
import { useAuth } from "@/lib/auth";

const INITIAL_CONVERSATIONS = [
  {
    id: 1, name: "PerksNest Team", avatar: "P", preview: "Welcome to PerksNest Partner Program!",
    messages: [
      { id: 1, sender: "PerksNest Team", text: "Welcome to the PerksNest Partner Program! We're excited to have you on board. Your deals will be reviewed within 2-3 business days.", time: "2 days ago", read: true },
      { id: 2, sender: "PerksNest Team", text: "Pro tip: Partners who respond to inquiries within 24 hours see 40% higher conversion rates. Make sure to check your messages regularly!", time: "1 day ago", read: true },
    ]
  },
  {
    id: 2, name: "Revenue & Payouts", avatar: "R", preview: "Your first payout is ready",
    messages: [
      { id: 1, sender: "Revenue & Payouts", text: "Hi! Your first commission payout of $250 is ready to be processed. Please verify your payment details in Settings > Payouts to receive your funds.", time: "3 hours ago", read: false },
    ]
  },
  {
    id: 3, name: "Deal Support", avatar: "D", preview: "Optimization tips for your deals",
    messages: [
      { id: 1, sender: "Deal Support", text: "We noticed your latest deal has a high view-to-claim ratio. Here are a few tips to improve conversions: 1) Add a clear promo code, 2) Highlight the expiry date, 3) Include a short video demo if possible.", time: "5 hours ago", read: false },
    ]
  },
];

interface Message { id: number; sender: string; text: string; time: string; read: boolean; isOwn?: boolean; }
interface Conversation { id: number; name: string; avatar: string; preview: string; messages: Message[]; }

export const PartnerMessagesTab = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations — merge initial with any saved replies
  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(
        INITIAL_CONVERSATIONS.map(async conv => {
          const saved = await getMessageThread(conv.id);
          if (saved && saved.length > 0) return { ...conv, messages: saved };
          return conv;
        })
      );
      setConversations(results);
    };
    load();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedId, conversations]);

  const selectedConv = conversations.find(c => c.id === selectedId);
  const unreadCount = (conv: Conversation) => conv.messages.filter(m => !m.read && !m.isOwn).length;

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConv || !user) return;
    const msg: Message = {
      id: Date.now(),
      sender: user.name,
      text: newMessage.trim(),
      time: "just now",
      read: true,
      isOwn: true,
    };
    const updated = conversations.map(c =>
      c.id === selectedId ? { ...c, messages: [...c.messages, msg], preview: newMessage.trim() } : c
    );
    setConversations(updated);
    // Persist
    const conv = updated.find(c => c.id === selectedId);
    if (conv) saveMessageThread({ conversationId: selectedId, messages: conv.messages });
    setNewMessage("");
  };

  const handleSelect = (id: number) => {
    setSelectedId(id);
    // Mark as read
    const updated = conversations.map(c =>
      c.id === id ? { ...c, messages: c.messages.map(m => ({ ...m, read: true })) } : c
    );
    setConversations(updated);
    const conv = updated.find(c => c.id === id);
    if (conv) saveMessageThread({ conversationId: id, messages: conv.messages });
  };

  return (
    <div className="flex h-[600px] border rounded-xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => {
            const uc = unreadCount(conv);
            return (
              <div key={conv.id}
                onClick={() => handleSelect(conv.id)}
                className={`flex items-start gap-3 p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${selectedId === conv.id ? "bg-muted" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">{conv.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{conv.name}</span>
                    {uc > 0 && <span className="h-5 w-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">{uc}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.preview}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="px-5 py-3 border-b flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{selectedConv.avatar}</div>
              <span className="font-semibold">{selectedConv.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selectedConv.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${msg.isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t flex gap-3">
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSend} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a conversation</div>
        )}
      </div>
    </div>
  );
};
