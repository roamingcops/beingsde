import type { Metadata } from "next";
import lldQuestions from "@/data/lld.json";
import LldExplorerClient from "@/components/LldExplorerClient";

export const metadata: Metadata = {
  title: "Low-Level Design (LLD) Exercises & Class Blueprints | beingsde.in",
  description: "Browse 27+ Low-Level Design (LLD) exercises. Complete class diagrams, design pattern implementations, and code blueprints in Java, C++, and Python for software interviews.",
  keywords: [
    "low level design exercises",
    "LLD practice questions",
    "object oriented design interview",
    "class diagram examples",
    "Java LLD solutions",
    "C++ LLD solutions",
    "Python LLD solutions",
    "beingsde lld",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/lld",
  },
  openGraph: {
    title: "Low-Level Design (LLD) Exercises & Class Blueprints | beingsde.in",
    description: "Browse 27+ Low-Level Design exercises with class diagrams and code in Java, C++, Python.",
    url: "https://beingsde.in/lld",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Low-Level Design Exercises | beingsde.in",
    description: "Object-oriented design problems with code in Java, C++, and Python.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function LldPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Low-Level Design Exercises",
    "description": "Comprehensive library of object-oriented design problems and class structure solutions.",
    "url": "https://beingsde.in/lld",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": lldQuestions.length,
      "itemListElement": lldQuestions.slice(0, 10).map((q, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": q.title,
        "url": `https://beingsde.in/lld/${q.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LldExplorerClient />
    </>
  );
}
