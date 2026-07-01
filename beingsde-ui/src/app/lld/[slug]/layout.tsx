import type { Metadata } from "next";
import lldQuestions from "@/data/lld.json";

interface LLDQuestion {
  id: number;
  title: string;
  slug: string;
  difficulty: string;
  tag: string;
  patterns: string[];
  summary: string;
  requirements: string[];
  erDiagram: string;
  classes: string[];
  languages: {
    java: string;
    cpp: string;
    python: string;
  };
  approach: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const question = (lldQuestions as LLDQuestion[]).find((q) => q.slug === slug);

  if (!question) {
    return {
      title: "Low-Level Design (LLD) Exercise | beingsde.in",
      description: "Practice object-oriented design problems on beingsde.in.",
    };
  }

  const cleanTitle = question.title.replace(/[\n\r]/g, " ").trim();
  const cleanSummary = question.summary.replace(/[\n\r]/g, " ").trim();
  const lldKeywords = [
    cleanTitle,
    question.tag,
    ...question.patterns,
    "low level design",
    "LLD",
    "object oriented design",
    "OOD",
    "software design patterns",
    "beingsde",
    "beingsde.in",
    `${cleanTitle} LLD`,
    `${cleanTitle} class diagram`,
    "concurrency in OOD",
    "Java LLD code",
    "Python OOD code"
  ];

  return {
    title: `${cleanTitle} — Low-Level Design (LLD) | Being SDE (beingsde.in)`,
    description: `${cleanSummary} Comprehensive LLD case study with functional scope, ER schemas, and complete Java, C++, and Python code skeletons on Being SDE.`,
    keywords: lldKeywords,
    authors: [{ name: "beingsde Team", url: "https://beingsde.in" }],
    alternates: {
      canonical: `https://beingsde.in/lld/${slug}`,
    },
    openGraph: {
      title: `${cleanTitle} — Low-Level Design (LLD) | Being SDE`,
      description: `${cleanSummary} Detailed LLD solutions featuring design patterns, entity relationships, and multi-language codebase skeletons.`,
      url: `https://beingsde.in/lld/${slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} LLD Blueprint | Being SDE`,
      description: `${cleanSummary} Practice LLD questions with clean OOP blueprints on Being SDE.`,
      images: ["/images/redis-caching-diagram.png"],
      creator: "@beingsde",
    },
  };
}

export async function generateStaticParams() {
  return (lldQuestions as LLDQuestion[]).map((q) => ({ slug: q.slug }));
}

export default function LldDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <LldStructuredData params={params} />
      {children}
    </>
  );
}

// Server component that injects per-LLD JSON-LD into <head>
async function LldStructuredData({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = (lldQuestions as LLDQuestion[]).find((q) => q.slug === slug);
  if (!question) return null;

  const cleanTitle = question.title.replace(/[\n\r]/g, " ").trim();
  const cleanSummary = question.summary.replace(/[\n\r]/g, " ").trim();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `https://beingsde.in/lld/${slug}#article`,
        "headline": cleanTitle,
        "description": cleanSummary,
        "url": `https://beingsde.in/lld/${slug}`,
        "inLanguage": "en-US",
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
        "about": [
          {
            "@type": "Thing",
            "name": "Low-Level Design"
          },
          {
            "@type": "Thing",
            "name": "Object-Oriented Design"
          },
          {
            "@type": "Thing",
            "name": "Design Patterns"
          }
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
