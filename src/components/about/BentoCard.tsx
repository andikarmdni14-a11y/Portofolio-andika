import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** Kartu bento: terbuka seperti tirai dari atas ke bawah saat masuk layar. */
export function BentoCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal
      delay={delay}
      className={`border border-border p-6 transition-colors hover:border-accent md:p-8 ${className}`}
    >
      {children}
    </Reveal>
  );
}
