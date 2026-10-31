"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ElementType } from "react";
import { useIntroReady } from "./intro";

type RevealTextProps = {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  delay?: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Text reveal line-by-line: tiap baris meluncur dari bawah dari balik
 * pelindung overflow-hidden. Menunggu splash/transisi halaman selesai.
 * Pembaca layar membaca teks utuh lewat aria-label.
 */
export function RevealText({
  lines,
  as = "h2",
  id,
  className,
  delay = 0,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const introReady = useIntroReady();
  const Tag = as as ElementType;
  const show = inView && introReady;

  return (
    <Tag ref={ref} id={id} aria-label={lines.join(" ")} className={className}>
      {lines.map((line, index) => (
        <span key={line} aria-hidden="true" className="block overflow-hidden py-[0.04em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={show ? { y: 0 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: delay + index * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
