import type { Metadata } from "next";
import CheatSheetClient from "@/components/CheatSheetClient";

export const metadata: Metadata = {
  title: "System Design Quick Reference Cheat Sheet | beingsde.in",
  description: "Printable System Design Cheat Sheet for Staff+ Engineering Interviews. Database selection matrix, CAP & PACELC theorems, latency numbers, and scaling decision rules.",
  keywords: [
    "system design cheat sheet",
    "system design quick reference",
    "database selection matrix",
    "CAP theorem cheat sheet",
    "latency numbers every programmer should know",
    "scaling decision rules",
    "beingsde cheat sheet",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/cheat-sheet",
  },
  openGraph: {
    title: "System Design Quick Reference Cheat Sheet | beingsde.in",
    description: "Printable System Design Quick Reference for Staff+ Engineering Interviews.",
    url: "https://beingsde.in/cheat-sheet",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Cheat Sheet | beingsde.in",
    description: "Database selection matrix, CAP theorem, and scaling decision rules.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function CheatSheetPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "System Design Quick Reference Cheat Sheet",
    "description": "Essential architectural rules, database matrices, and latency metrics for software engineers.",
    "url": "https://beingsde.in/cheat-sheet",
    "publisher": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CheatSheetClient />
    </>
  );
}
