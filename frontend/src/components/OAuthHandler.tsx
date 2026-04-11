import { useEffect } from "react";
import { supabaseAuth } from "@/lib/supabase";
import { API_BASE_URL } from "@/lib/runtime";
import { useNavigate, useLocation } from "react-router-dom";
import { clearStoredReferralCode, getStoredReferralCode } from "@/lib/referrals";

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
    // Don't auto-login if user explicitly signed out
    if (localStorage.getItem('perksnest_logged_out') === 'true') return;
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

        const storedReferralCode = getStoredReferralCode();
        const syncResponse = await fetch(`${API_BASE_URL}/api/auth/oauth-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name,
            avatar,
            authUserId: googleUser.id,
            referralCode: storedReferralCode || undefined,
          }),
        });
        const syncData = await syncResponse.json().catch(() => null);
        if (!syncResponse.ok || !syncData?.user) {
          console.error("OAuthHandler sync error:", syncData);
          return;
        }

        const userId = syncData.user.id as string;
        const userRole = (syncData.user.role as string) || "customer";
        if (storedReferralCode) clearStoredReferralCode();

        localStorage.setItem('perksnest_user_id', userId);
        if (syncData.session?.access_token) {
          localStorage.setItem('pn_session', JSON.stringify(syncData.session));
        }

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
      if (event === 'SIGNED_IN' && session?.user && !localStorage.getItem('perksnest_user_id') && localStorage.getItem('perksnest_logged_out') !== 'true') {
        processOAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, location.search, navigate]);

  return null;
}
