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
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import guides from "@/data/guides.json";

interface Guide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  readingTimeMinutes: number;
  difficulty: string;
  publishedDate: string;
  author: string;
  contentMarkdown: string;
}

export default function GuideDetailClient({
  slug,
  initialGuide,
}: {
  slug: string;
  initialGuide?: Guide;
}) {
  const allGuides = guides as Guide[];
  const currentIndex = allGuides.findIndex((g) => g.slug === slug);

  const guide: Guide =
    initialGuide ||
    (currentIndex >= 0 ? allGuides[currentIndex] : allGuides[0]);

  const prevGuide = currentIndex > 0 ? allGuides[currentIndex - 1] : null;
  const nextGuide =
    currentIndex >= 0 && currentIndex < allGuides.length - 1
      ? allGuides[currentIndex + 1]
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
        <Link href="/guides" className="hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors">
          Architecture Case Studies
        </Link>
        <span>/</span>
        <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-none">
          {guide.category}
        </span>
      </nav>

      {/* Header and Article Meta */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to all case studies
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
              {guide.category}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1 text-zinc-500">
              <User className="w-3 h-3" /> By {guide.author}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1 text-zinc-500">
              <Calendar className="w-3 h-3" /> {guide.publishedDate}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Clock className="w-3 h-3" /> {guide.readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mt-1 leading-tight">
            {guide.title}
          </h1>
        </div>

        {/* Executive Takeaway Box */}
        {guide.summary && (
          <div className="p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-xs font-mono uppercase tracking-wider mb-1">
                Executive Architectural Takeaway
              </span>
              <p>{guide.summary}</p>
            </div>
          </div>
        )}
      </section>

      {/* Main Content Article */}
      <article className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-md shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-zinc-400" /> Production Architecture Case Study
          </span>
          <span className="text-3xs font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded">
            Peer Reviewed
          </span>
        </div>

        <MarkdownRenderer content={guide.contentMarkdown} />
      </article>

      {/* Author Bio Box for E-E-A-T */}
      <section className="p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-md flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-bold font-mono flex items-center justify-center shrink-0 text-base">
          AG
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Authored by Abha Gupta</span>
            <span className="text-3xs font-mono px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded">Editorial Lead</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Staff Software Architect and Founder of Being SDE. Specializes in distributed caching, wide-column database sharding, and high-concurrency real-time systems.
          </p>
        </div>
      </section>

      {/* Prev / Next Guide Traversal */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
        {prevGuide ? (
          <Link
            href={`/guides/${prevGuide.slug}`}
            className="group p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-400 dark:hover:border-zinc-600 rounded-sm transition-all flex flex-col gap-1"
          >
            <span className="text-3xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1 group-hover:-translate-x-0.5 transition-transform">
              <ChevronLeft className="w-3.5 h-3.5" /> Previous Case Study
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {prevGuide.title}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextGuide && (
          <Link
            href={`/guides/${nextGuide.slug}`}
            className="group p-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:border-zinc-400 dark:hover:border-zinc-600 rounded-sm transition-all flex flex-col gap-1 text-right sm:col-start-2"
          >
            <span className="text-3xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
              Next Case Study <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {nextGuide.title}
            </span>
          </Link>
        )}
      </section>

      {/* Cross-Link Modules */}
      <section className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-6 rounded-md flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-zinc-900 dark:text-zinc-100">
            Continue Your Architectural Prep
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            Explore 70+ interactive high-level system designs, low-level object-oriented patterns, and 50+ interview questions.
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
              Interactive blueprints with capacity estimations.
            </span>
          </Link>

          <Link
            href="/questions"
            className="p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 rounded-sm flex flex-col gap-1 group"
          >
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between">
              50+ HLD Questions
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <span className="text-3xs text-zinc-500">
              Trade-offs on sharding, WebSockets, and caching.
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
              Clean OOP code in Java, Python, and C++.
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
