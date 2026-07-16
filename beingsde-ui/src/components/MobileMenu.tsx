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
    { href: "/topics", label: "HLD" },
    { href: "/lld", label: "LLD" },
    { href: "/questions", label: "TOP HLD Questions" },
    { href: "/dsa", label: "DSA" },
    { href: "/interviews", label: "Mock Interviews" },
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
        <div className="fixed inset-0 top-[64px] z-40 bg-[#fafafa] dark:bg-[#09090b] border-t border-zinc-200 dark:border-zinc-800 flex flex-col p-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-6 text-lg font-medium text-zinc-800 dark:text-zinc-200">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-2 border-b border-zinc-100 dark:border-zinc-800/50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
