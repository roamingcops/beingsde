"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const links = [
    { href: "/topics", label: "HLD Topics" },
    { href: "/guides", label: "Case Studies (Deep Dives)" },
    { href: "/lld", label: "LLD Blueprints" },
    { href: "/questions", label: "TOP HLD Questions" },
    { href: "/dsa", label: "DSA Patterns" },
    { href: "/fde", label: "FDE Role Guide" },
    { href: "/cheat-sheet", label: "Cheat Sheet" },
    { href: "/bar-raiser", label: "Bar Raiser STAR Answers" },
    { href: "/promotion-doc", label: "Year-End Promotion Guide" },
    { href: "/editorial-policy", label: "Editorial Policy" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/disclaimer", label: "Disclaimer" },
  ];

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={toggleMenu}
        className="p-2 -mr-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full h-[calc(100vh-64px)] z-40 bg-[#fafafa] dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-800 flex flex-col p-6 overflow-y-auto pb-20 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-6">
            {/* System Design */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                System Design
              </span>
              <div className="flex flex-col gap-1 pl-1">
                <Link
                  href="/topics"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  HLD Topics (73 blueprints)
                </Link>
                <Link
                  href="/guides"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Case Studies (Deep Dives)
                </Link>
                <Link
                  href="/questions"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  60+ HLD Questions
                </Link>
                <Link
                  href="/cheat-sheet"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  SDE Cheat Sheet
                </Link>
              </div>
            </div>

            {/* Code & Patterns */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Code &amp; Patterns
              </span>
              <div className="flex flex-col gap-1 pl-1">
                <Link
                  href="/lld"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Low-Level Design (LLD)
                </Link>
                <Link
                  href="/dsa"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                  DSA Problem Patterns (90 problems)
                </Link>
              </div>
            </div>

            {/* Career & Prep */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Career &amp; Prep
              </span>
              <div className="flex flex-col gap-1 pl-1">
                <Link
                  href="/interviews"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Mock Interviews
                </Link>
                <Link
                  href="/bar-raiser"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                >
                  Bar Raiser STAR Answers
                </Link>
                <Link
                  href="/promotion-doc"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Promotion Guide
                </Link>
                <Link
                  href="/fde"
                  className="py-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  FDE Role Guide
                </Link>
              </div>
            </div>

            {/* Company & Resources */}
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Company &amp; Legal
              </span>
              <div className="grid grid-cols-2 gap-1 pl-1">
                <Link
                  href="/about"
                  className="py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/editorial-policy"
                  className="py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Editorial Policy
                </Link>
                <Link
                  href="/privacy"
                  className="py-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
