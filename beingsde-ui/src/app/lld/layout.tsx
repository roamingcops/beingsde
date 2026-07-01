import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top LLD Interview Questions & Answers — Object-Oriented Design | Being SDE (beingsde.in)",
  description:
    "Master standard Low-Level Design (LLD) and Object-Oriented Design (OOD) interview questions — Parking Lot, Movie Ticket Booking, Elevator System, and Splitwise with design patterns and Java code skeletons.",
  alternates: {
    canonical: "https://beingsde.in/lld",
  },
  openGraph: {
    title: "Top LLD Interview Questions & Answers — Object-Oriented Design | Being SDE (beingsde.in)",
    description:
      "Comprehensive design templates, code skeletons, and patterns for standard Low-Level Design (LLD) interview questions.",
    url: "https://beingsde.in/lld",
    siteName: "Being SDE (beingsde.in)",
    images: [{ url: "/images/redis-caching-diagram.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Low-Level Design (LLD) Interview Practice | Being SDE",
    description:
      "Interactive Low-Level Design (LLD) walkthroughs including class structures and pattern summaries.",
    images: ["/images/redis-caching-diagram.png"],
    creator: "@beingsde",
  },
};

export default function LldLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
