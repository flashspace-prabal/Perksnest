export type AdminUser = {
  id: string;
  email: string;
  name: string;
  plan: string;
  role: string;
  roles?: string[];
  referralCode?: string;
  referralCount?: number;
  claimedDeals?: string[];
  status?: string;
  avatar?: string | null;
  createdAt?: string;
  created_at?: string;
  notes?: string;
  email_verified?: boolean;
};

export type AdminPartnerDeal = {
  id: string;
  partnerId: string;
  partnerName: string;
  name: string;
  description: string;
  dealText: string;
  savings: string;
  category: string;
  websiteUrl?: string;
  logoUrl?: string;
  promoCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string | null;
  createdAt: string;
  approvedAt?: string | null;
  views?: number;
  claims?: number;
};

export type AdminPlatformDeal = {
  id: string;
  name: string;
  description?: string;
  dealText?: string;
  savings?: string;
  category?: string;
  isFree?: boolean;
  active?: boolean;
  logo?: string;
  link?: string;
  created_at?: string;
  claims?: number;
};

export type AdminWhiteLabelClient = {
  id: string;
  company: string;
  domain: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  members: number;
  monthlyFee: number;
  status: 'Active' | 'Pending';
  contactEmail: string;
  createdAt?: string;
};

export function parseMoney(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const cleaned = value.replace(/[^0-9.-]+/g, '');
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(amount: number, currency: 'USD' | 'INR' = 'USD') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount >= 1000 ? 0 : 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatCompactCurrency(amount: number, currency: 'USD' | 'INR' = 'USD') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatSessionDuration(minutes?: number | null) {
  if (!minutes || minutes <= 0) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export function relativeDateLabel(value?: string) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN');
}

export function normalizeTier(rawTier?: string | null, dealCount = 0, claims = 0) {
  const tier = String(rawTier || '').trim().toLowerCase();
  if (tier === 'enterprise' || tier === 'premium') return 'Premium';
  if (tier === 'growth') return 'Growth';
  if (dealCount >= 5 || claims >= 100) return 'Premium';
  if (dealCount >= 2 || claims >= 25) return 'Growth';
  return 'Starter';
}
