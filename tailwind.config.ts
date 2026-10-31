import type { Config } from "tailwindcss";

/**
 * Sistem desain — Website Portofolio High-Impact
 * Warna tema dikendalikan CSS variable (src/app/globals.css) agar
 * Dark Mode (default) dan Light Mode bisa berpindah tanpa class ganda.
 * Aksen merah tidak berubah di kedua tema.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem" },
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        accent: {
          DEFAULT: "#C62227", // Bold Red / Crimson
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        // Peran default
        display: ["var(--font-bebas-neue)", "Impact", "sans-serif"], // H1 hero & angka besar
        sans: ["var(--font-inter)", "system-ui", "sans-serif"], // teks body & UI

        // Semua varian tersedia sebagai utility (font-bebas, font-oswald, ...)
        bebas: ["var(--font-bebas-neue)", "Impact", "sans-serif"],
        oswald: ["var(--font-oswald)", "Impact", "sans-serif"],
        anton: ["var(--font-anton)", "Impact", "sans-serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        jakarta: ["var(--font-plus-jakarta-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
