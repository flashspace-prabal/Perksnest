import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { normalizeReferralCode, storeReferralCode } from "@/lib/referrals";

export default function ReferralRedirect() {
  const navigate = useNavigate();
  const { referralCode } = useParams<{ referralCode: string }>();

  useEffect(() => {
    const normalizedCode = normalizeReferralCode(referralCode);
    if (!normalizedCode) {
      navigate("/signup", { replace: true });
      return;
    }

    storeReferralCode(normalizedCode);
    navigate(`/signup?ref=${encodeURIComponent(normalizedCode)}`, { replace: true });
  }, [navigate, referralCode]);

  return null;
}
