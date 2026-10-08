import type { Metadata } from "next";
import defaultHldQuestions from "@/data/hld-questions.json";
import QuestionsClient from "@/components/QuestionsClient";

export const metadata: Metadata = {
  title: "Top 50+ System Design (HLD) Interview Questions & Answers (2025) | beingsde.in",
  description: "Master the top 50+ High-Level Design (HLD) interview questions for FAANG software engineering interviews. In-depth architectural trade-offs, caching, database sharding, and scalability solutions with diagrams.",
  keywords: [
    "top system design interview questions",
    "HLD interview questions",
    "system design practice questions",
    "FAANG system design interview",
    "database sharding questions",
    "Redis caching interview questions",
    "Kafka architecture questions",
    "consistent hashing questions",
    "system design interview answers",
    "beingsde questions",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/questions",
  },
  openGraph: {
    title: "Top 50+ System Design (HLD) Interview Questions & Answers (2025) | beingsde.in",
    description: "In-depth architectural trade-offs, caching, database sharding, and scalability solutions for FAANG system design interviews.",
    url: "https://beingsde.in/questions",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 50+ HLD System Design Questions & Answers | beingsde.in",
    description: "Master High-Level Design interview questions with deep architectural answers and trade-offs.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function QuestionsPage() {
  // Generate JSON-LD FAQPage for Google Search snippet rich cards
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": defaultHldQuestions.slice(0, 20).map((q) => ({
      "@type": "Question",
      "name": q.title,
      "url": `https://beingsde.in/questions/${q.slug}`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.summary || q.contentMarkdown.slice(0, 250).replace(/[#*`]/g, ""),
        "url": `https://beingsde.in/questions/${q.slug}#answer`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <QuestionsClient />
    </>
  );
}
