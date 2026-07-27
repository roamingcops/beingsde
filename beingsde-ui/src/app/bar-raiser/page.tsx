import type { Metadata } from "next";
import defaultBarRaiserQuestions from "@/data/bar-raiser.json";
import BarRaiserClient from "@/components/BarRaiserClient";

export const metadata: Metadata = {
  title: "Amazon Bar Raiser Questions & STAR Method Answers (SDE1 to Principal) | beingsde.in",
  description: "Master Amazon Bar Raiser & Leadership Principles interview questions. Structured STAR method answers tailored for SDE1, SDE2, SDE3, and Principal Engineers on Being SDE.",
  keywords: [
    "Amazon Bar Raiser interview questions",
    "Bar Raiser STAR method answers",
    "leadership principles software engineer",
    "SDE3 interview prep",
    "Principal Engineer interview questions",
    "have backbone disagree and commit",
    "ownership leadership principle",
    "customer obsession interview",
    "beingsde bar raiser",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/bar-raiser",
  },
  openGraph: {
    title: "Amazon Bar Raiser Questions & STAR Method Answers | beingsde.in",
    description: "Structured STAR method answers tailored for SDE1, SDE2, SDE3, and Principal Engineers.",
    url: "https://beingsde.in/bar-raiser",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Bar Raiser STAR Answers | beingsde.in",
    description: "Master Bar Raiser interviews with STAR structured answers by level.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function BarRaiserPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": defaultBarRaiserQuestions.map((q) => ({
      "@type": "Question",
      "name": q.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${q.why} Principle: ${q.principle}. Structured using Situation, Task, Action, and Result for SDE1 through Principal engineering levels.`
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BarRaiserClient />
    </>
  );
}
