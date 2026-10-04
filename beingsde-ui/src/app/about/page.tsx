import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Layers, Target, Users, ShieldCheck, Award, ArrowRight, Code, Cpu, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Being SDE — System Design & Architecture Platform",
  description: "Learn about Being SDE (beingsde.in), our mission to educate software engineers in High-Level Design (HLD), Low-Level Design (LLD), distributed systems, and FAANG interview preparation.",
  alternates: {
    canonical: "https://beingsde.in/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-12">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About Being SDE",
            "url": "https://beingsde.in/about",
            "description": "Being SDE (beingsde.in) is an educational platform dedicated to teaching system design, software architecture, distributed systems, and low-level object-oriented design.",
            "mainEntity": {
              "@type": "Organization",
              "name": "Being SDE",
              "url": "https://beingsde.in",
              "logo": "https://beingsde.in/images/redis-caching-diagram.png",
              "founder": {
                "@type": "Person",
                "name": "Abha Gupta",
                "jobTitle": "Founder & Managing Director",
                "url": "https://beingsde.in/about"
              },
              "knowsAbout": [
                "Distributed Systems",
                "High-Level Design",
                "Low-Level Design",
                "Software Architecture",
                "Database Sharding",
                "System Design Interviews"
              ]
            }
          }),
        }}
      />

      {/* HEADER SECTION */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-xs font-mono text-zinc-500 w-fit mx-auto md:mx-0">
          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
          <span>Our Story & Mission</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
          Empowering Engineers to Build Scale
        </h1>

        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Being SDE (<strong>beingsde.in</strong>) is a premier technical education platform designed to help software engineers, backend developers, and system architects master distributed systems, High-Level Design (HLD), Low-Level Design (LLD), and interview leadership principles.
        </p>
      </section>

      {/* OUR MISSION & VISION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-3">
          <div className="p-2.5 w-fit rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">Our Mission</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            System Design is often taught through dry theoretical text or superficial cheat sheets that miss real-world trade-offs. Our mission is to bridge the gap between academic computer science and production-grade software engineering through interactive architectural blueprints, real case studies, and concrete code implementations.
          </p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-3">
          <div className="p-2.5 w-fit rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">Editorial Excellence</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every topic, case study, and low-level code blueprint on <strong>beingsde.in</strong> is meticulously authored and peer-reviewed by Staff and Principal Engineers who have scaled real systems serving millions of daily active users at leading global technology companies.
          </p>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="flex flex-col gap-6">
        <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4">
          <h2 className="text-2xl font-black font-mono tracking-tight text-zinc-950 dark:text-zinc-50">
            What We Teach
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-0.5">Comprehensive System Design Curriculum</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold font-mono">High-Level Design (HLD)</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Distributed database sharding, consistent hashing rings, caching topologies (Redis/Memcached), rate limiters, and message queues (Kafka/RabbitMQ).
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-2">
            <Code className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold font-mono">Low-Level Design (LLD)</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Object-oriented design patterns, SOLID principles, class diagrams, concurrency primitives, and production-ready implementations in Java, C++, and Python.
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-2">
            <Users className="w-5 h-5 text-violet-500" />
            <h3 className="text-base font-bold font-mono">Bar Raiser & Behavioral</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Structured STAR-method frameworks for leadership principles, technical conflict resolution, trade-off communication, and architectural decision-making.
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-2">
            <Database className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold font-mono">Storage & Database Selection</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              SQL vs NoSQL trade-offs, ACID vs BASE, CAP & PACELC theorems, LSM trees vs B+ Trees, and time-series data indexing strategies.
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-2">
            <Cpu className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold font-mono">Real-World Case Studies</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Architecture breakdowns inspired by global platforms including URL shorteners, video streaming networks, ride-sharing systems, and distributed payment gateways.
            </p>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-5 rounded-sm flex flex-col gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            <h3 className="text-base font-bold font-mono">Mock Interview Evaluations</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              1-on-1 peer and mentor interview simulation directories, detailed scoring criteria, and actionable feedback rubrics.
            </p>
          </div>

        </div>
      </section>

      {/* EDITORIAL LEADERSHIP & AUTHORS (E-E-A-T) */}
      <section className="flex flex-col gap-6">
        <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4">
          <h2 className="text-2xl font-black font-mono tracking-tight text-zinc-950 dark:text-zinc-50">
            Editorial Leadership &amp; Authors
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
            Real software engineers, system architects &amp; industry practitioners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Abha Gupta Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-mono font-black text-xl shrink-0">
                AG
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">
                  Abha Gupta
                </h3>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                  Founder &amp; Managing Director
                </span>
                <span className="text-2xs text-zinc-500">
                  Technical Publisher &amp; Curriculum Director
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Abha leads <strong>beingsde.in</strong> as Founder and Managing Director, overseeing the editorial vision, learning platform operations, and technical publishing standards. She directs the development of high-fidelity architectural guides, distributed systems blueprints, and engineering career calibration frameworks designed to empower software engineers worldwide.
            </p>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2 text-3xs font-mono text-zinc-500">
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Platform Direction</span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Curriculum Standards</span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Editorial Governance</span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Technical Education</span>
            </div>
          </div>

          {/* Technical Review Board Card */}
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 rounded-sm flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-mono font-black text-xl shrink-0 border border-zinc-300 dark:border-zinc-700">
                EB
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50">
                  Engineering Review Board
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-medium">
                  Staff &amp; Principal Peer Reviewers
                </span>
                <span className="text-2xs text-zinc-500">
                  Alumni of Leading Tech Enterprises
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Every topic on Being SDE undergoes mandatory peer review by senior engineers and system architects. Our reviewers verify distributed consensus guarantees (Raft/Paxos), cache-invalidation strategies, capacity estimation formulas, and object-oriented class design against production post-mortems and battle-tested industry patterns.
            </p>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2 text-3xs font-mono text-zinc-500">
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Peer Review</span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Failure Mode Analysis</span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Latency Profiling</span>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Zero Machine Slop</span>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL INTEGRITY & ACCURACY COMMITMENT */}
      <section className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-8 rounded-sm space-y-5">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Editorial Standards &amp; Review Process</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
          How We Ensure Quality &amp; Authenticity
        </h2>
        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-3 leading-relaxed">
          <p>
            Google AdSense and modern engineering communities demand authentic, high-value, and reliable knowledge. At Being SDE, our content creation follows a rigorous 3-stage lifecycle:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                1. Primary Source Research
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Grounding every architecture in verified engineering papers (Google Spanner, Amazon Dynamo, Kafka, Raft) and production engineering blog post-mortems (Netflix, Discord, Meta).
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                2. Concrete Schematics &amp; Math
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No hand-waving or superficial bullet points. We calculate QPS, storage bandwidth, replication lag, and document failure scenarios like network splits and split-brain.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                3. Continuous Maintenance
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Systems evolve. We periodically refresh topics to incorporate modern paradigms like Vector DBs, CRDTs, and cloud-native serverless primitives.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 pt-2">
            Questions, feedback, or peer review inquiries? Contact our editorial team at{" "}
            <a href="mailto:support.beingsde@gmail.com" className="text-zinc-900 dark:text-zinc-100 underline font-medium">
              support.beingsde@gmail.com
            </a>.
          </p>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div>
          <h3 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">Ready to level up your engineering career?</h3>
          <p className="text-xs text-zinc-500">Explore our free High-Level Design tutorials or reach out to our team.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/topics"
            className="text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-5 py-3 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300 flex items-center gap-1.5"
          >
            Explore HLD Topics
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/contact"
            className="text-xs font-semibold uppercase tracking-wider bg-transparent text-zinc-600 dark:text-zinc-400 px-5 py-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
