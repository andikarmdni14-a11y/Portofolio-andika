import type { Metadata } from "next";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { RevealText } from "@/components/motion/RevealText";
import { ServiceList } from "@/components/services/ServiceList";
import {
  addOns,
  closingCta,
  companyProfile,
  comparisonMatrix,
  formatRupiah,
  landingPage,
  maintenance,
  pricelistTagline,
  servicesIntro,
  starterPackage,
  techStandards,
  terms,
  workflow,
  type PackageTier,
} from "@/lib/services-data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `${servicesIntro} Paket mulai ${formatRupiah(starterPackage.price)}.`,
};

const pad = (index: number) => String(index + 1).padStart(2, "0");

const buttonPrimary =
  "inline-flex rounded-none bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-foreground hover:text-background";
const buttonSecondary =
  "inline-flex rounded-none border border-foreground/40 px-7 py-3.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent";

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({
  id,
  index,
  lines,
  subtitle,
  description,
}: {
  id: string;
  index: string;
  lines: string[];
  subtitle?: string;
  description: string;
}) {
  return (
    <div className="mb-12 grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="mb-4 text-sm text-muted">
          <span className="text-accent">{index}</span>
          {subtitle ? ` · ${subtitle}` : null}
        </p>
        <RevealText
          as="h2"
          id={id}
          lines={lines}
          className="font-display text-5xl uppercase leading-none md:text-6xl"
        />
      </div>
      <p className="text-lg leading-relaxed text-muted lg:col-span-5 lg:self-end">
        {description}
      </p>
    </div>
  );
}

function TierGrid({ tiers }: { tiers: PackageTier[] }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-3">
      {tiers.map((tier, index) => (
        <li key={tier.name} className="flex">
          <Reveal
            delay={index * 0.08}
            className={`flex w-full flex-col border p-6 md:p-8 ${
              tier.highlight ? "border-accent" : "border-border"
            }`}
          >
            <p
              className={`text-sm ${tier.highlight ? "text-accent" : "text-muted"}`}
            >
              {tier.label}
            </p>
            <h3 className="mt-2 font-display text-4xl uppercase leading-none">
              {tier.name}
            </h3>
            <p className="mt-6 font-display text-5xl leading-none text-accent">
              {formatRupiah(tier.price)}
            </p>
            <p className="mt-5 text-muted">{tier.audience}</p>

            <div className="mt-6 flex-1 border-t border-border pt-6">
              <CheckList items={tier.features} />
            </div>

            <dl className="mt-8 grid gap-2 border-t border-border pt-5 text-sm">
              {[
                ["Revisi", tier.revision],
                ["Garansi", tier.warranty],
                ["Waktu", tier.duration],
              ].map(([term, value]) => (
                <div key={term} className="flex justify-between gap-4">
                  <dt className="text-muted">{term}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesPage() {
  const { whatsapp, email } = siteConfig;

  return (
    <>
      {/* Intro */}
      <section className="border-b border-border pb-16 pt-16 lg:pb-24 lg:pt-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RevealText
              as="h1"
              lines={["Services"]}
              className="font-display text-[clamp(4rem,12vw,10rem)] uppercase leading-[0.85]"
            />
          </div>
          <div className="space-y-4 lg:col-span-5 lg:pt-6">
            <p className="text-xl leading-relaxed md:text-2xl">{servicesIntro}</p>
            <p className="text-muted">{pricelistTagline}</p>
          </div>
        </div>
      </section>

      {/* Ringkasan layanan (PRD) */}
      <section aria-labelledby="layanan" className="border-b border-border py-16 lg:py-24">
        <div className="container">
          <RevealText
            as="h2"
            id="layanan"
            lines={["Ringkasan", "Layanan"]}
            className="mb-12 font-display text-5xl uppercase leading-none md:text-6xl"
          />
          <ServiceList />
        </div>
      </section>

      {/* Paket Starter */}
      <section aria-labelledby="starter" className="border-b border-border py-16 lg:py-24">
        <div className="container">
          <Reveal className="grid gap-10 border border-accent p-6 md:p-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm text-accent">{starterPackage.label}</p>
              <h2
                id="starter"
                className="mt-2 font-display text-5xl uppercase leading-none md:text-6xl"
              >
                {starterPackage.name}
              </h2>
              <p className="mt-6 font-display text-6xl leading-none text-accent">
                {formatRupiah(starterPackage.price)}
              </p>
              <p className="mt-6 leading-relaxed text-muted">{starterPackage.description}</p>
            </div>
            <div className="lg:col-span-7 lg:border-l lg:border-border lg:pl-10">
              <CheckList items={starterPackage.features} />
              <p className="mt-6 border-t border-border pt-5 text-sm text-muted">
                Catatan: {starterPackage.note}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Paket Landing Page */}
      <section aria-labelledby="paket-landing" className="border-b border-border py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            id="paket-landing"
            index="01"
            subtitle={landingPage.subtitle}
            lines={["Website", "Landing Page"]}
            description={landingPage.description}
          />
          <TierGrid tiers={landingPage.tiers} />
        </div>
      </section>

      {/* Paket Company Profile */}
      <section aria-labelledby="paket-company" className="border-b border-border py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            id="paket-company"
            index="02"
            subtitle={companyProfile.subtitle}
            lines={["Company Profile", "& Web Bisnis"]}
            description={companyProfile.description}
          />
          <TierGrid tiers={companyProfile.tiers} />
        </div>
      </section>

      {/* Maintenance */}
      <section aria-labelledby="maintenance" className="border-b border-border py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            id="maintenance"
            index="03"
            subtitle="Retainer"
            lines={["Maintenance", "& Support"]}
            description={maintenance.description}
          />
          <ul>
            {maintenance.plans.map((plan, index) => (
              <li key={plan.name}>
                <Reveal
                  delay={index * 0.08}
                  className="grid gap-4 border-t border-border py-8 last:border-b lg:grid-cols-12 lg:items-baseline lg:gap-8"
                >
                  <h3 className="font-display text-3xl uppercase leading-none md:text-4xl lg:col-span-3">
                    {plan.name}
                  </h3>
                  <p className="text-muted lg:col-span-6">{plan.scope}</p>
                  <p className="lg:col-span-3 lg:text-right">
                    <span className="text-sm text-muted">Mulai </span>
                    <span className="font-display text-4xl leading-none text-accent">
                      {formatRupiah(plan.price)}
                    </span>
                    <span className="text-sm text-muted"> / Bulan</span>
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Matriks perbandingan (Pricelist §4) */}
      <section aria-labelledby="matriks" className="border-b border-border py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            id="matriks"
            index="04"
            subtitle="Perbandingan"
            lines={["Matriks", "Fitur Utama"]}
            description="Perbedaan mendasar paket Landing Page dan Company Profile, berlaku untuk semua tier."
          />
          {/* Mobile: daftar bertumpuk per spesifikasi (3 kolom terlalu sempit) */}
          <Reveal className="md:hidden">
            <ul>
              {comparisonMatrix.rows.map((row) => (
                <li key={row.spec} className="border-t border-border py-5 last:border-b">
                  <p className="font-medium">{row.spec}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    {[
                      [comparisonMatrix.shortColumns[0], row.landing],
                      [comparisonMatrix.shortColumns[1], row.company],
                    ].map(([column, value]) => (
                      <div key={column}>
                        <dt className="text-xs text-muted">{column}</dt>
                        <dd className="mt-1">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Perbandingan fitur utama paket Landing Page dan Company Profile
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[34%] py-4 pr-4 text-sm font-medium text-muted">
                    Spesifikasi / Modul
                  </th>
                  {comparisonMatrix.columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="py-4 pr-4 font-display text-xl uppercase leading-none md:text-3xl"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.rows.map((row) => (
                  <tr
                    key={row.spec}
                    className="border-b border-border transition-colors hover:bg-surface"
                  >
                    <th scope="row" className="py-5 pr-4 align-top font-medium">
                      {row.spec}
                    </th>
                    <td className="py-5 pr-4 align-top text-muted">{row.landing}</td>
                    <td className="py-5 pr-4 align-top text-muted">{row.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      {/* Add-On */}
      <section aria-labelledby="addon" className="border-b border-border py-16 lg:py-24">
        <div className="container">
          <SectionHeading
            id="addon"
            index="05"
            subtitle="Add-On Modules"
            lines={["Layanan", "Tambahan"]}
            description="Modul opsional yang dapat ditambahkan ke paket mana pun sesuai kebutuhan bisnis Anda."
          />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {addOns.map((addOn, index) => (
              <li key={addOn.name} className="flex">
                <Reveal
                  delay={(index % 3) * 0.08}
                  className="flex w-full flex-col border border-border p-6 transition-colors hover:border-accent"
                >
                  <h3 className="font-display text-2xl uppercase leading-none">
                    {addOn.name}
                  </h3>
                  <p className="mt-4 flex-1 text-muted">{addOn.description}</p>
                  <p className="mt-6 font-display text-3xl leading-none text-accent">
                    +{formatRupiah(addOn.price)}
                    {addOn.unit ? (
                      <span className="font-sans text-sm text-muted"> {addOn.unit}</span>
                    ) : null}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Alur kerja */}
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
                    <p className="mt-2 max-w-xl text-muted">{step.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Teknologi & standar performa (Pricelist §7) */}
      <section aria-labelledby="teknologi" className="border-b border-border py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <RevealText
              as="h2"
              id="teknologi"
              lines={["Teknologi", "& Standar"]}
              className="font-display text-5xl uppercase leading-none md:text-6xl"
            />
            <p className="max-w-sm text-muted">{techStandards.intro}</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2 lg:col-span-8">
            {techStandards.items.map((item, index) => (
              <li key={item.title} className="flex">
                <Reveal
                  delay={(index % 2) * 0.08}
                  className="flex w-full flex-col border border-border p-6 transition-colors hover:border-accent md:p-8"
                >
                  <span aria-hidden="true" className="size-2.5 bg-accent" />
                  <h3 className="mt-5 font-display text-3xl uppercase leading-none">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-muted">{item.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ketentuan */}
      <section aria-labelledby="ketentuan" className="border-b border-border py-16 lg:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <RevealText
              as="h2"
              id="ketentuan"
              lines={["Ketentuan", "& Garansi"]}
              className="font-display text-5xl uppercase leading-none md:text-6xl"
            />
          </div>
          <ol className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:col-span-8">
            {terms.map((term, index) => (
              <li key={term.title} className="border-t border-border pt-5">
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-2xl leading-none text-accent">
                    {pad(index)}
                  </span>
                  <span className="font-medium">{term.title}</span>
                </p>
                <p className="mt-3 text-muted">{term.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Penutup */}
      <section aria-labelledby="diskusi" className="py-16 lg:py-24">
        <div className="container">
          <RevealText
            as="h2"
            id="diskusi"
            lines={["Mari Diskusikan", "Kebutuhan Bisnis Anda"]}
            className="font-display text-[clamp(2.75rem,7vw,6rem)] uppercase leading-[0.9]"
          />
          <p className="mt-6 max-w-xl text-lg text-muted">{closingCta.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonPrimary}
              >
                WhatsApp {whatsapp.display}
              </a>
            </Magnetic>
            <Magnetic>
              <a href={`mailto:${email}`} className={buttonSecondary}>
                {email}
              </a>
            </Magnetic>
          </div>
        </div>
      </section>
    </>
  );
}
