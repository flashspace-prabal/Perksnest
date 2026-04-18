import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { sendVerificationEmail, verifyEmailCode } from "@/lib/authHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { storeReferralCode } from "@/lib/referrals";
import { supabaseAuth } from "@/lib/supabase";

const Login = () => {
  useEffect(() => {
    document.title = "Sign In | PerksNest";
  }, []);

  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const refCode = searchParams.get("ref") || undefined;

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyStep, setVerifyStep] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyName, setVerifyName] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if (refCode) {
      storeReferralCode(refCode);
    }
  }, [refCode]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const dest = returnUrl || (user.role === "admin" ? "/admin" : user.role === "partner" ? "/partner" : "/customer");
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, user, navigate, returnUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(loginEmail, loginPassword);
    setLoading(false);
    if (!ok) toast.error("Invalid email or password");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    const ok = await register(regEmail, regPassword, regName, refCode);
    setLoading(false);
    if (!ok) {
      toast.error("Registration failed. Email may already exist.");
    } else {
      // Send verification email
      await sendVerificationEmail(regEmail, regName);
      setVerifyEmail(regEmail);
      setVerifyName(regName);
      setVerifyStep(true);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");
    setLoading(true);
    const ok = await verifyEmailCode(verifyEmail, verifyCode);
    setLoading(false);
    if (ok) {
      toast.success("Email verified! Welcome to PerksNest 🎉");
      const dest = returnUrl || "/customer";
      navigate(dest);
    } else {
      setVerifyError("Invalid or expired code. Check your email.");
    }
  };

  const handleGoogle = async () => {
    try {
      const callbackUrl = `${window.location.origin}/auth/callback${returnUrl ? '?returnUrl=' + encodeURIComponent(returnUrl) : ''}`;
      const { error } = await supabaseAuth.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          skipBrowserRedirect: false,
        },
      });
      if (error) toast.error('Google sign-in failed: ' + error.message);
    } catch (err) {
      toast.error('Google sign-in unavailable');
    }
  };

  if (verifyStep) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📧</div>
              <h2 className="text-xl font-semibold mb-1">Check your email</h2>
              <p className="text-muted-foreground text-sm">We sent a 6-digit code to <strong>{verifyEmail}</strong></p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {verifyError && <p className="text-red-500 text-sm text-center">{verifyError}</p>}
              <button
                type="submit"
                disabled={loading || verifyCode.length !== 6}
                className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Didn't get it?{" "}
              <button onClick={() => sendVerificationEmail(verifyEmail, verifyName).then(() => toast.success("Code resent!"))} className="text-primary hover:underline">Resend code</button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to access your deals and savings</p>
          </div>

          {/* Google Button */}
          <Button variant="outline" className="w-full gap-3 h-11 mb-6" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="login" className="flex-1">Sign in</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@startup.com" value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                      value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Sign in"}
                </Button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-muted rounded-lg text-sm">
                <p className="font-semibold mb-2 text-foreground">Demo accounts:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p><span className="font-mono bg-background px-1 rounded">demo@perksnest.com</span> / <span className="font-mono bg-background px-1 rounded">demo123</span> — Customer Pro</p>
                  <p><span className="font-mono bg-background px-1 rounded">admin@perksnest.com</span> / <span className="font-mono bg-background px-1 rounded">admin123</span> — Admin</p>
                  <p><span className="font-mono bg-background px-1 rounded">partner@perksnest.com</span> / <span className="font-mono bg-background px-1 rounded">partner123</span> — Partner</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="reg-name">Full name</Label>
                  <Input id="reg-name" placeholder="Sarah Johnson" value={regName}
                    onChange={e => setRegName(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="you@startup.com" value={regEmail}
                    onChange={e => setRegEmail(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters"
                    value={regPassword} onChange={e => setRegPassword(e.target.value)} required minLength={6} className="mt-1" />
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Create free account"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="underline hover:text-foreground">Terms</Link> and{" "}
                  <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/" className="hover:text-foreground underline">← Back to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
