"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("cookie_consent");
      if (!consent) {
        setShowBanner(true);
      }
    } catch (_) {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("cookie_consent", "accepted");
    } catch (_) {}
    setShowBanner(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("cookie_consent", "declined");
    } catch (_) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent Banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shadow-xl flex flex-col gap-3 text-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-mono font-bold text-zinc-900 dark:text-zinc-100">
          <Cookie className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Cookie &amp; Privacy Choices</span>
        </div>
        <button
          onClick={handleDecline}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        We use cookies and third-party advertising services (including Google AdSense) to deliver personalized content, ensure site security, and analyze technical performance. By continuing, you agree to our{" "}
        <Link href="/privacy" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 font-medium">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 font-medium">
          Terms
        </Link>.
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="flex-1 py-1.5 px-3 rounded-sm bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-mono font-semibold text-2xs uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
        >
          Accept All
        </button>
        <button
          onClick={handleDecline}
          className="py-1.5 px-3 rounded-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono text-2xs uppercase tracking-wider hover:border-zinc-400 transition-colors cursor-pointer"
        >
          Essential Only
        </button>
      </div>
    </div>
  );
}
