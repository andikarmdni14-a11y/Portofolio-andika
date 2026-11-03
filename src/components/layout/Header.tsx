"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const logoRef = useRef<HTMLAnchorElement>(null);

  // Akses rahasia Admin: klik 3x cepat pada nama di header → /admin.
  // Dipasang di fase capture milik window agar berjalan sebelum PageTransition
  // (capture di document) — klik pertama tidak boleh langsung memicu transisi,
  // karena layar penutupnya akan menelan klik ke-2 dan ke-3.
  // Klik tunggal tetap ke Beranda (ditunda ±350 ms untuk menunggu klik lanjutan).
  // Keamanan tetap di Supabase Auth + tabel admins; ini hanya jalan pintas.
  useEffect(() => {
    let clicks = 0;
    let timer: number | undefined;

    const onClick = (event: MouseEvent) => {
      const logo = logoRef.current;
      if (
        !logo ||
        !event.isTrusted || // klik sintetis (logo.click() di bawah) diteruskan normal
        event.detail === 0 || // aktivasi keyboard (Enter) → navigasi biasa
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Node) ||
        !logo.contains(event.target)
      )
        return;

      event.preventDefault();
      event.stopPropagation();
      window.clearTimeout(timer);
      clicks += 1;

      if (clicks >= 3) {
        clicks = 0;
        window.location.assign("/admin");
        return;
      }
      timer = window.setTimeout(() => {
        clicks = 0;
        logo.click(); // jalankan navigasi normal (PageTransition + Link)
      }, 350);
    };

    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.clearTimeout(timer);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container relative flex h-16 items-center justify-between">
        <Link
          ref={logoRef}
          href="/"
          className="select-none font-display text-2xl uppercase tracking-wide"
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
