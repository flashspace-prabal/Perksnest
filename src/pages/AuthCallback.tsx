import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/supabase";

const supabaseAuth = createClient(
  'https://supabase.stirringminds.com',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.flEXaRV1Ku-LEeKUiTTXvjlekdwZvGY8oOFiNDPMgkA'
);

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Completing sign-in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Step 1: Exchange the code/hash fragment for a session
        // Supabase puts tokens in URL hash (#access_token=...) or query (?code=...)
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        const queryParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const code = queryParams.get('code');

        let session = null;

        if (accessToken) {
          // Hash-based flow (implicit)
          const { data, error } = await supabaseAuth.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          if (!error) session = data.session;
        } else if (code) {
          // PKCE flow
          const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(code);
          if (!error) session = data.session;
        } else {
          // Try getting existing session
          const { data } = await supabaseAuth.auth.getSession();
          session = data.session;
        }

        if (!session?.user) {
          setStatus("Sign-in failed. Please try again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const googleUser = session.user;
        const email = googleUser.email?.toLowerCase().trim();
        const name = googleUser.user_metadata?.full_name 
          || googleUser.user_metadata?.name 
          || email?.split('@')[0] 
          || 'User';
        const avatar = googleUser.user_metadata?.avatar_url || null;

        if (!email) {
          setStatus("Could not get email from Google. Please try again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        setStatus("Setting up your account...");

        // Step 2: Find or create user in perksnest.users
        const { data: existing } = await db
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        let userId: string;

        if (existing) {
          userId = existing.id;
          // Update avatar if changed
          if (avatar && existing.avatar !== avatar) {
            await db.from('users').update({ avatar, email_verified: true }).eq('id', existing.id);
          }
        } else {
          // New user — create account
          const { data: newUser, error: insertError } = await db
            .from('users')
            .insert({
              email,
              name,
              avatar,
              password: 'google_oauth_' + googleUser.id,
              plan: 'free',
              role: 'customer',
              roles: ['customer'],
              status: 'active',
              email_verified: true,
              referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
              referral_count: 0,
              claimed_deals: [],
            })
            .select('*')
            .single();

          if (insertError || !newUser) {
            console.error('Insert error:', insertError);
            setStatus("Account creation failed. Please try again.");
            setTimeout(() => navigate("/login"), 2000);
            return;
          }

          userId = newUser.id;

          // Welcome email
          fetch('https://api.perksnest.co/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'welcome', to: email, name }),
          }).catch(() => {});
        }

        // Step 3: Set session in our custom auth system
        localStorage.setItem('perksnest_user_id', userId);
        
        setStatus("Welcome! Taking you to your dashboard...");
        
        // Redirect based on role
        const role = existing?.role || 'customer';
        const dest = role === 'admin' ? '/admin' : role === 'partner' ? '/partner' : '/customer';
        
        // Hard redirect to force auth context re-hydration
        window.location.replace(dest);

      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus("Something went wrong. Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground font-medium mb-1">{status}</p>
        <p className="text-muted-foreground text-sm">Please wait...</p>
      </div>
    </div>
  );
}
