import { useEffect } from "react";
import { supabaseAuth } from "@/lib/supabase";

// This component is a safety net that ensures OAuth redirect handling works
// The primary OAuth handling is now done in:
// 1. AuthProvider - listens to Supabase onAuthStateChange and syncs with backend
// 2. AuthCallback - handles explicit /auth/callback route
// 3. This component - minimal cleanup only
export default function OAuthHandler() {
  useEffect(() => {
    // Just ensure Supabase session is loaded from URL/storage
    // AuthProvider will handle the rest via onAuthStateChange listener
    supabaseAuth.auth.getSession().catch(err => {
      console.error('Error getting Supabase session:', err);
    });
  }, []);

  return null;
}
