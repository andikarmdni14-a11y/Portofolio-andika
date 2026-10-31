"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/home/ProjectCard";
import type { Project } from "@/lib/projects";

const ALL = "Semua";

// Grid bento asimetris: pasangan 7/5 lalu 5/7; kartu tunggal di baris akhir melebar penuh.
function bentoSpan(count: number, index: number) {
  if (count === 1 || (index === count - 1 && index % 2 === 0)) {
    return "lg:col-span-12";
  }
  const firstOfPair = index % 2 === 0;
  const evenPair = Math.floor(index / 2) % 2 === 0;
  if (evenPair) return firstOfPair ? "lg:col-span-7" : "lg:col-span-5";
  return firstOfPair ? "lg:col-span-5" : "lg:col-span-7";
}

export function ProjectsCatalog({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(ALL);

  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))),
    [projects],
  );

  const visible =
    active === ALL
      ? projects
      : projects.filter((project) => project.category === active);

  const options = [ALL, ...categories];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter kategori proyek"
        className="flex flex-wrap gap-3"
      >
        {options.map((option) => {
          const count =
            option === ALL
              ? projects.length
              : projects.filter((project) => project.category === option).length;
          const isActive = option === active;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(option)}
              className={`rounded-none border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              {option} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* key = kategori aktif: kartu dirender ulang sehingga animasi reveal berulang */}
      <ul
        key={active}
        className="mt-10 grid items-start gap-x-8 gap-y-14 lg:grid-cols-12"
      >
        {visible.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={projects.indexOf(project)}
            className={bentoSpan(visible.length, index)}
          />
        ))}
      </ul>
    </div>
  );
}
