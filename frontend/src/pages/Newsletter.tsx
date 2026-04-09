import { useState } from "react";
import { Mail, Zap, TrendingUp, Gift, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { subscribeToDigest, getDigestSubscribers } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const SAMPLE_ISSUES = [
  {
    number: 47,
    date: "Feb 24, 2026",
    subject: "🔥 7 new deals this week — Notion, Figma, and a hidden gem for API teams",
    preview: "This week: Notion's extended free trial is back, Figma adds a new startup plan, and we found a $500 credit deal for API-first teams...",
    dealCount: 7,
    savingsTotal: "$18,400",
  },
  {
    number: 46,
    date: "Feb 17, 2026",
    subject: "💰 Stripe, HubSpot, AWS — 3 mega deals before quarter end",
    preview: "Quarter-end deals are live. Stripe is offering 1 year free on Starter, HubSpot has their biggest deal ever, AWS credits are back...",
    dealCount: 5,
    savingsTotal: "$24,000",
  },
  {
    number: 45,
    date: "Feb 10, 2026",
    subject: "⚡ Valentine's special — free tools for early-stage founders",
    preview: "12 tools with free plans or extended trials specifically for pre-seed founders. No catch, no credit card required for most...",
    dealCount: 12,
    savingsTotal: "$8,200",
  },
];

const Newsletter = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [name, setName] = useState(user?.name || "");
  const [frequency, setFrequency] = useState<"weekly" | "monthly">("weekly");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSubscribers = getDigestSubscribers().length + 52381; // base count

  const handleSubscribe = async () => {
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    setLoading(true);
    const isNew = subscribeToDigest(email, name, frequency);
    await new Promise(r => setTimeout(r, 600));
    if (isNew) {
      setSubscribed(true);
      toast.success("You're subscribed! First issue lands next Monday 🎉");
    } else {
      toast.info("You're already subscribed!");
      setSubscribed(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-4">
              <Mail className="h-4 w-4" /> Weekly Digest
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">The best SaaS deals, every Monday</h1>
            <p className="text-primary-foreground/80 text-lg mb-2">
              Join <strong className="text-white">{totalSubscribers.toLocaleString()}+</strong> founders who get hand-picked deals, new tool launches, and exclusive discounts straight to their inbox.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
          {/* Subscribe card */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
            {!subscribed ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Subscribe — it's free</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)} />
                  <Input type="email" placeholder="you@startup.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  {(["weekly", "monthly"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all capitalize ${
                        frequency === f
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:border-primary"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <Button onClick={handleSubscribe} disabled={loading} className="w-full gap-2 h-11">
                  {loading ? "Subscribing..." : <><Mail className="h-4 w-4" /> Subscribe for Free</>}
                </Button>
                <p className="text-xs text-center text-muted-foreground">No spam, ever. Unsubscribe in one click.</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">You're in! 🎉</h2>
                <p className="text-muted-foreground">Your first digest will arrive next Monday. Check your inbox for a confirmation.</p>
              </div>
            )}
          </div>

          {/* What you get */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Curated weekly", desc: "Hand-picked deals reviewed by our team — only the best make the cut." },
              { icon: TrendingUp, title: "Early access", desc: "Subscribers get 24-hour early access to new deals before they go public." },
              { icon: Gift, title: "Exclusive bonuses", desc: "Newsletter-only deals that never appear on the public marketplace." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-5">
                <Icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Past issues */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent issues</h2>
            <div className="space-y-3">
              {SAMPLE_ISSUES.map(issue => (
                <div key={issue.number} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">{issue.subject}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Issue #{issue.number} · {issue.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="secondary" className="text-xs">{issue.dealCount} deals</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{issue.preview}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">Avg savings: <strong className="text-foreground">{issue.savingsTotal}</strong></span>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1 ml-auto">
                      Read issue <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Newsletter;
