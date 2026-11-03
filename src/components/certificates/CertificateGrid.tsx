import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import type { Certificate } from "@/lib/certificates";

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const isPdf = certificate.fileType === "pdf";
  return (
    <a
      href={certificate.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View"
      aria-label={`${certificate.title} — ${certificate.issuer}, ${certificate.year} (${isPdf ? "PDF" : "gambar"}, tab baru)`}
      className="group flex h-full w-full flex-col border border-border transition-colors hover:border-accent focus-visible:border-accent"
    >
      {/* Rasio tetap 4:3 — mencegah CLS saat gambar dimuat */}
      <ImageReveal className="aspect-[4/3] border-b border-border bg-surface">
        {isPdf ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <svg aria-hidden="true" width="40" height="48" viewBox="0 0 40 48" fill="none" className="text-muted">
              <path d="M4 1h22l10 10v36H4z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M26 1v10h10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="font-display text-4xl uppercase leading-none text-accent">PDF</span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={certificate.url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-4"
          />
        )}
      </ImageReveal>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm text-muted">
          {certificate.issuer} · <span className="tabular-nums">{certificate.year}</span>
        </p>
        <h3 className="font-display text-2xl uppercase leading-none transition-colors group-hover:text-accent">
          {certificate.title}
        </h3>
        <span className="mt-auto pt-3 text-xs font-medium text-muted transition-colors group-hover:text-foreground">
          {isPdf ? "Buka PDF ↗" : "Lihat sertifikat ↗"}
        </span>
      </div>
    </a>
  );
}

export function CertificateGrid({ certificates }: { certificates: Certificate[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certificates.map((certificate, index) => (
        <li key={certificate.id} className="flex">
          <Reveal delay={(index % 3) * 0.08} className="flex w-full">
            <CertificateCard certificate={certificate} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
