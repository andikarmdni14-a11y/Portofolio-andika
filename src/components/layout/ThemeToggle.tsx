"use client";

import { useSyncExternalStore } from "react";

// Sumber kebenaran tema = class "dark" pada <html> (dipasang skrip awal di layout).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
// Server selalu merender Dark Mode (default); klien menyesuaikan tanpa mismatch hidrasi.
const getServerSnapshot = () => true;

/**
 * Sakelar tema (role="switch"). Mikro-interaksi: ikon matahari/bulan berotasi dan
 * berganti skala, tombol mengecil saat ditekan; warna seluruh halaman berpindah
 * 300 ms lewat class sementara "theme-transition" (globals.css).
 */
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    const nextDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    } catch {
      // Penyimpanan tidak tersedia: tema tetap berganti untuk sesi ini.
    }
    window.setTimeout(() => root.classList.remove("theme-transition"), 550);
  }

  const icon =
    "theme-icon absolute inset-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Mode gelap"
      onClick={toggleTheme}
      className="grid size-10 place-items-center overflow-hidden rounded-none border border-border text-foreground transition-[color,border-color,transform] hover:border-accent hover:text-accent active:scale-90"
    >
      <span aria-hidden="true" className="relative block size-[18px]">
        {/* Matahari: tampil di Dark Mode (klik → terang) */}
        <svg
          className={`${icon} rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {/* Bulan: tampil di Light Mode (klik → gelap) */}
        <svg
          className={`${icon} rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-50 dark:opacity-0`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
    </button>
  );
}
