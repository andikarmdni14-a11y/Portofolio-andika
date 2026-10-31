"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { siteConfig } from "@/lib/site";

// Three.js hanya dimuat di browser dan tidak menghambat render awal.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const stats = [
  { value: "1+", label: "Tahun pengalaman" },
  { value: "1+", label: "Proyek selesai" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Teks latar bergerak berlawanan arah gulir (parallax).
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  return (
    // Class "dark" pada section: panggung hero selalu gelap di kedua tema,
    // sehingga teks tetap terbaca di atas foto yang berlatar gelap.
    <section
      ref={ref}
      className="dark relative isolate overflow-hidden border-b border-border bg-background text-foreground"
    >
      {/* Layer 0 — teks raksasa latar */}
      <motion.div
        aria-hidden="true"
        style={{ y: reduce ? 0 : titleY }}
        className="hero-title-fade pointer-events-none absolute inset-x-0 top-0 select-none whitespace-nowrap text-center font-display text-[30vw] uppercase leading-[0.8] text-accent"
      >
        Portfolio
      </motion.div>

      {/* Layer 1 — partikel 3D */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <HeroScene />
      </div>

      {/* Layer 2 — foto profil, diblend ke latar lewat mask */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[30rem] justify-center lg:inset-y-0 lg:h-auto">
        <div className="photo-blend relative h-full w-[min(100%,26rem)] lg:w-[min(48vw,38rem)]">
          <Image
            src="/images/andika-hero.jpg"
            alt="Foto profil Andika Ramadhani"
            fill
            preload
            sizes="(min-width: 1024px) 38rem, 26rem"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Layer 3 — konten */}
      <div className="container relative z-30 grid gap-10 pb-12 pt-[27rem] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:items-center lg:pb-16 lg:pt-20">
        <div className="lg:col-span-5">
          <RevealText
            as="h1"
            lines={[
              "Crafting",
              "High-Performance",
              "Web Applications &",
              "Modern Digital",
              "Experiences.",
            ]}
            className="font-display text-[clamp(2.5rem,5vw,5rem)] uppercase leading-[0.92]"
          />
          <p className="mt-6 max-w-md text-muted">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <Link
                href="/projects"
                className="inline-flex rounded-none bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Lihat Proyek
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                href="/contact"
                className="inline-flex rounded-none border border-foreground/40 px-7 py-3.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                Hubungi Saya
              </Link>
            </Magnetic>
          </div>
        </div>

        <ul
          aria-label="Statistik"
          className="lg:col-span-3 lg:col-start-10 lg:self-end"
        >
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex items-center gap-5 border-t border-border py-5 first:border-t-0 lg:first:border-t"
            >
              <span className="font-display text-6xl leading-none text-accent">
                {stat.value}
              </span>
              <span className="text-sm text-muted">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
