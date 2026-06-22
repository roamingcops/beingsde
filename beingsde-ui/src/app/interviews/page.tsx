"use client";

import {
  useEffect, useState
} from "react";
import {
  BadgeCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Search,
  Star,
  User,
  X,
  Clock,
  Video,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1/interviews";

const EXPERIENCE_LEVELS = ["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "STAFF"];

function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1.5 cursor-pointer align-middle">
      <HelpCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 text-3xs font-mono leading-relaxed bg-zinc-950 dark:bg-zinc-800 text-zinc-100 dark:text-zinc-200 border border-zinc-800 rounded shadow-md z-30 pointer-events-none select-none text-center">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-950 dark:border-t-zinc-800" />
      </div>
    </div>
  );
}

interface Profile {
  id: string;
  name: string;
  topics: string[];
  experienceLevel: string;
  bio: string;
  calendlyLink: string;
  isAvailable: boolean;
  createdAt: string;
  averageRating: number | null;
  interviewsConducted: number;
  availabilitySlots?: string[];
  availabilityText?: string;
}

interface Interview {
  id: string;
  interviewerId: string;
  interviewerName: string;
  interviewerEmail: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  topic: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  meetingLink: string;
  feedbackScore: number | null;
  feedbackNotes: string | null;
  createdAt: string;
}

export default function InterviewsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [directory, setDirectory] = useState<Profile[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Profile fields
  const [name, setName] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [bio, setBio] = useState("");
  const [calendlyLink, setCalendlyLink] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<string[]>([]);
  const [availabilityText, setAvailabilityText] = useState("");

  // Search & Filter
  const [dirSearch, setDirSearch] = useState("");
  const [dirLevel, setDirLevel] = useState("");
  const [dirSlot, setDirSlot] = useState("");

  // Booking Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [bookingTopic, setBookingTopic] = useState("");
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [bookingMeetingLink, setBookingMeetingLink] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Actions
  const [submittingFeedback, setSubmittingFeedback] = useState<string | null>(null);
  const [cancellingInterviewId, setCancellingInterviewId] = useState<string | null>(null);
  const [feedbackScores, setFeedbackScores] = useState<Record<string, number>>({});
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});

  const loadData = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [profileRes, dirRes, interviewsRes] = await Promise.all([
        sessionAwareFetch(`${API_BASE}/profile/me`, { headers }),
        sessionAwareFetch(`${API_BASE}/directory`, { headers }),
        sessionAwareFetch(`${API_BASE}`, { headers }),
      ]);

      if (profileRes.ok) {
        const p: Profile = await profileRes.json();
        const normalized = {
          ...p,
          isAvailable: p.isAvailable ?? (p as any).available
        };
        setProfile(normalized);
        setName(normalized.name || "");
        setExperienceLevel(normalized.experienceLevel || "");
        setBio(normalized.bio || "");
        setCalendlyLink(normalized.calendlyLink || "");
        setIsAvailable(normalized.isAvailable);
        setAvailabilitySlots(normalized.availabilitySlots || []);
        setAvailabilityText(normalized.availabilityText || "");
        if (normalized.topics) {
          setTopicsInput(normalized.topics.join(", "));
        }
      } else {
        // No profile yet, keep inputs clean
        setProfile(null);
      }

      if (dirRes.ok) {
        setDirectory(await dirRes.json());
      }

      if (interviewsRes.ok) {
        setInterviews(await interviewsRes.json());
      }
    } catch (e) {
      console.error("Failed to load interview data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    const token = localStorage.getItem("accessToken");
    const topics = topicsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      name,
      topics,
      experienceLevel: experienceLevel || null,
      bio,
      calendlyLink,
      available: isAvailable,
      availabilitySlots,
      availabilityText,
    };

    try {
      const res = await sessionAwareFetch(`${API_BASE}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || data.message || "Failed to save profile");
      } else {
        const updated: Profile = await res.json();
        const normalized = {
          ...updated,
          isAvailable: updated.isAvailable ?? (updated as any).available
        };
        setProfile(normalized);
        setSuccessMsg("Interviewer profile updated successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
        // Refresh directory to reflect updates
        const dirRes = await sessionAwareFetch(`${API_BASE}/directory`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (dirRes.ok) setDirectory(await dirRes.json());
      }
    } catch {
      setError("Network error saving profile");
    } finally {
      setSaving(false);
    }
  };

  const stopOffering = async () => {
    const token = localStorage.getItem("accessToken");
    await sessionAwareFetch(`${API_BASE}/profile`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setIsAvailable(false);
    if (profile) setProfile({ ...profile, isAvailable: false, available: false } as any);
    setSuccessMsg("You have stopped offering mock interviews.");
    setTimeout(() => setSuccessMsg(""), 3000);
    // Refresh directory
    const dirRes = await sessionAwareFetch(`${API_BASE}/directory`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (dirRes.ok) setDirectory(await dirRes.json());
  };

  const openBookingModal = (interviewer: Profile) => {
    setSelectedProfile(interviewer);
    setBookingTopic(interviewer.topics[0] || "System Design");
    setBookingDateTime("");
    setBookingMeetingLink("");
    setError("");
    setShowBookingModal(true);
  };

  const handleBookInterview = async () => {
    if (!selectedProfile || !bookingTopic || !bookingDateTime) {
      setError("Please fill out topic and scheduled date/time");
      return;
    }
    setIsBooking(true);
    setError("");
    const token = localStorage.getItem("accessToken");
    try {
      const res = await sessionAwareFetch(`${API_BASE}/book`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: selectedProfile.id,
          topic: bookingTopic,
          scheduledAt: new Date(bookingDateTime).toISOString(),
          meetingLink: bookingMeetingLink || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to book interview");
      } else {
        setSuccessMsg(`Mock interview booked with ${selectedProfile.name}!`);
        setShowBookingModal(false);
        setTimeout(() => setSuccessMsg(""), 3000);
        await loadData();
      }
    } catch {
      setError("Network error scheduling interview");
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelInterview = async (interviewId: string) => {
    if (!confirm("Are you sure you want to cancel this interview session?")) return;
    setCancellingInterviewId(interviewId);
    const token = localStorage.getItem("accessToken");
    try {
      const res = await sessionAwareFetch(`${API_BASE}/${interviewId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to cancel interview");
      } else {
        setSuccessMsg("Session cancelled successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
        await loadData();
      }
    } catch {
      setError("Network error cancelling session");
    } finally {
      setCancellingInterviewId(null);
    }
  };

  const submitFeedback = async (interviewId: string) => {
    setSubmittingFeedback(interviewId);
    const token = localStorage.getItem("accessToken");
    const score = feedbackScores[interviewId] || 0;
    const notes = feedbackNotes[interviewId] || "";

    await sessionAwareFetch(`${API_BASE}/${interviewId}/feedback`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score, notes }),
    });

    setSubmittingFeedback(null);
    loadData();
  };

  const filteredDirectory = directory.filter((p) => {
    const matchLevel = !dirLevel || p.experienceLevel === dirLevel;
    if (!matchLevel) return false;

    const matchSlot = !dirSlot || (p.availabilitySlots && p.availabilitySlots.includes(dirSlot));
    if (!matchSlot) return false;

    if (!dirSearch) return true;
    const query = dirSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.topics.some((t) => t.toLowerCase().includes(query)) ||
      (p.bio && p.bio.toLowerCase().includes(query))
    );
  });

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "STAFF":
        return "border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400";
      case "SENIOR":
        return "border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400";
      case "MID_LEVEL":
        return "border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400";
      case "ENTRY_LEVEL":
      default:
        return "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Banner / Header */}
      <section className="relative overflow-hidden rounded-lg bg-zinc-900 text-zinc-100 p-8 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-3xs font-mono font-bold tracking-widest uppercase bg-zinc-800 border border-zinc-700 text-zinc-400 px-2.5 py-1 rounded-full w-max">
              Premium Mock Interviews
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
              Mock Interviews
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Conduct high-fidelity system design mock sessions with experienced engineers or offer your skills to help other system architects grow.
            </p>
          </div>
        </div>
      </section>

      {/* Notifications */}
      {error && (
        <div className="flex gap-2.5 items-start p-4 text-sm border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-md">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="flex gap-2.5 items-start p-4 text-sm border border-emerald-200 dark:border-emerald-950 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-md">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interviewer Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className={`relative overflow-hidden border p-5 rounded-xl transition-all duration-350 shadow-md ${
            isAvailable 
              ? "border-emerald-500/25 dark:border-emerald-500/15 bg-white/70 dark:bg-zinc-900/60" 
              : "border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/30"
          } backdrop-blur-sm`}>
            
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800/80 mb-4 relative z-10">
              <div>
                <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                  Interviewer Console
                </h2>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none relative">
                <span className="text-3xs font-bold uppercase tracking-wider font-mono text-zinc-400 dark:text-zinc-500">
                  Online
                </span>
                <div className="relative w-8 h-4.5">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
                  />
                  <div className="w-8 h-4.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-250 dark:bg-zinc-800 peer-checked:bg-emerald-500 dark:peer-checked:bg-emerald-500 peer-checked:border-emerald-600 dark:peer-checked:border-emerald-500 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 peer-checked:translate-x-3.5 peer-checked:border-emerald-500 transition-all shadow-sm" />
                </div>
              </label>
            </div>

            {/* Profile Statistics Widgets */}
            {profile && (
              <div className="flex items-center justify-around py-1.5 px-3 bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-800/50 rounded-lg mb-4 text-3xs text-zinc-500 dark:text-zinc-400 font-mono relative z-10">
                <div>
                  Conducted: <strong className="text-zinc-700 dark:text-zinc-300">{profile.interviewsConducted}</strong>
                </div>
                <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex items-center gap-1">
                  Rating: <strong className="text-zinc-700 dark:text-zinc-300">{profile.averageRating ? `${profile.averageRating} ★` : "New"}</strong>
                </div>
              </div>
            )}

            {/* Edit Form */}
            <div className="flex flex-col gap-3.5 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-3xs font-bold uppercase tracking-wider font-mono text-zinc-400 dark:text-zinc-500">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors rounded-md dark:text-zinc-100"
                    placeholder="Your name"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-3xs font-bold uppercase tracking-wider font-mono text-zinc-400 dark:text-zinc-500">Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors rounded-md dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="" className="dark:bg-zinc-900">Select level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level} className="dark:bg-zinc-900">
                        {level.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-3xs font-bold uppercase tracking-wider font-mono text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
                  <span>Booking Link</span>
                  <InfoTooltip text="Link your Calendly, Cal.com scheduling page. Signup links: calendly.com / cal.com" />
                </label>
                <div className="relative flex items-center">
                  <input
                    type="url"
                    value={calendlyLink}
                    onChange={(e) => setCalendlyLink(e.target.value)}
                    className="w-full pl-2.5 pr-20 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors rounded-md dark:text-zinc-100"
                    placeholder="https://calendly.com/your-username"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const cleanName = (name || "user").toLowerCase().replace(/[^a-z0-9]/g, "-");
                      setCalendlyLink(`https://meet.jit.si/beingsde-interviews-${cleanName}-${Math.floor(1000 + Math.random() * 9000)}`);
                    }}
                    className="absolute right-1.5 text-[9px] font-bold font-mono uppercase tracking-wider bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                  >
                    + Jitsi Link
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-zinc-400 dark:text-zinc-550">
                  <span>Sign up:</span>
                  <a
                    href="https://calendly.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors inline-flex items-center gap-0.5"
                  >
                    Calendly <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <span>•</span>
                  <a
                    href="https://cal.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors inline-flex items-center gap-0.5"
                  >
                    Cal.com <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-3xs font-bold uppercase tracking-wider font-mono text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
                  <span>Topics</span>
                  <InfoTooltip text="Enter mock interview topics you cover, separated by commas (e.g. Caching, Sharding)." />
                </label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors rounded-md dark:text-zinc-100"
                  placeholder="Redis, Kafka (comma-separated)"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-3xs font-bold uppercase tracking-wider font-mono text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
                  <span>Availability</span>
                  <InfoTooltip text="Select the general slots you are free, and describe custom details below." />
                </label>
                <div className="grid grid-cols-3 gap-1.5 mb-0.5">
                  {[
                    { label: "Weekdays AM", value: "WEEKDAYS_MORNING" },
                    { label: "Weekdays PM", value: "WEEKDAYS_EVENING" },
                    { label: "Weekends", value: "WEEKENDS" },
                  ].map((s) => {
                    const active = availabilitySlots.includes(s.value);
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setAvailabilitySlots((prev) => prev.filter((val) => val !== s.value));
                          } else {
                            setAvailabilitySlots((prev) => [...prev, s.value]);
                          }
                        }}
                        className={`text-[9px] font-bold uppercase tracking-wider py-1.5 rounded-md border text-center transition-all select-none cursor-pointer ${
                          active
                            ? "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                            : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-500 dark:hover:border-zinc-700"
                        }`}
                      >
                        {active ? "✓ " : "+ "} {s.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={availabilityText}
                  onChange={(e) => setAvailabilityText(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors rounded-md dark:text-zinc-100"
                  placeholder="e.g. Saturdays 10 AM - 4 PM EST"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-3xs font-bold uppercase tracking-wider font-mono text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
                  <span>Bio / Focus</span>
                  <InfoTooltip text="A brief bio of your system design background, expertise, or typical mock structure." />
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400 transition-colors resize-none rounded-md dark:text-zinc-100"
                  placeholder="Describe your system design experience and focus..."
                />
              </div>
            </div>

            {/* Hand-drawn chalk calendar doodle background */}
            <svg className="w-24 h-24 text-zinc-400/5 dark:text-zinc-800/10 absolute -right-2 -bottom-2 pointer-events-none select-none rotate-6 z-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20,25 C30,23 70,24 80,25 C82,35 81,75 80,80 C70,82 30,81 20,80 C18,70 19,35 20,25 Z" />
              <path d="M35,18 C35,22 36,26 35,28" />
              <path d="M65,18 C65,22 66,26 65,28" />
              <path d="M22,42 C35,41 65,42 78,41" />
              <path d="M21,58 C35,59 65,58 79,59" />
              <path d="M40,28 C41,45 40,75 41,78" />
              <path d="M60,28 C59,45 60,75 59,78" />
              <path d="M48,48 C50,49 52,50 51,52 C49,53 47,51 48,48 Z" fill="currentColor" opacity="0.5" />
              <path d="M28,68 C32,66 33,70 31,72 Z" fill="currentColor" opacity="0.5" />
            </svg>

            <div className="flex items-center gap-3 mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex-1 text-xs font-semibold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-4 py-2 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 disabled:opacity-50 rounded-md shadow-sm cursor-pointer"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              {profile?.isAvailable && (
                <button
                  onClick={stopOffering}
                  className="text-xs font-semibold uppercase tracking-wider bg-transparent text-red-500 border border-red-200 dark:border-red-950/60 px-4 py-2 hover:border-red-500 rounded-md transition-colors cursor-pointer"
                >
                  Stop offering
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Search & Schedule Directory */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Section: Find an Interviewer */}
          <section className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 rounded-lg shadow-sm">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                Find an Interviewer
              </h2>
              <span className="text-3xs font-mono text-zinc-400">Book practice mock system design sessions</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 transition-colors rounded-md"
                  placeholder="Search by name, topic, or keyword..."
                />
              </div>
              <select
                value={dirLevel}
                onChange={(e) => setDirLevel(e.target.value)}
                className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 transition-colors rounded-md dark:bg-zinc-900"
              >
                <option value="" className="dark:bg-zinc-900">All Levels</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level} className="dark:bg-zinc-900">
                    {level.replace("_", " ")}
                  </option>
                ))}
              </select>
              <select
                value={dirSlot}
                onChange={(e) => setDirSlot(e.target.value)}
                className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 transition-colors rounded-md dark:bg-zinc-900"
              >
                <option value="" className="dark:bg-zinc-900">All Slots</option>
                <option value="WEEKDAYS_MORNING" className="dark:bg-zinc-900">Weekdays (Mornings)</option>
                <option value="WEEKDAYS_EVENING" className="dark:bg-zinc-900">Weekdays (Evenings)</option>
                <option value="WEEKENDS" className="dark:bg-zinc-900">Weekends</option>
              </select>
            </div>

            {filteredDirectory.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                <User className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                <p className="text-sm text-zinc-400">No interviewers available right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDirectory.map((p) => (
                  <div
                    key={p.id}
                    className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/60 p-5 rounded-lg flex flex-col justify-between gap-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                            {p.name}
                            <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          </h3>
                          <span className={`text-3xs font-mono font-bold px-2 py-0.5 border rounded-full w-max ${getExperienceColor(p.experienceLevel)}`}>
                            {p.experienceLevel.replace("_", " ")}
                          </span>
                        </div>

                        {/* Rating Display */}
                        <div className="flex items-center gap-1 text-2xs font-semibold text-zinc-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{p.averageRating ? `${p.averageRating} (${p.interviewsConducted})` : "New"}</span>
                        </div>
                      </div>

                      {p.topics && p.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {p.topics.map((topic) => (
                            <span
                              key={topic}
                              className="text-3xs font-mono px-2 py-0.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 bg-zinc-100 dark:bg-zinc-800/40 rounded-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}

                      {p.bio && (
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{p.bio}</p>
                      )}

                      {((p.availabilitySlots && p.availabilitySlots.length > 0) || p.availabilityText) && (
                        <div className="flex flex-col gap-1 mt-1 p-2 bg-zinc-100/50 dark:bg-zinc-950/20 border border-zinc-200/40 dark:border-zinc-800/40 rounded-md">
                          <span className="text-3xs font-mono font-bold uppercase text-zinc-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> Availability
                          </span>
                          <span className="text-3xs text-zinc-500 font-medium">
                            {p.availabilitySlots && p.availabilitySlots.length > 0 && (
                              <span className="capitalize block mb-0.5 font-mono">
                                {p.availabilitySlots.map(s => s.toLowerCase().replace("_", " ")).join(", ")}
                              </span>
                            )}
                            {p.availabilityText && (
                              <span className="italic block text-zinc-400">
                                {p.availabilityText}
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-200/50 dark:border-zinc-850">
                      {p.calendlyLink && (
                        <a
                          href={p.calendlyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-3xs font-bold uppercase tracking-wider bg-transparent text-zinc-800 dark:text-zinc-200 px-3 py-2 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-950 dark:hover:border-zinc-300 rounded-md transition-colors"
                        >
                          Book via Calendly
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        onClick={() => openBookingModal(p)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-3xs font-bold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-3 py-2 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all rounded-md shadow-sm"
                      >
                        Simulate Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section: My Interviews */}
          <section className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 rounded-lg shadow-sm">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-lg font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
                My Interviews
              </h2>
              <span className="text-3xs font-mono text-zinc-400">Track and review your mock sessions</span>
            </div>

            {interviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                <Calendar className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                <p className="text-sm text-zinc-400">No interviews yet. Book one from the directory above.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Upcoming Sessions
                  </h3>
                  {interviews.filter((i) => i.status === "SCHEDULED").length === 0 ? (
                    <p className="text-xs text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-md border border-dashed border-zinc-200 dark:border-zinc-800">
                      No upcoming interviews.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {interviews
                        .filter((i) => i.status === "SCHEDULED")
                        .map((interview) => (
                          <InterviewRow
                            key={interview.id}
                            interview={interview}
                            userEmail={userEmail}
                            submittingFeedback={submittingFeedback}
                            feedbackScores={feedbackScores}
                            feedbackNotes={feedbackNotes}
                            setFeedbackScores={setFeedbackScores}
                            setFeedbackNotes={setFeedbackNotes}
                            onSubmitFeedback={submitFeedback}
                            onCancel={handleCancelInterview}
                            cancellingId={cancellingInterviewId}
                          />
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400 mb-3 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> History & Feedback
                  </h3>
                  {interviews.filter((i) => i.status !== "SCHEDULED").length === 0 ? (
                    <p className="text-xs text-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-md border border-dashed border-zinc-200 dark:border-zinc-800">
                      No past interviews.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {interviews
                        .filter((i) => i.status !== "SCHEDULED")
                        .map((interview) => (
                          <InterviewRow
                            key={interview.id}
                            interview={interview}
                            userEmail={userEmail}
                            submittingFeedback={submittingFeedback}
                            feedbackScores={feedbackScores}
                            feedbackNotes={feedbackNotes}
                            setFeedbackScores={setFeedbackScores}
                            setFeedbackNotes={setFeedbackNotes}
                            onSubmitFeedback={submitFeedback}
                            onCancel={handleCancelInterview}
                            cancellingId={cancellingInterviewId}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Booking Simulation Dialog */}
      {showBookingModal && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-2xl flex flex-col gap-4">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-1">
              <h2 className="text-md font-bold text-zinc-800 dark:text-zinc-100">
                Schedule Practice Session
              </h2>
              <span className="text-2xs text-zinc-500 font-medium">
                Simulate a live design interview with <strong className="text-zinc-700 dark:text-zinc-300">{selectedProfile.name}</strong>
              </span>
            </div>

            {((selectedProfile.availabilitySlots && selectedProfile.availabilitySlots.length > 0) || selectedProfile.availabilityText) && (
              <div className="bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-800 p-3 rounded-md text-3xs text-zinc-500">
                <span className="font-bold text-zinc-400 block uppercase font-mono mb-1">Interviewer Availability</span>
                {selectedProfile.availabilitySlots && selectedProfile.availabilitySlots.length > 0 && (
                  <div className="capitalize font-mono mb-0.5">
                    Slots: {selectedProfile.availabilitySlots.map(s => s.toLowerCase().replace("_", " ")).join(", ")}
                  </div>
                )}
                {selectedProfile.availabilityText && (
                  <div className="italic text-zinc-400">
                    Hours: {selectedProfile.availabilityText}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3.5 mt-2">
              <div className="flex flex-col gap-1">
                <label className="text-3xs font-mono font-bold uppercase text-zinc-400">Choose Topic</label>
                <select
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 rounded-md dark:bg-zinc-800"
                >
                  {selectedProfile.topics.map((topic) => (
                    <option key={topic} value={topic} className="dark:bg-zinc-800">
                      {topic}
                    </option>
                  ))}
                  <option value="System Design Practice" className="dark:bg-zinc-800">Custom / General Design</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-3xs font-mono font-bold uppercase text-zinc-400">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={bookingDateTime}
                  onChange={(e) => setBookingDateTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 rounded-md dark:bg-zinc-800"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-3xs font-mono font-bold uppercase text-zinc-400">Simulated Meet Link (Optional)</label>
                <input
                  type="url"
                  value={bookingMeetingLink}
                  onChange={(e) => setBookingMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xyz-abc-qwe"
                  className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 rounded-md dark:bg-zinc-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-xs font-semibold px-4 py-2 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookInterview}
                disabled={isBooking}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-4 py-2 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all rounded-md shadow-sm disabled:opacity-50"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scheduling...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InterviewRow({
  interview,
  userEmail,
  submittingFeedback,
  feedbackScores,
  feedbackNotes,
  setFeedbackScores,
  setFeedbackNotes,
  onSubmitFeedback,
  onCancel,
  cancellingId,
}: {
  interview: Interview;
  userEmail: string | null;
  submittingFeedback: string | null;
  feedbackScores: Record<string, number>;
  feedbackNotes: Record<string, string>;
  setFeedbackScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setFeedbackNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmitFeedback: (id: string) => void;
  onCancel: (id: string) => void;
  cancellingId: string | null;
}) {
  const [expanded, setExpanded] = useState(false);

  const isInterviewer = userEmail && interview.interviewerEmail ? interview.interviewerEmail === userEmail : (userEmail ? interview.interviewerId !== interview.candidateId : false);
  const roleLabel = isInterviewer ? "As Interviewer" : "As Candidate";
  const partnerName = isInterviewer ? interview.candidateName : interview.interviewerName;
  const partnerEmail = isInterviewer ? interview.candidateEmail : interview.interviewerEmail;

  return (
    <div className={`border p-4 rounded-lg flex flex-col gap-3 transition-colors duration-200 ${
      interview.status === "SCHEDULED" 
        ? "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40" 
        : "border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/20 dark:bg-zinc-950/10"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <span className={`text-3xs font-bold font-mono uppercase px-2 py-0.5 border rounded-full shrink-0 ${
            isInterviewer 
              ? "border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400"
              : "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
          }`}>
            {roleLabel}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">{interview.topic}</span>
            <span className="text-3xs text-zinc-400 truncate">
              {isInterviewer ? "Candidate: " : "Interviewer: "} <strong>{partnerName}</strong> ({partnerEmail})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          {interview.scheduledAt && (
            <span className="text-3xs text-zinc-500 font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-sm flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(interview.scheduledAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          <span className={`text-3xs font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
            interview.status === "SCHEDULED"
              ? "border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
              : interview.status === "COMPLETED"
              ? "border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-zinc-200 dark:border-zinc-800 text-zinc-500 bg-zinc-100 dark:bg-zinc-800/40"
          }`}>
            {interview.status}
          </span>

          {interview.status === "SCHEDULED" && interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xs font-bold uppercase tracking-wider bg-transparent text-zinc-800 dark:text-zinc-200 px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-950 dark:hover:border-zinc-300 rounded-md transition-colors flex items-center gap-1 shadow-sm"
            >
              <Video className="w-3 h-3" /> Join
            </a>
          )}

          {interview.status === "SCHEDULED" && (
            <button
              onClick={() => onCancel(interview.id)}
              disabled={cancellingId === interview.id}
              className="text-3xs font-bold uppercase tracking-wider text-red-500 border border-transparent hover:border-red-300 dark:hover:border-red-900/60 px-3 py-1.5 rounded-md hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          {interview.status === "SCHEDULED" && isInterviewer && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-3xs font-bold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-3 py-1.5 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 rounded-md transition-all flex items-center gap-1 shadow-sm"
            >
              Feedback {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {interview.feedbackScore != null && (
            <div className="flex items-center gap-0.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 px-2 py-0.5 rounded-md">
              <span>{interview.feedbackScore}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          )}
        </div>
      </div>

      {/* Star feedback expander for completed rows */}
      {interview.status === "COMPLETED" && interview.feedbackNotes && (
        <div className="mt-2.5 p-3 bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-md">
          <span className="text-3xs font-mono font-bold uppercase text-zinc-400 block mb-1">Feedback from Interviewer</span>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
            &ldquo;{interview.feedbackNotes}&rdquo;
          </p>
        </div>
      )}

      {expanded && (
        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-3xs font-mono font-bold uppercase text-zinc-400">Score performance</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() =>
                    setFeedbackScores((prev) => ({ ...prev, [interview.id]: score }))
                  }
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      (feedbackScores[interview.id] || 0) >= score
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-300 dark:text-zinc-700"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-3xs font-mono font-bold uppercase text-zinc-400">Detailed Feedback Notes</span>
            <textarea
              value={feedbackNotes[interview.id] || ""}
              onChange={(e) =>
                setFeedbackNotes((prev) => ({ ...prev, [interview.id]: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-800 dark:focus:border-zinc-200 transition-colors resize-none rounded-md"
              placeholder="Provide constructive feedback detailing their trade-off analysis, system components depth, and technical communication..."
            />
          </div>

          <button
            onClick={() => onSubmitFeedback(interview.id)}
            disabled={submittingFeedback === interview.id}
            className="self-start text-3xs font-semibold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-4 py-2 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all rounded-md shadow-sm disabled:opacity-50"
          >
            {submittingFeedback === interview.id ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
