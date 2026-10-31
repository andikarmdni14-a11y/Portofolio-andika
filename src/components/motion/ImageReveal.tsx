"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, amount: 0.3 } as const;

/**
 * Pembungkus gambar: color-block reveal (blok aksen tersibak) + kedalaman
 * (isi mengecil perlahan dari 1.2 ke 1.0). Beri ukuran/aspect-ratio lewat className.
 */
export function ImageReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, ease: EASE }}
      >
        {children}
      </motion.div>

      {reduce ? null : (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-10 origin-right bg-accent"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        />
      )}
    </div>
  );
}
