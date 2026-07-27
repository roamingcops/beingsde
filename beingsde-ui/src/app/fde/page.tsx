import type { Metadata } from "next";
import FdeClient from "@/components/FdeClient";

export const metadata: Metadata = {
  title: "Forward Deployed Engineer (FDE) Role & Interview Guide | beingsde.in",
  description: "Complete career and interview guide for Forward Deployed Engineers (FDE). Learn system architecture, client integrations, enterprise data pipelines, and technical leadership at Palantir, Snowflake, and top tech companies.",
  keywords: [
    "Forward Deployed Engineer",
    "FDE role explained",
    "FDE interview preparation",
    "Palantir FDE interview",
    "Snowflake solutions engineer",
    "Forward Deployed Engineering architecture",
    "solutions architect vs FDE",
    "beingsde fde",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/fde",
  },
  openGraph: {
    title: "Forward Deployed Engineer (FDE) Role & Interview Guide | beingsde.in",
    description: "Complete career and interview guide for Forward Deployed Engineers (FDE).",
    url: "https://beingsde.in/fde",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forward Deployed Engineer Guide | beingsde.in",
    description: "Master the FDE role and interview process for software engineers.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function FdePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Forward Deployed Engineer (FDE) Complete Role & Interview Guide",
    "description": "Comprehensive analysis of Forward Deployed Engineering responsibilities, client architecture, and interview prep.",
    "url": "https://beingsde.in/fde",
    "publisher": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <FdeClient />
    </>
  );
}
