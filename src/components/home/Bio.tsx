import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Vercel",
];

export function Bio() {
  return (
    <section aria-labelledby="bio-heading" className="py-20 lg:py-28">
      <div className="container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RevealText
            as="h2"
            id="bio-heading"
            lines={["Tentang", "Saya"]}
            className="font-display text-5xl uppercase leading-none md:text-6xl"
          />
        </div>

        <div className="space-y-8 lg:col-span-7">
          <p className="max-w-2xl text-xl leading-relaxed md:text-2xl">
            Berpengalaman dalam merancang arsitektur perangkat lunak berbasis web
            dari hulu ke hilir. Berfokus pada skalabilitas, efisiensi kode, serta
            pengalaman pengguna yang intuitif dan berestetika tinggi.
          </p>

          <ul aria-label="Tech stack utama" className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-none border border-border px-4 py-2 text-sm"
              >
                {tech}
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="inline-flex border-b-2 border-accent pb-1 text-sm font-medium transition-colors hover:text-accent"
          >
            Selengkapnya tentang saya
          </Link>
        </div>
      </div>
    </section>
  );
}
