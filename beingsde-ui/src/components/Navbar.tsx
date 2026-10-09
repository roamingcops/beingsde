"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Layers,
  BookOpen,
  HelpCircle,
  Zap,
  Code2,
  GitBranch,
  Users,
  Award,
  TrendingUp,
  Terminal,
  ShieldCheck,
  Sparkles
} from "lucide-react";

type MenuKey = "system" | "code" | "career" | null;

export default function Navbar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close menus on route change
  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (menu: MenuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const toggleMenu = (menu: MenuKey) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Active status checks for categories
  const isSystemActive = [
    "/topics",
    "/guides",
    "/questions",
    "/cheat-sheet"
  ].some((path) => pathname.startsWith(path));

  const isCodeActive = [
    "/lld",
    "/dsa"
  ].some((path) => pathname.startsWith(path));

  const isCareerActive = [
    "/interviews",
    "/bar-raiser",
    "/promotion-doc",
    "/fde"
  ].some((path) => pathname.startsWith(path));

  const isLinkActive = (path: string) => pathname.startsWith(path);

  const getMenuButtonClass = (isActive: boolean, isOpen: boolean) =>
    `whitespace-nowrap text-xs uppercase tracking-wider font-mono transition-colors py-1.5 px-1 flex items-center gap-1 cursor-pointer focus:outline-none ${
      isActive || isOpen
        ? "text-zinc-950 dark:text-zinc-50 font-bold border-b-2 border-zinc-900 dark:border-zinc-100"
        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    }`;

  return (
    <nav
      ref={navRef}
      className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0 relative"
      onMouseLeave={handleMouseLeave}
    >
      {/* ─────────────────────────────────────────────────────────── */}
      {/* CATEGORY 1: SYSTEM DESIGN                                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("system")}
      >
        <button
          onClick={() => toggleMenu("system")}
          className={getMenuButtonClass(isSystemActive, activeMenu === "system")}
          aria-expanded={activeMenu === "system"}
          aria-haspopup="true"
        >
          <span>System Design</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMenu === "system" ? "rotate-180" : ""
            }`}
          />
        </button>

        {activeMenu === "system" && (
          <div className="absolute left-0 top-full mt-2 w-80 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-1">
              <span className="text-3xs font-mono uppercase tracking-widest text-zinc-400 font-bold px-2 py-1">
                Architecture &amp; Scalability
              </span>

              {/* HLD Topics */}
              <Link
                href="/topics"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/topics") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    HLD Topics
                  </span>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    73 distributed systems &amp; caching blueprints
                  </span>
                </div>
              </Link>

              {/* Case Studies */}
              <Link
                href="/guides"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/guides") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Case Studies
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-900">
                      Deep
                    </span>
                  </div>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    10 deep dives: Netflix, Uber, Discord, YouTube &amp; Stripe
                  </span>
                </div>
              </Link>

              {/* 60+ HLD Questions */}
              <Link
                href="/questions"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/questions") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    60+ HLD Questions
                  </span>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    Sharding, Kafka, and trade-off Q&amp;As
                  </span>
                </div>
              </Link>

              {/* SDE Cheat Sheet */}
              <Link
                href="/cheat-sheet"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/cheat-sheet") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-rose-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                    SDE Cheat Sheet
                  </span>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    Latency numbers, capacity formulas &amp; matrix
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CATEGORY 2: CODE & PATTERNS                                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("code")}
      >
        <button
          onClick={() => toggleMenu("code")}
          className={getMenuButtonClass(isCodeActive, activeMenu === "code")}
          aria-expanded={activeMenu === "code"}
          aria-haspopup="true"
        >
          <span>Code &amp; Patterns</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMenu === "code" ? "rotate-180" : ""
            }`}
          />
        </button>

        {activeMenu === "code" && (
          <div className="absolute left-0 top-full mt-2 w-80 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-1">
              <span className="text-3xs font-mono uppercase tracking-widest text-zinc-400 font-bold px-2 py-1">
                Software Design &amp; DSA
              </span>

              {/* LLD Blueprints */}
              <Link
                href="/lld"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/lld") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <Code2 className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Low-Level Design (LLD)
                  </span>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    27 OOP blueprints with UML diagrams &amp; code
                  </span>
                </div>
              </Link>

              {/* DSA Patterns */}
              <Link
                href="/dsa"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/dsa") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <GitBranch className="w-4 h-4 text-teal-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    DSA Problem Patterns
                  </span>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    90 optimal algorithmic solutions &amp; complexity
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CATEGORY 3: CAREER & INTERVIEWS                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter("career")}
      >
        <button
          onClick={() => toggleMenu("career")}
          className={getMenuButtonClass(isCareerActive, activeMenu === "career")}
          aria-expanded={activeMenu === "career"}
          aria-haspopup="true"
        >
          <span>Career &amp; Prep</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              activeMenu === "career" ? "rotate-180" : ""
            }`}
          />
        </button>

        {activeMenu === "career" && (
          <div className="absolute right-0 sm:left-0 top-full mt-2 w-80 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex flex-col gap-1">
              <span className="text-3xs font-mono uppercase tracking-widest text-zinc-400 font-bold px-2 py-1">
                Interview Prep &amp; Growth
              </span>

              {/* Mock Interviews */}
              <Link
                href="/interviews"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/interviews") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Mock Interviews
                  </span>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    Practice 1-on-1 with Staff/Principal architects
                  </span>
                </div>
              </Link>

              {/* Bar Raiser */}
              <Link
                href="/bar-raiser"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/bar-raiser") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <Award className="w-4 h-4 text-rose-500" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      Bar Raiser
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded border border-rose-200 dark:border-rose-900">
                      STAR
                    </span>
                  </div>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    Amazon Leadership Principles &amp; calibrated answers
                  </span>
                </div>
              </Link>

              {/* Promotion Guide */}
              <Link
                href="/promotion-doc"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/promotion-doc") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      Promotion Guide
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-900">
                      Guide
                    </span>
                  </div>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    Staff &amp; Senior engineering promotion doc framework
                  </span>
                </div>
              </Link>

              {/* FDE Role Guide */}
              <Link
                href="/fde"
                className={`flex items-start gap-3 p-2 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group ${
                  isLinkActive("/fde") ? "bg-zinc-100/70 dark:bg-zinc-800/40" : ""
                }`}
              >
                <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0 mt-0.5">
                  <Terminal className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    FDE Role Guide
                  </span>
                  <span className="text-3xs text-zinc-500 leading-tight">
                    Forward Deployed Engineering career roadmap
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DIRECT COMPANY LINKS                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Link
        href="/about"
        className={`whitespace-nowrap text-xs uppercase tracking-wider font-mono transition-colors py-1.5 px-1 ${
          pathname === "/about"
            ? "text-zinc-950 dark:text-zinc-50 font-bold border-b-2 border-zinc-900 dark:border-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        About
      </Link>

      <Link
        href="/contact"
        className={`whitespace-nowrap text-xs uppercase tracking-wider font-mono transition-colors py-1.5 px-1 ${
          pathname === "/contact"
            ? "text-zinc-950 dark:text-zinc-50 font-bold border-b-2 border-zinc-900 dark:border-zinc-100"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        }`}
      >
        Contact
      </Link>
    </nav>
  );
}
