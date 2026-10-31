"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container relative flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl uppercase tracking-wide"
          onClick={() => setMenuOpen(false)}
        >
          {siteConfig.name}
        </Link>

        {/* Navigasi desktop */}
        <nav aria-label="Navigasi utama" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Magnetic strength={0.3} radius={24}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block border-b-2 py-1 text-sm font-medium transition-colors hover:text-foreground ${
                      isActive(item.href)
                        ? "border-accent text-foreground"
                        : "border-transparent text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </Magnetic>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-none border border-border md:hidden"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigasi mobile: diposisikan absolut di dalam container relative */}
        {menuOpen ? (
          <nav
            id="menu-mobile"
            aria-label="Navigasi utama"
            className="absolute inset-x-0 top-full border-y border-border bg-background md:hidden"
          >
            <ul className="flex flex-col">
              {siteConfig.nav.map((item) => (
                <li key={item.href} className="border-b border-border last:border-b-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`block border-l-2 px-5 py-4 font-medium ${
                      isActive(item.href)
                        ? "border-accent text-foreground"
                        : "border-transparent text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
