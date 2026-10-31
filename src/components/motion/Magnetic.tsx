"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  /** Seberapa jauh elemen tertarik ke kursor (0–1). */
  strength?: number;
  /** Jarak tambahan (px) di luar elemen tempat tarikan mulai terasa. */
  radius?: number;
  className?: string;
};

/** Efek magnetik: elemen tertarik ke arah kursor mouse saat kursor mendekat. */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 70,
  className = "inline-block",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;

    const onMove = (event: PointerEvent) => {
      const el = ref.current;
      if (!el || event.pointerType !== "mouse") return;

      const rect = el.getBoundingClientRect();
      // Pusat asli = pusat saat ini dikurangi pergeseran, agar tidak berosilasi.
      const cx = rect.left + rect.width / 2 - x.get();
      const cy = rect.top + rect.height / 2 - y.get();
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const reach = Math.max(rect.width, rect.height) / 2 + radius;

      if (Math.hypot(dx, dy) < reach) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, radius, strength, x, y]);

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} className={className}>
      {children}
    </motion.div>
  );
}
