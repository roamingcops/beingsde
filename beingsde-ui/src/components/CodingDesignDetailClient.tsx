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
  Share2
} from "lucide-react";
import { CODING_DESIGN_TOPICS, CodingDesignTopic } from "@/data/coding-design";
import ScribbleDiagram from "./ScribbleDiagram";

interface Props {
  slug: string;
}

export default function CodingDesignDetailClient({ slug }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const currentIndex = CODING_DESIGN_TOPICS.findIndex((t) => t.slug === slug);
  const topic = CODING_DESIGN_TOPICS[currentIndex] || CODING_DESIGN_TOPICS[0];

  const prevTopic = currentIndex > 0 ? CODING_DESIGN_TOPICS[currentIndex - 1] : null;
  const nextTopic = currentIndex < CODING_DESIGN_TOPICS.length - 1 ? CODING_DESIGN_TOPICS[currentIndex + 1] : null;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      {/* ─────────────────────────────────────────────────────────── */}
      {/* BACK NAVIGATION & META BAR                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <Link
          href="/coding-design"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Coding Design Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-2xs font-mono text-zinc-400">
            Practice {currentIndex + 1} of {CODING_DESIGN_TOPICS.length}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ARTICLE HEADER                                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
            {topic.category}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            {topic.difficulty}
          </span>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {topic.readTimeMinutes} min deep dive
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 font-sans">
          {topic.title}
        </h1>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3-LINE EXECUTIVE SUMMARY CARD                               */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="rounded-lg border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-[#18181b] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            The 3-Line Engineering Rule
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1 p-3 rounded bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              1. THE RULE
            </span>
            <p className="text-zinc-900 dark:text-zinc-100 font-sans font-medium text-xs leading-relaxed">
              {topic.summary.rule}
            </p>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
              2. WHY IT MATTERS
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 font-sans text-xs leading-relaxed">
              {topic.summary.whyItMatters}
            </p>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
              3. PRODUCTION FIX
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 font-sans text-xs leading-relaxed">
              {topic.summary.verdict}
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE SCRIBBLE BLUEPRINT                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            Architectural Blueprint &amp; Sequence
          </h2>
          <span className="text-2xs font-mono text-zinc-400">
            Hover over nodes to inspect state transitions
          </span>
        </div>
        <ScribbleDiagram scribble={topic.scribble} categoryColor={topic.categoryColor} isInteractive={true} />
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* KEY TAKEAWAYS BULLETS                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 sm:p-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Key Engineering Takeaways
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {topic.keyTakeaways.map((takeaway, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-md bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/70"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                {takeaway}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* FULL ARTICLE OVERVIEW & PROBLEM BREAKDOWN                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 leading-relaxed">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight font-mono border-b border-zinc-200 dark:border-zinc-800 pb-2">
          The Problem &amp; Production Reality
        </h2>
        <p className="text-sm leading-relaxed mt-3">
          {topic.article.overview}
        </p>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* THE ANTI-PATTERN CODE                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
            {topic.article.antiPattern.title}
          </h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {topic.article.antiPattern.description}
        </p>

        {topic.article.antiPattern.codeSnippet && (
          <div className="relative rounded-md border border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-rose-200 dark:border-rose-900/40 bg-rose-100/40 dark:bg-rose-950/30 text-2xs font-mono text-rose-800 dark:text-rose-300">
              <span>ANTI-PATTERN EXAMPLE ({topic.article.antiPattern.language?.toUpperCase()})</span>
              <button
                onClick={() => copyToClipboard(topic.article.antiPattern.codeSnippet!, "antipattern")}
                className="flex items-center gap-1 hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                {copiedCode === "antipattern" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode === "antipattern" ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto text-zinc-800 dark:text-zinc-200 leading-relaxed">
              <code>{topic.article.antiPattern.codeSnippet}</code>
            </pre>
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* THE PRODUCTION PATTERN CODE                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
            {topic.article.productionPattern.title}
          </h3>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {topic.article.productionPattern.description}
        </p>

        <div className="relative rounded-md border border-emerald-300 dark:border-emerald-900 bg-zinc-950 text-zinc-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/90 text-2xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>PRODUCTION-READY CODE ({topic.article.productionPattern.language.toUpperCase()})</span>
            </div>
            <button
              onClick={() => copyToClipboard(topic.article.productionPattern.codeSnippet, "prodpattern")}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              {copiedCode === "prodpattern" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode === "prodpattern" ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto text-emerald-300/90 leading-relaxed bg-[#0c0d0e]">
            <code>{topic.article.productionPattern.codeSnippet}</code>
          </pre>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TRADE-OFF DECISION MATRIX                                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Trade-off Analysis &amp; Staff Recommendations
        </h3>
        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-mono text-left">
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-bold">Aspect</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-bold">Pros / Strengths</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-bold">Cons / Hazards</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-700 font-bold">Staff Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {topic.article.tradeoffs.map((row, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                  <td className="p-3 font-semibold font-mono text-zinc-950 dark:text-zinc-50">
                    {row.aspect}
                  </td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400">
                    {row.pros}
                  </td>
                  <td className="p-3 text-rose-700 dark:text-rose-400">
                    {row.cons}
                  </td>
                  <td className="p-3 font-medium bg-zinc-50/50 dark:bg-zinc-900/20">
                    {row.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CODE REVIEW CHECKLIST                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 sm:p-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-500" />
          PR Code Review Checklist (Click to verify)
        </h3>
        <div className="flex flex-col gap-2">
          {topic.article.checklist.map((item, idx) => {
            const isChecked = !!checkedItems[idx];
            return (
              <label
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer select-none transition-all ${
                  isChecked
                    ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-zinc-900 dark:text-zinc-100"
                    : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-zinc-400 dark:border-zinc-600"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-xs ${isChecked ? "line-through text-zinc-400 dark:text-zinc-500" : ""}`}>
                  {item}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* PREVIOUS / NEXT NAVIGATION                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        {prevTopic ? (
          <Link
            href={`/coding-design/${prevTopic.slug}`}
            className="flex flex-col items-start gap-1 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#18181b] w-full sm:w-1/2 transition-colors group"
          >
            <span className="text-2xs font-mono text-zinc-400 uppercase flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Previous Best Practice
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {prevTopic.shortTitle}
            </span>
          </Link>
        ) : (
          <div className="w-full sm:w-1/2" />
        )}

        {nextTopic ? (
          <Link
            href={`/coding-design/${nextTopic.slug}`}
            className="flex flex-col items-end gap-1 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-[#18181b] w-full sm:w-1/2 transition-colors text-right group"
          >
            <span className="text-2xs font-mono text-zinc-400 uppercase flex items-center gap-1">
              Next Best Practice <ArrowRight className="w-3 h-3" />
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {nextTopic.shortTitle}
            </span>
          </Link>
        ) : (
          <div className="w-full sm:w-1/2" />
        )}
      </div>
    </div>
  );
}
