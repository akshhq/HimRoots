import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/common/SEO";
import { Lock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setErrorMessage("Authentication service unavailable.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("Your password has been reset successfully. Redirecting to account...");
        setTimeout(() => navigate("/account"), 2000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Reset Password | Himroots Wellness"
        description="Set a new password for your Himroots customer account."
        canonical="/account/reset-password"
        noindex={true}
      />

      <div className="min-h-[80vh] py-16 bg-[var(--color-background)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-[var(--color-border-gold)] rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl gold-glow-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-border-gold)] text-[var(--color-primary)] mx-auto flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white mb-2">Create New Password</h1>
            <p className="text-xs text-gray-400">Please choose a secure new password for your account.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-3 text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs shadow-md mt-2"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link to="/account/login" className="text-xs text-gray-400 hover:text-[var(--color-primary)]">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
