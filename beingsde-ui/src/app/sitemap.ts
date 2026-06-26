import { MetadataRoute } from "next";
import MOCK_TOPICS from "../data/topics.json";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://beingsde.in";

  // Base routes
  const staticRoutes = [
    "",
    "/topics",
    "/subscriptions",
    "/interviews",
    "/login",
    "/register",
    "/privacy",
    "/terms",
    "/support"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/topics" ? 0.9 : 0.6,
  }));

  // Dynamic topic routes
  const topicRoutes = MOCK_TOPICS.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...topicRoutes];
}
