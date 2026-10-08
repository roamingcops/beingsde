import type { Metadata } from "next";
import { notFound } from "next/navigation";
import defaultHldQuestions from "@/data/hld-questions.json";
import QuestionDetailClient from "@/components/QuestionDetailClient";

export async function generateStaticParams() {
  return defaultHldQuestions.map((q) => ({
    slug: q.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const question = defaultHldQuestions.find((q) => q.slug === resolvedParams.slug);

  if (!question) {
    return {
      title: "System Design Interview Question | Being SDE (beingsde.in)",
      description: "Master distributed systems, HLD architecture trade-offs, and FAANG interview questions on Being SDE.",
    };
  }

  const title = `${question.title} — System Design Interview Answer & Trade-offs | beingsde.in`;
  const description =
    question.summary ||
    `Complete architectural answer to: ${question.title}. Covers ${question.category}, scalability trade-offs, and FAANG system design criteria.`;

  return {
    title,
    description,
    keywords: [
      question.title,
      `${question.title} system design`,
      `${question.title} interview question`,
      question.category,
      "HLD interview answer",
      "system design trade-offs",
      "FAANG system design",
      "beingsde",
      "beingsde.in",
    ],
    alternates: {
      canonical: `https://beingsde.in/questions/${question.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://beingsde.in/questions/${question.slug}`,
      type: "article",
      siteName: "Being SDE (beingsde.in)",
      images: [
        {
          url: "/images/redis-caching-diagram.png",
          width: 1200,
          height: 630,
          alt: `${question.title} — System Design Architecture Diagram`,
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

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const question = defaultHldQuestions.find((q) => q.slug === slug);

  if (!question) {
    notFound();
  }

  // Schema.org QAPage JSON-LD for Google rich snippet display
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    "mainEntity": {
      "@type": "Question",
      "name": question.title,
      "text": question.title,
      "answerCount": 1,
      "upvoteCount": 64,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": question.contentMarkdown.slice(0, 1500).replace(/[#*`]/g, ""),
        "url": `https://beingsde.in/questions/${question.slug}#answer`,
        "author": {
          "@type": "Organization",
          "name": "Being SDE",
          "url": "https://beingsde.in",
        },
      },
    },
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
        "name": "HLD Questions",
        "item": "https://beingsde.in/questions",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": question.title,
        "item": `https://beingsde.in/questions/${question.slug}`,
      },
    ],
  };

  // Schema.org TechArticle JSON-LD
  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": `${question.title} — System Design Architecture Guide`,
    "description": question.summary,
    "articleSection": question.category,
    "educationalLevel": question.difficulty,
    "url": `https://beingsde.in/questions/${question.slug}`,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <QuestionDetailClient slug={slug} initialQuestion={question} />
    </>
  );
}
