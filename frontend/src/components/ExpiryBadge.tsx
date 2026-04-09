import { Clock, AlertTriangle } from "lucide-react";
import { getExpiryLabel } from "@/data/deals";

interface ExpiryBadgeProps {
  expiresAt?: string;
  size?: "sm" | "md";
}

const ExpiryBadge = ({ expiresAt, size = "sm" }: ExpiryBadgeProps) => {
  const info = getExpiryLabel(expiresAt);
  if (!info) return null;

  const base = size === "sm"
    ? "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium"
    : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium";

  if (info.urgent) {
    return (
      <span className={`${base} bg-red-50 text-red-600 border border-red-200`}>
        <AlertTriangle className={size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
        {info.label}
      </span>
    );
  }

  return (
    <span className={`${base} bg-amber-50 text-amber-700 border border-amber-200`}>
      <Clock className={size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
      {info.label}
    </span>
  );
};

export default ExpiryBadge;
