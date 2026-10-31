// Logika murni form proyek admin (tanpa dependensi Next.js/Supabase) agar mudah diuji.
import { safeUrl } from "../url";

export type ProjectFormValues = {
  title: string;
  slug: string;
  summary: string;
  category: string;
  techStack: string; // dipisah koma
  challenge: string;
  solution: string;
  keyFeatures: string; // satu per baris
  thumbnailUrl: string;
  galleryUrls: string; // satu per baris
  liveUrl: string;
  repoUrl: string;
  sortOrder: string;
  isFeatured: boolean;
  isPublished: boolean;
};

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues, string>>;

export type ProjectRowInput = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tech_stack: string[];
  challenge: string | null;
  solution: string | null;
  key_features: string[];
  thumbnail_url: string | null;
  gallery_urls: string[];
  live_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
};

export const EMPTY_PROJECT_VALUES: ProjectFormValues = {
  title: "",
  slug: "",
  summary: "",
  category: "",
  techStack: "",
  challenge: "",
  solution: "",
  keyFeatures: "",
  thumbnailUrl: "",
  galleryUrls: "",
  liveUrl: "",
  repoUrl: "",
  sortOrder: "0",
  isFeatured: false,
  isPublished: false,
};

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const text = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
};

const splitList = (value: string, separator: RegExp) =>
  value
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);

export function parseProjectForm(fd: FormData): {
  values: ProjectFormValues;
  errors: ProjectFormErrors;
  row: ProjectRowInput | null;
} {
  const values: ProjectFormValues = {
    title: text(fd, "title"),
    slug: text(fd, "slug").toLowerCase(),
    summary: text(fd, "summary"),
    category: text(fd, "category"),
    techStack: text(fd, "techStack"),
    challenge: text(fd, "challenge"),
    solution: text(fd, "solution"),
    keyFeatures: text(fd, "keyFeatures"),
    thumbnailUrl: text(fd, "thumbnailUrl"),
    galleryUrls: text(fd, "galleryUrls"),
    liveUrl: text(fd, "liveUrl"),
    repoUrl: text(fd, "repoUrl"),
    sortOrder: text(fd, "sortOrder") || "0",
    isFeatured: fd.get("isFeatured") === "on",
    isPublished: fd.get("isPublished") === "on",
  };

  const errors: ProjectFormErrors = {};
  const slug = values.slug || slugify(values.title);

  if (!values.title) errors.title = "Judul wajib diisi.";
  else if (values.title.length > 120) errors.title = "Judul maksimal 120 karakter.";

  if (!slug) errors.slug = "Slug wajib diisi.";
  else if (!SLUG_PATTERN.test(slug) || slug.length > 80)
    errors.slug = "Gunakan huruf kecil, angka, dan tanda hubung (mis. fito-motor).";

  if (!values.summary) errors.summary = "Ringkasan wajib diisi.";
  else if (values.summary.length > 300) errors.summary = "Ringkasan maksimal 300 karakter.";

  if (!values.category) errors.category = "Kategori wajib diisi.";
  else if (values.category.length > 60) errors.category = "Kategori maksimal 60 karakter.";

  if (values.challenge.length > 3000) errors.challenge = "Maksimal 3000 karakter.";
  if (values.solution.length > 3000) errors.solution = "Maksimal 3000 karakter.";

  const techStack = splitList(values.techStack, /,/);
  if (techStack.some((item) => item.length > 60)) errors.techStack = "Tiap item maksimal 60 karakter.";

  const keyFeatures = splitList(values.keyFeatures, /\n/);
  if (keyFeatures.some((item) => item.length > 200)) errors.keyFeatures = "Tiap fitur maksimal 200 karakter.";

  const urlField = (key: "thumbnailUrl" | "liveUrl" | "repoUrl") => {
    if (!values[key]) return null;
    const url = safeUrl(values[key]);
    if (!url) errors[key] = "URL harus diawali https:// (atau path /...).";
    return url;
  };
  const thumbnailUrl = urlField("thumbnailUrl");
  const liveUrl = urlField("liveUrl");
  const repoUrl = urlField("repoUrl");

  const galleryRaw = splitList(values.galleryUrls, /\n/);
  const gallery = galleryRaw.map(safeUrl);
  if (gallery.some((url) => url === null)) errors.galleryUrls = "Setiap baris harus URL https:// (atau path /...).";
  else if (gallery.length > 12) errors.galleryUrls = "Maksimal 12 gambar.";

  const sortOrder = Number(values.sortOrder);
  if (!Number.isInteger(sortOrder) || Math.abs(sortOrder) > 9999)
    errors.sortOrder = "Urutan harus bilangan bulat antara -9999 dan 9999.";

  if (Object.keys(errors).length > 0) return { values, errors, row: null };

  return {
    values: { ...values, slug },
    errors,
    row: {
      slug,
      title: values.title,
      summary: values.summary,
      category: values.category,
      tech_stack: techStack,
      challenge: values.challenge || null,
      solution: values.solution || null,
      key_features: keyFeatures,
      thumbnail_url: thumbnailUrl,
      gallery_urls: gallery as string[],
      live_url: liveUrl,
      repo_url: repoUrl,
      is_featured: values.isFeatured,
      is_published: values.isPublished,
      sort_order: sortOrder,
    },
  };
}

/** Baris database → nilai form (untuk halaman edit). */
export function rowToFormValues(row: Partial<ProjectRowInput>): ProjectFormValues {
  return {
    title: row.title ?? "",
    slug: row.slug ?? "",
    summary: row.summary ?? "",
    category: row.category ?? "",
    techStack: (row.tech_stack ?? []).join(", "),
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    keyFeatures: (row.key_features ?? []).join("\n"),
    thumbnailUrl: row.thumbnail_url ?? "",
    galleryUrls: (row.gallery_urls ?? []).join("\n"),
    liveUrl: row.live_url ?? "",
    repoUrl: row.repo_url ?? "",
    sortOrder: String(row.sort_order ?? 0),
    isFeatured: row.is_featured ?? false,
    isPublished: row.is_published ?? false,
  };
}
