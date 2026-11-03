import { RevealText } from "@/components/motion/RevealText";
import { getCertificates } from "@/lib/certificates";
import { CertificateGrid } from "./CertificateGrid";

/** About — seluruh sertifikat. Tersembunyi bila belum ada data. */
export async function CertificatesSection() {
  const certificates = await getCertificates();
  if (certificates.length === 0) return null;

  return (
    <section
      id="sertifikat"
      aria-labelledby="certificates-heading"
      className="scroll-mt-20 border-t border-border py-20 lg:py-28"
    >
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <RevealText
            as="h2"
            id="certificates-heading"
            lines={["Sertifikat"]}
            className="font-display text-5xl uppercase leading-none md:text-6xl"
          />
          <p className="text-sm text-muted">
            <span className="font-display text-3xl text-accent">{String(certificates.length).padStart(2, "0")}</span>{" "}
            sertifikat
          </p>
        </div>
        <CertificateGrid certificates={certificates} />
      </div>
    </section>
  );
}
