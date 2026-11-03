"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Kartu paket: geser horizontal (scroll-snap) di bawah lg, grid 3 kolom di lg ke atas.
 * Kartu berikutnya terlihat sebagian di tepi kanan sebagai petunjuk geser.
 * Indikator posisi (01 / 03) dan tombol lompat hanya tampil di bawah lg.
 */
export function TierScroller({
  label,
  count,
  children,
}: {
  label: string;
  count: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const start = list.getBoundingClientRect().left + parseFloat(getComputedStyle(list).paddingLeft);
        let best = 0;
        let bestDistance = Infinity;
        Array.from(list.children).forEach((item, index) => {
          const distance = Math.abs(item.getBoundingClientRect().left - start);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = index;
          }
        });
        // Di ujung kanan (mis. tablet: 2 kartu terlihat), kartu terakhir dianggap aktif
        const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 2;
        setActive(atEnd && list.scrollLeft > 0 ? list.children.length - 1 : best);
      });
    };
    list.addEventListener("scroll", update, { passive: true });
    return () => {
      list.removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  function goTo(index: number) {
    const list = listRef.current;
    const items = list?.children;
    if (!list || !items?.[index]) return;
    const first = items[0] as HTMLElement;
    const target = items[index] as HTMLElement;
    list.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div>
      <ul
        ref={listRef}
        role="list"
        aria-label={label}
        tabIndex={0}
        // -mx-5/px-5 = padding .container (1,25 rem di semua ukuran di bawah 2xl)
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 outline-none [scrollbar-width:none] focus-visible:ring-1 focus-visible:ring-accent lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
        <p className="font-display text-2xl leading-none" aria-live="polite">
          <span className="text-accent">{pad(active + 1)}</span>
          <span className="text-muted"> / {pad(count)}</span>
        </p>
        <div className="flex items-center gap-1">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Tampilkan paket ${index + 1} dari ${count}`}
              aria-current={index === active ? "true" : undefined}
              className="group px-1 py-3"
            >
              <span
                className={`block h-0.5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  index === active ? "w-10 bg-accent" : "w-5 bg-border group-hover:bg-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
