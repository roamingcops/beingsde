import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, Calendar, ArrowRight, User, Layers, ShieldCheck, Sparkles } from "lucide-react";
import guides from "@/data/guides.json";

export const metadata: Metadata = {
  title: "Real-World System Architecture Case Studies & Deep Dives | beingsde.in",
  description: "Exhaustive engineering case studies of global systems: Netflix 4K streaming, Uber geolocation dispatch, WhatsApp Erlang concurrency, Twitter hybrid timeline, and payment idempotency.",
  keywords: [
    "system architecture case studies",
    "Netflix system design",
    "Uber architecture case study",
    "WhatsApp Erlang architecture",
    "Twitter timeline fanout",
    "payment system idempotency",
    "database sharding production",
    "software architecture deep dives",
    "beingsde guides",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/guides",
  },
  openGraph: {
    title: "Real-World System Architecture Case Studies | beingsde.in",
    description: "In-depth engineering deep dives into Netflix, Uber, WhatsApp, Twitter, and distributed databases.",
    url: "https://beingsde.in/guides",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Architecture Case Studies | beingsde.in",
    description: "Production-grade system architecture deep dives authored by Staff Engineers.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function GuidesIndexPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Production System Architecture Case Studies",
    "description": "Comprehensive engineering case studies on global distributed systems by Being SDE.",
    "url": "https://beingsde.in/guides",
    "publisher": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* HEADER SECTION */}
      <section className="flex flex-col gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-xs font-mono text-zinc-500 w-fit">
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Engineering Deep Dives</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
          Production Architecture Case Studies
        </h1>

        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Peer-reviewed, exhaustive architectural analyses of global platforms. Learn the non-trivial tradeoffs, failure recovery models, and kernel optimizations used at Netflix, Uber, WhatsApp, and mission-critical payment gateways.
        </p>
      </section>

      {/* CASE STUDIES GRID */}
      <section className="flex flex-col gap-6">
        {guides.map((guide) => (
          <article
            key={guide.id}
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 rounded-md shadow-sm hover:border-zinc-400 dark:hover:border-zinc-600 transition-all flex flex-col gap-4 group"
          >
            <div className="flex flex-wrap items-center gap-3 text-3xs font-mono uppercase tracking-wider text-zinc-400">
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded font-semibold">
                {guide.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {guide.readingTimeMinutes} min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {guide.publishedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> {guide.author}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Link href={`/guides/${guide.slug}`}>
                  {guide.title}
                </Link>
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {guide.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <Link
                href={`/guides/${guide.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 group-hover:translate-x-1 transition-transform"
              >
                <span>Read Full Architectural Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-3xs font-mono px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 rounded border border-zinc-200 dark:border-zinc-800">
                Level: {guide.difficulty}
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
