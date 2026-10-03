import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/common/SEO";
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles,
  ShieldCheck
} from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, resetPasswordForEmail, resendConfirmationEmail, isLoading } = useAuthStore();

  // Determine initial mode from URL or default to login
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect to /account or return URL
  useEffect(() => {
    if (user) {
      const redirectTo = searchParams.get("redirect") || "/account";
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "forgot") {
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      setIsSubmitting(true);
      const res = await resetPasswordForEmail(email);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage("Password reset link has been sent to your email.");
      }
      return;
    }

    if (mode === "signin") {
      if (!email.trim() || !password) {
        setErrorMessage("Please fill in both email and password.");
        return;
      }
      setIsSubmitting(true);
      const res = await signIn(email, password);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        const redirectTo = searchParams.get("redirect") || "/account";
        navigate(redirectTo, { replace: true });
      }
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      setIsSubmitting(true);
      const res = await signUp(email, password, fullName, phone);
      setIsSubmitting(false);

      if (res.error) {
        setErrorMessage(res.error);
      } else if (res.needsEmailConfirmation) {
        setSuccessMessage("Account created! Please check your email to confirm your account.");
      } else {
        setSuccessMessage("Account created successfully! Redirecting...");
        const redirectTo = searchParams.get("redirect") || "/account";
        setTimeout(() => navigate(redirectTo, { replace: true }), 1000);
      }
    }
  };

  return (
    <>
      <SEO
        title={mode === "signup" ? "Create Account | Himroots Wellness" : "Sign In | Himroots Wellness"}
        description="Access your Himroots Wellness customer account, manage order history, delivery addresses, and synced shopping cart."
        canonical="/account/login"
      />

      <div className="min-h-[85vh] py-12 sm:py-16 md:py-24 bg-[var(--color-background)] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
        
        {/* Subtle Himalayan ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          
          {/* Card Container */}
          <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-[var(--color-border-gold)] rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl gold-glow-sm">
            
            {/* Header / Brand */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-border-gold)] text-[var(--color-primary)] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                {mode === "signin" && "Welcome Back"}
                {mode === "signup" && "Create Your Account"}
                {mode === "forgot" && "Reset Password"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                {mode === "signin" && "Access your order history, delivery addresses, and personal recommendations."}
                {mode === "signup" && "Join Himroots for priority order tracking, saved addresses, and wellness rewards."}
                {mode === "forgot" && "Enter your email address and we'll send you a recovery link."}
              </p>
            </div>

            {/* Mode Tabs (Sign In / Create Account) */}
            {mode !== "forgot" && (
              <div className="grid grid-cols-2 p-1 mb-6 rounded-lg bg-black border border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                    mode === "signin"
                      ? "bg-[var(--color-secondary)] text-[var(--color-primary)] shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                    mode === "signup"
                      ? "bg-[var(--color-secondary)] text-[var(--color-primary)] shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Notifications / Alerts */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/50 flex flex-col gap-2 text-red-200 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                </div>
                {errorMessage.toLowerCase().includes("confirm") && email && (
                  <button
                    type="button"
                    onClick={async () => {
                      setErrorMessage(null);
                      setSuccessMessage("Sending verification link...");
                      const res = await resendConfirmationEmail(email);
                      if (res.error) {
                        setErrorMessage(res.error);
                        setSuccessMessage(null);
                      } else {
                        setSuccessMessage("Verification link resent! Please check your inbox and spam folder.");
                      }
                    }}
                    className="self-start text-[11px] font-semibold text-[var(--color-primary)] hover:underline ml-7 transition-colors"
                  >
                    Resend confirmation email →
                  </button>
                )}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-3 text-emerald-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">{successMessage}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Arya Sharma"
                        className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Password *
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] text-[var(--color-primary)] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm pl-10 pr-10 py-2.5 rounded-lg focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full h-11 bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs shadow-lg mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : mode === "signin" ? (
                  <span className="flex items-center justify-center gap-1.5">
                    Sign In <ArrowRight className="w-4 h-4" />
                  </span>
                ) : mode === "signup" ? (
                  <span className="flex items-center justify-center gap-1.5">
                    Create Account <ArrowRight className="w-4 h-4" />
                  </span>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </Button>
            </form>

            {/* Back button for Forgot Password mode */}
            {mode === "forgot" && (
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs text-gray-400 hover:text-[var(--color-primary)] transition-colors underline"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {/* Trust badge */}
            <div className="mt-8 pt-6 border-t border-[var(--color-border)]/60 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Encrypted with Supabase 256-bit Row Level Security</span>
            </div>

          </div>

          {/* Quick guest checkout link if arrived from checkout */}
          {searchParams.get("redirect")?.includes("checkout") && (
            <div className="text-center mt-4">
              <Link
                to="/checkout"
                className="text-xs text-gray-400 hover:text-[var(--color-primary)] transition-colors"
              >
                Continue as Guest Checkout →
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
