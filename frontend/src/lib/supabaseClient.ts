import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const SUPABASE_URL = requireEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL as string | undefined);
const SUPABASE_ANON_KEY = requireEnv('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);

// Single, unified Supabase client for all operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: { schema: 'perksnest' },
  auth: {
    flowType: 'pkce', // OAuth uses PKCE flow
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Automatically handle OAuth redirect
  },
});

// Exports for backwards compatibility
export const SUPABASE_URL_VALUE = SUPABASE_URL;
export const SUPABASE_ANON_KEY_VALUE = SUPABASE_ANON_KEY;
