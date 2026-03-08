import { useState, useEffect } from "react";
import { Gift, Copy, Check, Twitter, Linkedin, Mail, DollarSign, Users, TrendingUp, LogIn, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/lib/auth";
import { getReferralsByUser, trackReferral } from "@/lib/store";
import { toast } from "sonner";

const REWARD_PER_REFERRAL = 20;

const TIERS = [
  { name: "Starter", min: 0, max: 4, color: "bg-muted text-muted-foreground", reward: "$20/referral" },
  { name: "Champion", min: 5, max: 14, color: "bg-primary/10 text-primary", reward: "$25/referral" },
  { name: "Legend", min: 15, max: Infinity, color: "bg-yellow-100 text-yellow-700", reward: "$30/referral" },
];

const Invite = () => {
  // SEO: unique page title
  document.title = "Refer & Earn $20 Credit | PerksNest";

  const { user, isAuthenticated } = useAuth();
  useEffect(() => { if (user) getReferralsByUser(user.id).then(setMyReferrals); }, [user?.id]);
  const [copied, setCopied] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);

  const referralCode = user?.referralCode || "";
  const referralLink = user ? `${window.location.origin}/login?ref=${referralCode}` : "";
  const [myReferrals, setMyReferrals] = useState<import("@/lib/store").ReferralEntry[]>([]);
  const converted = myReferrals.filter(r => r.status === "converted" || r.status === "paid");
  const pending = myReferrals.filter(r => r.status === "pending");
  const totalEarned = converted.length * REWARD_PER_REFERRAL;
  const currentTier = TIERS.find(t => converted.length >= t.min && converted.length <= t.max) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];

  const handleCopy = () => {
    if (!isAuthenticated) { setShowAuthModal(true); return; }
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async () => {
    if (!isAuthenticated || !user) { setShowAuthModal(true); return; }
    if (!inviteEmail.includes("@")) { toast.error("Enter a valid email"); return; }
    setSending(true);
    trackReferral(referralCode, user.id, user.name, inviteEmail);
    toast.success(`Invite tracked for ${inviteEmail}!`);
    setInviteEmail("");
    setSending(false);
  };

  const handleShare = (platform: string) => {
    if (!isAuthenticated) { setShowAuthModal(true); return; }
    const message = "I've been saving thousands on SaaS tools with PerksNest. Get $20 credit when you sign up with my link:";
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(referralLink);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=Save thousands on SaaS with PerksNest&body=${encodedMessage}%0A%0A${encodedUrl}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-4">
              <Gift className="h-4 w-4" /> Referral Program
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Invite friends, earn rewards</h1>
            <p className="text-primary-foreground/80 text-lg">
              Get <strong className="text-white">$20 credit</strong> for every friend who signs up for PerksNest Premium.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          {/* Stats row */}
          {isAuthenticated && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Total Invited", value: myReferrals.length },
                { icon: Check, label: "Converted", value: converted.length },
                { icon: TrendingUp, label: "Pending", value: pending.length },
                { icon: DollarSign, label: "Earned", value: `$${totalEarned}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <Icon className="h-5 w-5 text-primary mx-auto mb-1" />
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tier badge */}
          {isAuthenticated && (
            <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${currentTier.color}`}>
                {currentTier.name} Tier
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">You're earning <strong>{currentTier.reward}</strong></p>
                {nextTier && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {nextTier.min - converted.length} more conversion{nextTier.min - converted.length !== 1 ? 's' : ''} to reach <strong>{nextTier.name}</strong> ({nextTier.reward})
                  </p>
                )}
                {!nextTier && <p className="text-xs text-muted-foreground mt-0.5">You've reached the top tier! 🎉</p>}
              </div>
              <Star className="h-5 w-5 text-yellow-500 shrink-0 hidden sm:block" />
            </div>
          )}

          {/* Public CTA for logged-out users */}
          {!isAuthenticated && (
            <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 text-center space-y-4">
              <div className="text-5xl">🎁</div>
              <h2 className="text-2xl font-bold text-foreground">Earn $20 for every friend you refer</h2>
              <p className="text-muted-foreground max-w-md mx-auto">Sign up for PerksNest and get a unique referral link. When your friends upgrade to Pro, you both earn $20 credit — no limits.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a href="/signup" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  Get your referral link →
                </a>
                <a href="/login" className="inline-flex items-center justify-center gap-2 border border-primary text-primary font-medium px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors">
                  Already a member? Sign in
                </a>
              </div>
              <p className="text-xs text-muted-foreground">Join 1,200+ members already earning referral credits</p>
            </div>
          )}

          {/* Referral link */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Your referral link</h2>
            {isAuthenticated ? (
              <>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground font-mono truncate"
                  />
                  <Button onClick={handleCopy} className="shrink-0 gap-2">
                    {copied ? <><Check className="h-4 w-4" />Copied!</> : <><Copy className="h-4 w-4" />Copy Link</>}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-sm text-muted-foreground self-center">Share via:</span>
                  <button onClick={() => handleShare("twitter")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-sm font-medium transition-colors">
                    <Twitter className="h-4 w-4 text-sky-500" /> Twitter / X
                  </button>
                  <button onClick={() => handleShare("linkedin")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-sm font-medium transition-colors">
                    <Linkedin className="h-4 w-4 text-blue-600" /> LinkedIn
                  </button>
                  <button onClick={() => handleShare("email")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary text-sm font-medium transition-colors">
                    <Mail className="h-4 w-4 text-muted-foreground" /> Email
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Sign in to get your personal referral link</p>
                <Button onClick={() => setShowAuthModal(true)} className="gap-2">
                  <LogIn className="h-4 w-4" /> Sign In to Get Link
                </Button>
              </div>
            )}
          </div>

          {/* Send invite by email */}
          {isAuthenticated && (
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Invite by email</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="friend@startup.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendInvite()}
                  className="flex-1"
                />
                <Button onClick={handleSendInvite} disabled={sending} className="shrink-0 gap-2">
                  <Mail className="h-4 w-4" /> {sending ? "Sending..." : "Send Invite"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">We'll track this referral. You earn $20 when they convert to Premium.</p>
            </div>
          )}

          {/* Referral history */}
          {isAuthenticated && myReferrals.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Referral history</h2>
              <div className="space-y-2">
                {myReferrals.map((ref, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{ref.referreeEmail}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ref.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={ref.status === "converted" || ref.status === "paid" ? "default" : "secondary"}>
                      {ref.status === "converted" ? `+$${ref.creditAmount}` : ref.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Share your link", desc: "Copy your unique referral link and share it with founders, startup teams, or anyone who needs SaaS tools." },
                { step: "2", title: "They sign up", desc: "Your friend joins PerksNest and upgrades to a paid plan using your referral link." },
                { step: "3", title: "You earn $20", desc: "Once they convert, $20 credit is added to your account automatically. No limits!" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-3">{step}</div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tier table */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Reward tiers</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-semibold text-muted-foreground">Tier</th>
                    <th className="text-left py-2 font-semibold text-muted-foreground">Conversions needed</th>
                    <th className="text-left py-2 font-semibold text-muted-foreground">Reward per referral</th>
                  </tr>
                </thead>
                <tbody>
                  {TIERS.map(tier => (
                    <tr key={tier.name} className={`border-b border-border last:border-0 ${currentTier.name === tier.name && isAuthenticated ? "bg-primary/5" : ""}`}>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${tier.color}`}>{tier.name}</span>
                        {currentTier.name === tier.name && isAuthenticated && <span className="ml-2 text-xs text-primary font-medium">← you</span>}
                      </td>
                      <td className="py-3 text-muted-foreground">{tier.min === 0 ? "0–4" : tier.max === Infinity ? `${tier.min}+` : `${tier.min}–${tier.max}`}</td>
                      <td className="py-3 font-semibold text-foreground">{tier.reward}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default Invite;
