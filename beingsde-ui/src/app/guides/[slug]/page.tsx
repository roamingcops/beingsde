import type { Metadata } from "next";
import { notFound } from "next/navigation";
import guides from "@/data/guides.json";
import GuideDetailClient from "@/components/GuideDetailClient";

export async function generateStaticParams() {
  return guides.map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const guide = guides.find((g) => g.slug === resolvedParams.slug);

  if (!guide) {
    return {
      title: "System Architecture Case Study | Being SDE (beingsde.in)",
      description: "Learn global software architecture, distributed scalability, and production trade-offs on Being SDE.",
    };
  }

  const title = `${guide.title} | beingsde.in`;
  const description = `${guide.summary} In-depth production engineering breakdown covering architectural blueprints, latency trade-offs, and failure recovery on Being SDE.`;

  return {
    title,
    description,
    keywords: [
      guide.title,
      `${guide.category} architecture`,
      "system architecture case study",
      "distributed systems breakdown",
      "high scale architecture",
      "FAANG system design",
      "beingsde",
      "beingsde.in"
    ],
    alternates: {
      canonical: `https://beingsde.in/guides/${guide.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://beingsde.in/guides/${guide.slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [
        {
          url: "/images/redis-caching-diagram.png",
          width: 1200,
          height: 630,
          alt: `${guide.title} Architecture Diagram`,
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

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  // Schema.org TechArticle JSON-LD with E-E-A-T metadata
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": guide.title,
    "description": guide.summary,
    "articleSection": guide.category,
    "educationalLevel": guide.difficulty,
    "datePublished": guide.publishedDate,
    "dateModified": "2026-10-08",
    "url": `https://beingsde.in/guides/${guide.slug}`,
    "author": {
      "@type": "Person",
      "name": guide.author,
      "url": "https://beingsde.in/about"
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
  };

  // Schema.org BreadcrumbList JSON-LD
  const breadcrumbSchema = {
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
        "name": "Architecture Case Studies",
        "item": "https://beingsde.in/guides"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": guide.title,
        "item": `https://beingsde.in/guides/${guide.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GuideDetailClient slug={slug} initialGuide={guide} />
    </>
  );
}
