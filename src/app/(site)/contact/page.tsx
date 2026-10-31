import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Siap mendiskusikan kebutuhan proyek web, konsultasi arsitektur sistem, atau peluang kerja sama.",
};

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-none border border-dashed border-border px-2 py-0.5 text-sm text-muted">
      {children}
    </span>
  );
}

/** "https://github.com/x" → "github.com/x" (lebih ringkas di layar sempit). */
const displayUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors hover:text-accent"
    >
      {children}
    </a>
  );
}

export default function ContactPage() {
  const { socials, location, whatsapp, email } = siteConfig;

  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: "Email",
      value: (
        <a href={`mailto:${email}`} className="transition-colors hover:text-accent">
          {email}
        </a>
      ),
    },
    {
      label: "GitHub",
      value: socials.github ? (
        <ExternalLink href={socials.github}>{displayUrl(socials.github)}</ExternalLink>
      ) : (
        <Placeholder>GitHub menyusul</Placeholder>
      ),
    },
    {
      label: "Instagram",
      value: socials.instagram ? (
        <ExternalLink href={socials.instagram}>{displayUrl(socials.instagram)}</ExternalLink>
      ) : (
        <Placeholder>Instagram menyusul</Placeholder>
      ),
    },
    {
      label: "Lokasi",
      value: location ?? <Placeholder>Lokasi menyusul</Placeholder>,
    },
  ];

  return (
    <>
      <section className="border-b border-border pb-16 pt-16 lg:pb-24 lg:pt-24">
        <div className="container">
          <RevealText
            as="h1"
            lines={["Mari Berkolaborasi", "dan Bangun Solusi", "Digital Anda"]}
            className="font-display text-[clamp(2.75rem,7vw,6.5rem)] uppercase leading-[0.9]"
          />
          <p className="mt-8 max-w-2xl text-xl leading-relaxed">
            Siap mendiskusikan kebutuhan proyek web, konsultasi arsitektur sistem,
            atau peluang kerja sama.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-5">
            <div className="space-y-4">
              <p className="text-sm text-muted">Kontak utama WhatsApp</p>
              <p className="font-display text-4xl leading-none">{whatsapp.display}</p>
              <Magnetic>
                <a
                  href={whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-none bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Chat via WhatsApp
                </a>
              </Magnetic>
            </div>

            <ul>
              {rows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-t border-border py-4 last:border-b"
                >
                  <span className="text-sm text-muted">{row.label}</span>
                  <span className="min-w-0 text-right [overflow-wrap:anywhere]">{row.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
