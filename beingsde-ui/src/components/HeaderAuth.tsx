"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

export default function HeaderAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = async (token: string) => {
    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
      const res = await sessionAwareFetch(`${API_BASE}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.profile?.avatarUrl || null);
      } else {
        setAvatarUrl(null);
      }
    } catch (e) {
      setAvatarUrl(null);
    }
  };

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    if (token) fetchUser(token);
    
    const handleSync = () => {
      const currentToken = localStorage.getItem("accessToken");
      setIsAuthenticated(!!currentToken);
      if (currentToken) fetchUser(currentToken);
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
    setAvatarUrl(null);
    window.dispatchEvent(new Event("auth-state-change"));
    router.push("/login");
    router.refresh();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/profile" className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          )}
        </Link>
        <button
          onClick={handleSignOut}
          className="text-xs font-semibold uppercase tracking-wider bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-900 dark:hover:border-zinc-100 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md transition-all duration-300 cursor-pointer"
        >
          Sign Out
        </button>
      </div>
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
