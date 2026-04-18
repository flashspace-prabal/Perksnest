import { User, UserPlan, UserRole } from './auth';
import { API_BASE_URL } from '@/lib/runtime';

const STORAGE_KEY = 'perksnest_user_id';
const SESSION_COOKIE_NAME = 'pn_session';

type AppSession = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user_id?: string;
  auth_user_id?: string;
};

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

function readStoredSession(): AppSession {
  try {
    const sessionJson = getCookie(SESSION_COOKIE_NAME);
    return sessionJson ? JSON.parse(sessionJson) : {};
  } catch {
    return {};
  }
}

async function authApi<T>(path: string, method = "GET", body?: unknown, userId?: string): Promise<T> {
  const session = readStoredSession();
  const resolvedUserId = userId || localStorage.getItem(STORAGE_KEY) || session.user_id;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(resolvedUserId ? { "x-user-id": resolvedUserId } : {}),
      ...(userId ? { "x-user-id": userId } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return payload;
}

const rowToUser = (row: Record<string, unknown>): User => ({
  id: row.id as string,
  email: row.email as string,
  name: (row.name as string) || (row.email as string)?.split('@')[0] || 'User',
  plan: ((row.plan as UserPlan) || 'free'),
  role: ((row.role as UserRole) || 'customer'),
  referralCode: (row.referralCode as string) || (row.referral_code as string) || '',
  referralCount: (row.referralCount as number) || (row.referral_count as number) || 0,
  claimedDeals: (row.claimedDeals as string[]) || (row.claimed_deals as string[]) || [],
  createdAt: (row.createdAt as string) || (row.created_at as string) || new Date().toISOString(),
  roles: (row.roles as string[]) || [((row.role as string) || 'customer')],
  status: (row.status as string) || 'active',
  avatar: (row.avatar as string) || null,
});

export async function getAllUsers(): Promise<User[]> {
  const response = await authApi<{ users: Record<string, unknown>[] }>("/api/admin/users?page=1&limit=1000");
  return (response.users || []).map(rowToUser);
}

export async function sendVerificationEmail(email: string, name: string): Promise<void> {
  await authApi("/api/auth/send-verification", "POST", { email, name });
}

export async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const response = await authApi<{ verified?: boolean }>("/api/auth/verify-email", "POST", { email, code });
  return !!response.verified;
}
