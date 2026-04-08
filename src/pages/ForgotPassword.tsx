import { useState } from "react";
import { Link } from "react-router-dom";
import { db } from "@/lib/supabase";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if email exists
    const { data } = await db.from("users").select("id").eq("email", email.toLowerCase().trim()).single();
    
    // Always show success (security: don't reveal if email exists)
    setSubmitted(true);
    setLoading(false);
    
    // In production: send reset email via Resend
    if (data) {
      await fetch("https://api.perksnest.co/api/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim(), userId: data.id }),
      }).catch(() => {}); // silent fail for now
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Check your inbox</h2>
              <p className="text-muted-foreground text-sm mb-6">
                If an account exists for <strong>{email}</strong>, we've sent password reset instructions.
              </p>
              <Link to="/login" className="text-primary hover:underline text-sm">← Back to sign in</Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-1">Reset your password</h2>
                <p className="text-muted-foreground text-sm">Enter your email and we'll send you reset instructions.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@startup.com"
                      className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
