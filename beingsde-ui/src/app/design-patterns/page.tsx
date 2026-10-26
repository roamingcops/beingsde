import type { Metadata } from "next";
import { DESIGN_PATTERNS } from "@/data/design-patterns";
import DesignPatternsExplorerClient from "@/components/DesignPatternsExplorerClient";

export const metadata: Metadata = {
  title: "Software Design Patterns Guide & Interactive UIs (GoF Patterns) | beingsde.in",
  description: "Master all 23 Gang of Four (GoF) Creational, Structural, and Behavioral design patterns with live interactive simulators, real-world metaphors, and production code in Java, TypeScript, and Python.",
  keywords: [
    "design patterns",
    "software design patterns",
    "gof design patterns",
    "creational design patterns",
    "structural design patterns",
    "behavioral design patterns",
    "strategy pattern",
    "observer pattern",
    "builder pattern",
    "factory pattern",
    "singleton pattern",
    "decorator pattern",
    "beingsde design patterns",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/design-patterns",
  },
  openGraph: {
    title: "Software Design Patterns & Interactive Coding Visualizer | beingsde.in",
    description: "Learn Creational, Structural, and Behavioral design patterns with interactive live simulators and multi-language code.",
    url: "https://beingsde.in/design-patterns",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Design Patterns Guide & Interactive Simulators | beingsde.in",
    description: "Interactive runtime visualizers for Strategy, Observer, Builder, Decorator, and State patterns.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function DesignPatternsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Software Design Patterns Hub",
    "description": "Comprehensive library of software design patterns with interactive visualizers and clean code.",
    "url": "https://beingsde.in/design-patterns",
    "publisher": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": DESIGN_PATTERNS.length,
      "itemListElement": DESIGN_PATTERNS.map((pattern, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": `${pattern.name} Pattern`,
        "url": `https://beingsde.in/design-patterns/${pattern.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <DesignPatternsExplorerClient />
    </>
  );
}
