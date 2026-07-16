import { useState, useEffect } from "react";
import { ExternalLink, HelpCircle } from "lucide-react";
import { Profile } from "./types";

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

interface InterviewerConsoleProps {
  profile: Profile | null;
  onSave: (body: any) => Promise<void>;
  onStopOffering: () => Promise<void>;
}

export function InterviewerConsole({ profile, onSave, onStopOffering }: InterviewerConsoleProps) {
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [topicsInput, setTopicsInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [bio, setBio] = useState("");
  const [calendlyLink, setCalendlyLink] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<string[]>([]);
  const [availabilityText, setAvailabilityText] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setExperienceLevel(profile.experienceLevel || "");
      setBio(profile.bio || "");
      setCalendlyLink(profile.calendlyLink || "");
      setIsAvailable(profile.isAvailable);
      setAvailabilitySlots(profile.availabilitySlots || []);
      setAvailabilityText(profile.availabilityText || "");
      if (profile.topics) {
        setTopicsInput(profile.topics.join(", "));
      }
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
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
      await onSave(body);
    } finally {
      setSaving(false);
    }
  };

  return (
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

      <div className="flex items-center gap-3 mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 relative z-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 text-xs font-semibold uppercase tracking-wider bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-4 py-2 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 disabled:opacity-50 rounded-md shadow-sm cursor-pointer"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {profile?.isAvailable && (
          <button
            onClick={onStopOffering}
            className="text-xs font-semibold uppercase tracking-wider bg-transparent text-red-500 border border-red-200 dark:border-red-950/60 px-4 py-2 hover:border-red-500 rounded-md transition-colors cursor-pointer"
          >
            Stop offering
          </button>
        )}
      </div>
    </section>
  );
}
