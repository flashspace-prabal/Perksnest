import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/supabase";

// Supabase auth client (anon key, same instance as login page uses)
const supabaseAuth = createClient(
  'https://supabase.stirringminds.com',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNjQxNzY5MjAwLCJleHAiOjE3OTk1MzU2MDB9.flEXaRV1Ku-LEeKUiTTXvjlekdwZvGY8oOFiNDPMgkA',
  { auth: { flowType: 'implicit', persistSession: true, autoRefreshToken: true } }
);

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Completing sign-in...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Give Supabase JS a moment to process the URL hash/code
        await new Promise(r => setTimeout(r, 500));

        // Try all methods to get the session
        let email: string | null = null;
        let name: string | null = null;
        let avatar: string | null = null;

        // Method 1: exchange code (PKCE flow - most common)
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(code);
          if (!error && data.session?.user) {
            email = data.session.user.email?.toLowerCase().trim() || null;
            name = data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || null;
            avatar = data.session.user.user_metadata?.avatar_url || null;
          }
        }

        // Method 2: hash fragment (implicit flow)
        if (!email) {
          const hash = new URLSearchParams(window.location.hash.replace('#', ''));
          const accessToken = hash.get('access_token');
          const refreshToken = hash.get('refresh_token');
          if (accessToken) {
            const { data } = await supabaseAuth.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            if (data.session?.user) {
              email = data.session.user.email?.toLowerCase().trim() || null;
              name = data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || null;
              avatar = data.session.user.user_metadata?.avatar_url || null;
            }
          }
        }

        // Method 3: session already in storage
        if (!email) {
          const { data } = await supabaseAuth.auth.getSession();
          if (data.session?.user) {
            email = data.session.user.email?.toLowerCase().trim() || null;
            name = data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || null;
            avatar = data.session.user.user_metadata?.avatar_url || null;
          }
        }

        if (!email) {
          setStatus("Could not get your Google account details. Please try again.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        setStatus("Setting up your account...");
        name = name || email.split('@')[0];

        // Look up or create user in perksnest.users
        const { data: existing } = await db
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        let userId: string;
        let userRole: string;

        if (existing) {
          userId = existing.id;
          userRole = existing.role || 'customer';
          // Update avatar if changed
          if (avatar && existing.avatar !== avatar) {
            await db.from('users').update({ avatar, email_verified: true }).eq('id', existing.id);
          }
        } else {
          // Create new user
          const { data: newUser, error: insertError } = await db
            .from('users')
            .insert({
              email,
              name,
              avatar,
              password: 'google_oauth',
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
            setStatus(`Account setup failed: ${insertError?.message || 'unknown error'}. Please try again.`);
            setTimeout(() => navigate("/login"), 3000);
            return;
          }

          userId = newUser.id;
          userRole = 'customer';

          // Welcome email (fire and forget)
          fetch('https://api.perksnest.co/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'welcome', to: email, name }),
          }).catch(() => {});
        }

        // Set session
        localStorage.setItem('perksnest_user_id', userId);
        setStatus("Welcome! Taking you to your dashboard...");

        // Redirect based on role or returnUrl
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        const defaultDest = userRole === 'admin' ? '/admin' : userRole === 'partner' ? '/partner' : '/customer';
        const dest = returnUrl && returnUrl.startsWith('/') ? returnUrl : defaultDest;
        window.location.replace(dest);

      } catch (err: any) {
        console.error('Auth callback error:', err);
        setStatus(`Error: ${err?.message || 'Something went wrong'}. Redirecting...`);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground font-medium mb-1">{status}</p>
        <p className="text-muted-foreground text-sm">Please wait...</p>
      </div>
    </div>
  );
}
