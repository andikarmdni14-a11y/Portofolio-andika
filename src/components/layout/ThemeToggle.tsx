"use client";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    const isDark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Penyimpanan tidak tersedia: tema tetap berganti untuk sesi ini.
    }
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Ganti tema terang/gelap"
      className="grid size-10 place-items-center rounded-none border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {/* Ikon dipilih lewat CSS (dark:) agar tidak ada mismatch hidrasi */}
      <svg
        className="hidden dark:block"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        className="block dark:hidden"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
