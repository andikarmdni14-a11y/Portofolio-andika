import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Magnetic } from "@/components/motion/Magnetic";
import { RevealText } from "@/components/motion/RevealText";
import { LaptopMockup } from "@/components/projects/LaptopMockup";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

type PageProps = { params: Promise<{ slug: string }> };

// Data proyek di-cache; diperbarui otomatis tiap 5 menit.
export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyek tidak ditemukan" };
  return { title: project.title, description: project.summary };
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-4xl uppercase leading-none md:text-5xl">
      {children}
    </h2>
  );
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const hasLinks = Boolean(project.liveUrl || project.repoUrl);
  const hasCaseStudy = Boolean(project.challenge || project.solution);

  return (
    <>
      {/* Header proyek */}
      <section className="border-b border-border pb-16 pt-10 lg:pb-24">
        <div className="container">
          <Link
            href="/projects"
            className="text-sm text-muted transition-colors hover:text-accent"
          >
            ← Semua proyek
          </Link>

          <p className="mt-10 flex items-center gap-3 text-sm text-muted">
            <span aria-hidden="true" className="size-2.5 bg-accent" />
            {project.isFeatured ? "Studi Kasus Unggulan · " : ""}
            {project.category}
          </p>

          <RevealText
            as="h1"
            lines={[project.title]}
            className="mt-4 font-display text-[clamp(3.5rem,11vw,9rem)] uppercase leading-[0.85]"
          />
          <p className="mt-6 max-w-2xl text-xl leading-relaxed md:text-2xl">
            {project.summary}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {project.liveUrl ? (
              <Magnetic>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-none bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Live Demo ↗
                </a>
              </Magnetic>
            ) : null}
            {project.repoUrl ? (
              <Magnetic>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-none border border-foreground/40 px-7 py-3.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                >
                  Repository ↗
                </a>
              </Magnetic>
            ) : null}
            {!hasLinks ? (
              <span className="inline-block rounded-none border border-dashed border-border px-3 py-1.5 text-sm text-muted">
                Tautan Live Demo &amp; Repository menyusul
              </span>
            ) : null}
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <LaptopMockup
              src={project.thumbnailUrl}
              alt={`Tampilan utama proyek ${project.title}`}
              placeholder={`Screenshot ${project.title} — menyusul`}
            />
          </div>
        </div>
      </section>

      {/* Tantangan & Solusi */}
      {hasCaseStudy ? (
        <section
          aria-label="Tantangan dan solusi"
          className="border-b border-border py-16 lg:py-24"
        >
          <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
            {project.challenge ? (
              <div className="space-y-5">
                <SectionTitle id="tantangan">Tantangan</SectionTitle>
                <p className="max-w-prose text-lg leading-relaxed text-muted">
                  {project.challenge}
                </p>
              </div>
            ) : null}
            {project.solution ? (
              <div className="space-y-5">
                <SectionTitle id="solusi">Solusi</SectionTitle>
                <p className="max-w-prose text-lg leading-relaxed text-muted">
                  {project.solution}
                </p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Fitur kunci */}
      {project.keyFeatures.length > 0 ? (
        <section
          aria-labelledby="fitur"
          className="border-b border-border py-16 lg:py-24"
        >
          <div className="container grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionTitle id="fitur">Fitur Kunci</SectionTitle>
            </div>
            <ol className="lg:col-span-8">
              {project.keyFeatures.map((feature, index) => (
                <li
                  key={feature}
                  className="flex items-baseline gap-6 border-t border-border py-5 last:border-b"
                >
                  <span className="font-display text-4xl leading-none text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xl">{feature}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Tech stack */}
      {project.techStack.length > 0 ? (
        <section
          aria-labelledby="tech"
          className="border-b border-border py-16 lg:py-24"
        >
          <div className="container grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionTitle id="tech">Tech Stack</SectionTitle>
            </div>
            <ul aria-label="Tech stack proyek" className="flex flex-wrap gap-3 lg:col-span-8">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-none border border-border px-4 py-2 text-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Galeri mockup */}
      <section aria-labelledby="galeri" className="py-16 lg:py-24">
        <div className="container space-y-10">
          <SectionTitle id="galeri">Galeri</SectionTitle>
          {project.galleryUrls.length > 0 ? (
            <div className="grid gap-10 lg:grid-cols-2">
              {project.galleryUrls.map((url, index) => (
                <LaptopMockup
                  key={url}
                  src={url}
                  alt={`Tampilan ${index + 1} proyek ${project.title}`}
                  placeholder="Screenshot menyusul"
                />
              ))}
            </div>
          ) : (
            <p className="inline-block rounded-none border border-dashed border-border px-3 py-1.5 text-sm text-muted">
              Galeri mockup menyusul
            </p>
          )}
        </div>
      </section>
    </>
  );
}
