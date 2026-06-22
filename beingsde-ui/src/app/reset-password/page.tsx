"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  KeyRound,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

  // If no token in URL, show an error immediately
  const noToken = !token;

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
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to reset password. The link may have expired.");
      }

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => router.push("/login?reset=true"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (noToken) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-start p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-sm dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Invalid reset link</span>
            <span className="text-xs">
              This link is missing a reset token. Please use the link from your email exactly as received.
            </span>
          </div>
        </div>
        <Link
          href="/forgot"
          className="text-xs text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-start p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-sm dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Password updated!</span>
            <span className="text-xs">
              Your password has been reset successfully. Redirecting you to sign in&hellip;
            </span>
          </div>
        </div>
        <Link
          href="/login"
          className="text-xs text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          Go to Sign In now
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="flex gap-2.5 items-start p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-sm dark:bg-rose-950/20 dark:border-rose-900/50">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password-input" className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">
            New Password
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
            Confirm New Password
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="confirm-password-input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat your new password"
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
          id="reset-submit-btn"
          type="submit"
          disabled={isLoading || !passwordsMatch}
          className="w-full text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 mt-2 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating Password..." : "Set New Password"}
        </button>
      </form>

      <div className="text-center text-3xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <span>
          Remember your password?{" "}
          <Link href="/login" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">
            Sign In
          </Link>
        </span>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center py-10 w-full min-h-[500px]">
      <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-8 rounded-md shadow-sm flex flex-col gap-6">

        {/* Back link */}
        <Link
          href="/forgot"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-black tracking-tight">Set New Password</h1>
          <p className="text-xs text-zinc-500">
            Choose a strong new password for your account.
          </p>
        </div>

        <Suspense fallback={<div className="text-xs text-zinc-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
