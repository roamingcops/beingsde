import type { Metadata } from "next";
import PromotionDocClient from "@/components/PromotionDocClient";

export const metadata: Metadata = {
  title: "How to Fill the SDE Year-End Promotion Document (Exceeds Expectations Guide) | beingsde.in",
  description:
    "Master the Software Engineer Year-End Promotion doc. Proven STAR-I templates for SDE1, SDE2, Senior SDE, and Staff engineers. Learn how to justify key features, quantify defect-free quality, showcase toil automation, prove customer obsession, and document continuous 1:1 growth.",
  keywords: [
    "how to fill year end promotion doc",
    "software engineer promotion packet",
    "SDE promotion doc template",
    "amazon sde promotion doc",
    "exceeds expectations performance review",
    "senior software engineer promotion guide",
    "quantifying software engineering impact",
    "deployment owner checklist",
    "1 on 1 feedback tracking engineer",
    "toil automation ROI",
    "beingsde promotion doc",
    "beingsde.in"
  ],
  alternates: {
    canonical: "https://beingsde.in/promotion-doc",
  },
  openGraph: {
    title: "How to Fill the SDE Year-End Promotion Document | beingsde.in",
    description:
      "A masterclass on crafting an Exceeds Expectations promotion packet: ticket justification, zero-defect metrics, toil automation, and 1:1 continuous feedback loops.",
    url: "https://beingsde.in/promotion-doc",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SDE Year-End Promotion Doc Blueprint | beingsde.in",
    description:
      "Proven templates and frameworks to justify key features, quantify engineering quality, and secure an Exceeds Expectations rating.",
    images: ["/images/redis-caching-diagram.png"],
  },
};

export default function PromotionDocPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "How to Fill the Software Engineer Year-End Promotion Document",
    "description":
      "Comprehensive architectural and performance review guide for software engineers aiming for SDE-2, Senior SDE, and Staff promotions.",
    "url": "https://beingsde.in/promotion-doc",
    "author": {
      "@type": "Organization",
      "name": "Being SDE",
      "url": "https://beingsde.in"
    },
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
      <PromotionDocClient />
    </>
  );
}
