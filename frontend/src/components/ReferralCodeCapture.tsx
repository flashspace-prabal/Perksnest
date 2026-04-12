import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { storeReferralCode, normalizeReferralCode } from "@/lib/referrals";
import { trackReferralClick } from "@/lib/api";

const TRACKED_SESSION_KEY = "pn_ref_click_tracked";

/**
 * Global component that captures `?ref=CODE` from any page URL.
 * Stores the referral code in localStorage and tracks the click
 * in the referral_clicks table. Prevents duplicate click tracking
 * within the same browser session via sessionStorage.
 */
export default function ReferralCodeCapture() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const rawCode = searchParams.get("ref");
    const code = normalizeReferralCode(rawCode);
    if (!code) return;

    // Always persist the code so signup can use it
    storeReferralCode(code);

    // Track click only once per session to avoid inflating counts
    const alreadyTracked = sessionStorage.getItem(TRACKED_SESSION_KEY);
    if (alreadyTracked === code) return;

    sessionStorage.setItem(TRACKED_SESSION_KEY, code);
    trackReferralClick({ code, source: "direct" }).catch(() => {});
  }, [searchParams]);

  return null;
}
