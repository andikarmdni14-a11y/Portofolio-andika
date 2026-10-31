import {
  backendSkills,
  frontendSkills,
  mainStack,
  softSkills,
  toolSkills,
  vscodeExtensions,
} from "@/lib/about-data";
import { BentoCard } from "./BentoCard";

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-2xl uppercase leading-none">{children}</h3>
  );
}

function Badges({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="mt-5 flex flex-wrap gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-none border border-border px-3 py-1.5 text-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function SkillsBento() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
      <BentoCard className="md:col-span-2 lg:col-span-5 lg:row-span-2">
        <CardTitle>Tech Stack Utama</CardTitle>
        <ul aria-label="Tech stack utama" className="mt-6">
          {mainStack.map((tech) => (
            <li
              key={tech}
              className="border-t border-border py-3 font-display text-3xl uppercase leading-none"
            >
              {tech}
            </li>
          ))}
        </ul>
      </BentoCard>

      <BentoCard delay={0.08} className="md:col-span-2 lg:col-span-7">
        <CardTitle>Frontend</CardTitle>
        <Badges items={frontendSkills} label="Keahlian frontend" />
      </BentoCard>

      <BentoCard delay={0.12} className="lg:col-span-3">
        <CardTitle>Backend / Database</CardTitle>
        <Badges items={backendSkills} label="Keahlian backend dan database" />
      </BentoCard>

      <BentoCard delay={0.16} className="lg:col-span-4">
        <CardTitle>Tools & Deployment</CardTitle>
        <Badges items={toolSkills} label="Tools dan deployment" />
        <p className="mt-5 text-sm text-muted">
          Ekstensi VS Code: {vscodeExtensions.join(", ")}.
        </p>
      </BentoCard>

      <BentoCard delay={0.2} className="md:col-span-2 lg:col-span-12">
        <CardTitle>Soft Skills</CardTitle>
        <ul className="mt-6 grid gap-8 md:grid-cols-2">
          {softSkills.map((skill) => (
            <li key={skill.title} className="border-t border-border pt-5">
              <p className="font-medium">{skill.title}</p>
              <p className="mt-2 max-w-md text-muted">{skill.description}</p>
            </li>
          ))}
        </ul>
      </BentoCard>
    </div>
  );
}
