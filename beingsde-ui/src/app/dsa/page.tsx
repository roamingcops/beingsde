import type { Metadata } from "next";
import defaultDsaQuestions from "@/data/dsa.json";
import DsaClient from "@/components/DsaClient";

export const metadata: Metadata = {
  title: "Data Structures & Algorithms (DSA) Interview Patterns | beingsde.in",
  description: "Master essential Data Structures & Algorithms patterns — Two Pointers, Sliding Window, Monotonic Stack, Binary Search, Dynamic Programming, Graphs, and Heaps for coding interviews.",
  keywords: [
    "DSA interview patterns",
    "data structures and algorithms",
    "two pointers pattern",
    "sliding window technique",
    "monotonic stack pattern",
    "binary search on answer",
    "dynamic programming patterns",
    "graph DFS BFS topological sort",
    "coding interview prep",
    "beingsde dsa",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/dsa",
  },
  openGraph: {
    title: "Data Structures & Algorithms (DSA) Interview Patterns | beingsde.in",
    description: "Master essential Data Structures & Algorithms patterns for coding interviews on Being SDE.",
    url: "https://beingsde.in/dsa",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Interview Patterns | beingsde.in",
    description: "Master 14+ core DSA patterns for software engineering interviews.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function DsaPage() {
  const dsaSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": "Data Structures & Algorithms Masterclass",
    "description": "Comprehensive guide to 50+ DSA pattern implementations across Arrays, Trees, Graphs, DP, and Heaps.",
    "educationalProgramMode": "online",
    "provider": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dsaSchema) }}
      />
      <DsaClient />
    </>
  );
}
