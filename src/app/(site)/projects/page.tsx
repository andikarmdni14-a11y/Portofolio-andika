import type { Metadata } from "next";
import { RevealText } from "@/components/motion/RevealText";
import { ProjectsCatalog } from "@/components/projects/ProjectsCatalog";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Katalog proyek web: aplikasi web, landing page, dan sistem full stack dengan Next.js dan Supabase.",
};

// Data proyek di-cache; diperbarui otomatis tiap 5 menit.
export const revalidate = 300;

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
          <RevealText
            as="h1"
            lines={["Projects"]}
            className="font-display text-[clamp(4rem,12vw,10rem)] uppercase leading-[0.85]"
          />
          <p className="text-muted">{projects.length} proyek</p>
        </div>
        <ProjectsCatalog projects={projects} />
      </div>
    </section>
  );
}
