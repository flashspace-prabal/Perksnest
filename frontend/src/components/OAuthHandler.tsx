import { useEffect } from "react";
import { supabaseAuth } from "@/lib/supabase";

/**
 * OAuthHandler ensures that OAuth redirects are processed correctly.
 * The real work happens in:
 * 1. supabaseClient config with detectSessionInUrl: true
 * 2. AuthProvider listening to onAuthStateChange
 * 3. AuthCallback page for explicit handling
 * 
 * This component just ensures the session is loaded from URL/storage.
 */
export default function OAuthHandler() {
  useEffect(() => {
    // Ensure Supabase processes any OAuth session from URL
    // The client config has detectSessionInUrl: true, but this forces it
    const initSession = async () => {
      try {
        const { data: { session } } = await supabaseAuth.auth.getSession();
        if (session?.user) {
          console.log('OAuth session detected and loaded', { user: session.user.email });
        }
      } catch (err) {
        console.error('Error loading Supabase session:', err);
      }
    };

    initSession();
  }, []);

  return null;
}
