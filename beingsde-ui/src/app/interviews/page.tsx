"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarClock, UserCheck, UserPlus, Clock, XCircle, Loader2, ExternalLink, Calendar } from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";

interface Interview {
  id: string;
  userId: string;
  matchedUserId: string | null;
  status: string;
  preferredTopics: string[] | null;
  experienceLevel: string | null;
  calendlyLink: string | null;
  notes: string | null;
  meetingLink: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  LOOKING: { label: "Finding partner...", color: "border-amber-200 bg-amber-50/50 text-amber-600 dark:border-amber-950 dark:bg-amber-950/20", icon: "search" },
  MATCHED: { label: "Matched", color: "border-emerald-200 bg-emerald-50/50 text-emerald-600 dark:border-emerald-950 dark:bg-emerald-950/20", icon: "check" },
  SCHEDULED: { label: "Scheduled", color: "border-blue-200 bg-blue-50/50 text-blue-600 dark:border-blue-950 dark:bg-blue-950/20", icon: "calendar" },
  COMPLETED: { label: "Completed", color: "border-zinc-200 bg-zinc-50/50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/20", icon: "done" },
  CANCELLED: { label: "Cancelled", color: "border-rose-200 bg-rose-50/50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/20", icon: "cancel" },
};

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendlyLink, setCalendlyLink] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("MID_LEVEL");
  const [preferredTopics, setPreferredTopics] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
      const res = await sessionAwareFetch(`${API_BASE}/interviews`, { headers });
      if (res.ok) {
        const data = await res.json();
        setInterviews(data.interviews || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const activeInterview = interviews.find(i =>
    ["LOOKING", "MATCHED", "SCHEDULED"].includes(i.status)
  );
  const pastInterviews = interviews.filter(i =>
    ["COMPLETED", "CANCELLED"].includes(i.status)
  );

  const handleFindPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      };
      const res = await sessionAwareFetch(`${API_BASE}/interviews/match`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          calendlyLink: calendlyLink || undefined,
          experienceLevel,
          preferredTopics: preferredTopics ? preferredTopics.split(",").map(t => t.trim()) : [],
          notes: notes || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.detail || body.message || "Failed to find a match");
        return;
      }
      setCalendlyLink("");
      setPreferredTopics("");
      setNotes("");
      await fetchInterviews();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers: Record<string, string> = { Authorization: `Bearer ${token || ""}` };
      await sessionAwareFetch(`${API_BASE}/interviews/${id}/cancel`, {
        method: "POST",
        headers,
      });
      await fetchInterviews();
    } catch {
      // silently fail
    }
  };

  return (
    <div className="flex flex-col gap-10 py-6 max-w-5xl mx-auto">
      <section>
        <h1 className="text-3xl font-black tracking-tight">Mock Interviews</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Practice system design with fellow premium engineers. Get matched, pick a time, and sharpen your skills together.
        </p>
      </section>

      {error && (
        <div className="border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 px-4 py-3 text-xs text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : activeInterview ? (
        <ActiveInterviewCard interview={activeInterview} onCancel={handleCancel} />
      ) : (
        <MatchForm
          calendlyLink={calendlyLink}
          setCalendlyLink={setCalendlyLink}
          experienceLevel={experienceLevel}
          setExperienceLevel={setExperienceLevel}
          preferredTopics={preferredTopics}
          setPreferredTopics={setPreferredTopics}
          notes={notes}
          setNotes={setNotes}
          submitting={submitting}
          onSubmit={handleFindPartner}
        />
      )}

      {pastInterviews.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold tracking-tight">Past Interviews</h2>
          <div className="grid grid-cols-1 gap-4">
            {pastInterviews.map(interview => (
              <PastInterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ActiveInterviewCard({ interview, onCancel }: { interview: Interview; onCancel: (id: string) => void }) {
  const cfg = STATUS_CONFIG[interview.status] || STATUS_CONFIG.LOOKING;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          {interview.status === "LOOKING" ? (
            <UserPlus className="w-8 h-8 text-amber-500" />
          ) : interview.status === "MATCHED" ? (
            <UserCheck className="w-8 h-8 text-emerald-500" />
          ) : (
            <CalendarClock className="w-8 h-8 text-blue-500" />
          )}
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {interview.status === "LOOKING" ? "In the Matching Pool" :
               interview.status === "MATCHED" ? "You've Been Matched!" :
               "Interview Scheduled"}
            </h2>
            <span className={`text-2xs font-bold font-mono px-2 py-0.5 uppercase border ${cfg.color}`}>
              {cfg.label}
            </span>
          </div>
        </div>
        {interview.status !== "SCHEDULED" && (
          <button
            onClick={() => onCancel(interview.id)}
            className="text-xs text-zinc-400 hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {interview.experienceLevel && (
          <div>
            <span className="text-2xs font-mono text-zinc-400 uppercase tracking-wider">Experience</span>
            <p className="font-medium mt-0.5">{interview.experienceLevel.replace("_", " ")}</p>
          </div>
        )}
        {interview.preferredTopics && interview.preferredTopics.length > 0 && (
          <div>
            <span className="text-2xs font-mono text-zinc-400 uppercase tracking-wider">Preferred Topics</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {interview.preferredTopics.map(topic => (
                <span key={topic} className="text-3xs font-mono px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
        <div>
          <span className="text-2xs font-mono text-zinc-400 uppercase tracking-wider">Status</span>
          <p className="font-medium mt-0.5 capitalize">{interview.status.toLowerCase()}</p>
        </div>
        {interview.notes && (
          <div className="md:col-span-2">
            <span className="text-2xs font-mono text-zinc-400 uppercase tracking-wider">Notes</span>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{interview.notes}</p>
          </div>
        )}
      </div>

      {interview.status === "MATCHED" && (
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 mb-3">
            Share your Calendly link with your partner to schedule the interview. If your partner shared theirs, it appears below.
          </p>
          {interview.calendlyLink && (
            <a
              href={interview.calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2 hover:opacity-80 transition-opacity"
            >
              <Calendar className="w-3.5 h-3.5" /> View Partner&apos;s Calendly <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {interview.status === "SCHEDULED" && interview.scheduledAt && (
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
          <Clock className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-medium">
            {new Date(interview.scheduledAt).toLocaleString()}
          </span>
          {interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-3 py-1.5 hover:opacity-80 transition-opacity"
            >
              Join <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function PastInterviewCard({ interview }: { interview: Interview }) {
  const cfg = STATUS_CONFIG[interview.status] || STATUS_CONFIG.CANCELLED;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className={`text-2xs font-bold font-mono px-2 py-0.5 uppercase border ${cfg.color}`}>
          {cfg.label}
        </span>
        <span className="text-xs text-zinc-500">
          {new Date(interview.createdAt).toLocaleDateString()}
        </span>
        {interview.preferredTopics && interview.preferredTopics.length > 0 && (
          <span className="text-xs text-zinc-400 hidden md:inline">
            {interview.preferredTopics.join(", ")}
          </span>
        )}
      </div>
      {interview.scheduledAt && (
        <span className="text-xs text-zinc-500">
          {new Date(interview.scheduledAt).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

function MatchForm({
  calendlyLink, setCalendlyLink,
  experienceLevel, setExperienceLevel,
  preferredTopics, setPreferredTopics,
  notes, setNotes,
  submitting, onSubmit,
}: {
  calendlyLink: string;
  setCalendlyLink: (v: string) => void;
  experienceLevel: string;
  setExperienceLevel: (v: string) => void;
  preferredTopics: string;
  setPreferredTopics: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-6 h-6 text-zinc-400" />
        <h2 className="text-xl font-bold tracking-tight">Find a Mock Interview Partner</h2>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5 max-w-lg">
        <div>
          <label className="text-2xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
            Your Calendly Link <span className="text-zinc-300">(optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://calendly.com/your-name"
            value={calendlyLink}
            onChange={e => setCalendlyLink(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
          />
          <p className="text-3xs text-zinc-400 mt-1">Share your Calendly so your partner can book a time with you.</p>
        </div>

        <div>
          <label className="text-2xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
            Experience Level
          </label>
          <select
            value={experienceLevel}
            onChange={e => setExperienceLevel(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
          >
            <option value="ENTRY_LEVEL">Entry Level</option>
            <option value="MID_LEVEL">Mid Level</option>
            <option value="SENIOR">Senior</option>
            <option value="STAFF">Staff+</option>
          </select>
        </div>

        <div>
          <label className="text-2xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
            Preferred Topics <span className="text-zinc-300">(comma separated)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Distributed Systems, Database Design, Caching"
            value={preferredTopics}
            onChange={e => setPreferredTopics(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
          />
        </div>

        <div>
          <label className="text-2xs font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
            Notes <span className="text-zinc-300">(optional)</span>
          </label>
          <textarea
            placeholder="What do you want to practice? Any specific system design areas?"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="self-start inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-5 py-2.5 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
          {submitting ? "Finding Partner..." : "Find a Partner"}
        </button>
      </form>

      <p className="text-3xs text-zinc-400 mt-6 leading-relaxed max-w-lg">
        You&apos;ll be added to the matching pool. When another premium user is looking for the same experience level,
        you&apos;ll be matched automatically. Both parties can then schedule via Calendly.
      </p>
    </div>
  );
}
