import { CERTIFICATE_BUCKET } from "./certificate-shared";
import { describeSupabaseError } from "./supabase/describe-error";
import { createPublicClient } from "./supabase/public";

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  year: number;
  fileType: "image" | "pdf";
  url: string;
};

type Row = {
  id: string;
  title: string;
  issuer: string;
  year: number;
  file_type: "image" | "pdf";
  file_path: string;
};

/**
 * Sertifikat terbaru lebih dulu (tahun, lalu waktu unggah).
 * Mengembalikan [] bila Supabase belum dikonfigurasi atau terjadi error,
 * sehingga seksi sertifikat otomatis disembunyikan.
 */
export async function getCertificates(limit?: number): Promise<Certificate[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("certificates")
    .select("id, title, issuer, year, file_type, file_path")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error, status } = await query;
  if (error || !data) {
    // warn, bukan error: situs tetap berjalan, seksi sertifikat disembunyikan.
    if (error) console.warn("[certificates] gagal memuat:", describeSupabaseError(error, status, "certificates"));
    return [];
  }

  return (data as Row[]).map((row) => ({
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    year: row.year,
    fileType: row.file_type,
    url: supabase.storage.from(CERTIFICATE_BUCKET).getPublicUrl(row.file_path).data.publicUrl,
  }));
}
