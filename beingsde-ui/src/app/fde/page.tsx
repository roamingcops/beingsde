"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Server, Zap, Shield, Database, LayoutTemplate, Briefcase, ArrowRight } from "lucide-react";

export default function FdePage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Role Guide</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50 mb-4">
          Forward Deployed Engineer (FDE)
        </h1>
        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Forward Deployed Engineers (also known as Solutions Engineers or Implementation Engineers) are full-stack software engineers who work directly on the frontlines with clients. Famously pioneered by companies like Palantir and Snowflake, this role blends hardcore technical architecture with high-stakes business strategy.
        </p>
      </div>

      {/* Core Competencies Grid */}
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          Core Competencies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 p-5 rounded-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-full text-blue-600 dark:text-blue-400">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Technical Agility</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              FDEs often drop into unknown client environments. You must be able to read legacy code, integrate with obscure SOAP APIs, and rapidly prototype full-stack solutions using unfamiliar tech stacks.
            </p>
          </div>
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 p-5 rounded-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-full text-emerald-600 dark:text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Client Empathy</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              You sit at the table with CEOs and end-users. You must translate ambiguous business problems (e.g., "Our supply chain is too slow") into concrete technical data pipelines and architectures.
            </p>
          </div>
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 p-5 rounded-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-full text-purple-600 dark:text-purple-400">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Security & On-Prem</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Unlike SaaS engineers, FDEs often deploy into highly secure, air-gapped, or on-premise networks. A deep understanding of networking, VPNs, Docker, and IAM policies is critical.
            </p>
          </div>
          <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 p-5 rounded-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-full text-amber-600 dark:text-amber-400">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Data Engineering</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Data is the lifeblood of client integrations. Expect to write complex ETL pipelines, optimize SQL queries, and design schema architectures to unify disjointed client datasets.
            </p>
          </div>
        </div>
      </div>

      {/* The Interview Loop */}
      <div className="mb-12">
        <h2 className="text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          The FDE Interview Loop
        </h2>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold font-mono text-sm">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Decomposition / Role Play</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                The defining round for FDEs. You will be given a vague scenario (e.g., "A hospital wants to predict patient readmissions"). You must ask the right business questions, scope the technical requirements, and pitch a high-level technical architecture to the interviewer acting as the client.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold font-mono text-sm">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Systems Integration & API Design</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Unlike standard HLD rounds that focus on building Facebook at scale, FDE design rounds focus on integration. Expect to design webhooks, ETL pipelines, OAuth flows, and data syncing strategies between legacy monolithic systems and modern cloud platforms.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold font-mono text-sm">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Data Structures & Algorithms</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Standard LeetCode-style coding interviews. While usually slightly less intense than core SWE rounds, you are still expected to write clean, optimal code for standard data structures (Trees, Graphs, HashMaps).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps CTA */}
      <div className="bg-zinc-50 dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-sm p-8 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Prepare for the FDE Loop</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-xl mx-auto">
          Brush up on your High-Level Design and System Integration concepts. Mastering HLD is the fastest way to ace the FDE Decomposition round.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/topics"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-6 py-3 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
          >
            Study HLD Topics
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/interviews"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider bg-transparent text-zinc-900 dark:text-zinc-100 px-6 py-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all"
          >
            Practice Mock Interviews
          </Link>
        </div>
      </div>
    </div>
  );
}
