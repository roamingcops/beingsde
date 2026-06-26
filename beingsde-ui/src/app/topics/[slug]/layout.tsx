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
    };
  }

  const cleanTitle = topic.title.replace(/[\n\r]/g, " ").trim();
  const cleanDescription = topic.description.replace(/[\n\r]/g, " ").trim();

  return {
    title: `${cleanTitle} | beingsde.in`,
    description: cleanDescription,
    alternates: {
      canonical: `https://beingsde.in/topics/${slug}`,
    },
    openGraph: {
      title: `${cleanTitle} | beingsde.in`,
      description: cleanDescription,
      url: `https://beingsde.in/topics/${slug}`,
      type: "article",
      images: topic.imageUrl
        ? [{ url: topic.imageUrl }]
        : [{ url: "/images/redis-caching-diagram.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | beingsde.in`,
      description: cleanDescription,
      images: topic.imageUrl ? [topic.imageUrl] : ["/images/redis-caching-diagram.png"],
    },
  };
}

export default function TopicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
