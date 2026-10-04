"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Copy,
  Check,
  Rocket,
  Target,
  Shield,
  Zap,
  Users,
  Star,
  Flame,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  GitPullRequest,
  Terminal,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  BadgeAlert,
} from "lucide-react";
import {
  EVALUATION_PILLARS,
  TICKET_EXAMPLES,
  QUALITY_METRICS_DATA,
  AUTOMATION_PROJECTS,
  DEPLOYMENT_CHECKLIST,
  CONTINUOUS_1ON1_LOG,
  TEMPLATES,
  TicketExample,
} from "@/data/promotion-guide";

type TabId =
  | "overview"
  | "tickets"
  | "quality"
  | "automation"
  | "senior-traits"
  | "one-on-one"
  | "templates";

type LevelFilter = "ALL" | "SDE1_TO_SDE2" | "SDE2_TO_SDE3" | "SDE3_TO_STAFF";

export default function PromotionDocClient() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("ALL");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Toggle state for before/after comparison on tickets
  const [ticketViews, setTicketViews] = useState<Record<string, "exceeds" | "standard">>({});

  // Toil Calculator State
  const [calcEngineers, setCalcEngineers] = useState<number>(12);
  const [calcHoursPerWeek, setCalcHoursPerWeek] = useState<number>(3.5);
  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(85);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  const getTicketView = (id: string) => ticketViews[id] || "exceeds";
  const toggleTicketView = (id: string) => {
    setTicketViews((prev) => ({
      ...prev,
      [id]: prev[id] === "standard" ? "exceeds" : "standard",
    }));
  };

  // Filtered tickets based on level
  const filteredTickets = TICKET_EXAMPLES.filter((t) => {
    if (levelFilter === "ALL") return true;
    return t.level === levelFilter;
  });

  // Calculate Toil Savings
  const annualHours = Math.round(calcEngineers * calcHoursPerWeek * 52);
  const annualDollars = Math.round(annualHours * calcHourlyRate);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 px-4">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(TEMPLATES.fullPromoDoc, "full-doc-top")}
            className="flex items-center gap-2 text-xs font-mono font-medium px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {copiedKey === "full-doc-top" ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Template Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Full Promo Template</span>
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-3.5 py-1.5 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Guide
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium tracking-wide mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Masterclass: Staff & Bar Raiser Promotion Evaluation Guide
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mb-3">
          How to Fill the SDE Year-End Promotion Document
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
          The definitive playbook for Software Engineers (<span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-200">SDE-1 → SDE-2 → Senior SDE → Staff</span>) to write a bulletproof promotion packet. Learn how to transform standard tickets into <strong>Exceeds Expectations</strong> achievements, prove customer &amp; business obsession, justify defect-free quality with hard metrics, eliminate operational toil, and document continuous 1:1 growth.
        </p>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <div>
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">STAR-I Format</div>
            <div className="text-zinc-500">Situation, Task, Action, Result &amp; Hard Impact</div>
          </div>
          <div>
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">Zero-Defect Quality</div>
            <div className="text-zinc-500">Defect Escape Rate, P0/P1 counts &amp; Chaos testing</div>
          </div>
          <div>
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">Deployment Owner</div>
            <div className="text-zinc-500">Canary rollouts, blast radius &amp; RCA playbooks</div>
          </div>
          <div>
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">1:1 Feedback Loops</div>
            <div className="text-zinc-500">Closed-loop growth tracking every catchup</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800 mb-8 text-xs font-medium no-scrollbar">
        {[
          { id: "overview", label: "Packet Blueprint", icon: Layers },
          { id: "tickets", label: "Ticket Showcase & STAR-I", icon: Rocket },
          { id: "quality", label: "Quality & Bug Counts", icon: Shield },
          { id: "automation", label: "Toil & Automation", icon: Zap },
          { id: "senior-traits", label: "Senior & Deployment Owner", icon: Users },
          { id: "one-on-one", label: "1:1 Feedback Tracking", icon: Clock },
          { id: "templates", label: "Copyable Templates", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-sm whitespace-nowrap transition-all ${
                isActive
                  ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & PROMO PACKET ARCHITECTURE */}
      {/* ========================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Executive Strategy Guide */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Committee Evaluation Mechanics
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                How Promotion Committees (Bar Raisers &amp; Directors) Grade Your Packet
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                In top-tier engineering organizations (Amazon, Google, Meta, Stripe), promotions are <strong>retrospective, not forward-looking</strong>. You are not promoted with the hope that you will perform at the next level; you are promoted because you have <strong>already been performing at the next level consistently for at least 6 to 12 months</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm bg-zinc-50/50 dark:bg-zinc-900/40">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                  <BadgeAlert className="w-4 h-4 text-rose-500" />
                  What Kills Promo Packets
                </div>
                <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-4 mt-2">
                  <li>Listing tasks completed without business or customer impact.</li>
                  <li>Using &ldquo;we&rdquo; everywhere without clarifying your distinct individual contribution.</li>
                  <li>Zero hard metrics (no latency numbers, bug counts, or dollar ROI).</li>
                  <li>Surprise gaps in calibration that were never discussed in 1:1s.</li>
                </ul>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm bg-zinc-50/50 dark:bg-zinc-900/40">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  What Secures &ldquo;Exceeds&rdquo;
                </div>
                <ul className="text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc pl-4 mt-2">
                  <li>Delivering ahead of deadline with zero post-launch P0/P1 defects.</li>
                  <li>Proactively solving unstated customer pain points beyond the PRD.</li>
                  <li>Acting as Deployment Owner with automated canary safety rails.</li>
                  <li>Eliminating operational toil that saves hundreds of team hours.</li>
                </ul>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm bg-zinc-50/50 dark:bg-zinc-900/40">
                <div className="font-bold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  The 6-Month Golden Rule
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Start drafting your promo doc <strong>6 months before the annual review</strong>. In every 1:1, review open action items with your manager. When official review season opens in Q4, your manager should have zero doubts and total alignment.
                </p>
              </div>
            </div>
          </div>

          {/* The 5 Evaluation Pillars */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              The 5 Core Pillars of a Staff-Grade Promotion Packet
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {EVALUATION_PILLARS.map((pillar) => (
                <div
                  key={pillar.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{pillar.title}</h4>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">{pillar.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {pillar.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                      <div className="font-mono font-bold text-zinc-500 mb-1">Meets Expectations (Standard)</div>
                      <p className="text-zinc-600 dark:text-zinc-400">{pillar.rubricComparison[0].description}</p>
                    </div>
                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-sm">
                      <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Exceeds Expectations (Promo-Ready)
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300">{pillar.rubricComparison[1].description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TICKET SHOWCASE & STAR-I */}
      {/* ========================================================= */}
      {activeTab === "tickets" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Header & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Work Tickets &amp; The STAR-I Justification Framework
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Toggle between &ldquo;Meets Expectations&rdquo; and &ldquo;Exceeds Expectations&rdquo; to see the exact difference in phrasing, technical depth, and quantifiable impact.
              </p>
            </div>

            {/* Level Filter Buttons */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
              {[
                { id: "ALL", label: "All Levels" },
                { id: "SDE1_TO_SDE2", label: "SDE 1 → 2" },
                { id: "SDE2_TO_SDE3", label: "SDE 2 → Senior" },
                { id: "SDE3_TO_STAFF", label: "Senior → Staff" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setLevelFilter(filter.id as LevelFilter)}
                  className={`px-2.5 py-1 transition-colors ${
                    levelFilter === filter.id
                      ? "bg-white dark:bg-[#18181b] text-zinc-900 dark:text-zinc-100 font-bold shadow-xs"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-6">
            {filteredTickets.map((ticket) => {
              const currentView = getTicketView(ticket.id);
              return (
                <div
                  key={ticket.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden"
                >
                  {/* Ticket Header Banner */}
                  <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 rounded-xs">
                          {ticket.ticketKey}
                        </span>
                        <span className="text-2xs font-mono px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full">
                          Role: {ticket.role}
                        </span>
                        <span className="text-2xs font-mono px-2 py-0.5 bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-full">
                          {ticket.principle}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-zinc-50">
                        {ticket.title}
                      </h3>
                    </div>

                    {/* View Switcher Toggle */}
                    <div className="flex items-center gap-2 self-start md:self-auto">
                      <button
                        onClick={() => toggleTicketView(ticket.id)}
                        className={`text-xs font-mono font-medium px-3 py-1.5 border transition-all ${
                          currentView === "standard"
                            ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                            : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                        }`}
                      >
                        {currentView === "standard" ? "View: Meets Expectations (Click to Upgrade)" : "View: Exceeds Expectations (Promo Standard)"}
                      </button>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-zinc-100/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-xs">
                    {ticket.metrics.map((m, idx) => (
                      <div key={idx} className="border-l-2 border-emerald-500 pl-3">
                        <div className="text-2xs font-mono text-zinc-500">{m.label}</div>
                        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Ticket Content Body */}
                  <div className="p-6">
                    {currentView === "standard" ? (
                      /* Standard (Meets Expectations) view */
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-sm">
                          <div className="text-xs font-mono font-bold text-amber-800 dark:text-amber-400 mb-1">
                            Common SDE Phrasing (Meets Expectations):
                          </div>
                          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 italic">
                            &ldquo;{ticket.standardWriteup.summary}&rdquo;
                          </p>
                        </div>

                        <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm text-xs space-y-2">
                          <div className="font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Why Committees Will Reject This for Promotion:
                          </div>
                          <ul className="list-disc pl-5 space-y-1 text-zinc-600 dark:text-zinc-400">
                            {ticket.standardWriteup.flaws.map((flaw, fIdx) => (
                              <li key={fIdx}>{flaw}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      /* Exceeds Expectations (Promo-Ready) view */
                      <div className="space-y-6 text-xs sm:text-sm">
                        {/* Situation */}
                        <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 space-y-1">
                          <span className="font-mono text-2xs uppercase tracking-wider font-bold text-zinc-400">
                            1. Situation &amp; Business Context
                          </span>
                          <p className="text-zinc-700 dark:text-zinc-300">{ticket.exceedsWriteup.situation}</p>
                        </div>

                        {/* Task */}
                        <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-4 space-y-1">
                          <span className="font-mono text-2xs uppercase tracking-wider font-bold text-zinc-400">
                            2. Task &amp; Scope Extension
                          </span>
                          <p className="text-zinc-700 dark:text-zinc-300">{ticket.exceedsWriteup.task}</p>
                        </div>

                        {/* Action */}
                        <div className="border-l-2 border-emerald-500 pl-4 space-y-1 bg-emerald-50/20 dark:bg-emerald-950/10 py-2 rounded-r-xs">
                          <span className="font-mono text-2xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                            3. Actions &amp; Architectural Ownership (The &ldquo;How&rdquo;)
                          </span>
                          <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed font-sans">
                            {ticket.exceedsWriteup.action}
                          </p>
                        </div>

                        {/* Result & Impact */}
                        <div className="border-l-2 border-sky-500 pl-4 space-y-2 bg-sky-50/20 dark:bg-sky-950/10 py-2 rounded-r-xs">
                          <span className="font-mono text-2xs uppercase tracking-wider font-bold text-sky-600 dark:text-sky-400">
                            4. Quantifiable Result &amp; Hard Metrics
                          </span>
                          <p className="text-zinc-800 dark:text-zinc-200">{ticket.exceedsWriteup.result}</p>
                          <div className="text-xs font-bold text-sky-700 dark:text-sky-300">
                            Impact: {ticket.exceedsWriteup.impact}
                          </div>
                        </div>

                        {/* Customer Obsession & Senior Traits Callouts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="p-3 bg-pink-50/40 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50 rounded-sm text-xs">
                            <div className="font-mono font-bold text-pink-700 dark:text-pink-400 flex items-center gap-1.5 mb-1">
                              <Target className="w-3.5 h-3.5" />
                              Customer First &amp; Obsession Angle
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300">{ticket.exceedsWriteup.customerObsessionAngle}</p>
                          </div>
                          <div className="p-3 bg-violet-50/40 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/50 rounded-sm text-xs">
                            <div className="font-mono font-bold text-violet-700 dark:text-violet-400 flex items-center gap-1.5 mb-1">
                              <Star className="w-3.5 h-3.5" />
                              Senior Traits &amp; Force Multiplier
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300">{ticket.exceedsWriteup.seniorTraitsAngle}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: QUALITY & BUG COUNTS */}
      {/* ========================================================= */}
      {activeTab === "quality" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Hard Engineering Evidence
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              How to Justify Code Quality with Defect Counts &amp; Hard Metrics
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
              Anyone can claim they &ldquo;write high quality code.&rdquo; Promotion committees dismiss vague self-praise. To earn an <strong>Exceeds Expectations</strong> rating on quality, you must present concrete, verifiable defect metrics, automated test pyramid expansions, and fault-tolerance validations.
            </p>
          </div>

          {/* Quality Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUALITY_METRICS_DATA.map((item, idx) => (
              <div
                key={idx}
                className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-zinc-950 dark:text-zinc-50">{item.category}</h3>
                  <span className="text-2xs font-mono px-2 py-0.5 bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800">
                    {item.target}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-mono text-zinc-500 font-semibold">How to Track &amp; Gather Data:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">{item.howToTrack}</p>
                  </div>

                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                    <span className="font-mono text-2xs uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                      Example Promo Doc Phrasing:
                    </span>
                    <p className="text-zinc-800 dark:text-zinc-200 mt-1 italic">&ldquo;{item.exampleMetric}&rdquo;</p>
                  </div>

                  <div className="font-mono text-2xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-xs">
                    {item.formula}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Defect Escape Rate Table */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm space-y-4">
            <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">
              The Engineering Quality Proof Matrix
            </h3>
            <p className="text-xs text-zinc-500">
              Drop this exact table into Section 3 of your promotion packet to provide undeniable evidence of engineering rigor.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-mono">
                    <th className="p-3">Quality Dimension</th>
                    <th className="p-3">Team Baseline / Standard</th>
                    <th className="p-3">My Delivered Score</th>
                    <th className="p-3">Verification Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Sev-1 / Sev-2 Production Outages</td>
                    <td className="p-3 text-zinc-500">&lt; 3 per year</td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">0 in 12 months</td>
                    <td className="p-3 text-zinc-500">PagerDuty Post-Mortem Log</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Defect Escape Rate (Post-Release Bugs)</td>
                    <td className="p-3 text-zinc-500">&lt; 5.0%</td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">0.4% across 18 deploys</td>
                    <td className="p-3 text-zinc-500">JIRA Bug Triage Filter</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Automated Test Pyramid Coverage</td>
                    <td className="p-3 text-zinc-500">55% baseline</td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">88.4% (Unit + Contract)</td>
                    <td className="p-3 text-zinc-500">SonarQube Coverage Report</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Pre-Launch Load Testing Verification</td>
                    <td className="p-3 text-zinc-500">1x peak expected traffic</td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">3.5x peak (45,000 QPS)</td>
                    <td className="p-3 text-zinc-500">k6 Benchmark Dashboard</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">P99 Checkout API Latency</td>
                    <td className="p-3 text-zinc-500">&lt; 450ms SLA</td>
                    <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">260ms sustained</td>
                    <td className="p-3 text-zinc-500">Datadog APM Trace Service</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: AUTOMATION & TOIL KILLER */}
      {/* ========================================================= */}
      {activeTab === "automation" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Force Multiplication
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Showcasing Automation Tasks &amp; &ldquo;Side Tickets&rdquo; to Kill Toil
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
              Engineers often spend dozens of hours automating broken CI pipelines, writing migration scripts, or building internal tools that nobody officially assigned to them. <strong>This is high-leverage Senior SDE behavior</strong>. Learn how to package these unassigned side projects into high-ROI promotion bullet points.
            </p>
          </div>

          {/* Interactive Toil Calculator */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-6">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 font-mono">
                Interactive Engineering Toil &amp; Dollar ROI Calculator
              </h3>
            </div>
            <p className="text-xs text-zinc-500">
              Use this formula to calculate the exact dollar capacity and engineering hours your automation saved the company.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-1">
                  Engineers Impacted by Your Tool:
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={calcEngineers}
                  onChange={(e) => setCalcEngineers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-sm font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-1">
                  Hours Saved per Engineer / Week:
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="40"
                  value={calcHoursPerWeek}
                  onChange={(e) => setCalcHoursPerWeek(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-sm font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-1">
                  Blended Hourly Cost per Eng ($USD):
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={calcHourlyRate}
                  onChange={(e) => setCalcHourlyRate(Math.max(30, parseInt(e.target.value) || 30))}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-sm font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
                />
              </div>
            </div>

            {/* Output Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-sm">
              <div>
                <div className="text-2xs font-mono uppercase text-amber-800 dark:text-amber-400 font-semibold">
                  Annual Engineering Capacity Unlocked
                </div>
                <div className="text-2xl font-black font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                  {annualHours.toLocaleString()} Hours / Year
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Equivalent to {(annualHours / 1900).toFixed(1)} full-time engineer(s) capacity freed from toil.
                </div>
              </div>

              <div>
                <div className="text-2xs font-mono uppercase text-amber-800 dark:text-amber-400 font-semibold">
                  Equivalent Engineering Dollar Savings
                </div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  ${annualDollars.toLocaleString()} / Year
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Based on ${calcHourlyRate}/hr loaded engineering cost model.
                </div>
              </div>
            </div>
          </div>

          {/* Catalog of Proven Automation Side-Tickets */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">
              4 Proven Automation Projects That Got Engineers Promoted
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AUTOMATION_PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xs">
                      {proj.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {proj.annualHoursSaved} hrs / yr saved
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-zinc-950 dark:text-zinc-50">{proj.title}</h4>

                  <div className="text-xs space-y-1.5">
                    <div>
                      <span className="font-mono text-zinc-400 font-semibold">The Pain: </span>
                      <span className="text-zinc-600 dark:text-zinc-400">{proj.problem}</span>
                    </div>
                    <div>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">The Automated Fix: </span>
                      <span className="text-zinc-800 dark:text-zinc-200">{proj.solution}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs font-mono text-zinc-500">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Senior Trait: </span>
                    {proj.seniorTraitDemonstrated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SENIOR TRAITS & DEPLOYMENT OWNER */}
      {/* ========================================================= */}
      {activeTab === "senior-traits" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Technical Leadership &amp; Operational Command
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Senior Developer Traits &amp; The Deployment Owner Playbook
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
              A Senior SDE is not just a faster coder. A Senior SDE is a <strong>safe pair of hands</strong> who manages ambiguity, drives architectural consensus via RFCs, and commands high-stakes deployments with zero blast radius.
            </p>
          </div>

          {/* 3 Core Senior SDE Archetypes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm space-y-3">
              <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-violet-500" />
                1. Driving RFCs &amp; Architecture
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Take an ambiguous mandate (&ldquo;our search is slow&rdquo;), investigate the root bottlenecks, and author an RFC proposing 2–3 viable paths with trade-off matrices (CAP, cost, operational complexity). Schedule and lead the design review, proactively resolving pushback.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm space-y-3">
              <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                2. Deployment Owner Command
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Act as the Primary Release Commander. Author the blast-radius runbook, verify zero-lock DB migrations, enforce canary validation stages, and define quantitative, non-negotiable rollback thresholds before traffic ramps.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm space-y-3">
              <div className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" />
                3. Mentorship &amp; Code Review Culture
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Senior engineers multiply their team. Conduct thorough, architectural code reviews that catch concurrency traps and security holes before QA. Mentor junior engineers through their first multi-component feature delivery.
              </p>
            </div>
          </div>

          {/* Deployment Owner Pre-Flight & Rollout Checklist */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">
                  The Deployment Owner Execution Runbook
                </h3>
                <p className="text-xs text-zinc-500">
                  Follow this exact step-by-step checklist when acting as Deployment Owner for high-stakes production rollouts.
                </p>
              </div>
              <button
                onClick={() =>
                  copyToClipboard(
                    DEPLOYMENT_CHECKLIST.map((c) => `[${c.phase}] ${c.action}\nRationale: ${c.rationale}\nVerification: ${c.ownerCheck}`).join("\n\n"),
                    "deploy-checklist"
                  )
                }
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {copiedKey === "deploy-checklist" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Checklist</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-3">
              {DEPLOYMENT_CHECKLIST.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-sm text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold uppercase px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xs">
                      {item.phase}
                    </span>
                    <span className="text-2xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Verified
                    </span>
                  </div>
                  <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.action}</div>
                  <p className="text-zinc-600 dark:text-zinc-400">{item.rationale}</p>
                  <div className="pt-1 text-2xs font-mono text-zinc-500 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">Owner Verification Check: </span>
                    {item.ownerCheck}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: 1:1 FEEDBACK & CONTINUOUS GROWTH LOG */}
      {/* ========================================================= */}
      {activeTab === "one-on-one" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Zero-Surprise Calibration
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Documenting Every 1:1 &amp; Showing Closed-Loop Improvement
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
              The single biggest mistake engineers make is waiting until performance review season to ask: <em>&ldquo;Am I on track for promotion?&rdquo;</em> By then, it is already too late. You must maintain a <strong>Continuous 1:1 Feedback Log</strong>. Every time your manager highlights an area for growth, you document it, act on it within 14 days, and bring hard evidence to the next catchup to formally close the loop.
            </p>
          </div>

          {/* The 3-Step Closed Loop System */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-[#18181b] rounded-sm space-y-2">
              <span className="font-mono text-2xs font-bold text-rose-500 uppercase">Step 1: Capture</span>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Record Exact Manager Feedback</h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Immediately after your 1:1, write down verbatim what your manager said. Do not soften the feedback. Treat it as an explicit rubric requirement for your promo packet.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-[#18181b] rounded-sm space-y-2">
              <span className="font-mono text-2xs font-bold text-amber-500 uppercase">Step 2: Act</span>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Execute in 14 Days</h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Take immediate, verifiable action. If they said you need to speak up more in architecture syncs, author an RFC and present it. If they said code reviews were slow, block daily calendar review slots.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-[#18181b] rounded-sm space-y-2">
              <span className="font-mono text-2xs font-bold text-emerald-500 uppercase">Step 3: Close Loop</span>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Present Evidence at Next Catchup</h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                At the very next 1:1, open with: <em>&ldquo;In our last catchup, you advised me to improve X. Here is what I did and the data. Would you agree this gap is now resolved?&rdquo;</em>
              </p>
            </div>
          </div>

          {/* Real-World 1:1 Feedback Tracking Examples */}
          <div className="space-y-4">
            <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">
              Real-World 1:1 Feedback-to-Improvement Matrix
            </h3>

            <div className="space-y-4">
              {CONTINUOUS_1ON1_LOG.map((log) => (
                <div
                  key={log.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xs">
                        {log.date}
                      </span>
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{log.area}</span>
                    </div>
                    <span className="text-2xs font-mono font-bold px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full self-start sm:self-auto">
                      Status: {log.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/40 rounded-sm">
                      <span className="font-mono text-2xs uppercase text-rose-700 dark:text-rose-400 font-bold">
                        Manager Feedback Highlighted:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 mt-1 italic leading-relaxed">{log.managerFeedback}</p>
                    </div>

                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                      <span className="font-mono text-2xs uppercase text-zinc-500 font-bold">
                        Immediate Action Taken (Within 14 Days):
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200 mt-1 leading-relaxed">{log.actionTaken}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-sm text-xs space-y-2">
                    <div>
                      <span className="font-mono text-2xs uppercase text-emerald-700 dark:text-emerald-400 font-bold">
                        Evidence Shown in Next Catchup:
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200 mt-0.5">{log.nextCatchupEvidence}</p>
                    </div>
                    <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/40">
                      <span className="font-mono text-2xs uppercase text-emerald-800 dark:text-emerald-300 font-bold">
                        Manager Confirmation &amp; Sign-Off:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 italic mt-0.5">{log.managerResponse}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: COPYABLE TEMPLATES */}
      {/* ========================================================= */}
      {activeTab === "templates" && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Ready-to-Use Artifacts
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              One-Click Copyable Promotion &amp; Self-Review Templates
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
              Copy these battle-tested Markdown templates directly into your Notion, Google Docs, or internal HR portal. Fill in the bracketed placeholders with your specific metrics and tickets.
            </p>
          </div>

          {/* Template 1: Full Promo Document */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 font-mono">
                  1. Complete Year-End Promotion Packet Template (Full Document)
                </h3>
                <p className="text-2xs text-zinc-500">Includes Executive Summary, STAR-I tickets, Defect Matrix, Toil Automation, and 1:1 Logs.</p>
              </div>
              <button
                onClick={() => copyToClipboard(TEMPLATES.fullPromoDoc, "tmpl-full")}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                {copiedKey === "tmpl-full" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Markdown</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-6 text-2xs font-mono bg-zinc-950 text-zinc-300 overflow-x-auto max-h-96 leading-relaxed select-all">
              {TEMPLATES.fullPromoDoc}
            </pre>
          </div>

          {/* Template 2: STAR-I Ticket Template */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 font-mono">
                  2. Single Project / Ticket Writeup Template (STAR-I)
                </h3>
                <p className="text-2xs text-zinc-500">Use this to structure each major feature ticket or initiative in your promo document.</p>
              </div>
              <button
                onClick={() => copyToClipboard(TEMPLATES.ticketTemplate, "tmpl-ticket")}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                {copiedKey === "tmpl-ticket" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Ticket Template</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-6 text-2xs font-mono bg-zinc-950 text-zinc-300 overflow-x-auto max-h-80 leading-relaxed select-all">
              {TEMPLATES.ticketTemplate}
            </pre>
          </div>

          {/* Template 3: 1:1 Feedback Tracker */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 font-mono">
                  3. Continuous 1:1 Feedback Matrix &amp; Manager Alignment Tracker
                </h3>
                <p className="text-2xs text-zinc-500">Paste this into a private running document shared with your engineering manager.</p>
              </div>
              <button
                onClick={() => copyToClipboard(TEMPLATES.oneOnOneTracker, "tmpl-1on1")}
                className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                {copiedKey === "tmpl-1on1" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy 1:1 Tracker</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-6 text-2xs font-mono bg-zinc-950 text-zinc-300 overflow-x-auto max-h-80 leading-relaxed select-all">
              {TEMPLATES.oneOnOneTracker}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
