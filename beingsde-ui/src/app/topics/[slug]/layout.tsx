import type { Metadata } from "next";
import MOCK_TOPICS from "@/data/topics.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const topic = MOCK_TOPICS.find((t) => t.slug === slug);

  if (!topic) {
    return {
      title: "System Design Topic | beingsde.in",
      description: "Learn system design concepts on beingsde.in — the leading system design interview preparation platform.",
    };
  }

  const cleanTitle = topic.title.replace(/[\n\r]/g, " ").trim();
  const cleanDescription = topic.description.replace(/[\n\r]/g, " ").trim();
  const topicKeywords = [
    cleanTitle,
    topic.category,
    ...topic.tags,
    "system design",
    "system design interview",
    "beingsde",
    "beingsde.in",
    `${cleanTitle} tutorial`,
    `${cleanTitle} explained`,
    `${cleanTitle} system design`,
    "FAANG interview prep",
    "high level design",
    "software engineering interview",
  ];

  return {
    title: `${cleanTitle} — System Design Guide | beingsde.in`,
    description: `${cleanDescription} A complete system design deep-dive with real-world case studies, architectural diagrams, and interview tips on beingsde.in.`,
    keywords: topicKeywords,
    authors: [{ name: "beingsde Team", url: "https://beingsde.in" }],
    alternates: {
      canonical: `https://beingsde.in/topics/${slug}`,
    },
    openGraph: {
      title: `${cleanTitle} — System Design Guide | beingsde.in`,
      description: `${cleanDescription} Deep-dive system design guide with architecture diagrams and real-world corporate case studies.`,
      url: `https://beingsde.in/topics/${slug}`,
      type: "article",
      siteName: "beingsde.in",
      images: topic.imageUrl
        ? [{ url: topic.imageUrl, width: 1200, height: 630, alt: `${cleanTitle} — System Design Diagram` }]
        : [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | beingsde.in`,
      description: `${cleanDescription} Learn on beingsde.in — the #1 system design interview prep platform.`,
      images: topic.imageUrl ? [topic.imageUrl] : ["/images/redis-caching-diagram.png"],
      creator: "@beingsde",
    },
  };
}

export async function generateStaticParams() {
  return MOCK_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export default function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <TopicStructuredData params={params} />
      {children}
    </>
  );
}

// Server component that injects per-topic JSON-LD into <head> via Next.js Script
async function TopicStructuredData({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = MOCK_TOPICS.find((t) => t.slug === slug);
  if (!topic) return null;

  const cleanTitle = topic.title.replace(/[\n\r]/g, " ").trim();
  const cleanDescription = topic.description.replace(/[\n\r]/g, " ").trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `https://beingsde.in/topics/${slug}#article`,
        "headline": cleanTitle,
        "description": cleanDescription,
        "url": `https://beingsde.in/topics/${slug}`,
        "inLanguage": "en-US",
        "author": {
          "@type": "Organization",
          "@id": "https://beingsde.in/#organization",
          "name": "beingsde Team"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://beingsde.in/#organization",
          "name": "beingsde.in"
        },
        "image": topic.imageUrl || "https://beingsde.in/images/redis-caching-diagram.png",
        "articleSection": topic.category,
        "keywords": topic.tags.join(", "),
        "timeRequired": `PT${topic.estimatedTimeMinutes}M`,
        "educationalLevel": topic.difficulty,
        "learningResourceType": "Tutorial",
        "isPartOf": {
          "@id": "https://beingsde.in/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://beingsde.in" },
          { "@type": "ListItem", "position": 2, "name": "Topics", "item": "https://beingsde.in/topics" },
          { "@type": "ListItem", "position": 3, "name": cleanTitle, "item": `https://beingsde.in/topics/${slug}` }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

