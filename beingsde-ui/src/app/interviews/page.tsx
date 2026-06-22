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
} from "lucide-react";
import { sessionAwareFetch } from "@/lib/sessionAwareFetch";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1/interviews";

const EXPERIENCE_LEVELS = ["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "STAFF"];

interface Profile {
  id: string;
  name: string;
  topics: string[];
  experienceLevel: string;
  bio: string;
  calendlyLink: string;
  isAvailable: boolean;
  createdAt: string;
}

interface Interview {
  id: string;
  interviewerId: string;
  candidateId: string;
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

  const [name, setName] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [bio, setBio] = useState("");
  const [calendlyLink, setCalendlyLink] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);

  const [dirSearch, setDirSearch] = useState("");
  const [dirLevel, setDirLevel] = useState("");

  const [submittingFeedback, setSubmittingFeedback] = useState<string | null>(null);
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
        setProfile(p);
        setName(p.name || "");
        setExperienceLevel(p.experienceLevel || "");
        setBio(p.bio || "");
        setCalendlyLink(p.calendlyLink || "");
        setIsAvailable(p.isAvailable);
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
    const init = async () => {
      await Promise.resolve();
      await loadData();
    };
    init();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setError("");
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
        setProfile(updated);
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
    if (profile) setProfile({ ...profile, isAvailable: false });
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
    if (!dirSearch) return true;
    const query = dirSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.topics.some((t) => t.toLowerCase().includes(query)) ||
      (p.bio && p.bio.toLowerCase().includes(query))
    );
  });

  const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 py-6 max-w-5xl mx-auto">
      <section className="text-center max-w-xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Mock Interviews</h1>
        <p className="text-sm text-zinc-500">
          Offer mock interviews or book sessions with experienced interviewers.
        </p>
      </section>

      {error && (
        <div className="flex gap-2.5 items-start p-3 text-xs border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-sm">
          <X className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <section className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold tracking-tight">My Interviewer Profile</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">
              Offer mock interviews
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100 peer-checked:border-zinc-900 dark:peer-checked:border-zinc-100 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 peer-checked:translate-x-4 peer-checked:border-zinc-900 dark:peer-checked:border-zinc-100 transition-all shadow-sm" />
            </div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
            >
              <option value="">Select level</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">
              Topics <span className="text-zinc-300 normal-case">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              placeholder="Redis, Kafka, Load Balancing"
            />
            {topicsInput && (
              <div className="flex flex-wrap gap-1 mt-1">
                {topicsInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((topic) => (
                    <span
                      key={topic}
                      className="text-3xs font-mono px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-900"
                    >
                      {topic}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Calendly Link</label>
            <input
              type="url"
              value={calendlyLink}
              onChange={(e) => setCalendlyLink(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              placeholder="https://calendly.com/your-link"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors resize-none"
              placeholder="Brief description of your experience and what topics you can help with..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {profile?.isAvailable && (
            <button
              onClick={stopOffering}
              className="text-xs font-semibold uppercase tracking-wider bg-transparent text-red-500 border border-red-300 dark:border-red-800 px-4 py-2 hover:border-red-500 transition-colors"
            >
              Stop offering
            </button>
          )}
        </div>
      </section>

      <section className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm">
        <h2 className="text-lg font-bold tracking-tight mb-4">Find an Interviewer</h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={dirSearch}
              onChange={(e) => setDirSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
              placeholder="Search by name, topic, or keyword..."
            />
          </div>
          <select
            value={dirLevel}
            onChange={(e) => setDirLevel(e.target.value)}
            className="px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
          >
            <option value="">All Levels</option>
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {filteredDirectory.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-sm">
            <User className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-400">No interviewers available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDirectory.map((p) => (
              <div
                key={p.id}
                className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold">{p.name}</h3>
                    <span className="text-3xs font-mono px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
                      {p.experienceLevel.replace("_", " ")}
                    </span>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                </div>

                {p.topics && p.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-3xs font-mono px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 text-zinc-400 bg-zinc-50 dark:bg-zinc-900"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {p.bio && (
                  <p className="text-xs text-zinc-500 line-clamp-2">{p.bio}</p>
                )}

                {p.calendlyLink && (
                  <a
                    href={p.calendlyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-3 py-1.5 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 self-start"
                  >
                    Book via Calendly
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm">
        <h2 className="text-lg font-bold tracking-tight mb-4">My Interviews</h2>

        {interviews.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-sm">
            <Calendar className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            <p className="text-sm text-zinc-400">No interviews yet. Book one from the directory above.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400 mb-3">Upcoming</h3>
              {interviews.filter((i) => i.status === "SCHEDULED").length === 0 ? (
                <p className="text-xs text-zinc-500">No upcoming interviews.</p>
              ) : (
                <div className="flex flex-col gap-2">
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
                      />
                    ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-2xs font-bold uppercase tracking-wider font-mono text-zinc-400 mb-3">Past</h3>
              {interviews.filter((i) => i.status !== "SCHEDULED").length === 0 ? (
                <p className="text-xs text-zinc-500">No past interviews.</p>
              ) : (
                <div className="flex flex-col gap-2">
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
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
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
}: {
  interview: Interview;
  userEmail: string | null;
  submittingFeedback: string | null;
  feedbackScores: Record<string, number>;
  feedbackNotes: Record<string, string>;
  setFeedbackScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setFeedbackNotes: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSubmitFeedback: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const isInterviewer = userEmail ? interview.interviewerId !== interview.candidateId : false;
  const roleLabel = isInterviewer ? "As Interviewer" : "As Candidate";

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 p-3 rounded-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xs font-bold font-mono uppercase px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 shrink-0">
            {roleLabel}
          </span>
          <span className="text-xs font-medium truncate">{interview.topic}</span>
          <span className="text-3xs font-bold font-mono uppercase px-2 py-0.5 border shrink-0">
            {interview.status}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {interview.scheduledAt && (
            <span className="text-3xs text-zinc-500 font-mono">
              {new Date(interview.scheduledAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          {interview.status === "SCHEDULED" && interview.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
            >
              Join <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {interview.status === "SCHEDULED" && isInterviewer && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-3xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-1"
            >
              Feedback {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          {interview.feedbackScore != null && (
            <div className="flex items-center gap-1">
              {Array.from({ length: interview.feedbackScore }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-zinc-900 dark:fill-zinc-100 text-zinc-900 dark:text-zinc-100" />
              ))}
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() =>
                  setFeedbackScores((prev) => ({ ...prev, [interview.id]: score }))
                }
                className="p-0.5"
              >
                <Star
                  className={`w-4 h-4 ${
                    (feedbackScores[interview.id] || 0) >= score
                      ? "fill-zinc-900 dark:fill-zinc-100 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-300 dark:text-zinc-600"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={feedbackNotes[interview.id] || ""}
            onChange={(e) =>
              setFeedbackNotes((prev) => ({ ...prev, [interview.id]: e.target.value }))
            }
            rows={2}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-transparent text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors resize-none"
            placeholder="Share your feedback on the candidate's performance..."
          />
          <button
            onClick={() => onSubmitFeedback(interview.id)}
            disabled={submittingFeedback === interview.id}
            className="self-start text-3xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-3 py-1.5 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 disabled:opacity-50"
          >
            {submittingFeedback === interview.id ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
