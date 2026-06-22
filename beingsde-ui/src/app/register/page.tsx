"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, AlertTriangle, User, Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(() => [
    { label: "At least 6 characters", pass: password.length >= 6 },
    { label: "Contains a number", pass: /\d/.test(password) },
    { label: "Contains uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Contains special character", pass: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  const strength = checks.filter((c) => c.pass).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"][strength];
  const strengthTextColor = ["", "text-rose-500", "text-amber-500", "text-sky-500", "text-emerald-500"][strength];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* Strength bar */}
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? strengthColor : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          />
        ))}
        <span className={`text-3xs font-semibold ml-1 ${strengthTextColor}`}>{strengthLabel}</span>
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            {check.pass ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            ) : (
              <Circle className="w-3 h-3 text-zinc-400 shrink-0" />
            )}
            <span className={`text-3xs ${check.pass ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Registration failed. Please try again.");
      }

      router.push("/login?registered=true");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 w-full min-h-[500px]">
      <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-8 rounded-md shadow-sm flex flex-col gap-6">

        {/* Header */}
        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-black tracking-tight">Create Account</h1>
          <p className="text-xs text-zinc-500">Join beingsde and start mastering system design.</p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="flex gap-2.5 items-start p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-sm dark:bg-rose-950/20 dark:border-rose-900/50">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name-input" className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="name-input"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email-input" className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="email-input"
                type="email"
                placeholder="jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password-input" className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-password-input" className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">
              Confirm Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className={`w-full pl-10 pr-10 py-2 border bg-white dark:bg-[#18181b] text-sm focus:outline-none transition-colors ${
                  !passwordsMatch
                    ? "border-rose-400 focus:border-rose-500"
                    : "border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-3xs text-rose-500 mt-0.5">Passwords do not match.</p>
            )}
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={isLoading || !passwordsMatch}
            className="w-full text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 mt-2 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-3xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col gap-2">
          <span>
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">
              Sign In
            </Link>
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">
            By registering, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-zinc-500">Terms of Service</Link>.
          </span>
        </div>
      </div>
    </div>
  );
}
