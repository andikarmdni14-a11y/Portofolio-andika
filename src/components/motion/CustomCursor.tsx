"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Kursor kustom (titik + cincin). Hanya aktif pada perangkat dengan mouse dan
 * tanpa preferensi reduced-motion. Elemen ber-atribut data-cursor="Teks"
 * membuat kursor membesar dan menampilkan teks tersebut (mis. "View").
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [interactive, setInteractive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 450, damping: 38, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 450, damping: 38, mass: 0.5 });

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const el = event.target instanceof Element ? event.target : null;
      setLabel(el?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? null);
      setInteractive(Boolean(el?.closest("a, button, [role='button'], input, textarea, select")));
    };
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 88 : interactive ? 56 : 36;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent text-xs font-medium text-accent-foreground"
          animate={{
            width: size,
            height: size,
            backgroundColor: label ? "rgba(198,34,39,1)" : "rgba(198,34,39,0)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          {label}
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[101]"
        style={{ x, y }}
      >
        <div
          className={`absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity ${
            label ? "opacity-0" : "opacity-100"
          }`}
        />
      </motion.div>
    </>
  );
}
