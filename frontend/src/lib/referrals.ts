export const REFERRAL_STORAGE_KEY = "pn_referral_code";

export function normalizeReferralCode(code?: string | null): string {
  return (code || "").trim().toUpperCase();
}

export function storeReferralCode(code?: string | null): void {
  const normalized = normalizeReferralCode(code);
  if (!normalized) return;
  localStorage.setItem(REFERRAL_STORAGE_KEY, normalized);
}

export function getStoredReferralCode(): string | undefined {
  const code = localStorage.getItem(REFERRAL_STORAGE_KEY);
  return code ? normalizeReferralCode(code) : undefined;
}

export function clearStoredReferralCode(): void {
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}

export function buildReferralLink(code: string, origin = window.location.origin): string {
  return `${origin}/ref/${normalizeReferralCode(code)}`;
}
