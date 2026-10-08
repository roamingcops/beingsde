import { MetadataRoute } from "next";
import MOCK_TOPICS from "../data/topics.json";
import lldQuestions from "../data/lld.json";
import defaultHldQuestions from "../data/hld-questions.json";
import defaultDsaQuestions from "../data/dsa.json";
import guides from "../data/guides.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://beingsde.in";

  // Base routes
  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/topics", priority: 0.95 },
    { path: "/guides", priority: 0.95 },
    { path: "/lld", priority: 0.90 },
    { path: "/questions", priority: 0.90 },
    { path: "/dsa", priority: 0.90 },
    { path: "/bar-raiser", priority: 0.90 },
    { path: "/promotion-doc", priority: 0.90 },
    { path: "/fde", priority: 0.85 },
    { path: "/cheat-sheet", priority: 0.85 },
    { path: "/interviews", priority: 0.80 },
    { path: "/about", priority: 0.75 },
    { path: "/editorial-policy", priority: 0.70 },
    { path: "/contact", priority: 0.70 },
    { path: "/privacy", priority: 0.40 },
    { path: "/terms", priority: 0.40 },
    { path: "/disclaimer", priority: 0.40 },
    { path: "/support", priority: 0.40 },
  ].map(({ path, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));

  // Dynamic topic routes — high priority (0.85) for all content pages
  const topicRoutes = MOCK_TOPICS.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: topic.isPremium ? 0.80 : 0.85,
  }));

  // Dynamic LLD routes — high priority (0.85) for article pages
  const lldRoutes = lldQuestions.map((q) => ({
    url: `${baseUrl}/lld/${q.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Dynamic HLD Question routes — high priority (0.85) for specific interview answers
  const hldRoutes = defaultHldQuestions.map((q) => ({
    url: `${baseUrl}/questions/${q.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Dynamic DSA Problem routes — high priority (0.85) for algorithmic solutions
  const dsaRoutes = defaultDsaQuestions.map((q) => ({
    url: `${baseUrl}/dsa/${q.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Dynamic Case Study Guide routes — high priority (0.90) for long-form case studies
  const guideRoutes = guides.map((g) => ({
    url: `${baseUrl}/guides/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.90,
  }));

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...lldRoutes,
    ...hldRoutes,
    ...dsaRoutes,
    ...guideRoutes,
  ];
}
