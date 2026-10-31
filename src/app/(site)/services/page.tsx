import type { Metadata } from "next";
import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { services, servicesIntro, workflow } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIntro,
};

const pad = (index: number) => String(index + 1).padStart(2, "0");

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-border pb-16 pt-16 lg:pb-24 lg:pt-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RevealText
              as="h1"
              lines={["Services"]}
              className="font-display text-[clamp(4rem,12vw,10rem)] uppercase leading-[0.85]"
            />
          </div>
          <p className="text-xl leading-relaxed md:text-2xl lg:col-span-5 lg:pt-6">
            {servicesIntro}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="layanan"
        className="border-b border-border py-16 lg:py-24"
      >
        <div className="container">
          <RevealText
            as="h2"
            id="layanan"
            lines={["Paket &", "Penawaran Jasa"]}
            className="mb-12 font-display text-5xl uppercase leading-none md:text-6xl"
          />
          <ul>
            {services.map((service, index) => (
              <li key={service.title}>
                <Reveal
                  delay={index * 0.08}
                  className="grid gap-4 border-t border-border py-8 last:border-b lg:grid-cols-12 lg:gap-8 lg:py-10"
                >
                  <span className="font-display text-4xl leading-none text-accent lg:col-span-1">
                    {pad(index)}
                  </span>
                  <h3 className="font-display text-3xl uppercase leading-[0.95] md:text-4xl lg:col-span-6">
                    {service.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-muted lg:col-span-5">
                    {service.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-8 inline-block rounded-none border border-dashed border-border px-3 py-1.5 text-sm text-muted">
            Rincian paket &amp; harga menyusul
          </p>
        </div>
      </section>

      <section aria-labelledby="alur-kerja" className="border-b border-border py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealText
              as="h2"
              id="alur-kerja"
              lines={["Alur", "Kerja"]}
              className="font-display text-5xl uppercase leading-none md:text-6xl"
            />
          </div>
          <ol className="lg:col-span-8">
            {workflow.map((step, index) => (
              <li key={step.title}>
                <Reveal
                  delay={index * 0.06}
                  className="flex items-baseline gap-6 border-t border-border py-6 last:border-b"
                >
                  <span className="font-display text-4xl leading-none text-accent">
                    {pad(index)}
                  </span>
                  <div>
                    <h3 className="font-display text-3xl uppercase leading-none">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-muted">{step.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container">
          <Magnetic>
            <Link
              href="/contact"
              className="inline-flex rounded-none bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Hubungi Saya
            </Link>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
