import { useState } from "react";
import { BadgeCheck, Clock, ExternalLink, Search, Star, User } from "lucide-react";
import { Profile } from "./types";

const EXPERIENCE_LEVELS = ["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "STAFF"];

interface InterviewerDirectoryProps {
  directory: Profile[];
  onSimulate: (profile: Profile) => void;
}

export function InterviewerDirectory({ directory, onSimulate }: InterviewerDirectoryProps) {
  const [dirSearch, setDirSearch] = useState("");
  const [dirLevel, setDirLevel] = useState("");
  const [dirSlot, setDirSlot] = useState("");

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

  return (
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
                    {p.calendlyLink.includes("calendly.com")
                      ? "Book via Calendly"
                      : p.calendlyLink.includes("cal.com")
                      ? "Book via Cal.com"
                      : p.calendlyLink.includes("jit.si")
                      ? "Join Jitsi Room"
                      : "Book Session"}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => onSimulate(p)}
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
  );
}
