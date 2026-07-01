import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | beingsde.in",
  description: "Choose a new secure password for your beingsde.in account.",
  alternates: {
    canonical: "https://beingsde.in/reset-password",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
