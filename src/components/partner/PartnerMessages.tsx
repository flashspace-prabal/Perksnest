import { useState } from "react";
import { 
  MessageSquare, Search, Send, Paperclip, MoreVertical, 
  CheckCheck, Clock, User, Bell, Star, Archive, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

const conversations = [
  { 
    id: 1, 
    sender: "PerksNest Support", 
    avatar: "🎯", 
    lastMessage: "Your deal 'Notion Pro - 6 Months Free' has been approved!", 
    time: "10 min ago", 
    unread: true,
    type: "system"
  },
  { 
    id: 2, 
    sender: "Account Manager", 
    avatar: "👤", 
    lastMessage: "Hi! Just wanted to check in on your Q1 performance goals...", 
    time: "2 hours ago", 
    unread: true,
    type: "support"
  },
  { 
    id: 3, 
    sender: "PerksNest Platform", 
    avatar: "🔔", 
    lastMessage: "New feature: You can now schedule deal expiration dates", 
    time: "Yesterday", 
    unread: false,
    type: "announcement"
  },
  { 
    id: 4, 
    sender: "Billing Team", 
    avatar: "💳", 
    lastMessage: "Your January commission of $3,680 has been processed", 
    time: "3 days ago", 
    unread: false,
    type: "billing"
  },
];

const selectedConversation = {
  id: 1,
  messages: [
    { id: 1, sender: "system", text: "Your deal submission has been received and is under review.", time: "Jan 20, 10:00 AM", read: true },
    { id: 2, sender: "system", text: "Great news! Your deal 'Notion Pro - 6 Months Free' has been approved and is now live on PerksNest!", time: "Jan 20, 2:30 PM", read: true },
    { id: 3, sender: "user", text: "Thank you! How can I track the performance of this deal?", time: "Jan 20, 3:15 PM", read: true },
    { id: 4, sender: "system", text: "You can view all analytics in the Analytics tab of your Partner Portal. There you'll find views, claims, conversions, and revenue data in real-time.", time: "Jan 20, 3:20 PM", read: true },
    { id: 5, sender: "system", text: "Pro tip: Deals with detailed descriptions and clear value propositions tend to perform 25% better!", time: "Jan 20, 3:21 PM", read: false },
  ]
};

export const PartnerMessages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-muted-foreground">Communicate with the PerksNest team</p>
        </div>
        <Badge className="bg-primary text-primary-foreground">
          {conversations.filter(c => c.unread).length} unread
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              <div className="divide-y">
                {conversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => setSelectedChat(convo.id)}
                    className={`w-full py-4 pl-4 pr-6 text-left hover:bg-muted/50 transition-colors ${
                      selectedChat === convo.id ? "bg-primary/5 border-l-2 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl flex-shrink-0">
                        {convo.avatar}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="font-medium truncate flex-1 min-w-0 pr-2">{convo.sender}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 ml-auto">{convo.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-normal break-words leading-snug line-clamp-2">
                          {convo.lastMessage}
                        </p>
                      </div>
                      {convo.unread && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <p className="font-medium">PerksNest Support</p>
                  <p className="text-xs text-muted-foreground">Deal approval & platform updates</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${msg.sender === "user" ? "order-2" : ""}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                      msg.sender === "user" ? "justify-end" : ""
                    }`}>
                      <span>{msg.time}</span>
                      {msg.sender === "user" && (
                        msg.read ? <CheckCheck className="h-3 w-3 text-primary" /> : <Clock className="h-3 w-3" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input 
                placeholder="Type your message..." 
                className="flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Contact Support</p>
                  <p className="text-xs text-muted-foreground">Get help with your account</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Account Manager</p>
                  <p className="text-xs text-muted-foreground">Schedule a call</p>
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Manage preferences</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
