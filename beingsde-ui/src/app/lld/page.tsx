"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, AlertTriangle, Boxes } from "lucide-react";

import lldQuestions from "@/data/lld.json";

interface LLDQuestion {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  tag: string;
  patterns: string[];
  summary: string;
  requirements: string[];
  erDiagram: string;
  classes: string[];
  languages: {
    java: string;
    cpp: string;
    python: string;
  };
  approach: string;
}

export default function LldPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");

  const filtered = (lldQuestions as LLDQuestion[]).filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.patterns.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      q.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "ALL" || q.difficulty.toUpperCase() === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Boxes className="w-5 h-5 text-zinc-400" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">OOD / LLD practice</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50 mb-2">
          Low-Level Design Exercises
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
          Standard object-oriented design problems curated to help you master class structures, design patterns, and thread-safe implementations.
        </p>

        {/* Stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
              {lldQuestions.length}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Standard Problems</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">Java / C++ / Py</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Code Blueprints</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title, pattern, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 rounded-sm transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Difficulty:</span>
          {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`text-2xs font-semibold px-3 py-1.5 border uppercase tracking-wider transition-all duration-300 ${
                selectedDifficulty === diff
                  ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                  : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Subtitle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Catalog Index</span>
        <span className="text-xs text-zinc-400 font-mono">{filtered.length} design templates</span>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-sm p-3 mb-6">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Select any low-level design template below to explore detailed requirements, Entity-Relationship schemas, and full multi-language code templates.
        </p>
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-500">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No LLD designs match your current filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty("ALL");
            }}
            className="mt-2 text-xs underline text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q, idx) => {
            return (
              <Link
                key={q.id}
                href={`/lld/${q.slug}`}
                className="block border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#18181b] rounded-sm transition-all duration-200 px-5 py-4 flex items-start gap-3 group"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-mono font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {q.tag}
                    </span>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        q.difficulty === "Easy"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : q.difficulty === "Medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    {q.patterns.map((p) => (
                      <span
                        key={p}
                        className="inline-block text-[10px] font-mono text-zinc-400 dark:text-zinc-500 border border-zinc-250 dark:border-zinc-800 px-1.5 py-0.5 rounded-sm"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {q.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {q.summary}
                  </p>
                </div>

                <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500 mt-2 font-mono text-xs group-hover:translate-x-1 transition-transform">
                  &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
