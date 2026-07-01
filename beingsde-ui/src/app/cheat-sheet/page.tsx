"use client";

import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";

export default function CheatSheetPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back + Print Controls */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <Link
          href="/topics"
          className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to HLD
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2 border border-zinc-900 dark:border-zinc-100 hover:bg-transparent hover:text-zinc-900 dark:hover:bg-transparent dark:hover:text-zinc-100 transition-all duration-300"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / Save as PDF
        </button>
      </div>

      {/* Cheat Sheet Content */}
      <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] p-8 space-y-8 text-xs print:border-none print:p-0">

        {/* Header */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 text-center">
          <h1 className="text-2xl font-black tracking-tight font-mono text-zinc-950 dark:text-zinc-50">
            SYSTEM DESIGN QUICK REFERENCE
          </h1>
          <p className="text-zinc-400 text-xs mt-1 font-mono">beingsde.in — Built for Staff+ Engineering Interviews</p>
        </div>

        {/* 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* COLUMN 1 */}
          <div className="space-y-6">

            {/* Database Selection */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                1. Database Selection Matrix
              </h2>
              <table className="w-full border-collapse text-2xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900">
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Data Type</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Database</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 dark:text-zinc-400">
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Transactions / Ledger</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">PostgreSQL</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">ACID, WAL, JOINs</td></tr>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/30"><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">User Profiles</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">MongoDB</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Flexible JSON schema</td></tr>
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Logs / Metrics</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Cassandra</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">High write throughput, LSM</td></tr>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/30"><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Real-time Analytics</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Apache Druid</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Columnar, sub-second aggs</td></tr>
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Search / Catalog</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Elasticsearch</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Inverted index, fuzzy search</td></tr>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/30"><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Sessions / Cache</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Redis</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">In-memory, sub-ms reads</td></tr>
                </tbody>
              </table>
            </section>

            {/* CAP / PACELC */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                2. CAP Theorem
              </h2>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li><span className="font-bold text-zinc-900 dark:text-zinc-200">C — Consistency:</span> Every read returns the most recent write or an error.</li>
                <li><span className="font-bold text-zinc-900 dark:text-zinc-200">A — Availability:</span> Every request receives a (possibly stale) response.</li>
                <li><span className="font-bold text-zinc-900 dark:text-zinc-200">P — Partition Tolerance:</span> System continues operating despite network splits.</li>
                <li className="pt-1 text-zinc-500">→ Distributed systems must choose CA, CP, or AP during a network partition.</li>
              </ul>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: "CP Systems", ex: "PostgreSQL, Spanner, HBase", color: "text-blue-500" },
                  { label: "AP Systems", ex: "DynamoDB, Cassandra, CouchDB", color: "text-amber-500" },
                  { label: "CA Systems", ex: "Single-node RDBMS (no partition)", color: "text-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="border border-zinc-200 dark:border-zinc-800 p-2 rounded-sm">
                    <div className={`font-bold text-2xs ${item.color}`}>{item.label}</div>
                    <div className="text-zinc-500 text-2xs mt-0.5">{item.ex}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Scaling Decision */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                3. Scaling Decision Rules
              </h2>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>✓ <span className="font-semibold text-zinc-900 dark:text-zinc-100">Vertical first</span> — Add CPU/RAM until hardware limits or cost spikes.</li>
                <li>✓ <span className="font-semibold text-zinc-900 dark:text-zinc-100">Horizontal</span> — When write volume exceeds single-node capacity.</li>
                <li>✓ <span className="font-semibold text-zinc-900 dark:text-zinc-100">Read replicas</span> — When reads &gt;&gt; writes (e.g., 90/10 ratio).</li>
                <li>✓ <span className="font-semibold text-zinc-900 dark:text-zinc-100">Caching</span> — For repeated, slow queries with &lt;1% write rate.</li>
                <li>✓ <span className="font-semibold text-zinc-900 dark:text-zinc-100">Sharding</span> — When storage or write throughput hits single-DB ceiling.</li>
                <li>✓ <span className="font-semibold text-zinc-900 dark:text-zinc-100">CDN</span> — For static assets; eliminates origin server load entirely.</li>
              </ul>
            </section>

            {/* Sharding vs Partitioning vs Indexing */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                4. Sharding vs Partitioning vs Indexing
              </h2>
              <table className="w-full border-collapse text-2xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900">
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Strategy</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Scope</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Goal</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 dark:text-zinc-400">
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-bold text-emerald-600 dark:text-emerald-400">Indexing</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Single table</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Faster reads</td></tr>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/30"><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-bold text-blue-600 dark:text-blue-400">Partitioning</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Single DB instance</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Manage table layout</td></tr>
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-bold text-amber-600 dark:text-amber-400">Sharding</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Multiple DB nodes</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Scale write throughput</td></tr>
                </tbody>
              </table>
            </section>

          </div>

          {/* COLUMN 2 */}
          <div className="space-y-6">

            {/* Auth Mechanisms */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                5. Auth Mechanisms
              </h2>
              <table className="w-full border-collapse text-2xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900">
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Method</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">State</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Revocable</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Use Case</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 dark:text-zinc-400">
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Sessions (Redis)</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Stateful</td><td className="p-2 border border-zinc-200 dark:border-zinc-700 text-emerald-500">✓ Yes</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Web apps, high security</td></tr>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/30"><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">JWT</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Stateless</td><td className="p-2 border border-zinc-200 dark:border-zinc-700 text-rose-500">✗ Hard</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">APIs, microservices</td></tr>
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">OAuth 2.0</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Delegated</td><td className="p-2 border border-zinc-200 dark:border-zinc-700 text-emerald-500">✓ Yes</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">SSO, 3rd-party access</td></tr>
                </tbody>
              </table>
              <p className="text-zinc-400 mt-2">💡 <strong>Pattern:</strong> API Gateway validates JWT/session, then passes <code className="bg-zinc-100 dark:bg-zinc-900 px-1 rounded">X-User-ID</code> headers downstream.</p>
            </section>

            {/* Consistent Hashing */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                6. Consistent Hashing
              </h2>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>• Hash ring spans 0 → 2³² − 1. Servers and keys map onto the ring.</li>
                <li>• Key routes clockwise to nearest server on the ring.</li>
                <li>• Adding/removing a node only moves <strong>1/N keys</strong> (vs. 100% in modulo hashing).</li>
                <li>• <strong>Virtual nodes</strong> (100–200 per server) prevent hotspots and ensure even distribution.</li>
                <li className="text-zinc-400">Used in: Cassandra, Dynamo, Memcached, Discord gateway.</li>
              </ul>
            </section>

            {/* Rate Limiting */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                7. Rate Limiting Algorithms
              </h2>
              <table className="w-full border-collapse text-2xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900">
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Algorithm</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Burst?</th>
                    <th className="text-left p-2 border border-zinc-200 dark:border-zinc-700 font-semibold">Memory</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 dark:text-zinc-400">
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Token Bucket</td><td className="p-2 border border-zinc-200 dark:border-zinc-700 text-emerald-500">✓ Yes</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Low</td></tr>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-900/30"><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Sliding Window Log</td><td className="p-2 border border-zinc-200 dark:border-zinc-700 text-rose-500">✗ No</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">High (stores timestamps)</td></tr>
                  <tr><td className="p-2 border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100">Sliding Window Counter</td><td className="p-2 border border-zinc-200 dark:border-zinc-700 text-amber-500">~ Partial</td><td className="p-2 border border-zinc-200 dark:border-zinc-700">Low (approximation)</td></tr>
                </tbody>
              </table>
              <p className="text-zinc-400 mt-2">💡 Use <strong>Lua scripts in Redis</strong> for atomic rate-limit evaluation across distributed gateways.</p>
            </section>

            {/* WebSockets Scaling */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                8. WebSocket Scaling
              </h2>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>• Increase Linux file descriptor limit (<code className="bg-zinc-100 dark:bg-zinc-900 px-1 rounded">nofile</code>) to ~1M.</li>
                <li>• Use <strong>Layer 4 load balancing</strong> (HAProxy) with sticky sessions.</li>
                <li>• Use <strong>Redis Pub/Sub backplane</strong> for cross-server message routing.</li>
                <li>• Pattern: Client → L4 LB → WS Server ↔ Redis Pub/Sub → WS Server → Client</li>
              </ul>
            </section>

            {/* Kafka */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                9. Kafka Key Rules
              </h2>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>• Same partition key → same partition → strict ordering within partition only.</li>
                <li>• Max consumers in a group = number of partitions.</li>
                <li>• <strong>At-least-once</strong> delivery requires idempotent consumers.</li>
                <li>• Consumer group lag = key metric for scaling consumer count.</li>
              </ul>
            </section>

            {/* Snowflake IDs */}
            <section>
              <h2 className="text-xs font-black font-mono uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-3 text-zinc-950 dark:text-zinc-50">
                10. Snowflake ID Layout (64-bit)
              </h2>
              <div className="font-mono text-2xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-sm flex flex-wrap gap-3 text-zinc-600 dark:text-zinc-400">
                <span><strong className="text-zinc-900 dark:text-zinc-100">1b</strong> Sign</span>
                <span>|</span>
                <span><strong className="text-zinc-900 dark:text-zinc-100">41b</strong> Timestamp (ms)</span>
                <span>|</span>
                <span><strong className="text-zinc-900 dark:text-zinc-100">5b</strong> Datacenter</span>
                <span>|</span>
                <span><strong className="text-zinc-900 dark:text-zinc-100">5b</strong> Worker</span>
                <span>|</span>
                <span><strong className="text-zinc-900 dark:text-zinc-100">12b</strong> Sequence</span>
              </div>
              <ul className="space-y-1 text-zinc-500 mt-2">
                <li>• Time-sortable, no central coordinator needed.</li>
                <li>• Up to 4,096 unique IDs per millisecond per machine.</li>
              </ul>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 text-center text-zinc-400 font-mono text-3xs print:block">
          beingsde.in — System Design Cheat Sheet — Use alongside full topic guides at beingsde.in/topics
        </div>
      </div>
    </div>
  );
}
