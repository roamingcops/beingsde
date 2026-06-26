import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Design Cheat Sheet — Quick Reference Guide | beingsde.in",
  description:
    "A printable system design quick-reference sheet covering database selection, CAP theorem, SQL vs NoSQL, sharding vs partitioning, auth patterns (JWT vs Sessions vs OAuth), consistent hashing, rate limiting, Kafka rules, and Snowflake ID layout.",
  keywords: [
    "system design cheat sheet",
    "system design quick reference",
    "system design interview cheat sheet",
    "database selection cheat sheet",
    "CAP theorem cheat sheet",
    "SQL vs NoSQL quick reference",
    "consistent hashing summary",
    "rate limiting algorithms summary",
    "JWT vs sessions comparison",
    "Kafka rules cheat sheet",
    "Snowflake ID explained",
    "system design printable PDF",
    "beingsde cheat sheet",
    "FAANG interview cheat sheet",
    "system design one pager",
  ],
  alternates: {
    canonical: "https://beingsde.in/cheat-sheet",
  },
  openGraph: {
    title: "System Design Cheat Sheet — Quick Reference | beingsde.in",
    description:
      "Printable one-page system design reference: database matrix, CAP theorem, scaling rules, auth patterns, Kafka, consistent hashing, and more.",
    url: "https://beingsde.in/cheat-sheet",
    type: "website",
    siteName: "beingsde.in",
    images: [
      {
        url: "/images/redis-caching-diagram.png",
        width: 1200,
        height: 630,
        alt: "System Design Cheat Sheet — beingsde.in",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Cheat Sheet | beingsde.in",
    description:
      "One-page printable system design cheat sheet. Print as PDF and use for last-minute interview review.",
    images: ["/images/redis-caching-diagram.png"],
    creator: "@beingsde",
  },
};

export default function CheatSheetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
