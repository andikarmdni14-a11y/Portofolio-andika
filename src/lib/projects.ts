import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { safeUrl } from "@/lib/url";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  techStack: string[];
  challenge: string | null;
  solution: string | null;
  keyFeatures: string[];
  thumbnailUrl: string | null;
  galleryUrls: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  isFeatured: boolean;
};

type ProjectRow = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tech_stack: string[] | null;
  challenge: string | null;
  solution: string | null;
  key_features: string[] | null;
  thumbnail_url: string | null;
  gallery_urls: string[] | null;
  live_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
};

const COLUMNS =
  "slug, title, summary, category, tech_stack, challenge, solution, key_features, thumbnail_url, gallery_urls, live_url, repo_url, is_featured";

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    category: row.category,
    techStack: row.tech_stack ?? [],
    challenge: row.challenge,
    solution: row.solution,
    keyFeatures: row.key_features ?? [],
    thumbnailUrl: safeUrl(row.thumbnail_url),
    galleryUrls: (row.gallery_urls ?? [])
      .map(safeUrl)
      .filter((url): url is string => url !== null),
    liveUrl: safeUrl(row.live_url),
    repoUrl: safeUrl(row.repo_url),
    isFeatured: row.is_featured,
  };
}

// Data cadangan dari PRD (studi kasus FitoMotor). Dipakai HANYA bila Supabase
// belum dikonfigurasi, error, atau belum berisi proyek terpublikasi.
// Hapus setelah data proyek diisi lewat Admin.
const fallbackProjects: Project[] = [
  {
    slug: "fitomotor",
    title: "FitoMotor",
    summary: "Platform e-commerce otomotif & manajemen suku cadang terintegrasi.",
    category: "Full Stack",
    techStack: ["Next.js (App Router)", "Supabase"],
    challenge:
      "Membangun alur pemesanan produk secara real-time, sinkronisasi stok otomatis, serta pengelolaan katalog multi-kategori.",
    solution:
      "Diimplementasikan secara end-to-end menggunakan Next.js App Router dan Supabase Database.",
    keyFeatures: [
      "Manajemen katalog produk",
      "Alur pemesanan & keranjang belanja",
      "Kontrol inventaris stok",
      "Dashboard autentikasi admin backend",
    ],
    thumbnailUrl: null, // PLACEHOLDER: screenshot belum diberikan
    galleryUrls: [],
    liveUrl: null, // PLACEHOLDER: tautan Live Demo belum diberikan
    repoUrl: null, // PLACEHOLDER: tautan Repository belum diberikan
    isFeatured: true,
  },
];

/** Seluruh proyek terpublikasi, terurut sort_order lalu terbaru. */
export const getAllProjects = cache(async (): Promise<Project[]> => {
  const supabase = createPublicClient();
  if (!supabase) return fallbackProjects;

  try {
    const { data, error } = await supabase
      .from("projects")
      .select(COLUMNS)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return fallbackProjects;
    return (data as ProjectRow[]).map(toProject);
  } catch {
    return fallbackProjects;
  }
});

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.isFeatured).slice(0, 3);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
