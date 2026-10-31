import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { EMPTY_PROJECT_VALUES } from "@/lib/admin/project-form";

export const metadata: Metadata = { title: "Proyek baru" };

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-5xl uppercase leading-none">Proyek baru</h1>
      <ProjectForm initialValues={EMPTY_PROJECT_VALUES} />
    </div>
  );
}
