import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import HeaderAuth from "@/components/HeaderAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "beingsde.com | Master System Design",
  description: "A premium interactive learning platform to master HLD, LLD, and scale distributed architectures.",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-full flex flex-col bg-[#fafafa] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa] antialiased grid-bg`}
      >
        {/* Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-[#fafafa]/80 dark:bg-[#09090b]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-tight font-mono border border-zinc-900 dark:border-zinc-100 px-2 py-0.5 rounded-sm hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all duration-300">
                beingsde
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/topics" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Topics
              </Link>
              <Link href="/subscriptions" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                Subscriptions
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
        <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-8 bg-[#fafafa]/50 dark:bg-[#09090b]/50">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500">
            <div>
              &copy; {new Date().getFullYear()} beingsde.com. All rights reserved. Built for System Architects.
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
