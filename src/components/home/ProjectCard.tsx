"use client";

import Link from "next/link";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import type { Project } from "@/lib/projects";

export function ProjectCard({
  project,
  index,
  className,
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  return (
    <li className={className}>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="View"
        className="group block"
      >
        {/* Rasio tetap: mencegah layout shift saat gambar dimuat */}
        <ImageReveal className="aspect-[16/10] border border-border bg-surface">
          {project.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnailUrl}
              alt={`Pratinjau proyek ${project.title}`}
              loading="lazy"
              className="size-full object-cover"
            />
          ) : (
            <div className="grid size-full place-items-center p-6 text-center">
              <p className="text-sm text-muted">
                Pratinjau {project.title} — menyusul
              </p>
            </div>
          )}
        </ImageReveal>

        <div className="mt-5 flex items-start gap-5">
          <span className="font-display text-4xl leading-none text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <h3 className="font-display text-3xl uppercase leading-none">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{project.category}</p>
          </div>
          <Magnetic>
            <span className="grid size-11 place-items-center border border-border transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Magnetic>
        </div>
        <p className="mt-4 max-w-prose text-muted">{project.summary}</p>
      </Link>
    </li>
  );
}
