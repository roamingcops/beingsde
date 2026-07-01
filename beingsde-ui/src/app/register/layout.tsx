import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account | beingsde.in",
  description: "Join beingsde.in today. Get started with High-Level and Low-Level system design guides, mock interviews, and advanced curriculum.",
  alternates: {
    canonical: "https://beingsde.in/register",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
