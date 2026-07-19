"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  BarChart3,
  MessageSquare,
  Shield,
  Trophy,
  BookOpen,
  Star,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Brain,
  Users,
} from "lucide-react";
import defaultBarRaiserQuestions from "@/data/bar-raiser.json";

type Level = "SDE1" | "SDE2" | "SDE3" | "Principal";
type Category =
  | "Ownership"
  | "Conflict"
  | "Delivery"
  | "Ambiguity"
  | "Technical Leadership"
  | "Customer Obsession";

interface LevelAnswer {
  level: Level;
  focus: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  keyTakeaway: string;
}

interface BarRaiserQuestion {
  id?: string;
  title: string;
  category: Category;
  principle: string;
  why: string;
  redFlags: string[];
  greenFlags: string[];
  levels: LevelAnswer[];
}

const LEVEL_CONFIG: Record<Level, { label: string; color: string; bg: string; border: string; badge: string }> = {
  SDE1: {
    label: "SDE 1 · Junior Engineer",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  SDE2: {
    label: "SDE 2 · Mid-Level Engineer",
    color: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-800",
    badge: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
  },
  SDE3: {
    label: "SDE 3 · Senior Engineer",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    badge: "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  },
  Principal: {
    label: "Principal Engineer",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
};

const CATEGORY_CONFIG: Record<Category, { icon: React.ElementType; color: string; bg: string }> = {
  Ownership: { icon: Shield, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/30" },
  Conflict: { icon: MessageSquare, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30" },
  Delivery: { icon: Zap, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/30" },
  Ambiguity: { icon: Brain, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" },
  "Technical Leadership": { icon: BarChart3, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  "Customer Obsession": { icon: Target, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-950/30" },
};

function STARSection({ label, color, bgColor, content }: {
  label: string;
  color: string;
  bgColor: string;
  content: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      <span className={`text-[10px] font-bold uppercase tracking-widest font-mono block mb-2 ${color}`}>{label}</span>
      <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">{content}</p>
    </div>
  );
}

function LevelAnswerCard({ answer }: { answer: LevelAnswer }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = LEVEL_CONFIG[answer.level];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${cfg.border}`}>
      <button
        className={`w-full flex items-center justify-between p-4 text-left gap-3 ${cfg.bg}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-[10px] font-bold font-mono uppercase px-2.5 py-1 border rounded-full shrink-0 ${cfg.badge}`}>
            {answer.level}
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{answer.focus}</span>
          </div>
        </div>
        <div className={`shrink-0 ${cfg.color}`}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="p-5 space-y-3 border-t border-zinc-100 dark:border-zinc-800/60">
          <STARSection
            label="🎬 Situation — What was happening?"
            color="text-zinc-600 dark:text-zinc-400"
            bgColor="bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-700/50"
            content={answer.situation}
          />
          <STARSection
            label="🎯 Task — What was YOUR specific responsibility?"
            color="text-sky-600 dark:text-sky-400"
            bgColor="bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/50"
            content={answer.task}
          />
          <STARSection
            label="⚡ Action — What did YOU specifically do? (This is scored most heavily)"
            color="text-violet-600 dark:text-violet-400"
            bgColor="bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50"
            content={answer.action}
          />
          <STARSection
            label="🏆 Result — What was the measurable outcome?"
            color="text-emerald-600 dark:text-emerald-400"
            bgColor="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50"
            content={answer.result}
          />

          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono block mb-1">Bar Raiser Key Takeaway</span>
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed font-medium">{answer.keyTakeaway}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ q, index }: { q: BarRaiserQuestion; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [activeLevel, setActiveLevel] = useState<Level | "ALL">("ALL");
  const catCfg = CATEGORY_CONFIG[q.category] || CATEGORY_CONFIG["Ownership"];
  const CatIcon = catCfg.icon;
  const displayedLevels = activeLevel === "ALL" ? q.levels : q.levels.filter(l => l.level === activeLevel);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold font-mono text-sm border border-zinc-200 dark:border-zinc-700">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catCfg.bg} ${catCfg.color} border border-current/10`}>
                <CatIcon className="w-3 h-3" />
                {q.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {q.principle}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug mb-4">
              {q.title}
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-lg p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400 flex items-center gap-1 mb-2">
                  <AlertTriangle className="w-3 h-3" /> Red Flags — Do Not Say These
                </span>
                <ul className="space-y-1.5">
                  {q.redFlags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-lg p-3.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-2">
                  <CheckCircle2 className="w-3 h-3" /> Green Flags — Aim for These
                </span>
                <ul className="space-y-1.5">
                  {q.greenFlags.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-5 w-full flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 py-2.5 rounded-lg transition-all bg-zinc-50/50 dark:bg-zinc-800/30"
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" /> Collapse All STAR Answers</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> View STAR Answers for All 4 Levels</>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 space-y-5 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="flex items-start gap-3 p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg">
            <Brain className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400 font-mono block mb-1">Why Bar Raisers Ask This Question</span>
              <p className="text-sm text-sky-850 dark:text-sky-300 leading-relaxed">{q.why}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 mb-2.5">Filter by your level:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLevel("ALL")}
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${activeLevel === "ALL" ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100" : "border-zinc-200 dark:border-zinc-700 text-zinc-655 dark:text-zinc-400 hover:border-zinc-400 bg-white dark:bg-transparent"}`}
              >
                All Levels
              </button>
              {(["SDE1", "SDE2", "SDE3", "Principal"] as Level[]).map(lvl => {
                const cfg = LEVEL_CONFIG[lvl];
                return (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${activeLevel === lvl ? cfg.badge : "border-zinc-200 dark:border-zinc-700 text-zinc-655 dark:text-zinc-400 hover:border-zinc-400 bg-white dark:bg-transparent"}`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {displayedLevels.map(answer => (
              <LevelAnswerCard key={answer.level} answer={answer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BarRaiserPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");
  const [questions, setQuestions] = useState<BarRaiserQuestion[]>(defaultBarRaiserQuestions as any[]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
        const res = await fetch(`${API_BASE}/bar-raiser`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const activeQuestions = data.filter((q: any) => !q.isArchived);
            if (activeQuestions.length > 0) {
              setQuestions(activeQuestions);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch live Bar Raiser questions, using static fallback", e);
      }
    };
    fetchQuestions();
  }, []);

  const categories: Array<{ id: Category | "ALL"; label: string; icon: React.ElementType }> = [
    { id: "ALL", label: "All Questions", icon: BookOpen },
    { id: "Ownership", label: "Ownership", icon: Shield },
    { id: "Conflict", label: "Conflict & Backbone", icon: MessageSquare },
    { id: "Delivery", label: "Delivery & Trade-offs", icon: Zap },
    { id: "Ambiguity", label: "Ambiguity", icon: Brain },
    { id: "Technical Leadership", label: "Technical Leadership", icon: BarChart3 },
    { id: "Customer Obsession", label: "Customer Obsession", icon: Target },
  ];

  const filtered = selectedCategory === "ALL" ? questions : questions.filter(q => q.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 px-3 py-1.5 rounded-full">
          <Flame className="w-3.5 h-3.5" />
          Amazon Bar Raiser · Leadership Principles
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
          Bar Raiser Interview
          <br />
          <span className="text-zinc-400">Questions & STAR Answers</span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
          The Bar Raiser ensures every hire raises the bar — a new hire must be better than 50% of people already doing that role. These questions probe ownership, backbone, and deep technical judgment. Each answer below is structured using the{" "}
          <strong className="text-zinc-750 dark:text-zinc-300">STAR method</strong> (Situation · Task · Action · Result) and tailored by engineering level with a real technical story.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {(["SDE1", "SDE2", "SDE3", "Principal"] as Level[]).map(lvl => {
            const cfg = LEVEL_CONFIG[lvl];
            return (
              <span key={lvl} className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border rounded-full ${cfg.badge}`}>
                {cfg.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Engineering Levels", value: "4" },
          { icon: BookOpen, label: "Questions", value: String(questions.length) },
          { icon: Clock, label: "Avg Prep Time", value: "2 hrs" },
          { icon: Star, label: "STAR Stories", value: String(questions.length * 4) },
        ].map(stat => (
          <div key={stat.label} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl p-4 flex flex-col gap-1.5">
            <stat.icon className="w-4 h-4 text-zinc-400" />
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{stat.value}</span>
            <span className="text-[11px] text-zinc-400 font-medium leading-tight">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl p-5">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          How to Use This Guide Effectively
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Study the Red & Green Flags First", desc: "Before reading any answer, internalize what Bar Raisers are actually scoring. The flags are more important than the stories themselves." },
            { step: "02", title: "Read Your Level's STAR Story", desc: "Read the answer at your current level carefully. Note the specific technical depth, scope of impact, and vocabulary expected for that level." },
            { step: "03", title: "Substitute Your Own Real Story", desc: "These are structural templates with fictional events. Replace the technical details with your own real experiences, keeping the STAR structure intact." },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <span className="text-2xl font-black text-zinc-200 dark:text-zinc-700 font-mono shrink-0 leading-none">{s.step}</span>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">{s.title}</p>
                <p className="text-xs text-zinc-505 dark:text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const Icon = cat.icon;
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as Category | "ALL")}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border rounded-full transition-all ${
                active
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-650 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-550 bg-white dark:bg-zinc-900/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {filtered.map((q, i) => (
          <QuestionCard key={q.id} q={q} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-400">
            <Brain className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No questions in this category yet. More coming soon!</p>
          </div>
        )}
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center space-y-4 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900/40 dark:to-zinc-950/40">
        <Trophy className="w-7 h-7 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Ready to Practice Live?</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">Schedule a mock interview with an experienced FAANG interviewer and get real-time feedback on your STAR answers.</p>
        <a
          href="/interviews"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Book a Mock Interview <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
