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
        return "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300";
      case "SENIOR":
        return "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300";
      case "MID_LEVEL":
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300";
      case "ENTRY_LEVEL":
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300";
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
              className="group border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 rounded-xl flex flex-col justify-between gap-5 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img 
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${p.name}`} 
                        alt={p.name} 
                        className="w-11 h-11 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900"
                      />
                      <BadgeCheck className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 bg-white dark:bg-zinc-950 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {p.name}
                      </h3>
                      <span className={`mt-0.5 text-xs font-semibold px-2 py-0.5 rounded w-max ${getExperienceColor(p.experienceLevel)}`}>
                        {p.experienceLevel.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{p.averageRating ? `${p.averageRating} (${p.interviewsConducted})` : "New"}</span>
                  </div>
                </div>

                {p.topics && p.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs font-medium px-2.5 py-1 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/50 rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {p.bio && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{p.bio}</p>
                )}

                {((p.availabilitySlots && p.availabilitySlots.length > 0) || p.availabilityText) && (
                  <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                    <Clock className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400" />
                    <div className="flex flex-col">
                      {p.availabilitySlots && p.availabilitySlots.length > 0 && (
                        <span className="capitalize font-medium">
                          {p.availabilitySlots.map(s => s.toLowerCase().replace("_", " ")).join(", ")}
                        </span>
                      )}
                      {p.availabilityText && (
                        <span className="italic text-zinc-500">
                          {p.availabilityText}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-auto">
                {p.calendlyLink && (
                  <a
                    href={p.calendlyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-4 py-2 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    {p.calendlyLink.includes("calendly.com")
                      ? "Calendly"
                      : p.calendlyLink.includes("cal.com")
                      ? "Cal.com"
                      : p.calendlyLink.includes("jit.si")
                      ? "Jitsi Room"
                      : "Book Session"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => onSimulate(p)}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Simulate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
