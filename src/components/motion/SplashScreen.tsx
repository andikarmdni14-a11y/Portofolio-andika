"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { markIntroDone } from "./intro";

const EASE = [0.76, 0, 0.24, 1] as const;
const SEEN_KEY = "intro-seen";

/**
 * Pre-loader (sekali per sesi): hitungan 0–100% bertipografi tebal, lalu layar
 * tersapu ke atas berlapis (gelap, lalu aksen merah). Tampil hanya bila skrip
 * awal di <head> menandai <html data-splash>; selain itu disembunyikan oleh CSS
 * sejak paint pertama (termasuk tanpa JS & reduced-motion).
 */
export function SplashScreen() {
  const [active, setActive] = useState(true);
  const base = useRef<HTMLDivElement>(null);
  const accent = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const percent = useTransform(count, (value) => `${Math.round(value)}%`);
  const progress = useTransform(count, (value) => value / 100);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.splash === undefined) {
      setActive(false);
      return;
    }

    let cancelled = false;
    (async () => {
      await animate(count, 100, { duration: 1.0, ease: [0.65, 0, 0.35, 1] });
      if (cancelled || !base.current || !accent.current) return;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Tanpa sessionStorage: splash dapat tampil lagi pada muatan berikutnya.
      }
      // Animasi masuk halaman dimulai bersamaan dengan sapuan pembuka.
      markIntroDone();
      await Promise.all([
        animate(base.current, { y: "-100%" }, { duration: 0.8, ease: EASE, delay: 0.15 }),
        animate(accent.current, { y: "-100%" }, { duration: 0.8, ease: EASE, delay: 0.27 }),
      ]);
      delete root.dataset.splash;
      if (!cancelled) setActive(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [count]);

  if (!active) return null;

  return (
    <div id="splash" aria-hidden="true" className="dark fixed inset-0 z-[95]">
      <div ref={accent} className="absolute inset-0 bg-accent" />
      <div
        ref={base}
        className="absolute inset-0 flex flex-col justify-between bg-background p-6 text-foreground md:p-10"
      >
        <div className="flex justify-between text-sm text-muted">
          <span>Andika Ramadhani</span>
          <span>Portfolio</span>
        </div>
        <div>
          <motion.p className="font-display text-[clamp(6rem,24vw,20rem)] leading-[0.8]">
            {percent}
          </motion.p>
          <div className="mt-6 h-px w-full bg-border">
            <motion.div className="h-full origin-left bg-accent" style={{ scaleX: progress }} />
          </div>
        </div>
      </div>
    </div>
  );
}
