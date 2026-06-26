import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Design Topics & Learning Curriculum | beingsde.in",
  description:
    "Browse 60+ in-depth system design topics including Redis caching, consistent hashing, Kafka event streaming, DynamoDB, PostgreSQL sharding, rate limiting, load balancing, and distributed system architecture. Perfect for FAANG and senior engineering interviews.",
  keywords: [
    "system design topics",
    "system design curriculum",
    "system design learning path",
    "Redis system design",
    "consistent hashing tutorial",
    "Kafka system design",
    "DynamoDB tutorial",
    "PostgreSQL sharding",
    "rate limiter design",
    "load balancing architecture",
    "distributed systems course",
    "HLD topics list",
    "LLD topics list",
    "system design for interviews",
    "beingsde topics",
    "system design interview topics",
    "FAANG system design curriculum",
  ],
  alternates: {
    canonical: "https://beingsde.in/topics",
  },
  openGraph: {
    title: "System Design Topics & Learning Curriculum | beingsde.in",
    description:
      "Browse 60+ comprehensive system design topics. From Redis caching to consistent hashing, Kafka, DynamoDB, and microservices — the most complete system design curriculum online.",
    url: "https://beingsde.in/topics",
    siteName: "beingsde.in",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Topics | beingsde.in",
    description: "60+ in-depth system design learning topics. Start your FAANG interview prep now.",
    images: ["/images/redis-caching-diagram.png"],
    creator: "@beingsde",
  },
};

export default function TopicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

