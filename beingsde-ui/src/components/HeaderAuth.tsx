"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function HeaderAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    
    const handleSync = () => {
      setIsAuthenticated(!!localStorage.getItem("accessToken"));
    };
    
    // Listen for storage changes (multi-tab sync)
    window.addEventListener("storage", handleSync);
    // Listen for same-tab custom event
    window.addEventListener("auth-state-change", handleSync);
    
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("auth-state-change", handleSync);
    };
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("auth-state-change"));
    router.push("/login");
    router.refresh();
  };

  if (isAuthenticated) {
    return (
      <button
        onClick={handleSignOut}
        className="text-xs font-semibold uppercase tracking-wider bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-900 dark:hover:border-zinc-100 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md transition-all duration-300 cursor-pointer"
      >
        Sign Out
      </button>
    );
  }

  return (
    <>
      <Link 
        href="/login" 
        className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        Sign In
      </Link>
      <Link 
        href="/register" 
        className="hidden sm:inline-flex text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
      >
        Get Started
      </Link>
    </>
  );
}
