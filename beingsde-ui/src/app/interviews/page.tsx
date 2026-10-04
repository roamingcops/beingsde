"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Lock, Crown, ArrowRight, ShieldCheck, CheckCircle2, Clock, Zap, Target, BookOpen, Layers, Cpu, Scale } from "lucide-react";
import Link from "next/link";
import { useInterviews } from "@/hooks/useInterviews";
import { Profile } from "@/components/interviews/types";
import { InterviewerConsole } from "@/components/interviews/InterviewerConsole";
import { InterviewerDirectory } from "@/components/interviews/InterviewerDirectory";
import { MyInterviews } from "@/components/interviews/MyInterviews";
import { BookingModal } from "@/components/interviews/BookingModal";

export default function InterviewsPage() {
  const {
    loading,
    authStatus,
    profile,
    directory,
    interviews,
    error,
    successMsg,
    saveProfile,
    stopOffering,
    bookInterview,
    cancelInterview,
    submitFeedback,
    submitCandidateReview,
  } = useInterviews();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const openBookingModal = (interviewer: Profile) => {
    setSelectedProfile(interviewer);
    setShowBookingModal(true);
  };

  const handleBook = async (topic: string, scheduledAt: string, meetingLink: string) => {
    if (selectedProfile) {
      await bookInterview(selectedProfile.id, topic, scheduledAt, meetingLink);
    }
  };


  return (
    <div className="flex flex-col gap-8 py-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Banner / Header */}
      <section className="relative overflow-hidden rounded-lg bg-zinc-900 text-zinc-100 p-8 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-zinc-800 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-3xs font-mono font-bold tracking-widest uppercase bg-zinc-800 border border-zinc-700 text-zinc-400 px-2.5 py-1 rounded-full w-max">
              Premium Mock Interviews
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
              Mock Interviews
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Conduct high-fidelity system design mock sessions with experienced engineers or offer your skills to help other system architects grow.
            </p>
          </div>
        </div>
      </section>

      <div className="relative">
        {/* Workspace Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-500 ${authStatus !== "premium" ? "opacity-40 select-none pointer-events-none blur-[2px]" : ""}`}>
          {/* Left Column: Interviewer Panel & My Interviews */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <InterviewerConsole
              profile={profile}
              onSave={saveProfile}
              onStopOffering={stopOffering}
            />

            <MyInterviews
              interviews={interviews}
              onCancel={cancelInterview}
              onSubmitFeedback={submitFeedback}
              onSubmitCandidateReview={submitCandidateReview}
            />
          </div>

          {/* Right Column: Search & Schedule Directory */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <InterviewerDirectory
              directory={directory}
              onSimulate={openBookingModal}
            />
          </div>
        </div>

        {/* Overlay Paywalls */}
        {authStatus === "unauthenticated" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl text-center max-w-lg mx-auto transform transition-all">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700 shadow-inner">
                <Lock className="w-7 h-7 text-zinc-500 dark:text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Sign in to unlock Mock Interviews</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Join our community to browse the directory, book live 1-on-1 mock sessions, or offer your expertise to help others grow.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign In to Continue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {authStatus === "free" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center p-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-amber-200/50 dark:border-amber-900/50 rounded-2xl shadow-2xl shadow-amber-900/5 text-center max-w-lg mx-auto transform transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/10 rounded-full flex items-center justify-center mb-6 border border-amber-200 dark:border-amber-800 shadow-inner">
                <Crown className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Premium Feature</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Mock Interviews are an exclusive feature for Premium members. Upgrade your account to unlock the ability to schedule live 1-on-1 system design sessions with experienced architects.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-amber-400 hover:to-amber-500 hover:-translate-y-0.5 transition-all duration-300"
              >
                Inquire About Premium <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {showBookingModal && selectedProfile && authStatus === "premium" && (
        <BookingModal
          profile={selectedProfile}
          onClose={() => setShowBookingModal(false)}
          onBook={handleBook}
        />
      )}

      {/* SYSTEM DESIGN MOCK INTERVIEW MASTER GUIDE & RUBRICS (PUBLIC EDUCATIONAL VALUE) */}
      <section className="flex flex-col gap-10 mt-8 pt-10 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-xs font-mono text-zinc-500 w-fit">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Complete Preparation Playbook</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 font-mono">
            How to Master System Design Mock Interviews
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            A system design interview is not a test of memory; it is an open-ended dialogue simulating how you design, debate, and deliver scalable production software. Below is our industry-standard 45-minute blueprint and level calibration rubric used by Staff interviewers at top-tier tech companies.
          </p>
        </div>

        {/* 4-PHASE ROADMAP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded">Phase 1 (0-5 Min)</span>
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>
            <h3 className="text-base font-bold font-mono">Scope &amp; Non-Functionals</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Clarify functional requirements (core user workflows) and non-functional requirements: latency SLAs (p99 &lt; 50ms), availability (99.99%), consistency model (strong vs eventual), and daily active users (DAU).
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded">Phase 2 (5-18 Min)</span>
              <Layers className="w-4 h-4 text-zinc-400" />
            </div>
            <h3 className="text-base font-bold font-mono">High-Level Architecture</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Lay out end-to-end data flow: DNS/CDN, Load Balancer, API Gateway, Stateless Application Services, Primary Database, and Cache. Define clean REST/gRPC interfaces and core data entities.
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded">Phase 3 (18-35 Min)</span>
              <Cpu className="w-4 h-4 text-zinc-400" />
            </div>
            <h3 className="text-base font-bold font-mono">Deep Dives &amp; Bottlenecks</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Address concurrency, cache stampedes, database sharding keys, message queue partitions (Kafka), idempotency keys for payment/order deduplication, and read/write skew handling.
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono font-bold px-2 py-0.5 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded">Phase 4 (35-45 Min)</span>
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
            </div>
            <h3 className="text-base font-bold font-mono">Resilience &amp; Observability</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Wrap up with multi-region disaster recovery, circuit breakers, rate limiting algorithms (Token Bucket/Leaky Bucket), structured logging, distributed tracing (OpenTelemetry), and alerting SLOs.
            </p>
          </div>
        </div>

        {/* CALIBRATION RUBRIC */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h3 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              Bar-Raiser Interview Calibration Matrix (L4 vs L5 vs L6)
            </h3>
            <p className="text-xs text-zinc-500">
              How interview committees and Bar Raisers score system design candidates.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">Engineering Level</th>
                  <th className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">Expected Competency</th>
                  <th className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">Failure Modes / Red Flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-600 dark:text-zinc-400">
                <tr>
                  <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">SDE-1 (L3/L4)</td>
                  <td className="p-3">Demonstrates clear API design, understands relational tables vs key-value stores, and grasps basic client-server communication.</td>
                  <td className="p-3 text-rose-600 dark:text-rose-400">Struggles with estimating QPS/storage, unaware of cache eviction algorithms (LRU/LFU).</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">SDE-2 (L4/L5)</td>
                  <td className="p-3">Designs end-to-end architectures independently, identifies single points of failure, chooses optimal database indexing, and handles horizontal scaling.</td>
                  <td className="p-3 text-rose-600 dark:text-rose-400">Relies on buzzwords without calculating real trade-offs; ignores network partitions and replication delays.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">Senior SDE (L5/L6)</td>
                  <td className="p-3">Proactively drives ambiguity, defends CAP theorem trade-offs, specifies data consistency levels (Read Committed vs Serializable), and designs zero-downtime database migrations.</td>
                  <td className="p-3 text-rose-600 dark:text-rose-400">Passive demeanor waiting for interviewer prompts; unable to justify why Postgres vs Cassandra was selected.</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">Staff / Principal (L6+)</td>
                  <td className="p-3">Anticipates cross-system cascade failures, models cloud infrastructure operational costs, establishes organization-wide observability standards, and isolates blast radiuses.</td>
                  <td className="p-3 text-rose-600 dark:text-rose-400">Over-engineering for hypothetical billions without pragmatic phased rollouts; weak business/cost awareness.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5 CRITICAL MOCK INTERVIEW MISTAKES */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-6 rounded-sm flex flex-col gap-4">
          <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            Top 5 Fatal Mistakes Engineers Make in System Design Mocks
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
            <li className="flex flex-col gap-1 p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded">
              <strong className="text-zinc-900 dark:text-zinc-100">1. Diving into drawings without requirements</strong>
              <span>Never draw a box until you establish write-to-read ratio, peak concurrency, and latency budgets.</span>
            </li>
            <li className="flex flex-col gap-1 p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded">
              <strong className="text-zinc-900 dark:text-zinc-100">2. Dropping &ldquo;Kafka + Redis&rdquo; like magic dust</strong>
              <span>Always explain the failover behavior. What happens when Redis crashes? How does Kafka handle partition rebalancing?</span>
            </li>
            <li className="flex flex-col gap-1 p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded">
              <strong className="text-zinc-900 dark:text-zinc-100">3. Ignoring database write throughput &amp; lock contention</strong>
              <span>A single SQL instance cannot sustain 50,000 concurrent writes per second without batching or sharding.</span>
            </li>
            <li className="flex flex-col gap-1 p-3 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded">
              <strong className="text-zinc-900 dark:text-zinc-100">4. Overlooking Cache Invalidation &amp; Stampedes</strong>
              <span>Explain Write-Through, Write-Back, or Cache-Aside, and describe mutex locking or probabilistic early expiration for hot keys.</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
