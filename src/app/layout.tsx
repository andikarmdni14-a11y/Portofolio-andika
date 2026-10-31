import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

// Berjalan sebelum paint pertama:
// 1) Dark Mode default; lepas class "dark" bila pengguna memilih Light Mode.
// 2) Tandai splash screen (sekali per sesi, bukan di /admin, bukan reduced-motion).
const initScript = `try{var d=document.documentElement;if(localStorage.getItem("theme")==="light"){d.classList.remove("dark")}if(location.pathname.indexOf("/admin")!==0&&!sessionStorage.getItem("intro-seen")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="pending";d.dataset.splash="1"}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`dark ${fontVariables}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
