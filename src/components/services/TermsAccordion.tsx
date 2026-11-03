"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Term = { title: string; description: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Ketentuan & Garansi sebagai accordion (Fase 8.3).
 * Basis <details>/<summary>: tanpa JavaScript tetap bisa dibuka-tutup dan isinya
 * tetap ada di HTML (terindeks). Setelah hidrasi, tinggi konten dianimasikan
 * Framer Motion; <details> baru ditutup setelah animasi menutup selesai.
 */
function TermItem({ term, number }: { term: Term; number: string }) {
  const reduce = useReducedMotion();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Setelah hidrasi: ambil status asli <details> (bisa sudah dibuka sebelum JS siap).
  useEffect(() => {
    setOpen(detailsRef.current?.open ?? false);
    setHydrated(true);
  }, []);

  function onSummaryClick(event: React.MouseEvent) {
    const details = detailsRef.current;
    if (!details) return;
    event.preventDefault();
    if (open) {
      setOpen(false); // details.open = false menyusul di onAnimationComplete
    } else {
      details.open = true;
      setOpen(true);
    }
  }

  return (
    <li className="border-t border-border last:border-b">
      <details
        ref={detailsRef}
        // Sinkron bila dibuka oleh browser (mis. fitur cari di halaman)
        onToggle={(event) => {
          if (event.currentTarget.open && !open) setOpen(true);
        }}
      >
        <summary
          onClick={onSummaryClick}
          className="flex cursor-pointer list-none items-center gap-4 py-5 outline-none transition-colors hover:text-accent focus-visible:text-accent [&::-webkit-details-marker]:hidden"
        >
          <span className="font-display text-2xl leading-none text-accent">{number}</span>
          <span className="flex-1 font-medium">{term.title}</span>
          {/* Ikon "+" → "×" (rotasi 45°) */}
          <span aria-hidden="true" className="relative size-4 shrink-0">
            <span
              className={`absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "rotate-45" : "rotate-0"
              }`}
            >
              <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-accent" />
              <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-accent" />
            </span>
          </span>
        </summary>

        {/* key: dipasang ulang setelah hidrasi dengan tinggi awal eksplisit — konten di
            dalam <details> tertutup tidak dirender, sehingga tanpa ini Framer Motion
            tidak punya titik awal 0 dan animasi membuka akan melompat. */}
        <motion.div
          key={hydrated ? "animated" : "static"}
          className="overflow-hidden"
          initial={hydrated ? (open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }) : false}
          animate={hydrated ? { height: open ? "auto" : 0, opacity: open ? 1 : 0 } : undefined}
          transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
          onAnimationComplete={() => {
            if (!open && detailsRef.current) detailsRef.current.open = false;
          }}
        >
          <p className="max-w-2xl pb-6 pl-10 text-muted">{term.description}</p>
        </motion.div>
      </details>
    </li>
  );
}

export function TermsAccordion({ terms }: { terms: Term[] }) {
  return (
    <ol>
      {terms.map((term, index) => (
        <TermItem key={term.title} term={term} number={String(index + 1).padStart(2, "0")} />
      ))}
    </ol>
  );
}
