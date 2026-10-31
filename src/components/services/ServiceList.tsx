import { Reveal } from "@/components/motion/Reveal";
import { services } from "@/lib/services-data";

/** Ringkasan 3 layanan (PRD §8D). Dipakai di Home dan Services agar isi selalu sama. */
export function ServiceList() {
  return (
    <ul>
      {services.map((service, index) => (
        <li key={service.title}>
          <Reveal
            delay={index * 0.08}
            className="grid gap-4 border-t border-border py-8 last:border-b lg:grid-cols-12 lg:gap-8 lg:py-10"
          >
            <span className="font-display text-4xl leading-none text-accent lg:col-span-1">
              {String(index + 1).padStart(2, "0")}
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
  );
}
