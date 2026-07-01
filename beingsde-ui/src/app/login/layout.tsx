import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In to Your Account | beingsde.in",
  description: "Log in to beingsde.in to access your system design interview prep, custom mock interviews, and bookmarks.",
  alternates: {
    canonical: "https://beingsde.in/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
