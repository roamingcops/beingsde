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
  HelpCircle,
  CheckCheck,
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

  const TABS_CONFIG = [
    { id: "overview", label: "Packet Blueprint", icon: Layers, desc: "Rubrics & Committee Strategy" },
    { id: "tickets", label: "Ticket Showcase & STAR-I", icon: Rocket, desc: "Before vs. After Justifications" },
    { id: "quality", label: "Quality & Bug Counts", icon: Shield, desc: "Zero-Defect Metrics & Proof" },
    { id: "automation", label: "Toil & Automation", icon: Zap, desc: "Force-Multiplier Side Tasks" },
    { id: "senior-traits", label: "Senior & Deployment Owner", icon: Users, desc: "RFCs & Safe Rollout Command" },
    { id: "one-on-one", label: "1:1 Feedback Tracking", icon: Clock, desc: "Closed-Loop Growth Matrix" },
    { id: "templates", label: "Copyable Templates", icon: FileText, desc: "1-Click Markdown Artifacts" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-10">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => copyToClipboard(TEMPLATES.fullPromoDoc, "full-doc-top")}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors shadow-xs"
          >
            {copiedKey === "full-doc-top" ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Template Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-zinc-500" />
                <span>Copy Full Promo Template</span>
              </>
            )}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-sm font-semibold tracking-wide bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 px-4 py-2 border border-zinc-950 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-950 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 rounded-sm relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-medium tracking-wide mb-5">
          <Sparkles className="w-4 h-4" />
          <span>Staff &amp; Bar Raiser Promotion Evaluation Masterclass</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight mb-4">
          How to Fill the SDE Year-End Promotion Document
        </h1>
        
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
          The definitive field guide for Software Engineers (<span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">SDE-1 → SDE-2 → Senior SDE → Staff</span>) to write a compelling, review-ready promotion packet. Learn how to transform regular Jira tasks into <strong>Exceeds Expectations</strong> achievements, prove customer &amp; business obsession, justify defect-free quality with hard metrics, eliminate operational toil, and document continuous 1:1 growth.
        </p>

        {/* Modular Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
              <Rocket className="w-4 h-4 text-emerald-500" />
              STAR-I Framework
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
              Situation, Task, Action, Result &amp; Hard Business Metrics.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-500" />
              Zero-Defect Quality
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
              Defect escape rates, P0/P1 metrics &amp; automated test pyramid.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-500" />
              Deployment Owner
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
              Canary releases, blast-radius mitigation &amp; blameless RCAs.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              1:1 Feedback Loops
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
              Documenting feedback and proving mastery in the next catchup.
            </p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar — Modular Grid Cards */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Navigation Sections
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {TABS_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex flex-col text-left p-3.5 rounded-sm transition-all border ${
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-950 dark:border-zinc-100 shadow-sm"
                    : "bg-white dark:bg-[#18181b] border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400 dark:text-emerald-600" : "text-zinc-500"}`} />
                  <span className="text-sm font-bold truncate">{tab.label}</span>
                </div>
                <span className={`text-xs line-clamp-1 ${isActive ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500"}`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & PROMO PACKET ARCHITECTURE */}
      {/* ========================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-10 animate-in fade-in-50 duration-200">
          {/* Executive Strategy Guide */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 space-y-8 rounded-sm">
            <div>
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Calibration &amp; Evaluation Dynamics
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                How Promotion Committees (Bar Raisers &amp; Directors) Evaluate Your Packet
              </h2>
              <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 mt-3 leading-relaxed">
                In top-tier technology companies (Amazon, Google, Meta, Stripe), promotions are <strong>retrospective, never speculative</strong>. You are not promoted with the hope that you will grow into the next level; you are promoted because you have <strong>already been performing at the next level consistently for at least 6 to 12 months</strong>.
              </p>
            </div>

            {/* 3 Core Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm bg-zinc-50/70 dark:bg-zinc-900/50 space-y-3">
                <div className="font-bold text-base text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                  <BadgeAlert className="w-5 h-5 text-rose-500" />
                  What Kills Promo Packets
                </div>
                <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 list-disc pl-5 leading-relaxed">
                  <li>Listing tickets and feature deliverables without customer or business ROI.</li>
                  <li>Using &ldquo;we delivered&rdquo; everywhere without isolating your individual ownership.</li>
                  <li>Zero hard metrics (no latency deltas, bug escape rates, or dollar savings).</li>
                  <li>Unaddressed 1:1 gaps that surprise calibration committees in Q4.</li>
                </ul>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm bg-zinc-50/70 dark:bg-zinc-900/50 space-y-3">
                <div className="font-bold text-base text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  What Secures &ldquo;Exceeds&rdquo;
                </div>
                <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 list-disc pl-5 leading-relaxed">
                  <li>Delivering ahead of deadlines with zero post-launch P0/P1 regressions.</li>
                  <li>Proactively solving unstated customer pain points far beyond the PRD.</li>
                  <li>Acting as Primary Deployment Owner with automated canary safety rails.</li>
                  <li>Eliminating operational toil that saves hundreds of team engineering hours.</li>
                </ul>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm bg-zinc-50/70 dark:bg-zinc-900/50 space-y-3">
                <div className="font-bold text-base text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  The 6-Month Golden Rule
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Start drafting your self-review and promotion doc <strong>6 months before the annual review cycle</strong>. Review open action items in every bi-weekly 1:1. When official calibration opens in Q4, your manager and Bar Raiser should have zero doubts.
                </p>
              </div>
            </div>
          </div>

          {/* The 5 Evaluation Pillars */}
          <div className="space-y-6">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-emerald-500" />
                The 5 Evaluation Pillars: Meets vs. Exceeds Expectations
              </h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-1">
                Study how committee rubrics differentiate standard performance from promotion-ready excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {EVALUATION_PILLARS.map((pillar) => (
                <div
                  key={pillar.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-5 shadow-xs"
                >
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <h4 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-zinc-50">{pillar.title}</h4>
                    <p className="text-sm font-mono text-zinc-500 mt-1">{pillar.subtitle}</p>
                  </div>

                  <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {pillar.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-sm space-y-2">
                      <div className="font-mono font-bold text-xs uppercase tracking-wider text-zinc-500">
                        Meets Expectations (Standard Delivery)
                      </div>
                      <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {pillar.rubricComparison[0].description}
                      </p>
                    </div>

                    <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/80 rounded-sm space-y-2">
                      <div className="font-mono font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Exceeds Expectations (Promotion Standard)
                      </div>
                      <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                        {pillar.rubricComparison[1].description}
                      </p>
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
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Header & Filter Controls */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Real-World Case Studies
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mt-1">
                  Work Tickets &amp; The STAR-I Justification Framework
                </h2>
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-3xl leading-relaxed">
                  Toggle each ticket between <strong>&ldquo;Meets Expectations&rdquo;</strong> (the common junior/mid way) and <strong>&ldquo;Exceeds Expectations&rdquo;</strong> (the promotion-winning way) to see the dramatic difference in framing, architecture, and customer impact.
                </p>
              </div>

              {/* Level Filter Selector */}
              <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1.5 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-mono">
                {[
                  { id: "ALL", label: "All Levels" },
                  { id: "SDE1_TO_SDE2", label: "SDE 1 → 2" },
                  { id: "SDE2_TO_SDE3", label: "SDE 2 → Senior" },
                  { id: "SDE3_TO_STAFF", label: "Senior → Staff" },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setLevelFilter(filter.id as LevelFilter)}
                    className={`px-3 py-1.5 transition-colors font-medium ${
                      levelFilter === filter.id
                        ? "bg-white dark:bg-[#18181b] text-zinc-950 dark:text-zinc-50 font-bold shadow-xs border border-zinc-200 dark:border-zinc-700"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket Cards List */}
          <div className="space-y-8">
            {filteredTickets.map((ticket) => {
              const currentView = getTicketView(ticket.id);
              return (
                <div
                  key={ticket.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden shadow-xs"
                >
                  {/* Ticket Header Banner */}
                  <div className="p-6 sm:p-8 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs sm:text-sm font-bold px-2.5 py-1 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 rounded-xs">
                          {ticket.ticketKey}
                        </span>
                        <span className="text-xs sm:text-sm font-mono px-3 py-1 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full font-medium">
                          Role: {ticket.role}
                        </span>
                        <span className="text-xs sm:text-sm font-mono px-3 py-1 bg-violet-100 dark:bg-violet-950/50 text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-800 rounded-full font-medium">
                          {ticket.principle}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                        {ticket.title}
                      </h3>
                    </div>

                    {/* Prominent View Switcher Button */}
                    <button
                      onClick={() => toggleTicketView(ticket.id)}
                      className={`text-xs sm:text-sm font-mono font-semibold px-4 py-2.5 border transition-all self-start lg:self-auto shadow-xs ${
                        currentView === "standard"
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-200"
                          : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {currentView === "standard"
                        ? "Currently: Meets Expectations (Click to Upgrade)"
                        : "Currently: Exceeds Expectations (Promo Standard)"}
                    </button>
                  </div>

                  {/* High-Impact Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-zinc-100/60 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
                    {ticket.metrics.map((m, idx) => (
                      <div key={idx} className="border-l-3 border-emerald-500 pl-3.5 space-y-0.5">
                        <div className="text-xs font-mono text-zinc-500 uppercase tracking-wide">{m.label}</div>
                        <div className="font-mono font-bold text-sm sm:text-base text-zinc-950 dark:text-zinc-50">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8">
                    {currentView === "standard" ? (
                      /* Standard (Meets Expectations) view */
                      <div className="space-y-6">
                        <div className="p-5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 rounded-sm space-y-2">
                          <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                            Standard SDE Phrasing (Meets Expectations):
                          </div>
                          <p className="text-base sm:text-lg text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
                            &ldquo;{ticket.standardWriteup.summary}&rdquo;
                          </p>
                        </div>

                        <div className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-sm space-y-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                          <div className="font-mono font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Why Committees Will Reject This for Promotion:
                          </div>
                          <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                            {ticket.standardWriteup.flaws.map((flaw, fIdx) => (
                              <li key={fIdx}>{flaw}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      /* Exceeds Expectations (Promo-Ready) view */
                      <div className="space-y-6 text-sm sm:text-base">
                        {/* Situation */}
                        <div className="border-l-3 border-zinc-300 dark:border-zinc-700 pl-5 space-y-1.5">
                          <span className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
                            1. Situation &amp; Business Context
                          </span>
                          <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">{ticket.exceedsWriteup.situation}</p>
                        </div>

                        {/* Task */}
                        <div className="border-l-3 border-zinc-300 dark:border-zinc-700 pl-5 space-y-1.5">
                          <span className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400">
                            2. Task &amp; Scope Extension
                          </span>
                          <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">{ticket.exceedsWriteup.task}</p>
                        </div>

                        {/* Action */}
                        <div className="border-l-3 border-emerald-500 pl-5 space-y-2 bg-emerald-50/20 dark:bg-emerald-950/10 py-3 rounded-r-xs">
                          <span className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                            3. Actions &amp; Architectural Ownership (The &ldquo;How&rdquo;)
                          </span>
                          <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-line leading-relaxed font-sans">
                            {ticket.exceedsWriteup.action}
                          </p>
                        </div>

                        {/* Result & Impact */}
                        <div className="border-l-3 border-sky-500 pl-5 space-y-2 bg-sky-50/20 dark:bg-sky-950/10 py-3 rounded-r-xs">
                          <span className="font-mono text-xs uppercase tracking-wider font-bold text-sky-600 dark:text-sky-400">
                            4. Quantifiable Result &amp; Hard Metrics
                          </span>
                          <p className="text-zinc-900 dark:text-zinc-100 leading-relaxed">{ticket.exceedsWriteup.result}</p>
                          <div className="text-sm sm:text-base font-bold text-sky-700 dark:text-sky-300 pt-1">
                            Primary Impact: {ticket.exceedsWriteup.impact}
                          </div>
                        </div>

                        {/* Customer Obsession & Senior Traits Callouts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                          <div className="p-5 bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/60 rounded-sm space-y-2">
                            <div className="font-mono font-bold text-xs uppercase tracking-wider text-pink-700 dark:text-pink-300 flex items-center gap-1.5">
                              <Target className="w-4 h-4" />
                              Customer First &amp; Business Obsession Angle
                            </div>
                            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                              {ticket.exceedsWriteup.customerObsessionAngle}
                            </p>
                          </div>

                          <div className="p-5 bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-900/60 rounded-sm space-y-2">
                            <div className="font-mono font-bold text-xs uppercase tracking-wider text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
                              <Star className="w-4 h-4" />
                              Senior Traits &amp; Force Multiplier
                            </div>
                            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                              {ticket.exceedsWriteup.seniorTraitsAngle}
                            </p>
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
        <div className="space-y-10 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 space-y-4 rounded-sm">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Hard Engineering Evidence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              How to Justify Code Quality with Defect Counts &amp; Hard Metrics
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              Anyone can claim they &ldquo;write high quality code.&rdquo; Promotion committees dismiss vague self-praise. To earn an <strong>Exceeds Expectations</strong> rating on quality, you must present concrete, verifiable defect metrics, automated test pyramid expansions, and fault-tolerance validations.
            </p>
          </div>

          {/* Quality Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUALITY_METRICS_DATA.map((item, idx) => (
              <div
                key={idx}
                className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-5 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">{item.category}</h3>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 rounded-full border border-sky-200 dark:border-sky-800 self-start sm:self-auto">
                    {item.target}
                  </span>
                </div>

                <div className="space-y-4 text-sm sm:text-base">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wide text-zinc-500">How to Track &amp; Gather Data:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">{item.howToTrack}</p>
                  </div>

                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-sm">
                    <span className="font-mono text-xs uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                      Example Promo Doc Phrasing:
                    </span>
                    <p className="text-zinc-900 dark:text-zinc-100 mt-1.5 italic font-sans leading-relaxed">
                      &ldquo;{item.exampleMetric}&rdquo;
                    </p>
                  </div>

                  <div className="font-mono text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 p-3 rounded-xs border border-zinc-200 dark:border-zinc-700">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Formula: </span>
                    {item.formula}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Defect Escape Rate Table */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-5 shadow-xs">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-lg sm:text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                The Engineering Quality Proof Matrix
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Drop this exact table into Section 3 of your promotion packet to provide undeniable evidence of engineering rigor.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-mono text-xs uppercase tracking-wider">
                    <th className="p-4">Quality Dimension</th>
                    <th className="p-4">Team Baseline / Standard</th>
                    <th className="p-4">My Delivered Score</th>
                    <th className="p-4">Verification Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="p-4 font-semibold text-zinc-950 dark:text-zinc-50">Sev-1 / Sev-2 Production Outages</td>
                    <td className="p-4 text-zinc-500">&lt; 3 per year</td>
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">0 in 12 months</td>
                    <td className="p-4 text-zinc-500 font-mono text-xs">PagerDuty Post-Mortem Log</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="p-4 font-semibold text-zinc-950 dark:text-zinc-50">Defect Escape Rate (Post-Release Bugs)</td>
                    <td className="p-4 text-zinc-500">&lt; 5.0%</td>
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">0.4% across 18 deploys</td>
                    <td className="p-4 text-zinc-500 font-mono text-xs">JIRA Bug Triage Filter</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="p-4 font-semibold text-zinc-950 dark:text-zinc-50">Automated Test Pyramid Coverage</td>
                    <td className="p-4 text-zinc-500">55% baseline</td>
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">88.4% (Unit + Contract)</td>
                    <td className="p-4 text-zinc-500 font-mono text-xs">SonarQube Coverage Report</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="p-4 font-semibold text-zinc-950 dark:text-zinc-50">Pre-Launch Load Testing Verification</td>
                    <td className="p-4 text-zinc-500">1x peak expected traffic</td>
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">3.5x peak (45,000 QPS)</td>
                    <td className="p-4 text-zinc-500 font-mono text-xs">k6 Benchmark Dashboard</td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                    <td className="p-4 font-semibold text-zinc-950 dark:text-zinc-50">P99 Checkout API Latency</td>
                    <td className="p-4 text-zinc-500">&lt; 450ms SLA</td>
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">260ms sustained</td>
                    <td className="p-4 text-zinc-500 font-mono text-xs">Datadog APM Trace Service</td>
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
        <div className="space-y-10 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 space-y-4 rounded-sm">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Force Multiplication
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Showcasing Automation Tasks &amp; &ldquo;Side Tickets&rdquo; to Kill Toil
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              Engineers frequently spend dozens of hours automating fragile CI/CD pipelines, writing database migration scripts, or building developer tools that nobody officially assigned to them. <strong>This is quintessential Senior SDE behavior</strong>. Learn how to package these unassigned side projects into high-ROI promotion bullet points.
            </p>
          </div>

          {/* Interactive Toil Calculator */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 rounded-sm space-y-8 shadow-xs">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 font-mono">
                  Interactive Engineering Toil &amp; Dollar ROI Calculator
                </h3>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Quantify the exact dollar capacity and engineering hours your automation saved the organization.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Engineers Impacted by Your Tool:
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={calcEngineers}
                  onChange={(e) => setCalcEngineers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-base font-mono focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Hours Saved per Engineer / Week:
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="40"
                  value={calcHoursPerWeek}
                  onChange={(e) => setCalcHoursPerWeek(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-base font-mono focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Blended Hourly Cost per Eng ($USD):
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={calcHourlyRate}
                  onChange={(e) => setCalcHourlyRate(Math.max(30, parseInt(e.target.value) || 30))}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#18181b] text-base font-mono focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-100"
                />
              </div>
            </div>

            {/* Output Display Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 rounded-sm">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-amber-800 dark:text-amber-400 font-bold">
                  Annual Engineering Capacity Unlocked
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-zinc-950 dark:text-zinc-50">
                  {annualHours.toLocaleString()} Hours / Year
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Equivalent to <strong>{(annualHours / 1900).toFixed(1)} full-time engineer(s)</strong> capacity liberated from repetitive toil.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-amber-800 dark:text-amber-400 font-bold">
                  Equivalent Engineering Dollar Savings
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  ${annualDollars.toLocaleString()} / Year
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Calculated using standard ${calcHourlyRate}/hr loaded engineering cost model.
                </p>
              </div>
            </div>
          </div>

          {/* Catalog of Proven Automation Side-Tickets */}
          <div className="space-y-6">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                4 Proven Automation Projects That Got Engineers Promoted
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Notice how each problem is translated into quantifiable time and dollar savings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AUTOMATION_PROJECTS.map((proj) => (
                <div
                  key={proj.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xs font-medium">
                      {proj.category}
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {proj.annualHoursSaved} hrs / yr saved
                    </span>
                  </div>

                  <h4 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">{proj.title}</h4>

                  <div className="text-sm sm:text-base space-y-2 leading-relaxed">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wide text-zinc-500 font-bold">The Pain: </span>
                      <p className="text-zinc-700 dark:text-zinc-300 mt-0.5">{proj.problem}</p>
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400 font-bold">The Automated Fix: </span>
                      <p className="text-zinc-900 dark:text-zinc-100 mt-0.5">{proj.solution}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-sm font-mono text-zinc-600 dark:text-zinc-400">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Senior Trait Demonstrated: </span>
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
        <div className="space-y-10 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 space-y-4 rounded-sm">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Technical Leadership &amp; Operational Command
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Senior Developer Traits &amp; The Deployment Owner Playbook
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              A Senior SDE is not just a faster coder. A Senior SDE is a <strong>safe pair of hands</strong> who manages ambiguity, drives architectural consensus via RFCs, and commands high-stakes deployments with zero blast radius.
            </p>
          </div>

          {/* 3 Core Senior SDE Archetypes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-3 shadow-xs">
              <div className="font-mono font-bold text-lg text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-violet-500" />
                1. Driving RFCs &amp; Architecture
              </div>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Take an ambiguous mandate (&ldquo;our search is slow&rdquo;), investigate the root bottlenecks, and author an RFC proposing 2–3 viable paths with trade-off matrices (CAP, cost, operational complexity). Schedule and lead the design review, proactively resolving pushback.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-3 shadow-xs">
              <div className="font-mono font-bold text-lg text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                2. Deployment Owner Command
              </div>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Act as the Primary Release Commander. Author the blast-radius runbook, verify zero-lock DB migrations, enforce canary validation stages, and define quantitative, non-negotiable rollback thresholds before traffic ramps.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-3 shadow-xs">
              <div className="font-mono font-bold text-lg text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" />
                3. Mentorship &amp; Code Review Culture
              </div>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Senior engineers multiply their team. Conduct thorough, architectural code reviews that catch concurrency traps and security holes before QA. Mentor junior engineers through their first multi-component feature delivery.
              </p>
            </div>
          </div>

          {/* Deployment Owner Pre-Flight & Rollout Checklist */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                  The Deployment Owner Execution Runbook
                </h3>
                <p className="text-sm text-zinc-500 mt-1">
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
                className="flex items-center gap-2 text-sm font-mono px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
              >
                {copiedKey === "deploy-checklist" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-500" />
                    <span>Copy Checklist</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {DEPLOYMENT_CHECKLIST.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 rounded-sm space-y-2 text-sm sm:text-base"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold uppercase px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xs">
                      {item.phase}
                    </span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCheck className="w-4 h-4" />
                      Verified
                    </span>
                  </div>
                  <div className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 mt-1">{item.action}</div>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{item.rationale}</p>
                  <div className="pt-2 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">Owner Verification Check: </span>
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
        <div className="space-y-10 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 space-y-4 rounded-sm">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Zero-Surprise Calibration
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Documenting Every 1:1 &amp; Showing Closed-Loop Improvement
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              The single biggest mistake engineers make is waiting until performance review season to ask: <em>&ldquo;Am I on track for promotion?&rdquo;</em> By then, it is already too late. You must maintain a <strong>Continuous 1:1 Feedback Log</strong>. Every time your manager highlights an area for growth, you document it, act on it within 14 days, and bring hard evidence to the next catchup to formally close the loop.
            </p>
          </div>

          {/* The 3-Step Closed Loop System Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-[#18181b] rounded-sm space-y-2.5 shadow-xs">
              <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-wider">Step 1: Capture</span>
              <h4 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">Record Exact Manager Feedback</h4>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Immediately after your 1:1, write down verbatim what your manager said. Do not soften the feedback. Treat it as an explicit rubric requirement for your promo packet.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-[#18181b] rounded-sm space-y-2.5 shadow-xs">
              <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">Step 2: Act</span>
              <h4 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">Execute in 14 Days</h4>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Take immediate, verifiable action. If they said you need to speak up more in architecture syncs, author an RFC and present it. If they said code reviews were slow, block daily calendar review slots.
              </p>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-[#18181b] rounded-sm space-y-2.5 shadow-xs">
              <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">Step 3: Close Loop</span>
              <h4 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">Present Evidence at Next Catchup</h4>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                At the very next 1:1, open with: <em>&ldquo;In our last catchup, you advised me to improve X. Here is what I did and the data. Would you agree this gap is now resolved?&rdquo;</em>
              </p>
            </div>
          </div>

          {/* Real-World 1:1 Feedback Tracking Examples */}
          <div className="space-y-6">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
                Real-World 1:1 Feedback-to-Improvement Matrix
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                Concrete examples of how to take critical feedback and close the loop with verifiable proof.
              </p>
            </div>

            <div className="space-y-6">
              {CONTINUOUS_1ON1_LOG.map((log) => (
                <div
                  key={log.id}
                  className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm space-y-5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs sm:text-sm font-bold px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xs">
                        {log.date}
                      </span>
                      <span className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50">{log.area}</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-full self-start sm:self-auto">
                      Status: {log.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm sm:text-base">
                    <div className="p-4 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-sm space-y-1.5">
                      <span className="font-mono text-xs uppercase text-rose-700 dark:text-rose-400 font-bold">
                        Manager Feedback Highlighted:
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200 italic leading-relaxed">{log.managerFeedback}</p>
                    </div>

                    <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-sm space-y-1.5">
                      <span className="font-mono text-xs uppercase text-zinc-500 font-bold">
                        Immediate Action Taken (Within 14 Days):
                      </span>
                      <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">{log.actionTaken}</p>
                    </div>
                  </div>

                  <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-sm text-sm sm:text-base space-y-3">
                    <div>
                      <span className="font-mono text-xs uppercase text-emerald-700 dark:text-emerald-400 font-bold">
                        Evidence Shown in Next Catchup:
                      </span>
                      <p className="text-zinc-900 dark:text-zinc-100 mt-1 leading-relaxed">{log.nextCatchupEvidence}</p>
                    </div>
                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900/60">
                      <span className="font-mono text-xs uppercase text-emerald-800 dark:text-emerald-300 font-bold">
                        Manager Confirmation &amp; Sign-Off:
                      </span>
                      <p className="text-zinc-700 dark:text-zinc-300 italic mt-1 leading-relaxed">{log.managerResponse}</p>
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
        <div className="space-y-10 animate-in fade-in-50 duration-200">
          {/* Header */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-10 space-y-4 rounded-sm">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Ready-to-Use Artifacts
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              One-Click Copyable Promotion &amp; Self-Review Templates
            </h2>
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl">
              Copy these battle-tested Markdown templates directly into your Notion, Google Docs, or internal HR portal. Fill in the bracketed placeholders with your specific metrics and tickets.
            </p>
          </div>

          {/* Template 1: Full Promo Document */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden shadow-xs">
            <div className="p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 font-mono">
                  1. Complete Year-End Promotion Packet Template (Full Document)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Includes Executive Summary, STAR-I tickets, Defect Matrix, Toil Automation, and 1:1 Logs.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(TEMPLATES.fullPromoDoc, "tmpl-full")}
                className="flex items-center gap-2 text-sm font-mono px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors self-start sm:self-auto shadow-xs"
              >
                {copiedKey === "tmpl-full" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Markdown</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-6 text-xs sm:text-sm font-mono bg-zinc-950 text-zinc-300 overflow-x-auto max-h-[32rem] leading-relaxed select-all">
              {TEMPLATES.fullPromoDoc}
            </pre>
          </div>

          {/* Template 2: STAR-I Ticket Template */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden shadow-xs">
            <div className="p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 font-mono">
                  2. Single Project / Ticket Writeup Template (STAR-I)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Use this to structure each major feature ticket or initiative in your promo document.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(TEMPLATES.ticketTemplate, "tmpl-ticket")}
                className="flex items-center gap-2 text-sm font-mono px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors self-start sm:self-auto shadow-xs"
              >
                {copiedKey === "tmpl-ticket" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Ticket Template</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-6 text-xs sm:text-sm font-mono bg-zinc-950 text-zinc-300 overflow-x-auto max-h-96 leading-relaxed select-all">
              {TEMPLATES.ticketTemplate}
            </pre>
          </div>

          {/* Template 3: 1:1 Feedback Tracker */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] rounded-sm overflow-hidden shadow-xs">
            <div className="p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-950 dark:text-zinc-50 font-mono">
                  3. Continuous 1:1 Feedback Matrix &amp; Manager Alignment Tracker
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  Paste this into a private running document shared with your engineering manager.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(TEMPLATES.oneOnOneTracker, "tmpl-1on1")}
                className="flex items-center gap-2 text-sm font-mono px-4 py-2 bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors self-start sm:self-auto shadow-xs"
              >
                {copiedKey === "tmpl-1on1" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy 1:1 Tracker</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-6 text-xs sm:text-sm font-mono bg-zinc-950 text-zinc-300 overflow-x-auto max-h-96 leading-relaxed select-all">
              {TEMPLATES.oneOnOneTracker}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
