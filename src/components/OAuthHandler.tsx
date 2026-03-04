import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

const supabaseAuth = createClient(
  'https://supabase.stirringminds.com',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.flEXaRV1Ku-LEeKUiTTXvjlekdwZvGY8oOFiNDPMgkA',
  { auth: { flowType: 'implicit', persistSession: true } }
);

// This component handles the Google OAuth callback from anywhere in the app.
// Supabase redirects to SITE_URL (perksnest.co/) after OAuth, not to /auth/callback.
// This component detects the session and processes it globally.
export default function OAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip if already on /auth/callback (handled there)
    if (location.pathname === '/auth/callback') return;
    
    // Skip if already logged into perksnest
    if (localStorage.getItem('perksnest_user_id')) return;

    const processOAuth = async () => {
      try {
        const { data } = await supabaseAuth.auth.getSession();
        if (!data.session?.user) return;

        const googleUser = data.session.user;
        const email = googleUser.email?.toLowerCase().trim();
        if (!email) return;

        const name = googleUser.user_metadata?.full_name 
          || googleUser.user_metadata?.name 
          || email.split('@')[0];
        const avatar = googleUser.user_metadata?.avatar_url || null;

        // Look up or create in perksnest.users
        const { data: existing } = await db.from('users').select('*').eq('email', email).single();

        let userId: string;
        let userRole: string;

        if (existing) {
          userId = existing.id;
          userRole = existing.role || 'customer';
          if (avatar && existing.avatar !== avatar) {
            await db.from('users').update({ avatar, email_verified: true }).eq('id', existing.id);
          }
        } else {
          const { data: newUser, error } = await db.from('users').insert({
            email, name, avatar,
            password: 'google_oauth',
            plan: 'free', role: 'customer', roles: ['customer'],
            status: 'active', email_verified: true,
            referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            referral_count: 0, claimed_deals: [],
          }).select('*').single();

          if (error || !newUser) {
            console.error('OAuthHandler insert error:', error);
            return;
          }
          userId = newUser.id;
          userRole = 'customer';

          fetch('https://api.perksnest.co/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'welcome', to: email, name }),
          }).catch(() => {});
        }

        localStorage.setItem('perksnest_user_id', userId);

        // Redirect to intended destination
        const returnUrl = new URLSearchParams(location.search).get('returnUrl');
        const dest = returnUrl && returnUrl.startsWith('/')
          ? returnUrl
          : userRole === 'admin' ? '/admin' : userRole === 'partner' ? '/partner' : '/customer';
        
        window.location.replace(dest);
      } catch (err) {
        console.error('OAuthHandler error:', err);
      }
    };

    // Run when component mounts (catches the Supabase redirect)
    processOAuth();

    // Also listen for auth state changes
    const { data: { subscription } } = supabaseAuth.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && !localStorage.getItem('perksnest_user_id')) {
        processOAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, location.search, navigate]);

  return null;
}
