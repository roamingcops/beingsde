"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Award,
  TrendingUp,
  FileCode2,
  Terminal,
  Users,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Info,
  Mail,
  Zap
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const navLinkClass = (path: string) =>
    `whitespace-nowrap text-xs uppercase tracking-wider font-mono transition-colors py-1 ${
      isActive(path)
        ? "text-zinc-950 dark:text-zinc-50 font-bold border-b-2 border-zinc-900 dark:border-zinc-100"
        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    }`;

  const isDropdownActive = [
    "/bar-raiser",
    "/promotion-doc",
    "/cheat-sheet",
    "/fde",
    "/interviews",
    "/editorial-policy",
    "/about",
    "/contact"
  ].some((path) => pathname.startsWith(path));

  return (
    <nav className="hidden md:flex items-center gap-5 lg:gap-7">
      {/* 1. HLD Topics */}
      <Link href="/topics" className={navLinkClass("/topics")}>
        HLD
      </Link>

      {/* 2. LLD Blueprints */}
      <Link href="/lld" className={navLinkClass("/lld")}>
        LLD
      </Link>

      {/* 3. Questions */}
      <Link href="/questions" className={navLinkClass("/questions")}>
        Questions
      </Link>

      {/* 4. DSA Patterns */}
      <Link href="/dsa" className={navLinkClass("/dsa")}>
        DSA
      </Link>

      {/* 5. Case Studies */}
      <Link
        href="/guides"
        className={`whitespace-nowrap text-xs uppercase tracking-wider font-mono transition-colors py-1 flex items-center gap-1.5 ${
          isActive("/guides")
            ? "text-zinc-950 dark:text-zinc-50 font-bold border-b-2 border-zinc-900 dark:border-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        <span>Case Studies</span>
        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-900">
          Deep
        </span>
      </Link>

      {/* 6. Resources & Career Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`whitespace-nowrap text-xs uppercase tracking-wider font-mono transition-colors py-1 flex items-center gap-1 cursor-pointer focus:outline-none ${
            isDropdownActive
              ? "text-zinc-950 dark:text-zinc-50 font-bold border-b-2 border-zinc-900 dark:border-zinc-100"
              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <span>More</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu Modal */}
        {dropdownOpen && (
          <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-3 w-80 sm:w-96 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-3">
              {/* Career & Interview Section */}
              <div className="flex flex-col gap-1">
                <span className="text-3xs font-mono uppercase tracking-widest text-zinc-400 font-bold px-2 py-0.5">
                  Career &amp; Interview Prep
                </span>

                <Link
                  href="/bar-raiser"
                  className="flex items-start gap-2.5 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <Award className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                        Bar Raiser
                      </span>
                      <span className="text-[9px] font-bold px-1 py-0.2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded border border-rose-200 dark:border-rose-900">
                        STAR
                      </span>
                    </div>
                    <span className="text-3xs text-zinc-500">
                      Amazon Leadership Principles &amp; calibrated answers
                    </span>
                  </div>
                </Link>

                <Link
                  href="/promotion-doc"
                  className="flex items-start gap-2.5 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        Promotion Guide
                      </span>
                      <span className="text-[9px] font-bold px-1 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-900">
                        Framework
                      </span>
                    </div>
                    <span className="text-3xs text-zinc-500">
                      Staff &amp; Senior engineering promotion doc template
                    </span>
                  </div>
                </Link>

                <Link
                  href="/interviews"
                  className="flex items-start gap-2.5 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Mock Interviews
                    </span>
                    <span className="text-3xs text-zinc-500">
                      1-on-1 architecture practice with Staff interviewers
                    </span>
                  </div>
                </Link>
              </div>

              {/* Reference & System Tools */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-1">
                <span className="text-3xs font-mono uppercase tracking-widest text-zinc-400 font-bold px-2 py-0.5">
                  Reference &amp; Standards
                </span>

                <Link
                  href="/cheat-sheet"
                  className="flex items-start gap-2.5 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      System Design Cheat Sheet
                    </span>
                    <span className="text-3xs text-zinc-500">
                      Latency numbers, database matrices &amp; formulas
                    </span>
                  </div>
                </Link>

                <Link
                  href="/fde"
                  className="flex items-start gap-2.5 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <Terminal className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      FDE Role Guide
                    </span>
                    <span className="text-3xs text-zinc-500">
                      Forward Deployed Engineering career &amp; interview roadmap
                    </span>
                  </div>
                </Link>

                <Link
                  href="/editorial-policy"
                  className="flex items-start gap-2.5 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group"
                >
                  <ShieldCheck className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      Editorial Policy
                    </span>
                    <span className="text-3xs text-zinc-500">
                      Fact-checking standards, author credentials &amp; errata
                    </span>
                  </div>
                </Link>
              </div>

              {/* Bottom Quick Links */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-2 text-2xs text-zinc-500">
                <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
                  <Info className="w-3 h-3" /> About Us
                </Link>
                <span>•</span>
                <Link href="/contact" className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Contact
                </Link>
                <span>•</span>
                <Link href="/support" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
