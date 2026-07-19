"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Database,
  Cpu,
  Shield,
  Network,
  HelpCircle,
  Sliders,
  ArrowUpRight,
  Flame,
  CheckCircle2
} from "lucide-react";
import defaultHldQuestions from "@/data/hld-questions.json";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface HldQuestion {
  id?: string;
  questionId: number;
  title: string;
  category: string;
  difficulty: string;
  summary: string;
  contentMarkdown: string;
}

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  const [questions, setQuestions] = useState<HldQuestion[]>(defaultHldQuestions as any[]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
        const res = await fetch(`${API_BASE}/hld-questions`);
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
        console.error("Failed to fetch live HLD questions, using static fallback", e);
      }
    };
    fetchQuestions();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const categories = [
    { id: "ALL", label: "All Topics", icon: Sliders },
    { id: "Databases", label: "Databases & Storage", icon: Database },
    { id: "Scaling", label: "Scaling & Optimization", icon: Cpu },
    { id: "Security & Auth", label: "Security & Auth", icon: Shield },
    { id: "Protocols", label: "Protocols & Real-Time", icon: Network },
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || q.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* HEADER SECTION */}
      <section className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">HLD Practice Cards</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
          Top HLD Interview Questions
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Deep-dives into specific architecture decisions, storage patterns, and trade-offs.
        </p>

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-col gap-4 mt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. WebSockets, Sharding, DynamoDB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors placeholder-zinc-400 rounded-sm"
            />
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setExpandedIndex(null);
                  }}
                  className={`text-2xs font-semibold px-3 py-1.5 border uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 rounded-sm cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100"
                      : "bg-white dark:bg-[#18181b] text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUESTIONS ACCORDION LIST */}
      <section className="flex flex-col gap-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={q.id || q.questionId}
                className={`border rounded-sm bg-white dark:bg-[#18181b] transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-zinc-900 dark:border-zinc-100 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                {/* Header/Summary Card Trigger */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-2 items-center text-3xs font-mono tracking-widest font-black uppercase">
                      <span className="text-zinc-400">Q{q.questionId}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <span className="text-zinc-500">{q.category}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <span className={`px-1.5 py-0.5 border rounded-sm font-mono ${
                        q.difficulty === "Easy" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" :
                        q.difficulty === "Medium" ? "text-amber-500 border-amber-500/20 bg-amber-500/5" :
                        "text-rose-500 border-rose-500/20 bg-rose-500/5"
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                      {q.title}
                    </h3>
                    <p className="text-xs text-zinc-450 dark:text-zinc-500 line-clamp-2">
                      {q.summary}
                    </p>
                  </div>
                  <div className="mt-1 p-1 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-250 transition-colors shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Answer Body */}
                <div
                  className={`transition-all duration-300 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 ${
                    isExpanded ? "p-6 opacity-100 block" : "hidden"
                  }`}
                >
                  <MarkdownRenderer content={q.contentMarkdown} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-sm">
            <HelpCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No questions found</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Try broadening your search query or choosing another category.</p>
          </div>
        )}
      </section>

      {/* QUICK STATS & BOTTOM CONTEXT */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Curated Material</h4>
            <p className="text-2xs text-zinc-400 dark:text-zinc-500 mt-1">Aligned directly with expectations from FAANG and high-scale startup architecture bars.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Flame className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Deep-Dive Spans</h4>
            <p className="text-2xs text-zinc-400 dark:text-zinc-500 mt-1">Covers from low-level storage engines (B-Tree/LSM) to edge proxy routing, security tokens, and WebSockets scaling.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <ArrowUpRight className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Updated Regularly</h4>
            <p className="text-2xs text-zinc-400 dark:text-zinc-500 mt-1">Content verified against modern standards, containing lessons from Amazon DynamoDB, Apache Kafka, and Druid.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
