import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, BookOpen, Award, CheckCircle2, RefreshCw, Mail, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards | beingsde.in",
  description: "Learn about Being SDE's rigorous technical review process, editorial standards, author qualifications, and commitment to educational accuracy.",
  alternates: {
    canonical: "https://beingsde.in/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-10">
      {/* Header */}
      <section className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-xs font-mono text-zinc-500 w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Editorial Integrity &amp; Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
          Editorial Policy &amp; Standards
        </h1>
        <p className="text-sm text-zinc-500 max-w-2xl">
          Last updated: <strong>October 2026</strong>. How Being SDE researches, peer-reviews, validates, and updates technical architecture content.
        </p>
      </section>

      {/* Main Content Sections */}
      <div className="space-y-10 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        
        {/* 1. Mission */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            1. Our Editorial Mission
          </h2>
          <p className="pl-3">
            <strong>Being SDE (beingsde.in)</strong> was established to provide software engineers, backend developers, and engineering leaders with rigorous, verified educational resources in High-Level System Design (HLD), Low-Level Object-Oriented Design (LLD), Data Structures &amp; Algorithms (DSA), and technical leadership.
          </p>
          <p className="pl-3">
            Our goal is to transcend superficial interview cheat sheets by exploring the authentic engineering tradeoffs, mathematical bounds, and failure modes that govern production distributed systems.
          </p>
        </section>

        {/* 2. Authorship & Expertise (E-E-A-T) */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            2. Authorship &amp; Subject-Matter Expertise
          </h2>
          <p className="pl-3">
            All tutorials, system breakdowns, code blueprints, and case studies published on Being SDE are authored or reviewed by experienced software architects and senior engineers with proven backgrounds in cloud infrastructure, high-throughput distributed systems, and FAANG technical hiring panels.
          </p>
          <ul className="pl-6 list-disc space-y-1.5 mt-2">
            <li><strong>Lead Author &amp; Architect:</strong> Abha Gupta, Founder &amp; Editorial Director, specializing in distributed caching topologies, wide-column database sharding, and real-time streaming architectures.</li>
            <li><strong>Peer Review Panel:</strong> Articles undergo technical review by practicing Senior/Staff Engineers from top tech enterprises before publication.</li>
          </ul>
        </section>

        {/* 3. Technical Verification & Fact-Checking */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            3. Technical Verification &amp; Fact-Checking Standards
          </h2>
          <p className="pl-3">
            Every technical claim, algorithm, and architectural recommendation on beingsde.in is cross-referenced against authoritative primary sources:
          </p>
          <div className="pl-3 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="font-bold text-xs font-mono text-zinc-900 dark:text-zinc-100 block mb-1">Official Documentation</span>
              <p className="text-xs text-zinc-500">Official documentation from open-source systems including Apache Kafka, Redis, PostgreSQL, Apache Cassandra, and Linux kernel manuals.</p>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="font-bold text-xs font-mono text-zinc-900 dark:text-zinc-100 block mb-1">Academic Papers &amp; RFCs</span>
              <p className="text-xs text-zinc-500">Seminal peer-reviewed distributed systems papers (e.g., Google Spanner, Amazon Dynamo, Raft consensus) and Internet Engineering Task Force RFCs.</p>
            </div>
          </div>
        </section>

        {/* 4. Code Standards & Executability */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            4. Code Standards &amp; Clean Architecture
          </h2>
          <p className="pl-3">
            Low-Level Design (LLD) solutions provided on beingsde.in follow strict industry design patterns (GoF patterns) and SOLID principles. Code examples in Java, C++, and Python are designed to be syntactically valid, thread-safe where applicable, and accompanied by comprehensive class diagrams.
          </p>
        </section>

        {/* 5. Errata, Revisions & Community Corrections */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            5. Errata, Revisions &amp; Community Feedback
          </h2>
          <p className="pl-3">
            Software engineering standards evolve rapidly. When a cloud service deprecates an API, or a new distributed database release updates its consistency model, we update our articles to reflect current production best practices.
          </p>
          <p className="pl-3">
            If you identify a technical inaccuracy, typographical error, or outdated architectural pattern in any guide, please notify our editorial team directly at{" "}
            <a href="mailto:support.beingsde@gmail.com" className="font-mono underline text-zinc-900 dark:text-zinc-100 hover:text-blue-600">
              support.beingsde@gmail.com
            </a>. Verified corrections are updated within 48 hours.
          </p>
        </section>

        {/* 6. Commercial Independence & Advertising Disclosure */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            6. Editorial Independence &amp; Advertising Disclosure
          </h2>
          <p className="pl-3">
            Editorial content on Being SDE is strictly independent. We do not accept paid placements to endorse specific proprietary software vendors. Advertisements served through Google AdSense are clearly delineated from editorial educational content and do not influence our technical evaluations or trade-off conclusions.
          </p>
        </section>
      </div>

      {/* Footer Navigation */}
      <section className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-4 text-xs font-mono text-zinc-500">
        <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">About Being SDE →</Link>
        <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100">Contact Us →</Link>
        <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-100">Privacy Policy →</Link>
        <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-100">Terms of Service →</Link>
      </section>
    </div>
  );
}
