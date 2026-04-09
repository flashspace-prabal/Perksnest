import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://auth.perksnest.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.flEXaRV1Ku-LEeKUiTTXvjlekdwZvGY8oOFiNDPMgkA';
const DEFAULT_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTc5OTUzNTYwMH0.a_aG_-LkejoOF7RrktOYUmMr4z0ruvdkqIGIfq2bbzw';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
export const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || DEFAULT_SUPABASE_SERVICE_KEY;

// Use service role client (we handle auth ourselves, not Supabase Auth)
export const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: 'perksnest' },
  auth: { persistSession: false, autoRefreshToken: false },
});

export const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { flowType: 'implicit', persistSession: true, autoRefreshToken: true },
});

export default db;
