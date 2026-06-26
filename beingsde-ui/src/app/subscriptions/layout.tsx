import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Subscriptions & Plans | beingsde.in",
  description: "Get unlimited access to premium system design content, interactive mock interviews, Excalidraw templates, and architectural checklists.",
  alternates: {
    canonical: "https://beingsde.in/subscriptions",
  },
  openGraph: {
    title: "Premium Subscriptions & Plans | beingsde.in",
    description: "Get unlimited access to premium system design content, interactive mock interviews, Excalidraw templates, and architectural checklists.",
    url: "https://beingsde.in/subscriptions",
  },
};

export default function SubscriptionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
