import Link from "next/link";
import { RevealText } from "@/components/motion/RevealText";
import { getFeaturedProjects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

// Tata letak asimetris tergantung jumlah proyek (maks. 3).
function spanClass(count: number, index: number) {
  if (count === 1) return "md:col-span-12";
  if (count === 2) return index === 0 ? "md:col-span-7" : "md:col-span-5";
  return "md:col-span-6 lg:col-span-4";
}

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects();
  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby="featured-heading"
      className="border-b border-border py-20 lg:py-28"
    >
      <div className="container">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-6">
          <RevealText
            as="h2"
            id="featured-heading"
            lines={["Featured Work"]}
            className="font-display text-5xl uppercase leading-none md:text-6xl"
          />
          <Link
            href="/projects"
            className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            Lihat semua proyek →
          </Link>
        </div>

        <ul className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-12">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              className={spanClass(projects.length, index)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
