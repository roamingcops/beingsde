"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Shapes, 
  Layers, 
  Clock, 
  Zap, 
  Code2, 
  BookOpen, 
  Sliders, 
  Workflow 
} from "lucide-react";
import { DESIGN_PATTERNS, PATTERN_CATEGORIES, DesignPattern } from "@/data/design-patterns";

export default function DesignPatternsExplorerClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPatterns = useMemo(() => {
    return DESIGN_PATTERNS.filter((pattern) => {
      const matchesCategory =
        selectedCategory === "All" || pattern.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesSearch =
        pattern.name.toLowerCase().includes(q) ||
        pattern.oneLiner.toLowerCase().includes(q) ||
        pattern.metaphor.toLowerCase().includes(q) ||
        pattern.intent.toLowerCase().includes(q) ||
        pattern.realWorldUsage.some((u) => u.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto py-4 sm:py-8">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* HERO SECTION                                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="relative text-center flex flex-col items-center gap-4 max-w-4xl mx-auto px-2">
        {/* Animated Hand-Drawn Scribble Background Accent */}
        <div className="absolute -top-10 -left-10 md:left-4 opacity-30 dark:opacity-20 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100" className="fill-none stroke-zinc-900 dark:stroke-zinc-100 scribble-glow">
            <path 
              className="animate-scribble" 
              strokeWidth="1.5" 
              d="M50,15 C75,10 88,35 85,55 C82,75 60,88 40,85 C20,82 12,58 15,38 C18,18 42,12 49,15"
            />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-xs font-medium tracking-wide">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Being SDE — Software Design Patterns Catalog</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-zinc-950 dark:text-zinc-50">
          Master{" "}
          <span className="relative inline-block px-1">
            Design Patterns
            {/* Scribble Underline */}
            <svg 
              className="absolute -bottom-2.5 left-0 w-full h-3.5 overflow-visible pointer-events-none fill-none stroke-zinc-900 dark:stroke-zinc-100 stroke-[3]"
              viewBox="0 0 200 12"
            >
              <path 
                className="animate-scribble" 
                strokeLinecap="round" 
                d="M2,8 C40,15 80,2 198,10 C140,15 60,6 10,8"
              />
            </svg>
          </span>{" "}
          with Architectural Blueprints
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl font-normal leading-relaxed">
          Real-world metaphors, UML participant structures, and production-ready code in Java, TypeScript, and Python for all Creational, Structural, and Behavioral patterns.
        </p>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-2xs font-mono text-zinc-500">
          <span className="px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]">
            22+ Gang of Four &amp; Modern Patterns
          </span>
          <span className="px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]">
            Architectural Mental Models
          </span>
          <span className="px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b]">
            Java • TypeScript • Python Code
          </span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SEARCH & CATEGORY FILTER TABS                               */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4 w-full pt-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patterns (e.g. 'observer', 'builder', 'swap algorithm', 'caching')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-xs font-mono placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="text-2xs font-mono text-zinc-500">
            Showing <strong className="text-zinc-900 dark:text-zinc-100">{filteredPatterns.length}</strong> of {DESIGN_PATTERNS.length} design patterns
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {["All", ...PATTERN_CATEGORIES].map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === "All"
              ? DESIGN_PATTERNS.length
              : DESIGN_PATTERNS.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-zinc-700 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-800"
                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DESIGN PATTERNS GRID                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredPatterns.map((pattern) => {
          return (
            <article
              key={pattern.id}
              className="flex flex-col justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 group"
            >
              <div className="flex flex-col gap-3.5">
                {/* Header: Category Badge + Difficulty */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {pattern.category}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      pattern.difficulty === "BEGINNER"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                        : pattern.difficulty === "INTERMEDIATE"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-900"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-900"
                    }`}>
                      {pattern.difficulty}
                    </span>
                  </div>

                  <span className="text-2xs font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {pattern.readTimeMinutes}m
                  </span>
                </div>

                {/* Name */}
                <Link href={`/design-patterns/${pattern.slug}`}>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {pattern.name}
                  </h3>
                </Link>

                {/* One-Liner */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  {pattern.oneLiner}
                </p>

                {/* Real-World Metaphor Card */}
                <div className="rounded-md border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#111113] p-3 text-xs">
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[10px] shrink-0">
                      METAPHOR:
                    </span>
                    <p className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-relaxed italic">
                      {pattern.metaphor}
                    </p>
                  </div>
                </div>

                {/* Production Usage Tags */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                    Real-World Usage:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {pattern.realWorldUsage.slice(0, 2).map((usage, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-800/60"
                      >
                        {usage}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-2xs font-mono text-zinc-400">
                  Java • TS • Python
                </span>

                <Link
                  href={`/design-patterns/${pattern.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore Blueprint &amp; Code</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      {/* Empty State */}
      {filteredPatterns.length === 0 && (
        <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8">
          <h3 className="text-base font-bold font-mono text-zinc-800 dark:text-zinc-200">
            No design patterns matched &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-xs text-zinc-500 mt-1 font-mono">
            Try adjusting your search query or reset category filter to All.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-4 px-4 py-2 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-mono rounded"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
