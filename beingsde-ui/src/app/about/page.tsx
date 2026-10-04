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
          <h2 className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">Editorial Standard</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every topic, case study, and low-level code blueprint on <strong>beingsde.in</strong> is created with careful attention to practical engineering detail, verified architectural patterns, and real-world scalability trade-offs.
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

      {/* LEADERSHIP & PUBLISHING */}
      <section className="flex flex-col gap-6">
        <div className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4">
          <h2 className="text-2xl font-black font-mono tracking-tight text-zinc-950 dark:text-zinc-50">
            Leadership &amp; Publishing
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
            Platform governance &amp; educational direction
          </p>
        </div>

        {/* Abha Gupta Profile Card */}
        <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-sm flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 flex items-center justify-center font-mono font-black text-2xl shrink-0">
            AG
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <div>
              <h3 className="text-lg font-bold font-mono text-zinc-950 dark:text-zinc-50">
                Abha Gupta
              </h3>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium block">
                Founder &amp; Managing Director
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Abha leads <strong>beingsde.in</strong> as Founder and Managing Director, overseeing the platform&apos;s mission, publishing standards, and educational roadmaps. Being SDE was created to provide engineers and computer science learners with accessible, well-structured guides across distributed systems, object-oriented design patterns, and engineering career preparation.
            </p>
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2 text-3xs font-mono text-zinc-500">
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">Platform Direction</span>
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">Curriculum Standards</span>
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">Editorial Governance</span>
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">Technical Education</span>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL INTEGRITY & ACCURACY */}
      <section className="border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-8 rounded-sm space-y-5">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Editorial Standards</span>
        </div>
        <h2 className="text-xl font-bold font-mono text-zinc-950 dark:text-zinc-50">
          How Content is Authored &amp; Maintained
        </h2>
        <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-3 leading-relaxed">
          <p>
            At Being SDE, our content creation is guided by three straightforward principles:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                1. Industry Whitepapers
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Architectural guides are sourced from published systems research (such as Google Spanner, Amazon Dynamo, Apache Kafka, and Raft consensus) and real company engineering publications.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                2. Practical Trade-Offs
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Instead of abstract summaries, every module explores capacity math, database read/write bottlenecks, caching invalidation methods, and failure points like network partitions.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-zinc-800 rounded-sm">
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 block mb-1">
                3. Regular Revisions
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Software architecture continuously evolves. Modules are periodically revisited to include modern cloud-native patterns and community feedback.
              </p>
            </div>
          </div>
          <p className="text-xs text-zinc-500 pt-2">
            Have feedback, suggestions, or corrections? Contact our team at{" "}
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
