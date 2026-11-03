"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CERTIFICATE_BUCKET,
  CERTIFICATE_PATH_PATTERN,
  fileTypeFromPath,
  validateCertificateValues,
  type CertificateFormErrors,
  type CertificateFormValues,
} from "@/lib/certificate-shared";
import { getAdminContext } from "@/lib/supabase/admin-auth";
import { describeSupabaseError } from "@/lib/supabase/describe-error";

export type CertificateFormState = {
  message?: string;
  errors?: CertificateFormErrors;
  values: CertificateFormValues;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/about");
}

/**
 * Menyimpan metadata sertifikat. File diunggah lebih dulu oleh browser admin
 * langsung ke Supabase Storage (RLS: hanya admin), lalu path-nya dikirim ke sini.
 * Bila penyimpanan gagal, file baru dihapus agar tidak menjadi sampah di bucket.
 */
export async function saveCertificate(
  _previous: CertificateFormState,
  formData: FormData,
): Promise<CertificateFormState> {
  const values: CertificateFormValues = {
    title: String(formData.get("title") ?? ""),
    issuer: String(formData.get("issuer") ?? ""),
    year: String(formData.get("year") ?? ""),
  };
  const id = String(formData.get("id") ?? "");
  const newPath = String(formData.get("filePath") ?? "");

  if (id && !UUID_PATTERN.test(id)) return { values, message: "ID sertifikat tidak valid." };
  if (newPath && !CERTIFICATE_PATH_PATTERN.test(newPath)) {
    return { values, errors: { file: "File tidak valid. Unggah ulang." }, message: "File tidak valid." };
  }

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") return { values, message: "Sesi berakhir atau akses ditolak. Silakan login ulang." };
  const storage = ctx.supabase.storage.from(CERTIFICATE_BUCKET);
  const discardNewFile = async () => {
    if (newPath) await storage.remove([newPath]);
  };

  // Path lama selalu dibaca dari database, bukan dari isian form.
  let oldPath: string | null = null;
  if (id) {
    const { data } = await ctx.supabase.from("certificates").select("file_path").eq("id", id).maybeSingle();
    if (!data) {
      await discardNewFile();
      return { values, message: "Sertifikat tidak ditemukan." };
    }
    oldPath = data.file_path as string;
  }

  const errors = validateCertificateValues(values);
  if (!newPath && !oldPath) errors.file = "File sertifikat wajib diunggah.";
  if (Object.keys(errors).length > 0) {
    await discardNewFile();
    return { values, errors, message: "Periksa kembali isian yang ditandai." };
  }

  const filePath = newPath || (oldPath as string);
  const row = {
    title: values.title.trim(),
    issuer: values.issuer.trim(),
    year: Number(values.year),
    file_path: filePath,
    file_type: fileTypeFromPath(filePath),
  };

  const { error } = id
    ? await ctx.supabase.from("certificates").update(row).eq("id", id)
    : await ctx.supabase.from("certificates").insert(row);

  if (error) {
    await discardNewFile();
    console.error("[admin] gagal menyimpan sertifikat:", describeSupabaseError(error, undefined, "certificates"));
    return { values, message: "Gagal menyimpan sertifikat. Coba lagi." };
  }

  // File lama diganti → hapus dari bucket.
  if (oldPath && newPath && oldPath !== newPath) await storage.remove([oldPath]);

  revalidatePublic();
  redirect(`/admin/certificates?status=${id ? "updated" : "created"}`);
}

export async function deleteCertificate(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!UUID_PATTERN.test(id)) redirect("/admin/certificates?status=error");

  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");

  const { data } = await ctx.supabase.from("certificates").select("file_path").eq("id", id).maybeSingle();
  const { error } = await ctx.supabase.from("certificates").delete().eq("id", id);
  if (error) {
    console.error("[admin] gagal menghapus sertifikat:", describeSupabaseError(error, undefined, "certificates"));
    redirect("/admin/certificates?status=error");
  }
  if (data?.file_path) await ctx.supabase.storage.from(CERTIFICATE_BUCKET).remove([data.file_path as string]);

  revalidatePublic();
  redirect("/admin/certificates?status=deleted");
}
