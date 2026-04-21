import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { isPremiumDeal } from "@/lib/deal-types";

/**
 * Hook to handle premium deal access control
 */
export function usePremiumDealAccess(dealId: string) {
  const { user, isAuthenticated } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const isMUserPremium = user?.plan === "premium" || user?.plan === "enterprise";
  const isPremium = isPremiumDeal(dealId);
  const hasAccess = !isPremium || isMUserPremium;
  const canClaim = isAuthenticated && (!isPremium || isMUserPremium);

  const handleClaimClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // If not authenticated, show auth modal (handled by auth system)
    if (!isAuthenticated) {
      return;
    }

    // If premium deal and user not premium, show modal
    if (isPremium && !isMUserPremium) {
      setShowPremiumModal(true);
      return;
    }

    // Otherwise allow claim (normal flow)
  };

  const handleUpgrade = () => {
    // Navigate to pricing/upgrade page
    window.location.href = "/pricing";
  };

  return {
    isPremium,
    isPremium,
    canClaim,
    hasAccess,
    showPremiumModal,
    setShowPremiumModal,
    handleClaimClick,
    handleUpgrade,
  };
}
