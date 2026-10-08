import type { Metadata } from "next";
import { notFound } from "next/navigation";
import defaultDsaQuestions from "@/data/dsa.json";
import DsaDetailClient from "@/components/DsaDetailClient";

export async function generateStaticParams() {
  return defaultDsaQuestions.map((q) => ({
    slug: q.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const question = defaultDsaQuestions.find((q) => q.slug === resolvedParams.slug);

  if (!question) {
    return {
      title: "DSA Coding Interview Pattern | Being SDE (beingsde.in)",
      description: "Master essential Data Structures & Algorithms patterns and optimal problem-solving approaches on Being SDE.",
    };
  }

  const title = `${question.title} — Optimal Solution & Complexity Analysis | beingsde.in`;
  const description = `${question.summary} Optimal algorithmic approach with ${question.timeComplexity} time and ${question.spaceComplexity} space complexity using the ${question.pattern} pattern on Being SDE.`;

  return {
    title,
    description,
    keywords: [
      question.title,
      `${question.tag} algorithm`,
      `${question.pattern} pattern`,
      "coding interview solution",
      "time complexity",
      "space complexity",
      "FAANG coding interview",
      "beingsde dsa",
      "beingsde.in",
    ],
    alternates: {
      canonical: `https://beingsde.in/dsa/${question.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://beingsde.in/dsa/${question.slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [
        {
          url: "/images/redis-caching-diagram.png",
          width: 1200,
          height: 630,
          alt: `${question.title} — Algorithm Architecture Diagram`,
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

export default async function DsaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const question = defaultDsaQuestions.find((q) => q.slug === slug);

  if (!question) {
    notFound();
  }

  // Schema.org TechArticle JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${question.title} — Algorithmic Solution & Pattern Breakdown`,
    "description": question.summary,
    "articleSection": question.tag,
    "educationalLevel": question.difficulty,
    "url": `https://beingsde.in/dsa/${question.slug}`,
    "author": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://beingsde.in/logo.png",
      },
    },
    "inLanguage": "en-US",
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
        "item": "https://beingsde.in",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "DSA Patterns",
        "item": "https://beingsde.in/dsa",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": question.title,
        "item": `https://beingsde.in/dsa/${question.slug}`,
      },
    ],
  };

  // Schema.org QAPage JSON-LD
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question.title,
      "text": question.summary,
      "answerCount": 1,
      "upvoteCount": 48,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${question.approach}\n\nTime Complexity: ${question.timeComplexity}\nSpace Complexity: ${question.spaceComplexity}`,
        "url": `https://beingsde.in/dsa/${question.slug}#approach`,
        "author": {
          "@type": "Organization",
          "name": "Being SDE",
          "url": "https://beingsde.in",
        },
      },
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />
      <DsaDetailClient slug={slug} initialQuestion={question as any} />
    </>
  );
}
