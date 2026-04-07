import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Trophy, ArrowRight, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import UpvoteButton from "@/components/UpvoteButton";
import ExpiryBadge from "@/components/ExpiryBadge";
import { dealsData } from "@/data/deals";
import { getUpvoteCount } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const MEDAL: Record<number, string> = { 0: "🥇", 1: "🥈", 2: "🥉" };

const Leaderboard = () => {
  const ranked = useMemo(() =>
    [...dealsData]
      .map(d => ({ ...d, votes: getUpvoteCount(d.id) }))
      .sort((a, b) => b.votes - a.votes),
    []
  );

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1">
        <section className="bg-primary text-primary-foreground py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full mb-4">
              <Trophy className="h-4 w-4" /> Community Leaderboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Most popular deals</h1>
            <p className="text-primary-foreground/80 text-lg">Ranked by community upvotes. Updated in real time.</p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
          {/* Top 3 podium */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((deal, i) => (
              <Link key={deal.id} to={`/deals/${deal.id}`}
                className={`bg-card border rounded-2xl p-5 hover:shadow-md transition-all text-center ${i === 0 ? "border-yellow-300 ring-2 ring-yellow-200" : "border-border"}`}>
                <div className="text-3xl mb-2">{MEDAL[i]}</div>
                <SafeImage src={deal.logo} alt={deal.name} className="w-12 h-12 rounded-xl mx-auto mb-2 object-contain" />
                <h3 className="font-semibold text-foreground">{deal.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{deal.dealText}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-primary font-bold">
                  <TrendingUp className="h-4 w-4" /> {deal.votes} votes
                </div>
              </Link>
            ))}
          </div>

          {/* Full ranking */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/40">
              <h2 className="font-semibold text-foreground text-sm">Full Rankings</h2>
            </div>
            {ranked.map((deal, i) => (
              <Link key={deal.id} to={`/deals/${deal.id}`}
                className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                <span className="text-sm font-bold text-muted-foreground w-6 text-center">
                  {MEDAL[i] || `${i + 1}`}
                </span>
                <SafeImage src={deal.logo} alt={deal.name} className="w-8 h-8 rounded-lg object-contain shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground text-sm">{deal.name}</span>
                    {deal.isFree && <Badge variant="secondary" className="text-xs">Free</Badge>}
                    <ExpiryBadge expiresAt={deal.expiresAt} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{deal.dealText}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-primary">{deal.votes}</span>
                  <UpvoteButton dealId={deal.id} compact />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
