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
  BookOpen,
  HelpCircle,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import defaultHldQuestions from "@/data/hld-questions.json";

interface HldQuestion {
  questionId: number;
  title: string;
  category: string;
  difficulty: string;
  summary: string;
  contentMarkdown: string;
  slug: string;
}

export default function QuestionDetailClient({
  slug,
  initialQuestion,
}: {
  slug: string;
  initialQuestion?: HldQuestion;
}) {
  const allQuestions = defaultHldQuestions as HldQuestion[];
  const currentIndex = allQuestions.findIndex(
    (q) => q.slug === slug || q.questionId === initialQuestion?.questionId
  );
  
  const question: HldQuestion =
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

  const readingTime = Math.max(
    3,
    Math.ceil((question.contentMarkdown || "").split(/\s+/).length / 180)
  );

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link href="/" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/questions" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">
          HLD Questions
        </Link>
        <span>/</span>
        <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[240px] sm:max-w-none">
          {question.category}
        </span>
      </nav>

      {/* Header and Question Meta */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/questions"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all questions
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
              Question #{question.questionId} of {allQuestions.length}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="text-zinc-500">{question.category}</span>
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
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3 h-3" /> ~{readingTime} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mt-1 leading-tight">
            {question.title}
          </h1>
        </div>

        {/* Executive Summary / Interview Takeaway Box */}
        {question.summary && (
          <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-xs font-mono uppercase tracking-wider mb-1">
                Executive Takeaway
              </span>
              <p>{question.summary}</p>
            </div>
          </div>
        )}
      </section>

      {/* Main Architectural Breakdown Section */}
      <article className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-md shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-zinc-400" /> Architectural Breakdown &amp; Analysis
          </span>
          <span className="text-3xs font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded">
            FAANG Aligned
          </span>
        </div>

        <MarkdownRenderer content={question.contentMarkdown} />
      </article>

      {/* Prev / Next Question Navigation */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        {prevQuestion ? (
          <Link
            href={`/questions/${prevQuestion.slug}`}
            className="group p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-400 dark:hover:border-zinc-600 rounded-sm transition-all flex flex-col gap-1"
          >
            <span className="text-3xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:-translate-x-0.5 transition-transform">
              <ChevronLeft className="w-3.5 h-3.5" /> Previous Question
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
            href={`/questions/${nextQuestion.slug}`}
            className="group p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-400 dark:hover:border-zinc-600 rounded-sm transition-all flex flex-col gap-1 text-right sm:col-start-2"
          >
            <span className="text-3xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
              Next Question <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {nextQuestion.title}
            </span>
          </Link>
        )}
      </section>

      {/* Interlinked Resource Cards */}
      <section className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 rounded-md flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-900 dark:text-zinc-100">
            Continue Learning on Being SDE
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Explore deep-dive system architecture modules, low-level object-oriented designs, and interview cheat sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/topics"
            className="p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm flex flex-col gap-1 group"
          >
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              70+ HLD Topics
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-3xs text-zinc-500">
              Distributed caching, Kafka, and sharding architectures.
            </span>
          </Link>

          <Link
            href="/lld"
            className="p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm flex flex-col gap-1 group"
          >
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              25+ LLD Blueprints
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-3xs text-zinc-500">
              Clean OOP code in Java, Python, and C++ with UML diagrams.
            </span>
          </Link>

          <Link
            href="/cheat-sheet"
            className="p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm flex flex-col gap-1 group"
          >
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              SDE Cheat Sheet
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-3xs text-zinc-500">
              Latency numbers, capacity formulas, and trade-off tables.
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
