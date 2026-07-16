"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Shield, Calendar, Camera, Check, Loader2, AlertCircle } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  profile?: {
    avatarUrl?: string;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Avatar selection state
  const [isSelectingAvatar, setIsSelectingAvatar] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("");

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
  
  // List of available avatars
  const AVATARS = Array.from({ length: 10 }, (_, i) => `/avatars/avatar-${i + 1}.png`);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("accessToken");
          router.push("/login");
          return;
        }
        throw new Error("Failed to load profile");
      }

      const data = await res.json();
      setUser(data);
      if (data.profile?.avatarUrl) {
        setSelectedAvatarUrl(data.profile.avatarUrl);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (url: string) => {
    setUpdatingAvatar(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/users/me/avatar`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ avatarUrl: url })
      });

      if (!res.ok) throw new Error("Failed to update avatar");
      
      const data = await res.json();
      setUser(data);
      setSelectedAvatarUrl(url);
      setIsSelectingAvatar(false);
      
      // Dispatch event to update Navbar avatar
      window.dispatchEvent(new Event("auth-state-change"));
    } catch (err: any) {
      setError(err.message || "Failed to update avatar");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200 dark:border-rose-900/50 px-4 py-3 rounded-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your profile details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm relative group">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-teal-400 w-full"></div>
            
            <div className="px-6 pb-6 relative">
              <div className="relative -mt-12 mb-4 w-24 h-24 rounded-full border-4 border-white dark:border-[#18181b] overflow-hidden bg-white dark:bg-zinc-900 shrink-0 shadow-sm mx-auto group-hover:ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-[#18181b] transition-all cursor-pointer" onClick={() => setIsSelectingAvatar(!isSelectingAvatar)}>
                {selectedAvatarUrl ? (
                  <Image src={selectedAvatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <User className="w-8 h-8 text-zinc-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{user.name}</h2>
                <p className="text-xs font-medium text-zinc-500 flex items-center justify-center gap-1 mt-1">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details & Avatar Selector */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Avatar Selector Panel (Collapsible) */}
          {isSelectingAvatar && (
            <div className="bg-white dark:bg-[#18181b] border border-teal-200 dark:border-teal-900/50 p-6 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm tracking-tight text-teal-800 dark:text-teal-400">Choose an Avatar</h3>
                <button onClick={() => setIsSelectingAvatar(false)} className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-5 gap-3">
                {AVATARS.map((url) => (
                  <button 
                    key={url}
                    disabled={updatingAvatar}
                    onClick={() => updateAvatar(url)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${selectedAvatarUrl === url ? 'border-teal-500 shadow-md ring-2 ring-teal-500/20' : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'} ${updatingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Image src={url} alt="Avatar option" fill className="object-cover" />
                    {selectedAvatarUrl === url && (
                      <div className="absolute inset-0 bg-teal-500/10 flex items-end justify-end p-1">
                        <div className="bg-teal-500 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* User Details */}
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-[#18181b]/50">
              <h3 className="font-semibold text-sm">Personal Information</h3>
            </div>
            
            <div className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Full Name</label>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-800/50">
                    <User className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-800/50">
                    <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="text-sm font-medium">{user.email}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Account Type</label>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-800/50">
                    <Shield className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="text-sm font-medium">{user.role.replace("_", " ")}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Member Since</label>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-800/50">
                    <Calendar className="w-4 h-4 text-zinc-400 shrink-0" />
                    <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
