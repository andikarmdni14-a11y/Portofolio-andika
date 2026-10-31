"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import { useRef } from "react";
import type { TimelineItem } from "@/lib/about-data";

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-none border border-dashed border-border px-2 py-0.5 text-xs text-muted">
      {children}
    </span>
  );
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });

  return (
    <div ref={ref} className="relative">
      {/* Garis rel: terisi aksen mengikuti progres gulir */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-[0.3rem] top-1 w-px bg-border"
      >
        <motion.div
          className="h-full origin-top bg-accent"
          style={{ scaleY: reduce ? 1 : scrollYProgress }}
        />
      </div>

      <ol className="space-y-14">
        {items.map((item) => (
          <li
            key={`${item.category}-${item.title}`}
            className="relative grid gap-3 pl-10 md:grid-cols-12 md:gap-8 md:pl-14"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 size-2.5 bg-accent"
            />

            <div className="md:col-span-3">
              {item.period === null ? (
                <Placeholder>Periode menyusul</Placeholder>
              ) : item.period ? (
                <p className="font-display text-3xl leading-none text-accent">
                  {item.period}
                </p>
              ) : null}
            </div>

            <div className="md:col-span-9">
              <p className="text-sm text-muted">{item.category}</p>
              <h3 className="mt-1 font-display text-3xl uppercase leading-none md:text-4xl">
                {item.title}
              </h3>
              {item.organization === null ? (
                <p className="mt-3">
                  <Placeholder>Institusi / perusahaan menyusul</Placeholder>
                </p>
              ) : item.organization ? (
                <p className="mt-3 text-muted">{item.organization}</p>
              ) : null}
              {item.description ? (
                <p className="mt-4 max-w-2xl text-muted">{item.description}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
