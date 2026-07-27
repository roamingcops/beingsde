import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer & Educational Policy | beingsde.in",
  description: "Read the disclaimer and copyright policy of Being SDE (beingsde.in) regarding architectural trade-offs, company trademarks, and interview preparation content.",
  alternates: {
    canonical: "https://beingsde.in/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col gap-10">
      
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest font-mono text-zinc-400">Legal</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
          Disclaimer & Educational Policy
        </h1>
        <p className="text-sm text-zinc-500">
          Last updated: <strong>June 2026</strong>. Please read this disclaimer before using beingsde.in.
        </p>
      </div>

      <div className="space-y-8 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            1. Educational Purpose Only
          </h2>
          <p className="pl-3">
            All content, diagrams, code snippets, and architectural breakdowns provided on <strong>beingsde.in</strong> are strictly for general educational and interview preparation purposes. The information is designed to illustrate software architecture concepts (e.g., caching, sharding, message queues) and does not constitute formal engineering consultancy or enterprise architectural certification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            2. Trademarks & Brand Names
          </h2>
          <p className="pl-3">
            Product names, logos, brands, and trade marks mentioned on <strong>beingsde.in</strong> (including but not limited to Amazon, Google, Meta, Netflix, Uber, Twitter, Redis, Kafka, Cassandra, PostgreSQL, MongoDB, and Razorpay) are the property of their respective trademark holders. Reference to these brands does not imply endorsement, affiliation, sponsorship, or partnership with <strong>beingsde.in</strong>. All references are used solely for educational trade-off analysis and architectural case study illustrations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            3. No Guarantee of Interview Success
          </h2>
          <p className="pl-3">
            While our curriculum is authored by experienced engineers to reflect modern industry practices, <strong>beingsde.in</strong> makes no guarantees or warranties regarding employment offers, interview performance, or specific hiring outcomes at any organization. Individual interview success depends on personal preparation, problem-solving skills, and interviewer evaluation criteria.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            4. Content Accuracy & Revisions
          </h2>
          <p className="pl-3">
            We strive to maintain accurate, up-to-date information. However, computer science standards, open-source software libraries, and cloud infrastructure offerings evolve rapidly. <strong>beingsde.in</strong> provides content on an &quot;as is&quot; basis without warranties of completeness or fitness for a particular purpose.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold font-mono text-zinc-950 dark:text-zinc-50 border-l-2 border-zinc-900 dark:border-zinc-100 pl-3">
            5. Contact Us
          </h2>
          <p className="pl-3">
            If you have any questions regarding this disclaimer, please visit our{" "}
            <Link href="/contact" className="underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Contact Us page
            </Link>.
          </p>
        </section>

      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 flex gap-6 text-xs text-zinc-400">
        <Link href="/privacy" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">Privacy Policy</Link>
        <Link href="/terms" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">Terms of Service</Link>
        <Link href="/about" className="underline hover:text-zinc-700 dark:hover:text-zinc-200">About Us</Link>
      </div>
    </div>
  );
}
