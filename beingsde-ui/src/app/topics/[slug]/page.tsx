"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Lock, CheckCircle, Video, FileText, Download } from "lucide-react";

import MOCK_TOPICS from "@/data/topics.json";

export default function TopicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  
  const [activeTab, setActiveTab] = useState<"notes" | "video" | "pdf">("notes");

  // Retrieve topic info matching slug
  const topic = MOCK_TOPICS.find((t) => t.slug === slug) || MOCK_TOPICS[1];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      
      {/* Back Button & Metadata Header */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link 
          href="/topics" 
          className="inline-flex items-center gap-1 text-xs font-mono uppercase text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to explorer
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 text-2xs font-semibold font-mono text-zinc-400 uppercase">
              <span>{topic.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {topic.estimatedTimeMinutes} Min</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">{topic.title}</h1>
          </div>

          <div>
            <span className={`text-2xs font-bold font-mono px-3 py-1 uppercase rounded-sm border ${
              topic.difficulty === "EASY" ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-950 dark:bg-emerald-950/20" :
              topic.difficulty === "MEDIUM" ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-950 dark:bg-amber-950/20" :
              "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-950 dark:bg-rose-950/20"
            }`}>
              {topic.difficulty}
            </span>
          </div>
        </div>
      </section>

      {/* CORE WORKSPACE SECTION */}
      {topic.isPremium ? (
        
        /* LOCKED PREMIUM OVERLAY */
        <section className="relative w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-10 rounded-md shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center gap-6 overflow-hidden">
          
          {/* Blur Background filter effect */}
          <div className="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-950/40 backdrop-blur-[2px] pointer-events-none" />

          {/* Premium Locker box */}
          <div className="relative z-10 max-w-md flex flex-col items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-full text-amber-600 dark:text-amber-500">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Premium Architecture Locked</h2>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              This system design module includes complex database sharding strategies, trade-off notes, video lectures, and architectural blueprints available exclusively to Premium subscribers.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 w-full justify-center">
              <Link 
                href="/subscriptions"
                className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
              >
                Upgrade to Premium
              </Link>
              <Link 
                href="/topics"
                className="w-full sm:w-auto text-xs font-semibold uppercase tracking-wider bg-transparent text-zinc-600 hover:text-zinc-900 border border-zinc-200 dark:border-zinc-800 px-6 py-3 hover:border-zinc-400 transition-colors"
              >
                Try Free Topics
              </Link>
            </div>
          </div>
          
          {/* Decorative Scribble Ring Loop */}
          <div className="absolute -bottom-10 -right-10 opacity-30 pointer-events-none">
            <svg width="150" height="150" viewBox="0 0 100 100" className="fill-none stroke-amber-500">
              <path className="animate-scribble" strokeWidth="1" d="M10,50 C10,20 40,10 50,10 C80,10 90,40 90,50 C90,80 60,90 50,90 C20,90 10,60 10,50" />
            </svg>
          </div>
        </section>

      ) : (

        /* OPEN WORKSPACE (FREE TOPIC) */
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Learning Notes & Tabs */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Workspace tabs selector */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={() => setActiveTab("notes")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "notes" 
                    ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50" 
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Notes
              </button>
              <button 
                onClick={() => setActiveTab("video")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "video" 
                    ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50" 
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video Lecture
              </button>
              <button 
                onClick={() => setActiveTab("pdf")}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "pdf" 
                    ? "border-zinc-900 dark:border-zinc-50 text-zinc-900 dark:text-zinc-50" 
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Download className="w-3.5 h-3.5" /> PDF blueprint
              </button>
            </div>

            {/* Tab Rendering Content */}
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md shadow-sm min-h-[300px]">
              
              {activeTab === "notes" && (
                <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line text-zinc-700 dark:text-zinc-300">
                  {topic.contentMarkdown}
                </div>
              )}

              {activeTab === "video" && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-8">
                  <div className="w-full aspect-video border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 rounded flex flex-col items-center justify-center gap-2">
                    <Video className="w-12 h-12 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-400">{topic.title} video lecture placeholder</span>
                  </div>
                  <p className="text-2xs text-zinc-400 text-center">Video streams directly via CloudFront CDN cache edge.</p>
                </div>
              )}

              {activeTab === "pdf" && (
                <div className="w-full py-12 flex flex-col items-center justify-center gap-4 text-center">
                  <FileText className="w-12 h-12 text-zinc-400" />
                  <div>
                    <h3 className="font-semibold text-sm">Download System Blueprints</h3>
                    <p className="text-xs text-zinc-400 mt-1">Get high-resolution hand-sketched blueprints of this topology.</p>
                  </div>
                  <button 
                    type="button"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2.5 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" /> Download PDF Blueprint
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Prerequisites & Related Topics */}
          <div className="flex flex-col gap-6">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Prerequisites</h3>
              <ul className="flex flex-col gap-3">
                {topic.prerequisites?.map((prereq) => (
                  <li key={prereq} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                    <CheckCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Evaluation Workbench</h3>
              <p className="text-2xs text-zinc-500 leading-relaxed">
                Use this sandbox to test percentage evaluations locally. This course configuration evaluates on active client profiles.
              </p>
              <div className="flex items-center gap-2 text-3xs font-mono border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded mt-3 text-zinc-400">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active SDK evaluation matches client consistent rollout bucket key.
              </div>
            </div>
          </div>

        </section>
      )}

    </div>
  );
}
