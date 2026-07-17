import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderAuth from "@/components/HeaderAuth";
import MobileMenu from "@/components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beingsde.in"),
  title: {
    default: "Being SDE — #1 System Design Interview Prep Platform | beingsde.in",
    template: "%s | Being SDE (beingsde.in)"
  },
  description: "Being SDE (beingsde.in) is the leading interactive platform to master System Design interviews — HLD, LLD, distributed databases, caching, Kafka, consistent hashing, and sharding. Used by engineers at Google, Amazon, Meta, and top startups.",
  keywords: [
    "beingsde",
    "beingsde.in",
    "being sde",
    "beingsde system design",
    "system design interview prep",
    "system design interview questions",
    "high level design HLD",
    "low level design LLD",
    "distributed systems tutorial",
    "system design guide 2024",
    "FAANG system design interview",
    "software engineering scalability",
    "database sharding tutorial",
    "consistent hashing explained",
    "Redis caching architecture",
    "Kafka event streaming design",
    "SQL vs NoSQL comparison",
    "CAP theorem explained",
    "microservices system design",
    "load balancing architecture",
    "rate limiter design",
    "system design for beginners",
    "staff engineer interview prep",
    "principal engineer interview",
    "system design mock interview",
    "beingsde interview",
    "beingsde topics",
    "beingsde questions"
  ],
  authors: [{ name: "beingsde Team", url: "https://beingsde.in" }],
  creator: "beingsde",
  publisher: "beingsde",
  category: "Education",
  classification: "System Design Interview Preparation",
  verification: {
    google: "_-ZX6XQ6EPuXzDaJ0G4lrwySkbdYDvTrm9G_LhPinug",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://beingsde.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beingsde.in",
    title: "Being SDE — #1 System Design Interview Prep Platform | beingsde.in",
    description: "Master High-Level Design (HLD), Low-Level Design (LLD), database sharding, caching, and scalable architecture. The most comprehensive system design learning platform for FAANG interviews by Being SDE.",
    siteName: "Being SDE (beingsde.in)",
    images: [
      {
        url: "/images/redis-caching-diagram.png",
        width: 1200,
        height: 630,
        alt: "Being SDE - System Design Architecture Diagrams & Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Being SDE — Master System Design Interviews | beingsde.in",
    description: "The #1 interactive system design prep platform. Learn HLD, LLD, databases, caching, Kafka, consistent hashing with real-world blueprints on Being SDE.",
    images: ["/images/redis-caching-diagram.png"],
    creator: "@beingsde",
    site: "@beingsde",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
        {/* Organization JSON-LD — tells Google this is a real educational brand */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://beingsde.in/#organization",
                  "name": "Being SDE",
                  "alternateName": "beingsde",
                  "url": "https://beingsde.in",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://beingsde.in/images/redis-caching-diagram.png",
                    "width": 1200,
                    "height": 630
                  },
                  "description": "Being SDE (beingsde.in) is the leading system design interview preparation platform for software engineers. Learn HLD, LLD, distributed systems, caching, and database architecture.",
                  "sameAs": [
                    "https://beingsde.in"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://beingsde.in/#website",
                  "url": "https://beingsde.in",
                  "name": "Being SDE",
                  "alternateName": "beingsde.in",
                  "description": "The #1 interactive system design interview preparation platform by Being SDE, covering HLD, LLD, distributed databases, caching, Kafka, and scalability patterns.",
                  "publisher": { "@id": "https://beingsde.in/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": { "@type": "EntryPoint", "urlTemplate": "https://beingsde.in/topics?q={search_term_string}" },
                    "query-input": "required name=search_term_string"
                  },
                  "inLanguage": "en-US"
                },
                {
                  "@type": "EducationalOrganization",
                  "@id": "https://beingsde.in/#edu",
                  "name": "Being SDE — System Design Academy",
                  "url": "https://beingsde.in",
                  "description": "Interactive system design learning by Being SDE for software engineers preparing for FAANG, MAANG, and top-tier tech company interviews.",
                  "teaches": [
                    "System Design",
                    "High Level Design",
                    "Low Level Design",
                    "Distributed Systems",
                    "Database Architecture",
                    "Caching Strategies",
                    "Consistent Hashing",
                    "Kafka Event Streaming",
                    "Microservices Design"
                  ]
                }
              ]
            })
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7739167548285591"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-full flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa] antialiased grid-bg`}
      >
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-[#fafafa]/80 dark:bg-[#09090b]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MobileMenu />
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-xl font-bold tracking-tight font-mono border border-zinc-900 dark:border-zinc-100 px-2 py-0.5 rounded-sm hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all duration-300">
                  beingsde
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/topics" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                HLD
              </Link>
              <Link href="/lld" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                LLD
              </Link>
              <Link href="/fde" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                FDE
              </Link>
              <Link href="/questions" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                TOP HLD Questions
              </Link>
              <Link href="/dsa" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                DSA
              </Link>
              <Link href="/interviews" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Mock Interviews
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <HeaderAuth />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-8 bg-[#fafafa]/50 dark:bg-[#09090b]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-500">
            <div className="text-center md:text-left">
              &copy; {new Date().getFullYear()} beingsde.in. All rights reserved. Built for System Architects.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Terms of Service</Link>
              <Link href="/support" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Support</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
