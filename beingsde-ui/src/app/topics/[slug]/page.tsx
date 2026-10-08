import type { Metadata } from "next";
import MOCK_TOPICS from "@/data/topics.json";
import TopicDetailClient from "@/components/TopicDetailClient";

export async function generateStaticParams() {
  return MOCK_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const topic = MOCK_TOPICS.find((t) => t.slug === resolvedParams.slug);
  if (!topic) {
    return {
      title: "System Design Topic | Being SDE (beingsde.in)",
      description: "Learn High-Level System Design, distributed architecture, and scalability principles on Being SDE.",
    };
  }

  const title = `${topic.title} — System Design Blueprint, Trade-offs & Interview Guide | beingsde.in`;
  const description =
    topic.description
      ? `${topic.description} Detailed architecture diagram, database schema, latency trade-offs, and FAANG interview blueprint on Being SDE.`
      : `Master ${topic.title} for software architecture and FAANG system design interviews. Covers ${topic.category}, trade-offs, and implementation details on Being SDE.`;

  return {
    title,
    description,
    keywords: [
      topic.title,
      `${topic.title} system design`,
      `${topic.title} interview question`,
      topic.category,
      "system design guide",
      "FAANG interview prep",
      "beingsde",
      "beingsde.in",
      ...(topic.tags || [])
    ],
    alternates: {
      canonical: `https://beingsde.in/topics/${topic.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://beingsde.in/topics/${topic.slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [
        {
          url: "/images/redis-caching-diagram.png",
          width: 1200,
          height: 630,
          alt: `${topic.title} — System Design Architecture Diagram`,
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

export default async function TopicDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const topic = MOCK_TOPICS.find((t) => t.slug === slug);

  return (
    <>
      {topic && (
        <>
          {/* Schema.org TechArticle JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "TechArticle",
                "headline": `${topic.title} — System Design Architecture Guide`,
                "description": topic.description || `Comprehensive guide to ${topic.title} for software engineers and system architects.`,
                "articleSection": topic.category,
                "educationalLevel": topic.difficulty,
                "url": `https://beingsde.in/topics/${topic.slug}`,
                "author": {
                  "@type": "Organization",
                  "name": "Being SDE",
                  "url": "https://beingsde.in"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "Being SDE",
                  "url": "https://beingsde.in",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://beingsde.in/logo.png"
                  }
                },
                "inLanguage": "en-US"
              })
            }}
          />
          {/* Schema.org BreadcrumbList JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://beingsde.in"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "System Design Topics",
                    "item": "https://beingsde.in/topics"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": topic.title,
                    "item": `https://beingsde.in/topics/${topic.slug}`
                  }
                ]
              })
            }}
          />
        </>
      )}
      <TopicDetailClient slug={slug} initialTopic={topic} />
    </>
  );
}
