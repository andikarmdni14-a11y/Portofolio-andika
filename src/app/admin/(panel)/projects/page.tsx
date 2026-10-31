import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteProject } from "@/actions/admin/projects";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { buttonPrimary, buttonSecondary } from "@/components/admin/ui";
import { getAdminContext } from "@/lib/supabase/admin-auth";

export const metadata: Metadata = { title: "Proyek" };

const STATUS_TEXT: Record<string, string> = {
  created: "Proyek berhasil dibuat.",
  updated: "Perubahan berhasil disimpan.",
  deleted: "Proyek berhasil dihapus.",
  error: "Aksi gagal. Silakan coba lagi.",
};

type Row = {
  id: string;
  slug: string;
  title: string;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

function Badge({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`inline-block border px-2 py-0.5 text-xs ${accent ? "border-accent" : "border-border text-muted"}`}>
      {children}
    </span>
  );
}

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");

  const { data, error } = await ctx.supabase
    .from("projects")
    .select("id, slug, title, category, is_featured, is_published, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  const projects = (data ?? []) as Row[];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl uppercase leading-none">Proyek</h1>
        <Link href="/admin/projects/new" className={buttonPrimary}>+ Proyek baru</Link>
      </div>

      {status && STATUS_TEXT[status] ? (
        <p role="status" className="border border-accent px-4 py-3 text-sm">{STATUS_TEXT[status]}</p>
      ) : null}
      {error ? (
        <p role="alert" className="border border-accent px-4 py-3 text-sm">Gagal memuat proyek.</p>
      ) : null}

      {projects.length === 0 && !error ? (
        <p className="border border-dashed border-border px-4 py-6 text-muted">
          Belum ada proyek. Halaman publik menampilkan data cadangan FitoMotor (dari PRD)
          sampai proyek pertama diterbitkan.
        </p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Urutan</th>
                <th scope="col" className="px-4 py-3 font-medium">Judul</th>
                <th scope="col" className="px-4 py-3 font-medium">Kategori</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 tabular-nums">{project.sort_order}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-muted">/{project.slug}</p>
                  </td>
                  <td className="px-4 py-3">{project.category}</td>
                  <td className="space-x-2 px-4 py-3">
                    <Badge accent={project.is_published}>{project.is_published ? "Terbit" : "Draf"}</Badge>
                    {project.is_featured ? <Badge>Unggulan</Badge> : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {project.is_published ? (
                        <Link href={`/projects/${project.slug}`} target="_blank" className={buttonSecondary}>Lihat</Link>
                      ) : null}
                      <Link href={`/admin/projects/${project.id}/edit`} className={buttonSecondary}>Edit</Link>
                      <form action={deleteProject}>
                        <input type="hidden" name="id" value={project.id} />
                        <input type="hidden" name="slug" value={project.slug} />
                        <ConfirmSubmit
                          message={`Hapus proyek "${project.title}"? Tindakan ini tidak dapat dibatalkan.`}
                          className={buttonSecondary}
                        >
                          Hapus
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
