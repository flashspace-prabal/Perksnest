import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { toggleUpvote, getUpvoteCount, hasUpvoted } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface UpvoteButtonProps {
  dealId: string;
  compact?: boolean;
}

const UpvoteButton = ({ dealId, compact = false }: UpvoteButtonProps) => {
  const { user, isAuthenticated } = useAuth();
  const [count, setCount] = useState(() => getUpvoteCount(dealId));
  const [voted, setVoted] = useState(() => user ? hasUpvoted(dealId, user.id) : false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || !user) {
      toast.error("Sign in to upvote deals");
      return;
    }
    const nowVoted = toggleUpvote(dealId, user.id);
    setVoted(nowVoted);
    setCount(getUpvoteCount(dealId));
    if (nowVoted) toast.success("Upvoted!");
  };

  if (compact) {
    return (
      <button
        onClick={handleUpvote}
        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
          voted
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
        }`}
      >
        <ArrowUp className="h-3 w-3" />
        <span>{count > 0 ? count : "0"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleUpvote}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border-2 transition-all min-w-[52px] ${
        voted
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
      }`}
    >
      <ArrowUp className="h-4 w-4" />
      <span className="text-sm font-bold leading-none">{count}</span>
    </button>
  );
};

export default UpvoteButton;
