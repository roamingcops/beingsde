"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Share2,
  Check,
  Code2,
  Cpu,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import defaultDsaQuestions from "@/data/dsa.json";

interface DSAQuestion {
  id?: string | number;
  questionId?: number;
  title: string;
  tag: string;
  difficulty: string;
  summary: string;
  keyPoints: string[];
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  pattern: string;
  tabGroup: string;
  slug: string;
}

export default function DsaDetailClient({
  slug,
  initialQuestion,
}: {
  slug: string;
  initialQuestion?: DSAQuestion;
}) {
  const allQuestions = defaultDsaQuestions as DSAQuestion[];
  const currentIndex = allQuestions.findIndex((q) => q.slug === slug);

  const question: DSAQuestion =
    initialQuestion ||
    (currentIndex >= 0 ? allQuestions[currentIndex] : allQuestions[0]);

  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex >= 0 && currentIndex < allQuestions.length - 1
      ? allQuestions[currentIndex + 1]
      : null;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link href="/" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/dsa" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">
          DSA Patterns
        </Link>
        <span>/</span>
        <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-none">
          {question.tag}
        </span>
      </nav>

      {/* Header and Problem Metadata */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/dsa"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all DSA patterns
          </Link>

          <button
            onClick={handleCopyLink}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm text-zinc-600 dark:text-zinc-300 hover:border-zinc-400 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2.5 text-2xs font-semibold font-mono uppercase tracking-wider">
            <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-sm">
              {question.tag}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-zinc-500">Pattern: {question.pattern}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span
              className={`px-2 py-0.5 rounded-sm border ${
                question.difficulty === "Easy"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-950 dark:bg-emerald-950/20"
                  : question.difficulty === "Medium"
                  ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-950 dark:bg-amber-950/20"
                  : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/20"
              }`}
            >
              {question.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mt-1 leading-tight">
            {question.title}
          </h1>
        </div>

        {/* Executive Summary Box */}
        {question.summary && (
          <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-xs font-mono uppercase tracking-wider mb-1">
                Problem Intuition &amp; Objective
              </span>
              <p>{question.summary}</p>
            </div>
          </div>
        )}
      </section>

      {/* Complexity Matrix Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-3xs font-mono uppercase text-zinc-400 block tracking-widest">
                Time Complexity
              </span>
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {question.timeComplexity}
              </span>
            </div>
          </div>
          <span className="text-2xs font-mono text-zinc-400">Optimal</span>
        </div>

        <div className="p-4 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-3xs font-mono uppercase text-zinc-400 block tracking-widest">
                Space Complexity
              </span>
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {question.spaceComplexity}
              </span>
            </div>
          </div>
          <span className="text-2xs font-mono text-zinc-400">Memory Bounds</span>
        </div>
      </section>

      {/* Algorithmic Approach Breakdown */}
      <article className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-md shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <Code2 className="w-4 h-4 text-zinc-400" /> Optimal Algorithmic Approach
          </span>
          <div className="mt-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
            <p className="whitespace-pre-line">{question.approach}</p>
          </div>
        </div>

        {/* Key Takeaways & Invariants */}
        {question.keyPoints && question.keyPoints.length > 0 && (
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Core Invariants &amp; Edge Cases
            </h3>
            <ul className="space-y-2">
              {question.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* Traversal Links (Previous / Next Problem) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        {prevQuestion ? (
          <Link
            href={`/dsa/${prevQuestion.slug}`}
            className="group p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-400 dark:hover:border-zinc-600 rounded-sm transition-all flex flex-col gap-1"
          >
            <span className="text-3xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:-translate-x-0.5 transition-transform">
              <ChevronLeft className="w-3.5 h-3.5" /> Previous Problem
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {prevQuestion.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextQuestion && (
          <Link
            href={`/dsa/${nextQuestion.slug}`}
            className="group p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-400 dark:hover:border-zinc-600 rounded-sm transition-all flex flex-col gap-1 text-right sm:col-start-2"
          >
            <span className="text-3xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
              Next Problem <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {nextQuestion.title}
            </span>
          </Link>
        )}
      </section>

      {/* Related Platform Resources */}
      <section className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 rounded-md flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-900 dark:text-zinc-100">
            System Design &amp; Architecture Roadmap
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Coding interviews are only 50% of the bar. Master High-Level Design, distributed systems, and Object-Oriented LLD.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/questions"
            className="p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm flex flex-col gap-1 group"
          >
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              50+ HLD Questions
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-3xs text-zinc-500">
              Sharding, caching, and real-time distributed systems.
            </span>
          </Link>

          <Link
            href="/lld"
            className="p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm flex flex-col gap-1 group"
          >
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              27 LLD Blueprints
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-3xs text-zinc-500">
              Object-oriented design patterns with class diagrams.
            </span>
          </Link>

          <Link
            href="/cheat-sheet"
            className="p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm flex flex-col gap-1 group"
          >
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              SDE Quick Reference
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-3xs text-zinc-500">
              Latency numbers and database selection matrix.
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
