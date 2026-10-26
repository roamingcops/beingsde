import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DESIGN_PATTERNS } from "@/data/design-patterns";
import DesignPatternDetailClient from "@/components/DesignPatternDetailClient";

export async function generateStaticParams() {
  return DESIGN_PATTERNS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const pattern = DESIGN_PATTERNS.find((p) => p.slug === resolvedParams.slug);

  if (!pattern) {
    return {
      title: "Design Pattern | Being SDE (beingsde.in)",
      description: "Software design patterns and architecture blueprints on Being SDE.",
    };
  }

  const title = `${pattern.name} Pattern — Interactive Simulator & Code Blueprint | beingsde.in`;
  const description = `${pattern.oneLiner} Learn ${pattern.name} with real-world metaphors, interactive playground, and clean code in Java, TypeScript, and Python on Being SDE.`;

  return {
    title,
    description,
    keywords: [
      pattern.name,
      `${pattern.name} design pattern`,
      `${pattern.category} pattern`,
      `${pattern.name} Java example`,
      `${pattern.name} TypeScript example`,
      `${pattern.name} Python example`,
      "software architecture pattern",
      "beingsde",
      "beingsde.in",
      ...pattern.realWorldUsage
    ],
    alternates: {
      canonical: `https://beingsde.in/design-patterns/${pattern.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://beingsde.in/design-patterns/${pattern.slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [
        {
          url: "/images/redis-caching-diagram.png",
          width: 1200,
          height: 630,
          alt: `${pattern.name} Design Pattern`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/redis-caching-diagram.png"],
    },
  };
}

export default async function DesignPatternDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const pattern = DESIGN_PATTERNS.find((p) => p.slug === resolvedParams.slug);

  if (!pattern) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${pattern.name} Pattern Guide`,
    "description": pattern.oneLiner,
    "url": `https://beingsde.in/design-patterns/${pattern.slug}`,
    "proficiencyLevel": pattern.difficulty,
    "author": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    },
    "keywords": `${pattern.name}, ${pattern.category}, software design patterns, GoF`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <DesignPatternDetailClient slug={resolvedParams.slug} />
    </>
  );
}
