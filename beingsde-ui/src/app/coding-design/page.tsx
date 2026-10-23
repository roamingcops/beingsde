import type { Metadata } from "next";
import { CODING_DESIGN_TOPICS } from "@/data/coding-design";
import CodingDesignExplorerClient from "@/components/CodingDesignExplorerClient";

export const metadata: Metadata = {
  title: "Coding Design & Production Best Practices (25 Hard-Earned Rules) | beingsde.in",
  description: "Master 25 critical coding design best practices: queue consumer retries, API idempotency keys, circuit breakers, inventory state machines, concurrency locks, and distributed tracing with interactive scribble blueprints.",
  keywords: [
    "coding design best practices",
    "software engineering best practices",
    "system design best practices",
    "queue consumer retry mechanism",
    "api idempotency key pattern",
    "circuit breaker resilience4j",
    "inventory state machine",
    "optimistic locking stock quantity",
    "distributed tracing trace_id mdc",
    "RFC 7807 problem details",
    "beingsde coding design",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/coding-design",
  },
  openGraph: {
    title: "Coding Design & Production Best Practices | beingsde.in",
    description: "25 battle-tested software engineering best practices with interactive scribble blueprints and production code.",
    url: "https://beingsde.in/coding-design",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Design & Production Best Practices | beingsde.in",
    description: "25 hard-earned architectural rules, queue retries, idempotency, and concurrency locking patterns.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function CodingDesignPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Coding Design & Production Best Practices",
    "description": "Comprehensive library of 25 production-grade coding design and architectural best practices.",
    "url": "https://beingsde.in/coding-design",
    "publisher": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": CODING_DESIGN_TOPICS.length,
      "itemListElement": CODING_DESIGN_TOPICS.map((topic, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": topic.title,
        "url": `https://beingsde.in/coding-design/${topic.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CodingDesignExplorerClient />
    </>
  );
}
