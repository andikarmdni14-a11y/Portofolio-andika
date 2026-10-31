"use client";

import { useAnimate, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";
import { markIntroDone, setIntroPending } from "./intro";

const EASE = [0.76, 0, 0.24, 1] as const;

function labelFor(pathname: string) {
  const match = [...siteConfig.nav]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));
  return match?.label ?? "";
}

/**
 * Transisi halaman: blok aksen lalu blok gelap meluncur dari bawah menutupi layar,
 * rute berganti, lalu keduanya tersapu ke atas membuka halaman baru.
 * Klik tautan internal dicegat secara global, sehingga semua <Link> ikut bertransisi.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate();
  const [label, setLabel] = useState("");
  const busy = useRef(false);
  const waitingFor = useRef<string | null>(null);
  const revealRef = useRef<(() => Promise<void>) | null>(null);

  // Cegat klik tautan internal.
  useEffect(() => {
    if (reduce) return;

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // tautan hash / halaman sama

      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      const href = url.pathname + url.search + url.hash;
      setLabel(labelFor(url.pathname));

      (async () => {
        const root = scope.current as HTMLElement;
        root.style.pointerEvents = "auto";
        await Promise.all([
          animate(".pt-accent", { y: ["100%", "0%"] }, { duration: 0.5, ease: EASE }),
          animate(".pt-base", { y: ["100%", "0%"] }, { duration: 0.5, ease: EASE, delay: 0.08 }),
        ]);
        setIntroPending();
        waitingFor.current = url.pathname;
        router.push(href);
        // Cadangan: bila rute tidak berubah dalam 4 detik, tetap buka layar.
        window.setTimeout(() => {
          if (waitingFor.current) void reveal();
        }, 4000);
      })();
    };

    const reveal = async () => {
      waitingFor.current = null;
      markIntroDone();
      await Promise.all([
        animate(".pt-base", { y: "-100%" }, { duration: 0.6, ease: EASE, delay: 0.05 }),
        animate(".pt-accent", { y: "-100%" }, { duration: 0.6, ease: EASE, delay: 0.15 }),
      ]);
      await animate(".pt-panel", { y: "100%" }, { duration: 0 });
      (scope.current as HTMLElement).style.pointerEvents = "none";
      busy.current = false;
    };

    revealRef.current = reveal;
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [animate, reduce, router, scope]);

  // Rute baru telah dirender: buka layar.
  useEffect(() => {
    if (waitingFor.current && pathname === waitingFor.current) {
      void revealRef.current?.();
    }
  }, [pathname]);

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="dark pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <div className="pt-panel pt-accent absolute inset-0 translate-y-full bg-accent" />
      <div className="pt-panel pt-base absolute inset-0 grid translate-y-full place-items-center bg-background">
        <span className="font-display text-[clamp(4rem,16vw,14rem)] uppercase leading-none text-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}
