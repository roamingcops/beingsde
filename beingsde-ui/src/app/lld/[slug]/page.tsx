"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, Code2, AlertTriangle, Boxes } from "lucide-react";

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

export default function LldDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [selectedLang, setSelectedLang] = useState<"java" | "cpp" | "python">("java");
  const [question, setQuestion] = useState<LLDQuestion>(
    (lldQuestions as LLDQuestion[]).find((q) => q.slug === slug) || (lldQuestions[0] as LLDQuestion)
  );

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081").replace(/\/$/, "") + "/api/v1";
        const res = await fetch(`${API_BASE}/lld/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setQuestion(data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch live LLD detail, using static fallback", e);
      }
    };
    fetchQuestion();
  }, [slug]);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-6 px-4">
      {/* Back Button & Metadata Header */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link
          href="/lld"
          className="inline-flex items-center gap-1 text-xs font-mono uppercase text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to LLD explorer
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 text-2xs font-semibold font-mono text-zinc-400 uppercase">
              <span>{question.tag}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Boxes className="w-3.5 h-3.5" /> Patterns: {question.patterns.join(", ")}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">{question.title}</h1>
          </div>

          <div>
            <span
              className={`text-2xs font-bold font-mono px-3 py-1 uppercase rounded-sm border ${
                question.difficulty === "Easy"
                  ? "border-emerald-255 bg-emerald-50 text-emerald-600 dark:border-emerald-950 dark:bg-emerald-950/20"
                  : question.difficulty === "Medium"
                  ? "border-amber-220 bg-amber-50 text-amber-600 dark:border-amber-950 dark:bg-amber-950/20"
                  : "border-rose-220 bg-rose-50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/20"
              }`}
            >
              {question.difficulty}
            </span>
          </div>
        </div>
      </section>

      {/* Grid Layout for details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Description, Requirements, ER, Approach */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Summary Box */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm shadow-2xs">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
              Problem Summary
            </h2>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {question.summary}
            </p>
          </div>

          {/* Requirements */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm shadow-2xs">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
              Functional Scope
            </h2>
            <ul className="space-y-2">
              {question.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ER Diagram */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm shadow-2xs">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
              Entity-Relationship (ER) Schema
            </h2>
            <pre className="bg-zinc-50 dark:bg-[#1f1f23] border border-zinc-200 dark:border-zinc-800 rounded-sm p-4 text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed overflow-x-auto">
              {question.erDiagram}
            </pre>
          </div>

          {/* Approach callout */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 rounded-sm">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-zinc-500" /> Design Approach
            </h2>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {question.approach}
            </p>
          </div>
        </div>

        {/* Right Side: Classes list & Code Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Core Classes */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm shadow-2xs">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
              Core Classes & Models
            </h2>
            <div className="flex flex-wrap gap-2">
              {question.classes.map((cls) => (
                <span
                  key={cls}
                  className="bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs px-2.5 py-1.5 rounded-sm border border-zinc-200 dark:border-zinc-800 font-mono"
                >
                  {cls}
                </span>
              ))}
            </div>
          </div>

          {/* Code Panel */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-[#18181b] p-5 rounded-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                <Code2 className="w-4 h-4" /> Code Blueprint
              </div>
              <div className="flex gap-1.5">
                {(["java", "cpp", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`text-[10px] font-mono font-bold px-3 py-1 border uppercase tracking-wider rounded-sm transition-all duration-300 ${
                      selectedLang === lang
                        ? "bg-zinc-100 text-zinc-900 border-zinc-100"
                        : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-650"
                    }`}
                  >
                    {lang === "cpp" ? "C++" : lang}
                  </button>
                ))}
              </div>
            </div>
            
            <pre className="bg-zinc-950 text-zinc-100 text-xs p-4 rounded-sm font-mono overflow-x-auto border border-zinc-800 leading-relaxed max-h-[500px]">
              <code>{question.languages[selectedLang]}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
