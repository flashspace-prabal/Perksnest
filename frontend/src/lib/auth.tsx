import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabaseAuth } from "./supabase";
import { clearStoredReferralCode, getStoredReferralCode } from "@/lib/referrals";
import { API_BASE_URL } from "@/lib/runtime";

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
}

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = 'perksnest_user_id';

async function authApi<T>(path: string, method = "GET", body?: unknown, userId?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
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
    const userId = localStorage.getItem(STORAGE_KEY);
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const response = await authApi<{ success: boolean; user: Record<string, unknown> }>(
          "/api/auth/me",
          "GET",
          undefined,
          userId
        );
        if (response.user) setUser(rowToUser(response.user));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi<{ success: boolean; user: Record<string, unknown> }>(
        "/api/auth/login",
        "POST",
        { email, password }
      );
      const u = rowToUser(response.user);
      setUser(u);
      localStorage.setItem(STORAGE_KEY, u.id);
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
      const response = await authApi<{ success: boolean; user: Record<string, unknown> }>(
        "/api/auth/register",
        "POST",
        { email, password, name, referrerCode: normalizedReferrerCode }
      );
      const u = rowToUser(response.user);
      setUser(u);
      localStorage.setItem(STORAGE_KEY, u.id);
      localStorage.removeItem('perksnest_logged_out');
      if (normalizedReferrerCode) clearStoredReferralCode();
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem('perksnest_logged_out', 'true');
      Promise.resolve(supabaseAuth.auth.signOut()).catch((err: unknown) => {
        console.error('Supabase sign out error:', err);
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      window.location.href = '/';
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

    const response = await authApi<{ success: boolean; user: Record<string, unknown> }>(
      "/api/auth/claim-deal",
      "POST",
      { dealId },
      user.id
    );
    setUser(rowToUser(response.user));
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
