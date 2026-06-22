"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Something went wrong. Please try again.");
      }

      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  };

  return (
    <div className="flex justify-center items-center py-10 w-full min-h-[500px]">
      <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-8 rounded-md shadow-sm flex flex-col gap-6">

        {/* Back link */}
        <Link
          href="/login"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-black tracking-tight">Reset Password</h1>
          <p className="text-xs text-zinc-500">
            Enter the email address on your account and we&apos;ll send you a reset link.
          </p>
        </div>

        {/* Success state */}
        {state === "success" ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-start p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-sm dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Check your inbox</span>
                <span className="text-xs">
                  If <strong>{email}</strong> is registered, you&apos;ll receive a password
                  reset link within a few minutes. Check your spam folder if it doesn&apos;t arrive.
                </span>
              </div>
            </div>
            <button
              onClick={() => { setState("idle"); setEmail(""); }}
              className="text-xs text-zinc-400 underline hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-left"
            >
              Didn&apos;t receive it? Try a different email.
            </button>
          </div>
        ) : (
          <>
            {/* Error callout */}
            {state === "error" && (
              <div className="flex gap-2.5 items-start p-3 text-xs bg-rose-50 border border-rose-200 text-rose-600 rounded-sm dark:bg-rose-950/20 dark:border-rose-900/50">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <button
                id="forgot-submit-btn"
                type="submit"
                disabled={state === "loading"}
                className="w-full text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 py-3 mt-2 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="text-center text-3xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-4">
              <span>
                Remembered it?{" "}
                <Link href="/login" className="underline hover:text-zinc-600 dark:hover:text-zinc-300">
                  Sign In
                </Link>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
