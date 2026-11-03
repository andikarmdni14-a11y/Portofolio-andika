"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseProjectForm,
  type ProjectFormErrors,
  type ProjectFormValues,
} from "@/lib/admin/project-form";
import { getAdminContext } from "@/lib/supabase/admin-auth";
import { describeSupabaseError } from "@/lib/supabase/describe-error";

export type ProjectFormState = {
  message?: string;
  errors?: ProjectFormErrors;
  values: ProjectFormValues;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function revalidatePublic(...slugs: (string | null | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/projects");
  for (const slug of new Set(slugs.filter(Boolean))) revalidatePath(`/projects/${slug}`);
}

/** Membuat (tanpa id) atau memperbarui (dengan id) proyek. */
export async function saveProject(
  _previous: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const { values, errors, row } = parseProjectForm(formData);
  const id = String(formData.get("id") ?? "");
  const originalSlug = String(formData.get("originalSlug") ?? "");

  if (!row) return { values, errors, message: "Periksa kembali isian yang ditandai." };
  if (id && !UUID_PATTERN.test(id)) return { values, message: "ID proyek tidak valid." };

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return { values, message: "Sesi berakhir atau akses ditolak. Silakan login ulang." };

  const { error } = id
    ? await ctx.supabase.from("projects").update(row).eq("id", id)
    : await ctx.supabase.from("projects").insert(row);

  if (error) {
    if (error.code === "23505") {
      return { values, errors: { slug: "Slug sudah dipakai proyek lain." }, message: "Slug sudah dipakai." };
    }
    console.error("[admin] gagal menyimpan proyek:", describeSupabaseError(error, undefined, "projects"));
    return { values, message: "Gagal menyimpan proyek. Coba lagi." };
  }

  revalidatePublic(row.slug, originalSlug);
  redirect(`/admin/projects?status=${id ? "updated" : "created"}`);
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!UUID_PATTERN.test(id)) redirect("/admin/projects?status=error");

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");

  const { error } = await ctx.supabase.from("projects").delete().eq("id", id);
  if (error) {
    console.error("[admin] gagal menghapus proyek:", describeSupabaseError(error, undefined, "projects"));
    redirect("/admin/projects?status=error");
  }

  revalidatePublic(slug);
  redirect("/admin/projects?status=deleted");
}
