import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CODING_DESIGN_TOPICS } from "@/data/coding-design";
import CodingDesignDetailClient from "@/components/CodingDesignDetailClient";

export async function generateStaticParams() {
  return CODING_DESIGN_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = CODING_DESIGN_TOPICS.find((t) => t.slug === resolvedParams.slug);

  if (!topic) {
    return {
      title: "Coding Design Practice | Being SDE (beingsde.in)",
      description: "Production software engineering and coding design best practices on Being SDE.",
    };
  }

  const title = `${topic.title} — Coding Design Blueprint & Production Rule | beingsde.in`;
  const description = `${topic.summary.rule} ${topic.summary.whyItMatters} Production code, anti-pattern breakdown, and interactive scribble schematic on Being SDE.`;

  return {
    title,
    description,
    keywords: [
      topic.title,
      `${topic.title} best practice`,
      "coding design pattern",
      "software architecture rule",
      "production resilience",
      "beingsde",
      "beingsde.in",
      ...topic.tags,
    ],
    alternates: {
      canonical: `https://beingsde.in/coding-design/${topic.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://beingsde.in/coding-design/${topic.slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [
        {
          url: "/images/redis-caching-diagram.png",
          width: 1200,
          height: 630,
          alt: `${topic.title} — Interactive Scribble Blueprint`,
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

export default async function CodingDesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const topic = CODING_DESIGN_TOPICS.find((t) => t.slug === resolvedParams.slug);

  if (!topic) {
    notFound();
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": topic.title,
    "description": topic.summary.rule,
    "url": `https://beingsde.in/coding-design/${topic.slug}`,
    "proficiencyLevel": topic.difficulty,
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
    "keywords": topic.tags.join(", ")
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CodingDesignDetailClient slug={resolvedParams.slug} />
    </>
  );
}
