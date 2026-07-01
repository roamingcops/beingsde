import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | beingsde.in",
  description: "Recover or reset your beingsde.in account password.",
  alternates: {
    canonical: "https://beingsde.in/forgot",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
