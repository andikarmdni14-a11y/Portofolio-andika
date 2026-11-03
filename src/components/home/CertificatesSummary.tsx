import Link from "next/link";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { RevealText } from "@/components/motion/RevealText";
import { getCertificates } from "@/lib/certificates";

/** Home — 3 sertifikat terbaru. Tersembunyi bila belum ada data. */
export async function CertificatesSummary() {
  const certificates = await getCertificates(3);
  if (certificates.length === 0) return null;

  return (
    <section aria-labelledby="home-certificates-heading" className="border-b border-border py-20 lg:py-28">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-6">
          <RevealText
            as="h2"
            id="home-certificates-heading"
            lines={["Sertifikat"]}
            className="font-display text-5xl uppercase leading-none md:text-6xl"
          />
          <Link
            href="/about#sertifikat"
            className="shrink-0 border-b-2 border-accent pb-1 text-sm font-medium transition-colors hover:text-accent"
          >
            Lihat semua sertifikat
          </Link>
        </div>
        <CertificateGrid certificates={certificates} />
      </div>
    </section>
  );
}
