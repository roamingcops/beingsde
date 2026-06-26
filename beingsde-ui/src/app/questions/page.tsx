"use client";

import { useState } from "react";
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Database, 
  Cpu, 
  Shield, 
  Network, 
  HelpCircle, 
  Sliders, 
  ArrowUpRight,
  Info,
  AlertTriangle,
  Flame,
  CheckCircle2
} from "lucide-react";

interface Question {
  id: number;
  title: string;
  category: "Databases" | "Scaling" | "Security & Auth" | "Protocols";
  difficulty: "Easy" | "Medium" | "Hard";
  summary: string;
  content: React.ReactNode;
}

export default function QuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const categories = [
    { id: "ALL", label: "All Topics", icon: Sliders },
    { id: "Databases", label: "Databases & Storage", icon: Database },
    { id: "Scaling", label: "Scaling & Optimization", icon: Cpu },
    { id: "Security & Auth", label: "Security & Auth", icon: Shield },
    { id: "Protocols", label: "Protocols & Real-Time", icon: Network },
  ];

  const questions: Question[] = [
    {
      id: 1,
      title: "How do you choose between SQL and NoSQL databases for a system?",
      category: "Databases",
      difficulty: "Medium",
      summary: "Evaluate structural requirements, scalability patterns, and data consistency models to decide between relational and non-relational storage engines.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            The choice between <strong>SQL (Relational)</strong> and <strong>NoSQL (Non-Relational)</strong> databases is not about which is "better," but rather which matches your system's data structure, query patterns, and scale constraints.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. SQL Databases (e.g., PostgreSQL, MySQL)</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Data Structure:</strong> Strict tabular schema with defined relationships (Foreign Keys). Great for normalized structures.</li>
            <li><strong>Consistency:</strong> Strict ACID compliance by default. Ideal for ledger systems, transactions, and state where inconsistency causes immediate failure.</li>
            <li><strong>Scaling:</strong> Primarily vertical (scaling CPU/RAM). Horizontal scaling requires complex configurations (Master-Replica reads, sharding at the application layer).</li>
            <li><strong>Queries:</strong> Powerful SQL engine supporting multi-table JOINs and complex analytical aggregations.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. NoSQL Databases (e.g., MongoDB, DynamoDB, Cassandra)</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Data Structure:</strong> Schemaless or flexible models. Key-Value, Document (JSON), Wide-Column, or Graph.</li>
            <li><strong>Consistency:</strong> Eventual consistency models (BASE) optimized for ultra-high write throughput and partition tolerance (CAP Theorem focus on AP).</li>
            <li><strong>Scaling:</strong> Designed for horizontal scaling (sharing partition keys, auto-sharding out-of-the-box).</li>
            <li><strong>Queries:</strong> Key-value lookups or simple index searches. Multi-document JOINs are either unsupported or highly inefficient.</li>
          </ul>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200 block mb-2">Decision Rule of Thumb:</span>
            <p className="text-xs">
              Choose <strong>SQL</strong> if you require multi-record transactions, complex relational queries, or your data model is highly structured and static. Choose <strong>NoSQL</strong> if you need to scale horizontally to support massive read/write volumes, require flexible document representations, or are storing time-series or unstructured data.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "When should you choose Vertical Scaling (Scale Up) vs. Horizontal Scaling (Scale Out)?",
      category: "Scaling",
      difficulty: "Easy",
      summary: "Understand the hardware thresholds of single nodes and when to transition to distributed systems with replica groups and partition sets.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Scaling refers to increasing the system capacity to handle higher request volumes, storage sizes, and concurrent connections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wide mb-2">Vertical Scaling (Scale Up)</h5>
              <p className="text-xs mb-2">Adding resources (CPU, RAM, NVMe storage) to a single existing server instance.</p>
              <ul className="list-disc pl-4 text-2xs space-y-1">
                <li><strong>Pros:</strong> Simplicity. No network latency between nodes, simple programming model, transactions work natively.</li>
                <li><strong>Cons:</strong> Hard hardware limits. High cost (exponential price curve for high-end bare metal). Single Point of Failure (SPOF).</li>
                <li><strong>Best For:</strong> Early stage applications, relational databases with low write traffic, and background workers.</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wide mb-2">Horizontal Scaling (Scale Out)</h5>
              <p className="text-xs mb-2">Adding more commodity servers to the resource pool and distributing load across them.</p>
              <ul className="list-disc pl-4 text-2xs space-y-1">
                <li><strong>Pros:</strong> Infinite scaling limits. Elastic provisioning (scale up/down dynamically). High availability (no single point of failure).</li>
                <li><strong>Cons:</strong> Distributed system complexity. Data consistency issues, load balancer requirements, network latency overhead.</li>
                <li><strong>Best For:</strong> High-traffic web servers, caching layers, distributed databases, and high-volume media processing.</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 p-4 rounded-sm flex gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block mb-1">Interview Tip:</span>
              Always start your design interviews by mentioning that you'd leverage <strong>Vertical Scaling</strong> until the hardware limits or cost curves make it non-viable. Jumping straight to complex horizontal sharding architectures for low-scale designs is a common anti-pattern that interviewers dislike.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "What is the difference between Database Sharding, Partitioning, and Indexing?",
      category: "Databases",
      difficulty: "Medium",
      summary: "Differentiate how sharding distributes tables across distinct database nodes, partitioning divides local data logical segments, and indexing accelerates lookups.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            These are three core optimization strategies to handle large volumes of database reads and writes. They operate at different levels of database management:
          </p>

          <table className="w-full text-left border-collapse border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900">
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Strategy</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Location</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Key Objective</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">How It Works</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">Indexing</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Within a single table</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 font-medium">Accelerates read queries</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Creates a lookup helper (B-Tree or Hash index) mapping index keys to record disk locations. Slows down write operations.</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">Partitioning</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Within a single database instance</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 font-medium">Manages table layout</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Splits a single large table into smaller, logically managed physical chunks (e.g. partition by Month) on the same disk.</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">Sharding</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Across multiple physical databases</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 font-medium">Scales write throughput & storage</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Distributes database rows across distinct database servers (shards) using a shard key (e.g. `hash(user_id) % N`).</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <span className="text-xs font-bold block mb-1 text-zinc-900 dark:text-zinc-200">Sharding Challenges:</span>
            <p className="text-xs">
              Sharding introduces significant complexity: JOIN queries across shards become highly expensive or impossible, transaction boundaries must span multiple nodes (requiring distributed locks or 2PC), and re-balancing data when adding shards is extremely painful.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "How do you scale WebSockets to support millions of concurrent, stateful connections?",
      category: "Protocols",
      difficulty: "Hard",
      summary: "Deconstruct connection-state storage, load-balancer configurations, pub/sub communication backplanes, and server socket limits (ports & file descriptors).",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Unlike stateless HTTP requests, WebSockets are <strong>persistent, stateful TCP connections</strong>. A single client maintains an open connection with a specific server instance. Scaling this to millions of clients requires solving three core challenges:
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. OS-Level Socket Limits (File Descriptors)</h4>
          <p>
            In Linux, every TCP connection is represented as a File Descriptor (FD). By default, the OS limits FDs per process (often to 1024).
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Increase limits by modifying `/etc/security/limits.conf` (`nofile` limit to e.g., `1,000,000`).</li>
            <li>Optimize port allocations: A single IP can only connect to 65,535 ports on a target IP. To overcome this, attach multiple virtual IPs to the load balancer or WebSocket servers.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Load Balancing and Routing</h4>
          <p>
            Standard Load Balancers (like ALB or Nginx) must support protocol upgrading (`HTTP 1.1` to `WebSocket`).
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Sticky Sessions:</strong> Use load-balancer sticky sessions or hashing algorithms to ensure clients reconnecting land back on their active servers if connection-state is cached locally.</li>
            <li>Or load-balance at Layer 4 (TCP) using HAProxy to minimize CPU overhead compared to Layer 7 (HTTP) parsing.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">3. Inter-Server Communication (Pub/Sub Backplane)</h4>
          <p>
            If Client A is connected to WebSocket Server 1, and Client B is connected to WebSocket Server 2, how does Client A send a real-time message to Client B?
          </p>
          <ul className="list-disc pl-5 space-y-1 mb-2">
            <li><strong>Redis Pub/Sub or Kafka Backplane:</strong> When Server 1 receives a message for Client B, it publishes the message to a central Redis pub/sub channel.</li>
            <li>All WebSocket servers subscribe to this channel. Server 2 reads the message, identifies that Client B is connected to it locally, and pushes the message down Client B's TCP connection.</li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-sm">
            <div className="flex gap-2">
              <Info className="w-5 h-5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold block mb-1">Architecture Pattern:</span>
                Client → DNS / Global CDN → Layer 4 Load Balancer (HAProxy) → WebSocket App Servers (Node.js/Go/Java) ↔ Redis Cluster (Pub/Sub message bus).
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Which authorization and session mechanisms are required in distributed microservices?",
      category: "Security & Auth",
      difficulty: "Medium",
      summary: "Compare stateless JWT authentication, stateful sessions (Redis caches), and delegated OAuth2 patterns in microservice environments.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Authenticating and authorizing users across dozens of independent microservices requires moving away from local, memory-bound server sessions.
          </p>

          <table className="w-full text-left border-collapse border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900">
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Mechanism</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">How It Works</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Pros</th>
                <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Cons</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">Stateful Session (Redis)</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">User ID is mapped to a random Session ID in Redis. The browser receives this Session ID via cookies. Microservices call Redis to validate the token on every request.</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-500 font-medium">Immediate revocation (deleting the key logs the user out instantly). High security.</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Every single API call requires a network round-trip to Redis, introducing latency. Single point of failure.</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">Stateless JWT (JSON Web Tokens)</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">User metadata and permissions are signed cryptographically by Auth service and stored directly inside the client-side JWT. Microservices validate signatures locally using a public key.</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-500 font-medium">No database lookup required. Zero network latency for validation. Highly scalable.</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Hard to revoke before expiration (must implement blacklists, which makes it stateful again). If private key leaks, entire system is compromised.</td>
              </tr>
              <tr>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">OAuth 2.0 / OpenID Connect</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">An delegation framework enabling third-party services to access user scopes using Access/Refresh tokens issued by an identity provider (e.g., Okta, Auth0).</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-500 font-medium">Industry standard. Separation of concerns. Ideal for API ecosystems and SSO.</td>
                <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Complex setup. Multiple handshakes and tokens (ID token, Access token, Refresh token).</td>
              </tr>
            </tbody>
          </table>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <span className="text-xs font-bold block mb-1 text-zinc-900 dark:text-zinc-200">Hybrid Premium Pattern for Microservices:</span>
            <p className="text-xs text-zinc-500">
              Deploy an <strong>API Gateway</strong> (e.g. Kong, Spring Cloud Gateway) at the edge. The gateway validates the client's Session ID or JWT. It then strips the token and passes a sanitized, trusted header (e.g., `X-User-ID: 8472`, `X-User-Role: Admin`) down to internal microservices, preventing redundant authentication inside the internal network.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "How does Amazon DynamoDB implement Partition Keys, LSIs, and GSIs?",
      category: "Databases",
      difficulty: "Hard",
      summary: "Analyze DynamoDB's data distribution mechanics, sorting ranges, and the cost/consistency differences between Local (LSI) and Global Secondary Indexes (GSI).",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            DynamoDB is a fully managed, wide-column NoSQL database. Scaling seamlessly to petabytes of data requires a deep understanding of its keys and indexing architecture:
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. Partition Key (PK) & Sort Key (SK)</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Partition Key (Hash Key):</strong> Hashed by DynamoDB to determine which physical storage partition the item will live in. Uniform key distribution is critical to avoid "hot partitions."</li>
            <li><strong>Sort Key (Range Key):</strong> Determines the physical storage order of items within the partition. Enables query operations using relational operators (e.g., `begins_with`, `between`, `&gt;`).</li>
            <li><strong>Primary Key:</strong> Can be just a PK (simple) or a PK + SK combination (composite).</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Local Secondary Index (LSI)</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Structure:</strong> Shares the <strong>same Partition Key</strong> as the parent table, but uses a <strong>different Sort Key</strong>.</li>
            <li><strong>Scope:</strong> Bound to a single physical partition (maximum size 10 GB per item collection).</li>
            <li><strong>Throughput:</strong> Shares read/write capacity units (RCU/WCU) with the base table.</li>
            <li><strong>Consistency:</strong> Supports both <strong>Strongly Consistent</strong> and Eventual Consistent reads.</li>
            <li><strong>Lifecycle:</strong> Can only be created during table initialization. Cannot be added later.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">3. Global Secondary Index (GSI)</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Structure:</strong> Can define a <strong>completely new Partition Key</strong> and Sort Key, different from the parent table.</li>
            <li><strong>Scope:</strong> Spans across physical partitions, no size limitations.</li>
            <li><strong>Throughput:</strong> Requires its own dedicated, provisioned write/read capacity units (RCU/WCU). If a GSI is throttled due to insufficient WCU, the base table writes will also throttle!</li>
            <li><strong>Consistency:</strong> Supports <strong>Eventual Consistency only</strong> due to asynchronous replication from the base table.</li>
            <li><strong>Lifecycle:</strong> Can be created, updated, or deleted at any time on an active table.</li>
          </ul>

          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 p-4 rounded-sm flex gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">DynamoDB Design Constraint:</span>
              Always project only the minimum necessary attributes into your GSIs. Projecting `ALL` attributes duplicates storage costs and increases the write throughput consumed on the GSI during updates on the parent table.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Which database should you choose for User Data, Transactions, Logs, and Business Flow Metadata?",
      category: "Databases",
      difficulty: "Hard",
      summary: "Analyze the database trade-offs of PostgreSQL, MongoDB, Cassandra, Druid, and Elasticsearch against real-world enterprise data flows.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            No single database fits all data formats. A premium system design separates storage based on throughput, query flexibility, durability, and cost:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Data Category</th>
                  <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Target Database</th>
                  <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Key Pros</th>
                  <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Key Cons</th>
                  <th className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-mono font-semibold text-zinc-900 dark:text-zinc-200">Trade-offs (Latency vs. Scale)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">
                    User Core / Account Profiles
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-sm">MongoDB</span> or PostgreSQL
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Flexible JSON document nesting (addresses, preferences), fast index lookups, easy schema evolution.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">No complex relational joins across nested structures, high memory footprint.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Sub-10ms read/write latency. Scalable via document partitioning.</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">
                    Ledger / Transactions / Payments
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-sm">PostgreSQL</span> (with WAL)
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Strict ACID transactions, strict schema enforcement, multi-table joins, absolute data durability.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Harder horizontal write scaling, high write lock contention on updates.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">P99 latencies ~10-25ms. Prioritizes consistency over extreme throughput.</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">
                    App Logs / Clickstream Metrics
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-sm">Cassandra</span> or Druid
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Log-Structured Merge-tree (LSM) engine supports massive write throughput, masterless architecture (no SPOF).</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">No support for relational queries, slow reads if query does not match the exact clustering keys.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Sub-5ms writes, but read latency can degrade if query filters aren't partitioned. Highly scalable.</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">
                    Analytical Events / Real-time Analytics
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-sm">Apache Druid</span>
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Columnar storage layout ideal for lightning-fast aggregation queries on billions of real-time stream items.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">High operational complexity, poor lookup performance for individual point rows.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Sub-second query aggregations on petabyte tables. High ingestion rates.</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800 font-bold text-zinc-950 dark:text-zinc-50">
                    Product Catalog / Full-Text Search
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-sm">Elasticsearch</span>
                  </td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Inverted index maps words to documents, supporting fast fuzzy matches, auto-complete, and ranking.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">High memory footprint, index lag (not real-time consistent for transactions). Not a source of truth database.</td>
                  <td className="p-3 border-b border-zinc-200 dark:border-zinc-800">Sub-10ms fuzzy text lookup queries. Scalable read shards.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <span className="text-xs font-bold block mb-1 text-zinc-900 dark:text-zinc-200">Architecture Recommendation:</span>
            <p className="text-xs">
              Do not use a single storage engine for everything. Map payments to <strong>PostgreSQL</strong>, feed checkout notifications to <strong>Kafka</strong>, buffer user sessions in <strong>Redis</strong>, sink raw logging events into <strong>Cassandra</strong>, and sync catalogue searches to <strong>Elasticsearch</strong> using Change Data Capture (CDC).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "How do you achieve strong consistency across multiple microservices (Sagas vs. 2PC)?",
      category: "Scaling",
      difficulty: "Hard",
      summary: "Understand the blocking nature of Two-Phase Commit (2PC) and how the Saga Pattern orchestrates distributed, eventual consistency transactions.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            When a single business transaction spans multiple database boundaries (e.g., Order Service → Inventory Service → Payment Service), local database transactions cannot guarantee consistency.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. Two-Phase Commit (2PC)</h4>
          <p>
            A synchronous distributed protocol coordinated by a central coordinator node:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Phase 1 (Prepare):</strong> Coordinator asks all participant databases if they are ready to commit their local transaction. They log the action and reply Yes or No.</li>
            <li><strong>Phase 2 (Commit):</strong> If all participants respond Yes, the coordinator issues a Commit command. Otherwise, it issues an Abort.</li>
            <li><strong>Trade-off:</strong> High consistency, but it is a <strong>blocking protocol</strong>. If the coordinator crashes mid-process, resources remain locked indefinitely, severely hurting write availability.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Saga Pattern (Eventually Consistent)</h4>
          <p>
            A sequence of local, independent transactions. Each service performs its transaction and publishes an event. Subsequent services listen and trigger their local actions.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>If a service fails (e.g., Payment fails), the Saga orchestrator triggers <strong>compensating transactions</strong> backwards (e.g., releases inventory, voids order) to revert state.</li>
            <li><strong>Choreography:</strong> Decentralized. Services trigger events and listen to neighbors. Simpler setup, but harder to trace flows.</li>
            <li><strong>Orchestration:</strong> Central controller coordinates tasks, handles failures, and guides flow. Easy to debug state, but adds single controller logic dependency.</li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-sm">
            <span className="text-xs font-bold block mb-1 text-zinc-900 dark:text-zinc-200">Standard Recommendation:</span>
            <p className="text-xs">
              Default to the **Saga Pattern** for scalable microservices. Avoid 2PC in high-throughput cloud environments due to network latency, blocking locks, and coordinator single points of failure.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "How does Consistent Hashing minimize data movement during node changes?",
      category: "Scaling",
      difficulty: "Medium",
      summary: "Explore consistent hash rings, server positioning, virtual node structures, and how keys shift clockwise during scale events.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Traditional hashing (`hash(key) % N`) behaves poorly when the number of server nodes ($N$) changes: **nearly 100% of all keys** will hash to a new server, invalidating all cache entries and causing immediate database overload.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. The Hash Ring</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>We map both servers and keys onto a shared circular hash ring (e.g., range $0$ to $2^{32}-1$).</li>
            <li>To find which server should store a key: locate the key on the ring, then travel clockwise until you find the first server node.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Adding or Removing a Node</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Adding Node X:</strong> Only keys located between Node X's predecessor and Node X on the ring need to migrate to Node X. All other keys remain routed to their existing servers.</li>
            <li><strong>Data Movement:</strong> Only $1/N$ of all keys are relocated.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">3. Virtual Nodes (V-Nodes)</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>To prevent uneven partition sizes (hotspots), each physical server is mapped multiple times (e.g., 100-200 V-Nodes) on the ring using name offsets (`NodeA-1`, `NodeA-2`).</li>
            <li>This distributes the load uniformly across all physical servers, matching their hardware capabilities.</li>
          </ul>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <span className="text-xs font-bold block mb-1 text-zinc-900 dark:text-zinc-200">Real-World Adopters:</span>
            <p className="text-xs">
              Consistent hashing is the core routing algorithm behind **Apache Cassandra**, **Amazon Dynamo**, **Discord's gateway routing**, and **Memcached client libraries**.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "How do you design and scale a distributed Rate Limiter?",
      category: "Scaling",
      difficulty: "Hard",
      summary: "Compare rate limiting algorithms (Token Bucket, Sliding Window) and detail how to scale them globally using Redis and Lua script locks.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Rate limiting protects resources from denial of service (DoS), web scrapers, and resource exhaustion.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. Core Algorithms</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Token Bucket:</strong> A bucket holds up to $N$ tokens, refilling at a constant rate. Each request consumes one token. Simple, allows bursts.</li>
            <li><strong>Sliding Window Log:</strong> Logs timestamps of all user requests. When a request arrives, count timestamps within the current window. Highly accurate, but high memory footprint.</li>
            <li><strong>Sliding Window Counter:</strong> Combines fixed-window counters and calculates window overlaps. Lightweight memory usage, good approximation.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Scaling in Distributed Clusters</h4>
          <p>
            To prevent race conditions when multiple API Gateways update rate limit counters concurrently:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Redis Cluster with Lua Scripting:</strong> Execute the rate limit evaluation and counter increment logic inside a single atomic Lua script on Redis. This avoids network round-trip race conditions.</li>
            <li><strong>Local Caching with Synchronization:</strong> Let the API Gateways cache and throttle requests locally, periodically syncing count differences back to Redis to minimize central database load.</li>
          </ul>

          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 text-amber-800 dark:text-amber-300 p-4 rounded-sm flex gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Race Condition Problem (Dirty Read):</span>
              If two requests read a counter value of `99` (limit `100`) from Redis at the exact same millisecond, both will allow the request and increment the counter to `100`, effectively letting 101 requests through. Always use Lua scripts for atomicity.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "How do you prevent Cache Stampede (Thundering Herd) in a high-traffic system?",
      category: "Scaling",
      difficulty: "Medium",
      summary: "Understand cache expiration spikes and how to mitigate database overload using single-flight locks, cache warming, and probabilistic expiration.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            A <strong>Cache Stampede</strong> occurs when a hot cache key expires, and thousands of concurrent requests read the cache miss simultaneously, hitting the backend database at the exact same moment. This spikes DB latency and can trigger system-wide outages.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Mitigation Strategies:</h4>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Mutex Locking (Single-Flight Pattern):</strong>
              <p className="text-xs">When a cache miss occurs, the application server acquires a distributed lock (e.g. via Redis/Redlock) for that key. Only the server holding the lock queries the database. All other concurrent requests wait, and then read the refreshed cache value.</p>
            </li>
            <li>
              <strong>Probabilistic Early Expiration (XFetch):</strong>
              <p className="text-xs">As the cache key nears expiration, a formula calculates a probability that a read request will fetch the new data early in the background before the key officially dies. The closer it is to expiration, the higher the probability of early background update.</p>
            </li>
            <li>
              <strong>De-coupled Background Updates:</strong>
              <p className="text-xs">Set cache keys to never expire physically in Redis. Instead, store a logical expiration timestamp inside the value. When the logical expiry is reached, the application serving the request continues to serve the stale data to clients while spawning a background thread to update the cache asynchronously.</p>
            </li>
          </ol>
        </div>
      )
    },
    {
      id: 12,
      title: "How do you design a distributed unique ID generator (like Snowflake)?",
      category: "Scaling",
      difficulty: "Medium",
      summary: "Deconstruct Snowflake ID bit layouts (Timestamp, Datacenter ID, Machine ID, Sequence) to generate unique, sorted IDs without a central coordinator.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            In a distributed database system, relying on a single database table auto-increment key creates a write bottleneck and a single point of failure.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Twitter Snowflake ID (64-Bit Structure)</h4>
          <p className="text-xs text-zinc-500">
            Snowflake IDs are time-sortable, 64-bit integers structured as follows:
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded-sm font-mono text-2xs flex flex-wrap gap-2 justify-between border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            <div>Sign Bit (1b)<br/><span className="text-zinc-400">0</span></div>
            <div>Timestamp (41b)<br/><span className="text-zinc-400">Milliseconds Epoch (~69 yrs)</span></div>
            <div>Datacenter ID (5b)<br/><span className="text-zinc-400">Up to 32 centers</span></div>
            <div>Worker Node ID (5b)<br/><span className="text-zinc-400">Up to 32 servers</span></div>
            <div>Sequence Number (12b)<br/><span className="text-zinc-400">Up to 4096 ids/ms</span></div>
          </div>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-3">Why this design is premium:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>No Central Coordinator:</strong> Each machine generates its own IDs locally without communicating with others, removing network hops.</li>
            <li><strong>Time Sortable:</strong> Since the timestamp is the leading bit segment, IDs naturally sort chronologically, which is critical for indexing efficiency in database B-Trees.</li>
            <li><strong>Scale:</strong> A single node can generate up to 4,096 IDs per millisecond.</li>
          </ul>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <span className="text-xs font-bold block mb-1 text-zinc-900 dark:text-zinc-200">Alternative: UUIDv4 (128-Bit)</span>
            <p className="text-xs text-zinc-500">
              UUIDs are completely random and require no coordination. However, they are 128-bit (double the storage size of 64-bit Snowflake IDs) and are **not chronologically ordered**, which causes severe database page splits and slow indexes.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "How does a Message Queue (Kafka) scale consumer groups and handle partition delivery?",
      category: "Scaling",
      difficulty: "Hard",
      summary: "Understand Kafka's log partitioning, how consumer groups map to partitions, and the trade-offs of message ordering guarantees.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Apache Kafka scales write and read throughput by splitting topics into physical segments called <strong>Partitions</strong>. Each partition is an append-only commit log.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. Partitioning and Ordering</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Messages with the same <strong>partitioning key</strong> (e.g. `order_id`) are routed to the exact same partition.</li>
            <li>Kafka guarantees **strict message ordering** only *within* a single partition. There is no global order across multiple partitions.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Consumer Groups & Scaling</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>A consumer group is a set of workers collaborating to read messages from a topic.</li>
            <li>Each partition is assigned to exactly **one consumer** in a consumer group at any given time.</li>
            <li><strong>Scale Limit:</strong> If a topic has 4 partitions, and you spawn 5 consumers in the same group, the 5th consumer will remain idle. To scale consumers, you must increase the partition count.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">3. Offset Commits & Delivery Guarantees</h4>
          <p className="text-xs">
            Consumers track progress by committing their current message read offset.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-500">
            <li><strong>At-Most-Once:</strong> Commit offset immediately after receiving message. If consumer crashes during processing, message is lost.</li>
            <li><strong>At-Least-Once:</strong> Process message, then commit offset. If consumer crashes mid-processing, the next consumer re-processes the message. Requires downstream handlers to be **idempotent**.</li>
          </ul>
        </div>
      )
    },
    {
      id: 14,
      title: "What are the trade-offs of Push vs. Pull models in real-time notification architectures?",
      category: "Protocols",
      difficulty: "Medium",
      summary: "Evaluate client-side polling vs server-side streaming (WebSockets, SSE) for chat apps, notification feeds, and live stock charts.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Real-time notifications need a communication strategy between application servers and clients.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs mb-2">1. Long Polling (Client Pull)</h5>
              <p className="text-2xs mb-2">Client requests data; server holds connection open until fresh data arrives or timeout occurs. Once received, client immediately opens a new request.</p>
              <ul className="list-disc pl-3 text-2xs space-y-1 text-zinc-500 text-left">
                <li>Simple HTTP mechanics.</li>
                <li>High connection setup overhead, not true real-time.</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs mb-2">2. Server-Sent Events (SSE)</h5>
              <p className="text-2xs mb-2">A unidirectional, persistent HTTP connection where servers push updates to clients. Web standard over standard HTTP/2.</p>
              <ul className="list-disc pl-3 text-2xs space-y-1 text-zinc-500 text-left">
                <li>Simple implementation, automatic reconnects, bypasses firewall blocks.</li>
                <li>Strictly one-way (server-to-client). Limit on concurrent connections per domain on HTTP/1.1.</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs mb-2">3. WebSockets (Bi-directional)</h5>
              <p className="text-2xs mb-2">Full-duplex persistent TCP connection. Both client and server can push messages at any time.</p>
              <ul className="list-disc pl-3 text-2xs space-y-1 text-zinc-500 text-left">
                <li>Sub-5ms latency, extremely lightweight frame headers.</li>
                <li>Complex scaling, requires custom proxy support, no built-in recovery on disconnect.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 15,
      title: "How do you handle hot partitions (the celebrity problem) in social feeds?",
      category: "Scaling",
      difficulty: "Hard",
      summary: "Mitigate partition skew and write bottlenecks when single high-profile entities trigger millions of simultaneous updates.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            A <strong>Hot Partition</strong> occurs when the request volume or data size is distributed unevenly, overloading a single server while others sit idle. A classic example is a celebrity user with 100M followers posting an update.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. Hybrid Fan-Out (Push vs. Pull)</h4>
          <p className="text-xs">
            How do you build a user's timeline?
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-500">
            <li><strong>Fan-Out on Write (Push):</strong> When a user posts, prepend the post directly into the pre-computed inbox cache of all their followers. Good for quick reads, but fails when a celebrity writes (writing 100M cache updates crashes the DB).</li>
            <li><strong>Fan-Out on Read (Pull):</strong> Timelines are computed at query time by pulling the posts of all followed users. Saves write capacity, but makes reads extremely slow.</li>
            <li><strong>The Hybrid Approach:</strong> Cache inbox feeds for standard users. For celebrities, **do not push** their posts. Instead, when a follower loads their feed, query the celebrity posts database on-the-fly and merge the results into the cached feed.</li>
          </ul>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-2">2. Shard Key Salting</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-500">
            <li>If you write logs for a specific brand name key (e.g. `NIKE`), append a random suffix to distribute the partition keys: `NIKE_1`, `NIKE_2`, `NIKE_10`.</li>
            <li>This spreads writes across distinct partitions. When performing aggregations, the query engine queries all salted partitions (`1` through `10`) in parallel.</li>
          </ul>
        </div>
      )
    },
    {
      id: 16,
      title: "When do you choose Eventual Consistency vs. Strong Consistency (PACELC Theorem)?",
      category: "Databases",
      difficulty: "Medium",
      summary: "Understand consistency limits in partitioned networks and the tradeoffs between latency and accuracy under normal operations.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            The **CAP Theorem** states that in the event of a network partition (P), a distributed system must choose between Availability (A) and Consistency (C).
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">The PACELC Theorem (Extended CAP)</h4>
          <p className="text-xs">
            PACELC goes further by evaluating normal operating conditions when there is no network partition:
          </p>
          <div className="bg-zinc-100 dark:bg-zinc-950 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <strong>If there is a Partition (P):</strong> Choose Availability (A) vs. Consistency (C).<br/>
            <strong>Else (E):</strong> Choose Latency (L) vs. Consistency (C).
          </div>

          <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-500">
            <li><strong>PA/EL Systems (e.g., MongoDB, DynamoDB):</strong> Prioritize Availability during partitions and Latency during normal operations. Reads return cached or stale data quickly.</li>
            <li><strong>PC/EC Systems (e.g., Relational Databases, Spanner):</strong> Prioritize Consistency at all times. Will reject writes/reads if they cannot be verified globally, and introduce network delays to ensure data matches on all replicas.</li>
          </ul>
        </div>
      )
    },
    {
      id: 17,
      title: "How does an LSM-Tree storage engine differ from a B-Tree?",
      category: "Databases",
      difficulty: "Hard",
      summary: "Compare the mechanics of write-optimized Log-Structured Merge-trees (MemTable, SSTables, compaction) with read-optimized B-Trees.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Databases write data to disk differently depending on whether they are optimized for writes or reads:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs mb-2">B-Tree (Read-Optimized)</h5>
              <p className="text-2xs mb-2">Maintains sorted keys in a balanced tree structure on disk. Used by PostgreSQL, MySQL, Oracle.</p>
              <ul className="list-disc pl-4 text-2xs space-y-1 text-zinc-500">
                <li><strong>How:</strong> Writes update pages in-place. Requires random disk access.</li>
                <li><strong>Pros:</strong> Fast point-lookups ($O(\log N)$), simple read mechanics.</li>
                <li><strong>Cons:</strong> Write amplification. Updating a single row requires rewriting an entire page of disk space.</li>
              </ul>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-sm">
              <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs mb-2">LSM-Tree (Write-Optimized)</h5>
              <p className="text-2xs mb-2">Appends writes sequentially. Used by Cassandra, RocksDB, InfluxDB.</p>
              <ul className="list-disc pl-4 text-2xs space-y-1 text-zinc-500">
                <li><strong>How:</strong> Writes append to a Write-Ahead Log (WAL) and write to memory (MemTable). Periodically flushes to sorted disk files (SSTables). Compaction merges duplicate keys.</li>
                <li><strong>Pros:</strong> Insanely high write speeds (sequential disk appends).</li>
                <li><strong>Cons:</strong> Read path is complex (must scan multiple SSTables and use Bloom Filters to verify keys).</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 18,
      title: "How do you design a resilient retry mechanism with exponential backoff and jitter?",
      category: "Scaling",
      difficulty: "Medium",
      summary: "Understand network timeouts and how retrying requests with exponential delays and random offset noises prevents thundering herds.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            When a downstream microservice experiences load, immediate naive retries will amplify the traffic, triggering a cascading crash.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. Exponential Backoff</h4>
          <p className="text-xs">
            Instead of retrying every 1 second, increase the retry wait time exponentially:
            <code className="block mt-1 p-2 bg-zinc-100 dark:bg-zinc-950 rounded-sm font-mono text-2xs text-zinc-600 dark:text-zinc-400">delay = min(base * (2 ^ attempt), max_delay)</code>
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Jitter (Random Noise)</h4>
          <p className="text-xs">
            If 1,000 requests fail simultaneously (e.g. database disconnect), exponential backoff ensures they will all retry at the exact same delayed millisecond. Adding **Jitter** scatters retries randomly:
            <code className="block mt-1 p-2 bg-zinc-100 dark:bg-zinc-950 rounded-sm font-mono text-2xs text-zinc-600 dark:text-zinc-400">delay_with_jitter = random(0, delay)</code>
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <span className="text-xs font-bold block mb-1 text-zinc-900 dark:text-zinc-200">AWS Jitter Testing Results:</span>
            <p className="text-xs text-zinc-500">
              AWS architecture benchmarks show that applying "Full Jitter" reduces the peak queue load on recovery servers from a sharp thundering spike to a completely flat, manageable line.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 19,
      title: "How do you scale search queries on a large product catalog (Elasticsearch)?",
      category: "Databases",
      difficulty: "Hard",
      summary: "Deconstruct Elasticsearch's inverted index, search document structures, shard routing, and replica node query splits.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            Relying on database `LIKE` string queries doesn't scale for product catalogs. Elasticsearch uses an <strong>Inverted Index</strong> to support fuzzy search, facets, and real-time analytical counts.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">1. Inverted Index Mechanics</h4>
          <p className="text-xs">
            A map listing every unique word, alongside which document IDs contain it. When a user searches "Red running shoes", the index intersects the lists for "Red", "running", and "shoes" instantly.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">2. Shard Distribution</h4>
          <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-500">
            <li><strong>Primary Shards:</strong> Document datasets are split into primary shards. When indexing a document, the target shard is computed via `hash(_id) % primary_shards`. Cannot be changed without re-indexing.</li>
            <li><strong>Replica Shards:</strong> Copy of primary shards. Handles read queries and guarantees failover. Add replicas dynamically to scale concurrent search throughput.</li>
          </ul>
        </div>
      )
    },
    {
      id: 20,
      title: "How do you design a secure API Gateway for routing, rate limiting, and SSL termination?",
      category: "Security & Auth",
      difficulty: "Medium",
      summary: "Explore the edge proxy architecture, consolidating routing, authentication, SSL termination, and rate limits in a centralized entry point.",
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            An <strong>API Gateway</strong> sits at the edge of your internal network, acting as the single entry point for all client requests.
          </p>

          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Edge Gateway Responsibilities:</h4>
          <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-500">
            <li>
              <strong>SSL/TLS Termination:</strong> Gateway decrypts HTTPS requests at the edge, allowing internal microservices to communicate over standard HTTP/TCP. This offloads CPU-intensive encryption tasks from app servers.
            </li>
            <li>
              <strong>Reverse Proxy & Routing:</strong> Maps external endpoints (e.g. `/api/v1/users`) to internal microservice IP/ports using Service Discovery registries (like Consul, Eureka).
            </li>
            <li>
              <strong>Cross-Cutting Concerns:</strong> Handles edge-level rate-limiting, CORS validation headers, request logs orchestration, and security threat prevention (blocking SQL Injection, XSS payloads).
            </li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 text-blue-800 dark:text-blue-300 p-4 rounded-sm flex gap-3 text-xs">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1 text-zinc-900 dark:text-zinc-200">Standard Technology Stack:</span>
              Use open-source proxies like **Nginx**, **Kong (Lua-based)**, **Envoys (C++)**, or **AWS API Gateway** to scale edge layers reliably.
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === "ALL" || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-10 py-6 max-w-5xl mx-auto">
      
      {/* HEADER SECTION */}
      <section className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-zinc-950 dark:text-zinc-50">
            Top 20 System Design Interview Questions
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-3xl leading-relaxed">
            Accelerate your learning curve with precise, highly visual, and comprehensive breakdowns of core distributed systems concepts. Filter by category, search by keyword, and inspect comparative trade-off blueprints.
          </p>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mt-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search questions (e.g. WebSockets, Sharding, DynamoDB)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#18181b] text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors placeholder-zinc-400 rounded-sm"
            />
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setExpandedIndex(null); // Reset open accordion to prevent layout confusion
                  }}
                  className={`text-2xs font-semibold px-3 py-1.5 border uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 rounded-sm cursor-pointer ${
                    selectedCategory === cat.id 
                      ? "bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100" 
                      : "bg-white dark:bg-[#18181b] text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUESTIONS ACCORDION LIST */}
      <section className="flex flex-col gap-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={q.id}
                className={`border rounded-sm bg-white dark:bg-[#18181b] transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? "border-zinc-900 dark:border-zinc-100 shadow-md" 
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                {/* Header/Summary Card Trigger */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-2 items-center text-3xs font-mono tracking-widest font-black uppercase">
                      <span className="text-zinc-400">Q{q.id}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <span className="text-zinc-500">{q.category}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                      <span className={`px-1.5 py-0.5 border rounded-sm ${
                        q.difficulty === "Easy" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" :
                        q.difficulty === "Medium" ? "text-amber-500 border-amber-500/20 bg-amber-500/5" :
                        "text-rose-500 border-rose-500/20 bg-rose-500/5"
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                      {q.title}
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-2">
                      {q.summary}
                    </p>
                  </div>
                  <div className="mt-1 p-1 rounded-sm border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Collapsible Answer Body */}
                <div 
                  className={`transition-all duration-500 ease-in-out border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10 ${
                    isExpanded ? "max-h-[2500px] p-6 opacity-100 animate-fadeIn" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  {isExpanded && q.content}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-sm">
            <HelpCircle className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No questions found</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Try broadening your search query or choosing another category.</p>
          </div>
        )}
      </section>

      {/* QUICK STATS & BOTTOM CONTEXT */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Curated Material</h4>
            <p className="text-2xs text-zinc-400 dark:text-zinc-500 mt-1">Aligned directly with expectations from FAANG and high-scale startup architecture bars.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Flame className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Deep-Dive Spans</h4>
            <p className="text-2xs text-zinc-400 dark:text-zinc-500 mt-1">Covers from low-level storage engines (B-Tree/LSM) to edge proxy routing, security tokens, and WebSockets scaling.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <ArrowUpRight className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-mono">Updated Regularly</h4>
            <p className="text-2xs text-zinc-400 dark:text-zinc-500 mt-1">Content verified against modern standards, containing lessons from Amazon DynamoDB, Apache Kafka, and Druid.</p>
          </div>
        </div>
      </section>
      
    </div>
  );
}
