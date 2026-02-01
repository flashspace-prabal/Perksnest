import { useState } from "react";
import { Gift, X } from "lucide-react";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-3 px-4 relative">
      <div className="container-wide flex items-center justify-center gap-3 text-sm">
        <Gift className="h-4 w-4" />
        <span>
          Get <span className="font-semibold">30% off</span> on our Premium membership! Promo code: <span className="font-bold">30SECRET</span> - offer ends in{" "}
          <span className="font-bold">6d 23h 59m 55s</span>
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:bg-primary-foreground/10 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
