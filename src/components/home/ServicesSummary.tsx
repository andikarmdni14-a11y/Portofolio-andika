import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { ServiceList } from "@/components/services/ServiceList";
import { servicesIntro } from "@/lib/services-data";

/** Home — Ringkasan Layanan (PRD §6A). */
export function ServicesSummary() {
  return (
    <section aria-labelledby="services-heading" className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <RevealText
              as="h2"
              id="services-heading"
              lines={["Ringkasan", "Layanan"]}
              className="font-display text-5xl uppercase leading-none md:text-6xl"
            />
            <p className="mt-6 max-w-xl text-lg text-muted">{servicesIntro}</p>
          </div>
          <Link
            href="/services"
            className="shrink-0 border-b-2 border-accent pb-1 text-sm font-medium transition-colors hover:text-accent"
          >
            Lihat paket &amp; harga
          </Link>
        </div>
        <ServiceList />
      </div>
    </section>
  );
}
