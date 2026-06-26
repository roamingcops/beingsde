import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Design Topics Directory | beingsde.in",
  description: "Browse 60+ comprehensive High-Level Design (HLD) and Low-Level Design (LLD) system design topics. Learn caching, database scaling, consistent hashing, load balancing, and more.",
  alternates: {
    canonical: "https://beingsde.in/topics",
  },
  openGraph: {
    title: "System Design Topics Directory | beingsde.in",
    description: "Browse 60+ comprehensive High-Level Design (HLD) and Low-Level Design (LLD) system design topics. Learn caching, database scaling, consistent hashing, load balancing, and more.",
    url: "https://beingsde.in/topics",
  },
};

export default function TopicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
