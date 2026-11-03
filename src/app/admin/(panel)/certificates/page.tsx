import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteCertificate } from "@/actions/admin/certificates";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { buttonPrimary, buttonSecondary } from "@/components/admin/ui";
import { CERTIFICATE_BUCKET } from "@/lib/certificate-shared";
import { getAdminContext } from "@/lib/supabase/admin-auth";

export const metadata: Metadata = { title: "Sertifikat" };

const STATUS_TEXT: Record<string, string> = {
  created: "Sertifikat berhasil ditambahkan.",
  updated: "Perubahan berhasil disimpan.",
  deleted: "Sertifikat berhasil dihapus.",
  error: "Aksi gagal. Silakan coba lagi.",
};

type Row = { id: string; title: string; issuer: string; year: number; file_type: "image" | "pdf"; file_path: string };

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");

  const { data, error } = await ctx.supabase
    .from("certificates")
    .select("id, title, issuer, year, file_type, file_path")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  const storage = ctx.supabase.storage.from(CERTIFICATE_BUCKET);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl uppercase leading-none">Sertifikat</h1>
          <p className="mt-2 text-sm text-muted">
            Tampil di halaman About; 3 terbaru juga tampil di Beranda.
          </p>
        </div>
        <Link href="/admin/certificates/new" className={buttonPrimary}>+ Sertifikat baru</Link>
      </div>

      {status && STATUS_TEXT[status] ? (
        <p role="status" className="border border-accent px-4 py-3 text-sm">{STATUS_TEXT[status]}</p>
      ) : null}
      {error ? (
        <p role="alert" className="border border-accent px-4 py-3 text-sm">
          Gagal memuat sertifikat. Pastikan <code>supabase/certificates.sql</code> sudah dijalankan.
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="border border-dashed border-border px-4 py-6 text-muted">
          Belum ada sertifikat. Seksi sertifikat di situs publik tersembunyi sampai sertifikat pertama ditambahkan.
        </p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">File</th>
                <th scope="col" className="px-4 py-3 font-medium">Judul</th>
                <th scope="col" className="px-4 py-3 font-medium">Tahun</th>
                <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const url = storage.getPublicUrl(row.file_path).data.publicUrl;
                return (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="grid h-12 w-16 place-items-center overflow-hidden bg-surface">
                        {row.file_type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt="" className="h-full w-full object-contain" />
                        ) : (
                          <span className="font-display text-lg text-accent">PDF</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{row.title}</p>
                      <p className="text-xs text-muted">{row.issuer}</p>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{row.year}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <a href={url} target="_blank" rel="noopener noreferrer" className={buttonSecondary}>Buka</a>
                        <Link href={`/admin/certificates/${row.id}/edit`} className={buttonSecondary}>Edit</Link>
                        <form action={deleteCertificate}>
                          <input type="hidden" name="id" value={row.id} />
                          <ConfirmSubmit
                            message={`Hapus sertifikat "${row.title}" beserta filenya? Tindakan ini tidak dapat dibatalkan.`}
                            className={buttonSecondary}
                          >
                            Hapus
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
