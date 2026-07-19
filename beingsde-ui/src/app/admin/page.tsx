"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Database, 
  Cpu, 
  Shield, 
  BarChart, 
  ArrowUpRight, 
  Activity, 
  Award,
  Terminal,
  BookOpen,
  Sliders
} from "lucide-react";
import Link from "next/link";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

interface Stats {
  totalUsers: number;
  totalTopics: number;
  totalInterviews: number;
  adminCount: number;
  premiumCount: number;
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
        const res = await sessionAwareFetch(`${API_BASE}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to load stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-5 h-5 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full"></div>
        <p className="text-xs font-mono text-zinc-400">CONNECTING CONTROL MODULE...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Accounts", value: stats?.totalUsers || 0, icon: Users, desc: "Registered user profiles", color: "text-blue-500", bg: "bg-blue-500/5 border-blue-500/10" },
    { label: "System Architectures", value: stats?.totalTopics || 0, icon: Database, desc: "HLD modules in database", color: "text-emerald-500", bg: "bg-emerald-500/5 border-emerald-500/10" },
    { label: "Mock Interviews", value: stats?.totalInterviews || 0, icon: Activity, desc: "Scheduled mock sessions", color: "text-orange-500", bg: "bg-orange-500/5 border-orange-500/10" },
    { label: "Premium Seats", value: stats?.premiumCount || 0, icon: Award, desc: "Active paid subscribers", color: "text-violet-500", bg: "bg-violet-500/5 border-violet-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 gap-4">
        <div>
          <span className="text-2xs font-mono font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" /> SECURE CONTROL NODE ACTIVE
          </span>
          <h1 className="text-2xl font-black mt-1.5 tracking-tight">System Control Panel</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage interactive course templates, user access lists, and interview slots.</p>
        </div>
      </section>

      {/* Grid Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`border rounded-lg p-5 flex flex-col gap-1.5 shadow-sm ${card.bg}`}>
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold text-zinc-400 uppercase tracking-wider">{card.label}</span>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <span className="text-3xl font-black tracking-tight">{card.value}</span>
            <span className="text-3xs text-zinc-400 font-medium leading-normal">{card.desc}</span>
          </div>
        ))}
      </section>

      {/* Database Tables Overview & Quicklinks */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quicklinks */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4">
          <div>
            <h3 className="font-bold text-sm tracking-tight font-mono">Control Modules</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Rapidly jump to custom item tables to insert or edit questions.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/admin/topics", label: "Edit HLD Topics", icon: Database },
              { href: "/admin/lld", label: "Edit LLD Exercises", icon: Cpu },
              { href: "/admin/dsa", label: "Edit DSA Exercises", icon: Sliders },
              { href: "/admin/bar-raiser", label: "Edit Bar Raiser Qs", icon: Shield },
              { href: "/admin/hld-questions", label: "Edit HLD Questions", icon: BookOpen },
              { href: "/admin/users", label: "Configure Users", icon: Users },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 p-3 text-xs font-semibold rounded border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all font-mono"
              >
                <link.icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="flex-1 truncate">{link.label}</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Database Info panel */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-sm tracking-tight font-mono">System Integrity</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All collections are hosted in MongoDB Atlas with replication groups active. Deleting questions via this console performs a soft-archive flag update (`isArchived: true`), protecting relational database links.
            </p>
          </div>
          
          <div className="border-t border-zinc-200 dark:border-zinc-800/60 pt-4 flex items-center justify-between text-3xs font-mono text-zinc-400">
            <span>DATABASE NODE: PRIMARY</span>
            <span>SHARDS: 3</span>
            <span className="text-emerald-500 font-bold animate-pulse">● STABLE</span>
          </div>
        </div>
      </section>
    </div>
  );
}
