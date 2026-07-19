"use client";

import { useState, useEffect } from "react";
import { Search, AlertTriangle, ShieldCheck } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

interface User {
  id: string;
  name: string;
  email: string;
  role: "GUEST" | "FREE_USER" | "PREMIUM_USER" | "INTERVIEWER" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [roleChangeLoading, setRoleChangeLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/admin/users?size=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.content || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setRoleChangeLoading(userId);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await sessionAwareFetch(`${API_BASE}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update role");
      }

      setSuccess("User role updated successfully.");
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setRoleChangeLoading(null);
    }
  };

  const filtered = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight font-mono">User Profiles Management</h2>
          <p className="text-xs text-zinc-500">Configure roles and assign paid subscription access tiers.</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Filter users by name or email address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-50 transition-colors"
        />
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded text-xs text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-600 dark:text-emerald-400">
          {success}
        </div>
      )}

      {/* List Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-5 h-5 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent animate-spin rounded-full"></div>
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800/80 rounded overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-mono">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3 text-right">Configure</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-zinc-200/60 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">{user.name || "N/A"}</td>
                  <td className="p-3 text-zinc-500 font-mono">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
                      user.role === "ADMIN" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800" :
                      user.role === "PREMIUM_USER" ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-200 dark:border-violet-800" :
                      user.role === "INTERVIEWER" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800" :
                      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={user.role}
                      disabled={roleChangeLoading === user.id}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="p-1 border border-zinc-200 dark:border-zinc-800 bg-transparent rounded text-2xs uppercase tracking-wider font-semibold font-mono dark:bg-zinc-900 cursor-pointer"
                    >
                      <option value="FREE_USER">FREE_USER</option>
                      <option value="PREMIUM_USER">PREMIUM_USER</option>
                      <option value="INTERVIEWER">INTERVIEWER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-400 font-mono">No matching records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
