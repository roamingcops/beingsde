import type { Metadata } from "next";
import MOCK_TOPICS from "@/data/topics.json";
import TopicsExplorerClient from "@/components/TopicsExplorerClient";

export const metadata: Metadata = {
  title: "System Design Explorer — 60+ HLD Architecture Topics | beingsde.in",
  description: "Explore 60+ interactive High-Level Design (HLD) topics. Master Redis caching, database sharding, consistent hashing, rate limiters, Kafka queues, and microservices architecture.",
  keywords: [
    "system design explorer",
    "HLD topics list",
    "distributed systems curriculum",
    "Redis caching system design",
    "database sharding guide",
    "consistent hashing ring",
    "rate limiter architecture",
    "Kafka message queue design",
    "FAANG system design topics",
    "beingsde topics",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/topics",
  },
  openGraph: {
    title: "System Design Explorer — 60+ HLD Architecture Topics | beingsde.in",
    description: "Master High-Level Design (HLD) architecture topics with hand-drawn schematics and interactive trade-off guides.",
    url: "https://beingsde.in/topics",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Topics Explorer | beingsde.in",
    description: "Explore 60+ High-Level Design architecture topics for FAANG interviews.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function TopicsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "System Design Explorer",
    "description": "Comprehensive library of High-Level Design topics and distributed systems architecture guides.",
    "url": "https://beingsde.in/topics",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": MOCK_TOPICS.length,
      "itemListElement": MOCK_TOPICS.slice(0, 15).map((topic, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": topic.title,
        "url": `https://beingsde.in/topics/${topic.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TopicsExplorerClient />
    </>
  );
}
