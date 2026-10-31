import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { rowToFormValues, type ProjectRowInput } from "@/lib/admin/project-form";
import { getAdminContext } from "@/lib/supabase/admin-auth";

export const metadata: Metadata = { title: "Edit proyek" };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");

  const { data } = await ctx.supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as ProjectRowInput & { id: string };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-5xl uppercase leading-none">Edit: {row.title}</h1>
      <ProjectForm id={row.id} originalSlug={row.slug} initialValues={rowToFormValues(row)} />
    </div>
  );
}
