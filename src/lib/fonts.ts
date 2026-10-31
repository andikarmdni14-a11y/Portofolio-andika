import {
  Anton,
  Bebas_Neue,
  Inter,
  Oswald,
  Plus_Jakarta_Sans,
} from "next/font/google";

// Default: Bebas Neue (heading) + Inter (body) → di-preload.
// Varian lain tetap terdaftar, tetapi tidak di-preload agar tidak membebani load awal;
// file font baru diunduh ketika benar-benar dipakai.
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas-neue",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald",
  preload: false,
});

export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
  preload: false,
});

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
  preload: false,
});

export const fontVariables = [
  bebasNeue,
  inter,
  oswald,
  anton,
  plusJakartaSans,
]
  .map((font) => font.variable)
  .join(" ");
