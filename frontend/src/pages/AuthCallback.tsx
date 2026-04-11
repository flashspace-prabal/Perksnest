import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseAuth } from "@/lib/supabase";
import { API_BASE_URL } from "@/lib/runtime";
import { clearStoredReferralCode, getStoredReferralCode } from "@/lib/referrals";

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
        let authUserId: string | null = null;
        let accessToken: string | null = null;
        let refreshToken: string | null = null;
        let expiresIn: number | null = null;
        let tokenType: string | null = null;

        // Method 1: exchange code (PKCE flow - most common)
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(code);
          if (!error && data.session?.user) {
            authUserId = data.session.user.id;
            accessToken = data.session.access_token;
            refreshToken = data.session.refresh_token;
            expiresIn = data.session.expires_in;
            tokenType = data.session.token_type;
            email = data.session.user.email?.toLowerCase().trim() || null;
            name = data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name || null;
            avatar = data.session.user.user_metadata?.avatar_url || null;
          }
        }

        // Method 2: hash fragment (implicit flow)
        if (!email) {
          const hash = new URLSearchParams(window.location.hash.replace('#', ''));
          const hashAccessToken = hash.get('access_token');
          const hashRefreshToken = hash.get('refresh_token');
          if (hashAccessToken) {
            const { data } = await supabaseAuth.auth.setSession({
              access_token: hashAccessToken,
              refresh_token: hashRefreshToken || '',
            });
            if (data.session?.user) {
              authUserId = data.session.user.id;
              accessToken = data.session.access_token;
              refreshToken = data.session.refresh_token;
              expiresIn = data.session.expires_in;
              tokenType = data.session.token_type;
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
            authUserId = data.session.user.id;
            accessToken = data.session.access_token;
            refreshToken = data.session.refresh_token;
            expiresIn = data.session.expires_in;
            tokenType = data.session.token_type;
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

        const storedReferralCode = getStoredReferralCode();
        const syncResponse = await fetch(`${API_BASE_URL}/api/auth/oauth-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            avatar,
            authUserId: authUserId || undefined,
            accessToken: accessToken || undefined,
            refreshToken: refreshToken || undefined,
            expiresIn: expiresIn || undefined,
            tokenType: tokenType || undefined,
            referralCode: storedReferralCode || undefined,
          }),
        });
        const syncData = await syncResponse.json().catch(() => null);
        if (!syncResponse.ok || !syncData?.user) {
          setStatus(`Account setup failed. Please try again.`);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }
        if (storedReferralCode) clearStoredReferralCode();

        const userId = syncData.user.id as string;
        const userRole = (syncData.user.role as string) || "customer";

        // Set session
        localStorage.setItem('perksnest_user_id', userId);
        if (syncData.session?.access_token) {
          localStorage.setItem('pn_session', JSON.stringify(syncData.session));
        }
        setStatus("Welcome! Taking you to your dashboard...");

        // Redirect based on role or returnUrl
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
        const defaultDest = userRole === 'admin' ? '/admin' : userRole === 'partner' ? '/partner' : '/customer';
        const dest = returnUrl && returnUrl.startsWith('/') ? returnUrl : defaultDest;
        window.location.replace(dest);

      } catch (err: unknown) {
        console.error('Auth callback error:', err);
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setStatus(`Error: ${message}. Redirecting...`);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

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
