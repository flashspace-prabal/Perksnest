import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabaseAuth } from "./supabase";
import { clearStoredReferralCode, getStoredReferralCode } from "@/lib/referrals";
import { API_BASE_URL } from "@/lib/runtime";
import { refetchUserClaimedDeals } from "@/lib/api";

export type UserPlan = 'free' | 'premium' | 'enterprise';
export type UserRole = 'customer' | 'partner' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  role: UserRole;
  referralCode: string;
  referralCount: number;
  claimedDeals: string[];
  roles?: string[];
  avatar?: string | null;
  status?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isPartner: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, referrerCode?: string) => Promise<boolean>;
  logout: () => void;
  updatePlan: (plan: UserPlan) => Promise<void>;
  claimDeal: (dealId: string) => Promise<void>;
  refetchClaimedDeals: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'perksnest_user_id';
const SESSION_COOKIE_NAME = 'pn_session';

type AppSession = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  user_id?: string;
  auth_user_id?: string;
};

// Cookie management functions
function setCookie(name: string, value: string, days: number = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

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

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function readStoredSession(): AppSession {
  try {
    const sessionJson = getCookie(SESSION_COOKIE_NAME);
    return sessionJson ? JSON.parse(sessionJson) : {};
  } catch {
    return {};
  }
}

function storeSession(session?: AppSession | null) {
  if (!session?.access_token) {
    deleteCookie(SESSION_COOKIE_NAME);
    return;
  }

  setCookie(SESSION_COOKIE_NAME, JSON.stringify(session), 7);
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Setup listener FIRST before any async operations
    // This ensures we catch OAuth state changes immediately
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in with OAuth - sync with backend
        // Clear the logout flag when signing in
        localStorage.removeItem('perksnest_logged_out');
        
        const email = session.user.email?.toLowerCase().trim();
        const name = session.user.user_metadata?.full_name 
          || session.user.user_metadata?.name 
          || email?.split('@')[0] 
          || 'User';
        const avatar = session.user.user_metadata?.avatar_url || null;

        // Always store the Supabase OAuth token for authenticated API calls
        if (session.access_token) {
          storeSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token || undefined,
            expires_in: session.expires_in,
            token_type: session.token_type,
          });
        }

        try {
          const syncResponse = await fetch(`${API_BASE_URL}/api/auth/oauth-sync`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              // Include token so backend can verify this is a valid Supabase user
              ...(session.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
            },
            body: JSON.stringify({
              email,
              name,
              avatar,
              authUserId: session.user.id,
            }),
          });
          
          const syncData = await syncResponse.json().catch(() => null);
          if (syncResponse.ok && syncData?.user) {
            const nextUser = rowToUser(syncData.user);
            setUser(nextUser);
            localStorage.setItem(STORAGE_KEY, nextUser.id);
            // If backend returns a different token, use that instead
            if (syncData.session?.access_token) {
              storeSession(syncData.session);
            }
          }
        } catch (err) {
          console.error('OAuth sync error:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        deleteCookie(SESSION_COOKIE_NAME);
      }
    });

    // Now initialize auth state
    const initializeAuth = async () => {
      try {
        // Check stored session first (works for both email and OAuth)
        const session = readStoredSession();
        const userId = localStorage.getItem(STORAGE_KEY) || session.user_id;
        
        // Also check Supabase session for OAuth cases
        const { data: supabaseSession } = await supabaseAuth.auth.getSession();
        
        if (!userId && !session.access_token && !supabaseSession.session?.user) {
          // No session anywhere
          setIsLoading(false);
          return;
        }

        // Fetch user from backend (this works for both email and OAuth)
        try {
          const response = await authApi<{ success: boolean; user: Record<string, unknown> }>(
            "/api/auth/me",
            "GET",
            undefined,
            userId || undefined
          );
          if (response.user) {
            const nextUser = rowToUser(response.user);
            setUser(nextUser);
            if (!localStorage.getItem(STORAGE_KEY)) {
              localStorage.setItem(STORAGE_KEY, nextUser.id);
            }
          }
        } catch (err) {
          console.error('Failed to fetch user:', err);
          // Clear storage if fetch fails
          localStorage.removeItem(STORAGE_KEY);
          deleteCookie(SESSION_COOKIE_NAME);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi<{ success: boolean; user: Record<string, unknown>; session?: AppSession }>(
        "/api/auth/login",
        "POST",
        { email, password }
      );
      const u = rowToUser(response.user);
      setUser(u);
      localStorage.setItem(STORAGE_KEY, u.id);
      storeSession(response.session);
      localStorage.removeItem('perksnest_logged_out');
      return true;
    } catch {
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    referrerCode?: string
  ): Promise<boolean> => {
    const normalizedReferrerCode = referrerCode || getStoredReferralCode();
    try {
      const response = await authApi<{ success: boolean; user: Record<string, unknown>; session?: AppSession }>(
        "/api/auth/register",
        "POST",
        { email, password, name, referrerCode: normalizedReferrerCode }
      );
      const u = rowToUser(response.user);
      setUser(u);
      localStorage.setItem(STORAGE_KEY, u.id);
      storeSession(response.session);
      localStorage.removeItem('perksnest_logged_out');
      if (normalizedReferrerCode) clearStoredReferralCode();
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      deleteCookie(SESSION_COOKIE_NAME);
      localStorage.setItem('perksnest_logged_out', 'true');
      await supabaseAuth.auth.signOut().catch((err: unknown) => {
        console.error('Supabase sign out error:', err);
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updatePlan = async (plan: UserPlan) => {
    if (!user) throw new Error('User not authenticated');
    const response = await authApi<{ success: boolean; user: Record<string, unknown> }>(
      "/api/auth/plan",
      "PATCH",
      { plan },
      user.id
    );
    setUser(rowToUser(response.user));
  };

  const claimDeal = async (dealId: string) => {
    if (!user) throw new Error('User not authenticated');
    if (user.claimedDeals.includes(dealId)) return;

    const previousUser = user;
    const optimisticClaimedDeals = previousUser.claimedDeals.includes(dealId)
      ? previousUser.claimedDeals
      : [...previousUser.claimedDeals, dealId];

    console.log("[Auth] Claiming deal:", { userId: previousUser.id, dealId });
    setUser({ ...previousUser, claimedDeals: optimisticClaimedDeals });

    try {
      const response = await authApi<{ success: boolean; user: Record<string, unknown> }>(
        "/api/auth/claim-deal",
        "POST",
        { dealId },
        previousUser.id
      );
      const nextUser = rowToUser(response.user);
      console.log("[Auth] Claim synced from backend:", {
        dealId,
        claimedDeals: nextUser.claimedDeals,
      });
      setUser(nextUser);
    } catch (error) {
      console.error("[Auth] Claim failed, rolling back optimistic update:", error);
      setUser(previousUser);
      throw error;
    }
  };

  const refetchClaimedDeals = async () => {
    try {
      const updatedUser = await refetchUserClaimedDeals();
      if (updatedUser) {
        setUser(rowToUser(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refetch claimed deals:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: !!(user?.role === 'admin' || user?.roles?.includes('admin')),
        isPartner: !!(user?.role === 'partner' || user?.roles?.includes('partner') || user?.role === 'admin' || user?.roles?.includes('admin')),
        login,
        register,
        logout,
        updatePlan,
        claimDeal,
        refetchClaimedDeals,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

async function getAllUsers(): Promise<User[]> {
  const response = await authApi<{ users: Record<string, unknown>[] }>("/api/admin/users?page=1&limit=1000");
  return (response.users || []).map(rowToUser);
}

async function sendVerificationEmail(email: string, name: string): Promise<void> {
  await authApi("/api/auth/send-verification", "POST", { email, name });
}

async function verifyEmailCode(email: string, code: string): Promise<boolean> {
  const response = await authApi<{ verified?: boolean }>("/api/auth/verify-email", "POST", { email, code });
  return !!response.verified;
}
