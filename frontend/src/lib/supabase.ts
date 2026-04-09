import { createClient } from '@supabase/supabase-js';

function requireEnv(name: string, value: string | undefined): string {
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const SUPABASE_URL = requireEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL as string | undefined);
export const SUPABASE_ANON_KEY = requireEnv('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined);
export const SUPABASE_SERVICE_KEY = requireEnv('VITE_SUPABASE_SERVICE_KEY', import.meta.env.VITE_SUPABASE_SERVICE_KEY as string | undefined);

// Use service role client (we handle auth ourselves, not Supabase Auth)
export const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: 'perksnest' },
  auth: { persistSession: false, autoRefreshToken: false },
});

export const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { flowType: 'implicit', persistSession: true, autoRefreshToken: true },
});

export default db;
