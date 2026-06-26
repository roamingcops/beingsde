import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top 20 System Design Interview Questions & Answers | beingsde.in",
  description:
    "Master the top 20 most-asked system design interview questions — SQL vs NoSQL, WebSocket scaling, consistent hashing, rate limiting, DynamoDB GSI/LSI, Kafka partitions, and database selection matrices. Comprehensive answers with trade-off tables.",
  keywords: [
    "system design interview questions",
    "top system design questions",
    "system design questions and answers",
    "SQL vs NoSQL interview question",
    "WebSocket scaling system design",
    "consistent hashing interview",
    "rate limiter design interview",
    "DynamoDB GSI LSI interview",
    "Kafka system design",
    "database selection system design",
    "PostgreSQL vs MongoDB vs Cassandra",
    "system design questions 2024",
    "beingsde questions",
    "beingsde system design interview",
    "FAANG system design questions",
    "microservices interview questions",
    "distributed systems interview questions",
    "CAP theorem interview",
    "sharding partitioning indexing difference",
    "vertical vs horizontal scaling interview",
  ],
  alternates: {
    canonical: "https://beingsde.in/questions",
  },
  openGraph: {
    title: "Top 20 System Design Interview Questions & Answers | beingsde.in",
    description:
      "Comprehensive answers to the 20 most critical system design interview questions. Includes trade-off tables for databases, auth patterns, scaling strategies, and more.",
    url: "https://beingsde.in/questions",
    type: "website",
    siteName: "beingsde.in",
    images: [
      {
        url: "/images/redis-caching-diagram.png",
        width: 1200,
        height: 630,
        alt: "Top 20 System Design Interview Questions — beingsde.in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 20 System Design Interview Questions | beingsde.in",
    description:
      "The most comprehensive system design Q&A guide. From SQL vs NoSQL to Kafka partitions — with precise, interview-ready answers.",
    images: ["/images/redis-caching-diagram.png"],
    creator: "@beingsde",
  },
};

// FAQ JSON-LD — eligible for Google FAQ rich results (expandable snippets in SERP)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "name": "Top 20 System Design Interview Questions",
  "url": "https://beingsde.in/questions",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you choose between SQL and NoSQL databases?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Choose SQL (PostgreSQL, MySQL) for structured data requiring ACID transactions, complex JOINs, and strict schema enforcement. Choose NoSQL (MongoDB, DynamoDB, Cassandra) for flexible schemas, massive horizontal scale, high write throughput, and eventual consistency workloads."
      }
    },
    {
      "@type": "Question",
      "name": "When should you choose Vertical Scaling vs Horizontal Scaling?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Start with vertical scaling (adding CPU/RAM to one server) for simplicity. Transition to horizontal scaling (adding more servers) when hardware limits are reached, cost curves become prohibitive, or high availability is required. Horizontal scaling introduces distributed system complexity."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between Sharding, Partitioning, and Indexing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Indexing speeds up read queries within a single table using B-Tree or Hash structures. Partitioning splits a single table into logical physical chunks within one database instance. Sharding distributes rows across multiple distinct database servers using a shard key, scaling write throughput and storage."
      }
    },
    {
      "@type": "Question",
      "name": "How do you scale WebSockets to millions of concurrent connections?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Increase Linux file descriptor limits, use Layer 4 load balancing with sticky sessions, and implement a Redis Pub/Sub backplane so any WebSocket server can relay messages to clients connected to other servers. Pattern: Client → HAProxy → WS Servers ↔ Redis Pub/Sub."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between LSI and GSI in DynamoDB?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Local Secondary Index (LSI) shares the same partition key as the base table but uses a different sort key. It is limited to 10GB per item collection and supports strong consistency. A Global Secondary Index (GSI) uses a completely different partition key, spans all partitions, supports only eventual consistency, and has its own dedicated throughput capacity."
      }
    },
    {
      "@type": "Question",
      "name": "Which database should I use for transactions, user profiles, logs, and analytics?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use PostgreSQL for financial transactions (ACID compliance). Use MongoDB for user profiles (flexible JSON). Use Cassandra for logs and high-throughput writes (LSM tree). Use Apache Druid for real-time analytics (columnar storage). Use Elasticsearch for search and catalog (inverted index). Use Redis for sessions and caching (in-memory)."
      }
    },
    {
      "@type": "Question",
      "name": "How does Consistent Hashing work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Consistent hashing maps both servers and keys onto a circular ring. A key routes clockwise to the nearest server. When a node is added or removed, only 1/N keys need to migrate (vs nearly 100% in modulo hashing). Virtual nodes (100-200 per server) ensure even distribution and prevent hotspots."
      }
    },
    {
      "@type": "Question",
      "name": "How do you design a distributed rate limiter?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use a Token Bucket algorithm for burst-friendly limiting. For distributed enforcement across multiple API gateway instances, use Redis with Lua scripts to atomically evaluate and increment counters, preventing race conditions (dirty reads) where concurrent requests could bypass the limit."
      }
    }
  ]
};

export default function QuestionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
