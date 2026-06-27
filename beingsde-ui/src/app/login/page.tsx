"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isSessionInvalidated, setIsSessionInvalidated] = useState(false);

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setTimeout(() => setIsRegistered(true), 0);
      }
      if (params.get("reset") === "true") {
        setTimeout(() => setIsPasswordReset(true), 0);
      }
      if (params.get("reason") === "session_invalidated") {
        setTimeout(() => setIsSessionInvalidated(true), 0);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Invalid email or password");
      }

      const data = await res.json();
      
      // Store JWT token for API calls
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", email);

      // Sync state globally in the window
      window.dispatchEvent(new Event("auth-state-change"));

      // Redirect to Topics explorer page
      router.push("/topics");
      router.refresh();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 w-full min-h-[500px]">
      <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-8 rounded-md shadow-sm flex flex-col gap-6">
        
        {/* Header */}
        <div className="text-center flex flex-col gap-1.5">
          <h1 className="text-2xl font-black tracking-tight">Access Workbench</h1>
          <p className="text-xs text-zinc-500">Sign in to sync your system design logs.</p>
        </div>

        {/* Registration Success Callout */}
        {isRegistered && !error && (
          <div className="flex gap-2.5 items-start p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-sm dark:bg-emerald-950/20 dark:border-emerald-900/50">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Registration successful! Please sign in with your credentials.</span>
          </div>
        )}

        {/* Password Reset Success Callout */}
        {isPasswordReset && !isRegistered && !error && (
          <div className="flex gap-2.5 items-start p-3 text-xs bg-sky-50 border border-sky-200 text-sky-700 rounded-sm dark:bg-sky-950/20 dark:border-sky-900/50">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Password updated successfully! Sign in with your new password.</span>
          </div>
        )}

        {/* Session Invalidated Warning */}
        {isSessionInvalidated && !error && (
          <div className="flex gap-2.5 items-start p-3 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-sm dark:bg-amber-950/20 dark:border-amber-900/50">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>You were signed out.</strong> Your account was accessed from another device or browser.
              Sign in again to continue.
            </span>
          </div>
        )}
        {/* Error Callout */}
        {error && (
          <div className="flex gap-2.5 items-start p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-sm dark:bg-rose-950/20 dark:border-rose-900/50">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                id="email-input"
                type="email" 
                placeholder="jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                id="password-input"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              />
            </div>
          </div>

          <button 
            id="login-submit-btn"
            type="submit" 
            disabled={isLoading}
            className="w-full text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 mt-2 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-3xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col gap-2">
          <span>Forgot your password? <Link href="/forgot" className="underline hover:text-zinc-600">Reset it</Link></span>
          <span>Don&apos;t have an account? <Link href="/register" className="underline hover:text-zinc-600">Register</Link></span>
        </div>
      </div>
    </div>
  );
}
