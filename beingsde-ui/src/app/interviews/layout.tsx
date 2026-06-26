import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mock System Design Interviews | beingsde.in",
  description: "Schedule structured system design mock interviews with FAANG Staff Engineers. Receive detailed rubric scoring, constructive feedback, and prep recommendations.",
  alternates: {
    canonical: "https://beingsde.in/interviews",
  },
  openGraph: {
    title: "Mock System Design Interviews | beingsde.in",
    description: "Schedule structured system design mock interviews with FAANG Staff Engineers. Receive detailed rubric scoring, constructive feedback, and prep recommendations.",
    url: "https://beingsde.in/interviews",
  },
};

export default function InterviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
