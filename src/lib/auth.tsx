import { addClaimEvent, sendEmail } from '@/lib/store';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserPlan = 'free' | 'pro' | 'enterprise';
export type UserRole = 'customer' | 'admin' | 'partner';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  role: UserRole;
  claimedDeals: string[];
  referralCode: string;
  referralCount: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  claimDeal: (dealId: string, dealName?: string) => boolean;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email'>>) => boolean;
  isAuthenticated: boolean;
  isPro: boolean;
  isAdmin: boolean;
  isPartner: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'perksnest_user';
const USERS_KEY = 'perksnest_users';

// Demo accounts
const DEMO_ACCOUNTS = [
  {
    id: 'demo-1',
    email: 'demo@perksnest.com',
    password: 'demo123',
    name: 'Demo User',
    plan: 'pro' as UserPlan,
    role: 'customer' as UserRole,
    claimedDeals: ['notion', 'google-cloud', 'figma'],
    referralCode: 'DEMO2026',
    referralCount: 5,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'admin-1',
    email: 'admin@perksnest.com',
    password: 'admin123',
    name: 'Admin User',
    plan: 'enterprise' as UserPlan,
    role: 'admin' as UserRole,
    claimedDeals: [],
    referralCode: 'ADMIN2026',
    referralCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'partner-1',
    email: 'partner@perksnest.com',
    password: 'partner123',
    name: 'Partner User',
    plan: 'pro' as UserPlan,
    role: 'partner' as UserRole,
    claimedDeals: [],
    referralCode: 'PARTNER2026',
    referralCount: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

// Initialize demo users in localStorage
const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_ACCOUNTS));
  }
};

const generateReferralCode = (name: string): string => {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
  const year = new Date().getFullYear();
  return `${cleanName}${year}`;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize demo users
    initializeDemoUsers();

    // Load user from localStorage
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const usersData = localStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : DEMO_ACCOUNTS;

    const foundUser = users.find(
      (u: typeof DEMO_ACCOUNTS[0]) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    const usersData = localStorage.getItem(USERS_KEY);
    const users = usersData ? JSON.parse(usersData) : DEMO_ACCOUNTS;

    // Check if user already exists
    if (users.find((u: typeof DEMO_ACCOUNTS[0]) => u.email === email)) {
      return false;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      plan: 'free' as UserPlan,
      role: 'customer' as UserRole,
      claimedDeals: [],
      referralCode: generateReferralCode(name),
      referralCount: 0,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const claimDeal = (dealId: string, dealName?: string): boolean => {
    if (!user) return false;

    // Check if already claimed
    if (user.claimedDeals.includes(dealId)) {
      return false;
    }

    const updatedUser = {
      ...user,
      claimedDeals: [...user.claimedDeals, dealId],
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in users list
    const usersData = localStorage.getItem(USERS_KEY);
    if (usersData) {
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: User & { password?: string }) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], claimedDeals: updatedUser.claimedDeals };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }

    return true;
  };

  const updateUser = (updates: Partial<Pick<User, 'name' | 'email'>>): boolean => {
    if (!user) return false;

    const updatedUser = {
      ...user,
      ...updates,
    };

    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

    // Update in users list
    const usersData = localStorage.getItem(USERS_KEY);
    if (usersData) {
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: User & { password?: string }) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    }

    return true;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    claimDeal,
    updateUser,
    isAuthenticated: !!user,
    isPro: user?.plan === 'pro' || user?.plan === 'enterprise',
    isAdmin: user?.role === 'admin',
    isPartner: user?.role === 'partner',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get all users (for admin portal)
export const getAllUsers = (): (User & { password?: string })[] => {
  const usersData = localStorage.getItem(USERS_KEY);
  return usersData ? JSON.parse(usersData) : DEMO_ACCOUNTS;
};
