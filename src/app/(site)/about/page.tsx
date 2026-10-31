import type { Metadata } from "next";
import { SkillsBento } from "@/components/about/SkillsBento";
import { Timeline } from "@/components/about/Timeline";
import { RevealText } from "@/components/motion/RevealText";
import { timeline } from "@/lib/about-data";

export const metadata: Metadata = {
  title: "Tentang Saya",
  description:
    "Berpengalaman dalam merancang arsitektur perangkat lunak berbasis web dari hulu ke hilir, dengan fokus pada skalabilitas, efisiensi kode, dan pengalaman pengguna yang intuitif.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border pb-20 pt-16 lg:pb-28 lg:pt-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RevealText
              as="h1"
              lines={["Tentang", "Saya"]}
              className="font-display text-[clamp(4rem,12vw,10rem)] uppercase leading-[0.85]"
            />
          </div>
          <div className="space-y-6 lg:col-span-5 lg:pt-6">
            <p className="text-xl leading-relaxed md:text-2xl">
              Berpengalaman dalam merancang arsitektur perangkat lunak berbasis
              web dari hulu ke hilir. Berfokus pada skalabilitas, efisiensi kode,
              serta pengalaman pengguna yang intuitif dan berestetika tinggi.
            </p>
            <p className="text-muted">
              Latar belakang di Warehouse &amp; Inventory Management membentuk
              logika yang kuat dalam menyusun database e-commerce dan dashboard.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="skills-heading"
        className="border-b border-border py-20 lg:py-28"
      >
        <div className="container">
          <RevealText
            as="h2"
            id="skills-heading"
            lines={["Keahlian &", "Tech Stack"]}
            className="mb-12 font-display text-5xl uppercase leading-none md:text-6xl"
          />
          <SkillsBento />
        </div>
      </section>

      <section aria-labelledby="timeline-heading" className="py-20 lg:py-28">
        <div className="container">
          <RevealText
            as="h2"
            id="timeline-heading"
            lines={["Perjalanan", "Karier"]}
            className="mb-12 font-display text-5xl uppercase leading-none md:text-6xl"
          />
          <Timeline items={timeline} />
        </div>
      </section>
    </>
  );
}
