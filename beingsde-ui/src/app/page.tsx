"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Layers, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-20 py-10 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full max-w-4xl text-center flex flex-col items-center gap-6 mt-10">
        
        {/* Animated Hand-Drawn Circle Accent */}
        <div className="absolute -top-12 -left-6 md:left-12 opacity-40 dark:opacity-20 pointer-events-none">
          <svg width="100" height="100" viewBox="0 0 100 100" className="fill-none stroke-zinc-900 dark:stroke-zinc-100 scribble-glow">
            <path 
              className="animate-scribble" 
              strokeWidth="1.5" 
              d="M50,15 C75,10 88,35 85,55 C82,75 60,88 40,85 C20,82 12,58 15,38 C18,18 42,12 49,15"
            />
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-[#ffffff] dark:bg-[#18181b] text-xs font-medium tracking-wide">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Production-Ready System Design Platform
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-zinc-950 dark:text-zinc-50 max-w-3xl">
          Master{" "}
          <span className="relative inline-block px-1">
            System Design
            {/* Underline loop scribble */}
            <svg 
              className="absolute -bottom-3 left-0 w-full h-4 overflow-visible pointer-events-none fill-none stroke-zinc-900 dark:stroke-zinc-100 stroke-[3]"
              viewBox="0 0 200 12"
            >
              <path 
                className="animate-scribble"
                strokeLinecap="round" 
                d="M2,8 C40,15 80,2 198,10 C140,15 60,6 10,8"
              />
            </svg>
          </span>{" "}
          at Global Scale
        </h1>

        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mt-4 font-normal leading-relaxed">
          Interactive High-Level and Low-Level architecture tutorials, mock interview evaluations, and consistent rollout feature flag mechanics designed by Staff Engineers.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link 
            href="/topics"
            className="group flex items-center gap-2 text-sm font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3.5 border border-zinc-950 dark:border-zinc-50 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
          >
            Explore Design Topics
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/subscriptions"
            className="text-sm font-semibold uppercase tracking-wider bg-transparent text-zinc-900 dark:text-zinc-100 px-6 py-3.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors"
          >
            View Pricing Plans
          </Link>
        </div>

        {/* Scribble Pointing Arrow */}
        <div className="hidden md:block absolute -right-20 bottom-0 pointer-events-none opacity-45">
          <svg width="80" height="80" viewBox="0 0 80 80" className="fill-none stroke-zinc-900 dark:stroke-zinc-100">
            <path 
              className="animate-scribble" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              d="M10,15 C20,35 45,45 60,35 M50,25 C55,29 58,32 60,35 C58,38 52,43 48,47"
            />
          </svg>
        </div>
      </section>

      {/* MINIMALIST HAND-DRAWN SYSTEM SCHEMATIC DIAGRAM */}
      <section className="w-full max-w-4xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-md shadow-sm flex flex-col items-center gap-6">
        <div className="w-full flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Interactive Architectural Workbench</span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Layers className="w-3.5 h-3.5" /> High-Level Design (HLD)</span>
        </div>

        {/* Scribble System Design Image */}
        <div className="w-full overflow-hidden rounded-sm">
          <Image
            src="/hld-scribble.png"
            alt="Hand-drawn HLD diagram showing Client → ALB/Gateway → beingsde-core → Redis Cache & MongoDB"
            width={1024}
            height={512}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </section>

      {/* VALUE PROP GRID */}
      <section className="w-full max-w-5xl flex flex-col gap-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight uppercase text-zinc-400 font-mono">CORE ADVANTAGES</h2>
          <p className="text-sm text-zinc-500 mt-2">Why engineers choose beingsde.com to pass MAANG interviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-[#18181b] hover:shadow-md transition-shadow">
            <BookOpen className="w-8 h-8 text-zinc-900 dark:text-zinc-100 mb-4" />
            <h3 className="text-base font-bold mb-2">High-Level & Low-Level Designs</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Step-by-step guides covering architectural trade-offs (CAP, consistency models) down to detailed package interfaces.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-[#18181b] hover:shadow-md transition-shadow">
            <Zap className="w-8 h-8 text-zinc-900 dark:text-zinc-100 mb-4" />
            <h3 className="text-base font-bold mb-2">Consistent Percentage Rollouts</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Interact with custom feature flag rules to see how specific course assets load dynamically depending on user metadata.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-[#18181b] hover:shadow-md transition-shadow">
            <Users className="w-8 h-8 text-zinc-900 dark:text-zinc-100 mb-4" />
            <h3 className="text-base font-bold mb-2">Detailed Mock Evaluations</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Book structured simulation calls with Staff/Principal interviewers and receive scores mapping to standard industry criteria.
            </p>
          </div>
        </div>
      </section>

      {/* NEWSLETTER / CONVERSION SECTION */}
      <section className="w-full max-w-4xl text-center border-t border-zinc-200 dark:border-zinc-800 pt-16 flex flex-col items-center gap-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready to master high-scale architecture?</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
          Join 12,000+ senior engineers reading our weekly breakdowns of modern distributed database topologies.
        </p>

        <div className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            placeholder="Enter your professional email" 
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors"
          />
          <button 
            type="button" 
            className="text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 border border-zinc-900 dark:border-zinc-100 transition-all duration-300"
          >
            Subscribe
          </button>
        </div>
      </section>
      
    </div>
  );
}
