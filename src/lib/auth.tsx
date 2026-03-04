import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import db from "./supabase";
import { convertReferral } from "@/lib/store";

// Simple deterministic hash for password storage
// In production this would be bcrypt server-side — for now use SHA-256 via Web Crypto
async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password + 'perksnest_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, referrerCode?: string) => Promise<boolean>;
  logout: () => void;
  updatePlan: (plan: UserPlan) => Promise<void>;
  claimDeal: (dealId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'perksnest_user_id';

const generateReferralCode = (name: string): string => {
  const base = name.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4) || 'USER';
  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
};

const rowToUser = (row: Record<string, unknown>): User => ({
  id: row.id as string,
  email: row.email as string,
  name: row.name as string,
  plan: row.plan as UserPlan,
  role: row.role as UserRole,
  referralCode: row.referral_code as string,
  referralCount: row.referral_count as number,
  claimedDeals: (row.claimed_deals as string[]) || [],
  createdAt: row.created_at as string,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem(STORAGE_KEY);
    if (userId) {
      db.from('users').select('*').eq('id', userId).single()
        .then(({ data }) => {
          if (data) setUser(rowToUser(data));
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const hashedPw = await hashPassword(password);
    const { data, error } = await db
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('password', hashedPw)
      .single();

    if (error || !data) return false;

    const u = rowToUser(data);
    setUser(u);
    localStorage.setItem(STORAGE_KEY, u.id);
    return true;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    referrerCode?: string
  ): Promise<boolean> => {
    // Check if email already exists
    const { data: existing } = await db
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) return false;

    const hashedPw = await hashPassword(password);
    const { data, error } = await db
      .from('users')
      .insert({
        email: email.toLowerCase().trim(),
        password: hashedPw,
        name,
        plan: 'free',
        role: 'customer',
        referral_code: generateReferralCode(name),
        referral_count: 0,
        claimed_deals: [],
      })
      .select('*')
      .single();

    if (error || !data) return false;

    const u = rowToUser(data);
    setUser(u);
    localStorage.setItem(STORAGE_KEY, u.id);

    // Track referral conversion
    if (referrerCode) {
      convertReferral(email, u.id);
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updatePlan = async (plan: UserPlan) => {
    if (!user) return;
    await db.from('users').update({ plan }).eq('id', user.id);
    setUser({ ...user, plan });
  };

  const claimDeal = async (dealId: string) => {
    if (!user || user.claimedDeals.includes(dealId)) return;
    const updated = [...user.claimedDeals, dealId];
    await db.from('users').update({ claimed_deals: updated }).eq('id', user.id);
    setUser({ ...user, claimedDeals: updated });
    // Record claim event
    await db.from('claim_events').upsert(
      { user_id: user.id, deal_id: dealId },
      { onConflict: 'user_id,deal_id' }
    );
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isLoading,
      login, register, logout, updatePlan, claimDeal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Admin helpers
export async function getAllUsers(): Promise<User[]> {
  const { data } = await db.from('users').select('*').order('created_at', { ascending: false });
  return (data || []).map(rowToUser);
}
