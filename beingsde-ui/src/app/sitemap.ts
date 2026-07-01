import { MetadataRoute } from "next";
import MOCK_TOPICS from "../data/topics.json";
import lldQuestions from "../data/lld.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://beingsde.in";

  // Base routes
  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/topics", priority: 0.95 },
    { path: "/lld", priority: 0.90 },
    { path: "/questions", priority: 0.90 },
    { path: "/dsa", priority: 0.85 },
    { path: "/cheat-sheet", priority: 0.85 },
    { path: "/interviews", priority: 0.80 },
    { path: "/subscriptions", priority: 0.75 },
    { path: "/login", priority: 0.5 },
    { path: "/register", priority: 0.5 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    { path: "/support", priority: 0.4 },
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

  return [...staticRoutes, ...topicRoutes, ...lldRoutes];
}
