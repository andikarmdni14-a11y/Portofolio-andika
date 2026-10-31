"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Pembungkus: konten terbuka seperti tirai dari atas ke bawah saat masuk layar.
 *
 * Fase 7.1: IntersectionObserver ikut memperhitungkan clip-path milik target.
 * Elemen yang dimulai dengan clip-path tertutup penuh tidak pernah dianggap
 * "terlihat", sehingga `whileInView` tidak pernah terpicu dan konten tetap
 * tersembunyi. Karena itu yang diamati adalah elemen INDUK (tidak ter-clip).
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLElement | null>(null);

  // Berjalan sebelum efek useInView sehingga observer langsung memakai induk.
  useLayoutEffect(() => {
    parentRef.current = ref.current?.parentElement ?? ref.current;
  }, []);

  const inView = useInView(parentRef, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      animate={inView ? { clipPath: "inset(0 0 0% 0)" } : undefined}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
