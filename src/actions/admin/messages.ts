"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/admin-auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function adminClientOrRedirect() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");
  return ctx.supabase;
}

export async function setMessageRead(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const read = formData.get("read") === "true";
  if (!UUID_PATTERN.test(id)) return;

  const supabase = await adminClientOrRedirect();
  const { error } = await supabase.from("contacts").update({ is_read: read }).eq("id", id);
  if (error) console.error("[admin] gagal memperbarui pesan:", error.code ?? error.message);
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!UUID_PATTERN.test(id)) return;

  const supabase = await adminClientOrRedirect();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) console.error("[admin] gagal menghapus pesan:", error.code ?? error.message);
  revalidatePath("/admin", "layout");
}
