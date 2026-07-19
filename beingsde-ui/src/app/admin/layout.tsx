"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sliders, 
  Database, 
  Cpu, 
  Shield, 
  Users, 
  Home, 
  ChevronRight, 
  LogOut, 
  Menu, 
  X,
  BookOpen
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition-all ${
        active
          ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
          : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1">{label}</span>
      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active ? "opacity-100 translate-x-0.5" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"}`} />
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("accessToken");
    if (token && role === "ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Invalid credentials");
      }

      const data = await res.json();
      if (data.role !== "ADMIN") {
        throw new Error("Access Denied: Admin role required");
      }

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", email);
      
      setIsAdmin(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setIsAdmin(false);
    router.push("/");
  };

  // 1. Loading Authentication State
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa]">
        <div className="w-6 h-6 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  // 2. Unauthenticated Admin Login Card
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded shadow-sm p-8 space-y-6">
          <div className="text-center">
            <span className="text-2xs font-mono font-bold text-rose-500 uppercase tracking-widest border border-rose-500/20 px-2 py-0.5 rounded bg-rose-500/5">System Terminal</span>
            <h1 className="text-2xl font-black mt-2 tracking-tight">Admin Console</h1>
            <p className="text-xs text-zinc-500 mt-1">Authenticate to access database control endpoints.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beingsde.com"
                className="w-full px-3.5 py-2 text-sm border border-zinc-200 dark:border-zinc-800 bg-transparent rounded focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm border border-zinc-200 dark:border-zinc-800 bg-transparent rounded focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded border border-rose-200 dark:border-rose-800">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:hover:bg-zinc-100 dark:text-zinc-950 font-bold uppercase tracking-wider text-xs rounded transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Connect Terminal"}
            </button>
          </form>
          
          <div className="text-center">
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline transition-colors">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { href: "/admin", icon: Home, label: "Overview" },
    { href: "/admin/topics", icon: Sliders, label: "HLD Topics" },
    { href: "/admin/lld", icon: Database, label: "LLD Questions" },
    { href: "/admin/dsa", icon: Cpu, label: "DSA Questions" },
    { href: "/admin/bar-raiser", icon: Shield, label: "Bar Raiser" },
    { href: "/admin/hld-questions", icon: BookOpen, label: "HLD Questions" },
    { href: "/admin/users", icon: Users, label: "User Roles" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[85vh] gap-6 max-w-7xl mx-auto">
      {/* Mobile Sidebar Trigger */}
      <div className="md:hidden flex items-center justify-between border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-[#18181b] rounded">
        <span className="text-sm font-black tracking-tight uppercase font-mono">Admin Control</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 border border-zinc-200 dark:border-zinc-800 rounded">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-60 bg-white dark:bg-[#18181b]/50 border border-zinc-200 dark:border-zinc-800 p-4 rounded shrink-0 md:flex flex-col justify-between ${mobileMenuOpen ? "flex" : "hidden md:flex"}`}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <span className="text-3xs font-mono font-bold text-emerald-500 uppercase tracking-widest">Active session</span>
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 truncate max-w-[150px]">{localStorage.getItem("userEmail")}</p>
            </div>
            <ThemeToggle />
          </div>

          <nav className="flex flex-col gap-1.5">
            {sidebarLinks.map((link) => (
              <SidebarItem
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center justify-center gap-2 w-full py-2 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-2xs rounded transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> Disconnect Session
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-white dark:bg-[#18181b]/20 border border-zinc-200 dark:border-zinc-800 rounded p-6 sm:p-8 shadow-3xs">
        {children}
      </main>
    </div>
  );
}
