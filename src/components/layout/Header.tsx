"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="font-heading text-sm font-bold text-bg">M</span>
            </div>
            <span className="font-heading text-lg font-bold text-text">
              MME
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-accent"
                    : "text-text-secondary hover:text-text"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-[var(--radius)] bg-accent text-bg hover:bg-accent-hover transition-colors"
            >
              Book a Demo
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-bg/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 text-sm rounded-lg transition-colors",
                    pathname === link.href
                      ? "text-accent bg-bg-card"
                      : "text-text-secondary hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-accent"
              >
                Book a Demo
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
