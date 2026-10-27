"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Zap,
  Code2
} from "lucide-react";
import { DESIGN_PATTERNS, DesignPattern } from "@/data/design-patterns";

interface Props {
  slug: string;
}

export default function DesignPatternDetailClient({ slug }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<"java" | "typescript" | "python">("java");
  const [copied, setCopied] = useState(false);

  const currentIndex = DESIGN_PATTERNS.findIndex((p) => p.slug === slug);
  const pattern = DESIGN_PATTERNS[currentIndex] || DESIGN_PATTERNS[0];

  const prevPattern = currentIndex > 0 ? DESIGN_PATTERNS[currentIndex - 1] : null;
  const nextPattern = currentIndex < DESIGN_PATTERNS.length - 1 ? DESIGN_PATTERNS[currentIndex + 1] : null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pattern.code[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* BACK NAVIGATION & META BAR                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link
          href="/design-patterns"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Design Patterns</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono text-zinc-400">
            Pattern {currentIndex + 1} of {DESIGN_PATTERNS.length}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ARTICLE HEADER                                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
            {pattern.category} Pattern
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            {pattern.difficulty}
          </span>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {pattern.readTimeMinutes} min deep dive
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
          {pattern.name} Pattern
        </h1>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
          {pattern.oneLiner}
        </p>

        {/* Real-World Metaphor Callout */}
        <div className="rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-[#151518] p-4 text-xs font-mono">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                Real-World Mental Model / Metaphor:
              </span>
              <p className="text-zinc-800 dark:text-zinc-200 font-sans leading-relaxed text-xs">
                {pattern.metaphor}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ARCHITECTURAL BLUEPRINT FLOW (FAST & CLEAN VISUALIZATION)   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#141416] p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Architectural Flow Blueprint
            </h2>
          </div>
          <span className="text-2xs font-mono text-zinc-400">
            Participant Interactions &amp; Component Wiring
          </span>
        </div>

        {/* Visual Flow diagram: step-by-step participant pill flow */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-1">
          {pattern.structure.participants.map((participant, idx) => (
            <React.Fragment key={participant.name}>
              <div className="flex flex-col gap-1 p-3 rounded-md border border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-[#18181b] min-w-[140px] max-w-[240px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {participant.name}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {participant.type}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-zinc-600 dark:text-zinc-400 leading-tight">
                  {participant.role}
                </p>
              </div>

              {idx < pattern.structure.participants.length - 1 && (
                <div className="hidden sm:flex text-zinc-400 dark:text-zinc-600 items-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Real World Usage Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 text-2xs font-mono">
          <span className="text-zinc-400 font-bold uppercase tracking-wider">
            Production Implementations:
          </span>
          {pattern.realWorldUsage.map((usage, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
            >
              {usage}
            </span>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* INTENT, PROBLEM & SOLUTION                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 flex flex-col gap-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> The Problem It Solves
          </span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
            {pattern.problemSolved}
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 flex flex-col gap-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> The Architectural Solution
          </span>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
            {pattern.solution}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* PARTICIPANTS & STRUCTURE BREAKDOWN                          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-500" />
          Pattern Structure &amp; Participants
        </h3>

        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-md">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-mono text-left">
                <th className="p-2.5 border-b border-zinc-200 dark:border-zinc-700 font-bold">Participant</th>
                <th className="p-2.5 border-b border-zinc-200 dark:border-zinc-700 font-bold">Role &amp; Responsibility</th>
                <th className="p-2.5 border-b border-zinc-200 dark:border-zinc-700 font-bold">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono">
              {pattern.structure.participants.map((p, idx) => (
                <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                  <td className="p-2.5 font-bold text-zinc-900 dark:text-zinc-100">{p.name}</td>
                  <td className="p-2.5 font-sans text-xs">{p.role}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {p.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pattern.structure.relationships && pattern.structure.relationships.length > 0 && (
          <div className="pt-2">
            <span className="text-2xs font-mono text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
              Collaboration Rules:
            </span>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              {pattern.structure.relationships.map((rel, idx) => (
                <li key={idx}>{rel}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* MULTI-LANGUAGE CODE IMPLEMENTATION                          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Production Code Implementation
            </h3>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md text-2xs font-mono">
            {(["java", "typescript", "python"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded transition-colors font-bold uppercase cursor-pointer ${
                  selectedLanguage === lang
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Code Box */}
        <div className="relative rounded-md border border-zinc-800 bg-[#0c0d0e] text-zinc-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/90 text-2xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{pattern.name}.{selectedLanguage === "java" ? "java" : selectedLanguage === "typescript" ? "ts" : "py"}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300/90 leading-relaxed max-h-[500px]">
            <code>{pattern.code[selectedLanguage]}</code>
          </pre>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* WHEN TO USE VS WHEN TO AVOID                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10 p-5 flex flex-col gap-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> When to Use:
          </span>
          <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-sans">
            {pattern.whenToUse.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 p-5 flex flex-col gap-2.5">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> When to Avoid (Anti-Pattern):
          </span>
          <ul className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-sans">
            {pattern.whenToAvoid.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* INTERVIEW TIPS & TRADE-OFFS                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 sm:p-6 flex flex-col gap-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-500" />
          Staff Engineering Interview Insights &amp; Gotchas
        </h3>
        <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-sans">
          {pattern.interviewTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 p-2.5 rounded bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* PREVIOUS / NEXT PATTERN NAVIGATION                          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        {prevPattern ? (
          <Link
            href={`/design-patterns/${prevPattern.slug}`}
            className="flex flex-col items-start gap-1 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#18181b] w-full sm:w-1/2 transition-colors group"
          >
            <span className="text-2xs font-mono text-zinc-400 uppercase flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Previous Pattern
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {prevPattern.name} ({prevPattern.category})
            </span>
          </Link>
        ) : (
          <div className="w-full sm:w-1/2" />
        )}

        {nextPattern ? (
          <Link
            href={`/design-patterns/${nextPattern.slug}`}
            className="flex flex-col items-end gap-1 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#18181b] w-full sm:w-1/2 transition-colors text-right group"
          >
            <span className="text-2xs font-mono text-zinc-400 uppercase flex items-center gap-1">
              Next Pattern <ArrowRight className="w-3 h-3" />
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {nextPattern.name} ({nextPattern.category})
            </span>
          </Link>
        ) : (
          <div className="w-full sm:w-1/2" />
        )}
      </div>
    </div>
  );
}
