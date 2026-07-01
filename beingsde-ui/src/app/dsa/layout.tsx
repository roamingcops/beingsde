import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top DSA Interview Questions – Data Structures & Algorithms | beingsde.in",
  description:
    "Master the top 40–50 Data Structures and 40–50 Algorithm interview questions at medium difficulty. Covers arrays, linked lists, trees, graphs, sorting, dynamic programming, sliding window, and more.",
  keywords: [
    "DSA interview questions",
    "data structures questions",
    "algorithm questions",
    "medium DSA problems",
    "array interview questions",
    "linked list problems",
    "binary tree questions",
    "graph algorithms interview",
    "dynamic programming questions",
    "sorting algorithms interview",
    "sliding window technique",
    "two pointers technique",
    "heap interview questions",
    "stack queue problems",
    "hash map interview",
    "binary search questions",
    "recursion backtracking",
    "greedy algorithm problems",
    "FAANG DSA questions",
    "beingsde DSA",
  ],
  alternates: {
    canonical: "https://beingsde.in/dsa",
  },
  openGraph: {
    title: "Top DSA Interview Questions – Data Structures & Algorithms | beingsde.in",
    description:
      "Comprehensive medium-level DSA questions covering Data Structures and Algorithms, with key concepts and approach hints for every question.",
    url: "https://beingsde.in/dsa",
    type: "website",
    siteName: "beingsde.in",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top DSA Interview Questions | beingsde.in",
    description:
      "Top 40–50 medium-level Data Structures and Algorithm questions with hints and patterns — perfect for FAANG interview prep.",
    creator: "@beingsde",
  },
};

export default function DsaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
