import type { Metadata } from "next";
import lldQuestions from "@/data/lld.json";
import LldDetailClient from "@/components/LldDetailClient";

export async function generateStaticParams() {
  return lldQuestions.map((q) => ({
    slug: q.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const q = lldQuestions.find((item) => item.slug === resolvedParams.slug);
  if (!q) {
    return {
      title: "Low-Level Design Exercise | Being SDE (beingsde.in)",
      description: "Master Low-Level Object Oriented Design and design patterns on Being SDE.",
    };
  }

  const title = `${q.title} LLD — Code Blueprint & Class Diagram | beingsde.in`;
  const description = q.summary || `Step-by-step object-oriented design and code implementation for ${q.title} in Java, C++, and Python. Learn design patterns and class diagrams on Being SDE.`;

  return {
    title,
    description,
    keywords: [
      q.title,
      `${q.title} low level design`,
      `${q.title} class diagram`,
      `${q.title} object oriented design`,
      "LLD interview question",
      "Java design patterns",
      "beingsde",
      "beingsde.in",
      ...(q.patterns || [])
    ],
    alternates: {
      canonical: `https://beingsde.in/lld/${q.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://beingsde.in/lld/${q.slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [
        {
          url: "/images/redis-caching-diagram.png",
          width: 1200,
          height: 630,
          alt: `${q.title} — LLD Code Blueprint`,
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

export default async function LldDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const q = lldQuestions.find((item) => item.slug === slug);

  return (
    <>
      {q && (
        <>
          {/* Schema.org TechArticle JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "TechArticle",
                "headline": `${q.title} — Low Level Design Blueprint`,
                "description": q.summary,
                "educationalLevel": q.difficulty,
                "url": `https://beingsde.in/lld/${q.slug}`,
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
                    "url": "https://beingsde.in/images/redis-caching-diagram.png"
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
                    "name": "Low-Level Design",
                    "item": "https://beingsde.in/lld"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": q.title,
                    "item": `https://beingsde.in/lld/${q.slug}`
                  }
                ]
              })
            }}
          />
        </>
      )}
      <LldDetailClient slug={slug} initialQuestion={q} />
    </>
  );
}
