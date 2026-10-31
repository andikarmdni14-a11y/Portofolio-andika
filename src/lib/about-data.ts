// Seluruh konten halaman About bersumber dari PRD.
// Pada TimelineItem: field `null` = data belum diberikan (ditampilkan sebagai
// placeholder "menyusul"); field `undefined` = memang tidak ditampilkan.

export const mainStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Vercel",
];

export const frontendSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
];

export const backendSkills = ["Node.js", "Python", "Supabase", "PostgreSQL"];

export const toolSkills = ["Vercel", "Streamlit", "GitHub", "Visual Studio Code"];

export const vscodeExtensions = [
  "Material Icon Theme",
  "Live Preview",
  "Better Comments",
  "vscode-pets",
];

export const softSkills = [
  {
    title: "Warehouse & Inventory Management",
    description:
      "Membentuk logika yang kuat dalam menyusun database e-commerce dan dashboard.",
  },
  {
    title: "Time Management",
    description:
      "Menyeimbangkan kelas karyawan di Universitas Esa Unggul dengan pekerjaan di gudang.",
  },
];

export type TimelineItem = {
  category: "Pendidikan" | "Pengalaman";
  title: string;
  organization?: string | null;
  period?: string | null;
  description?: string;
};

// Urutan sementara: periode D3 belum diberikan, sehingga urutan kronologis
// belum dapat dipastikan. Urutkan ulang setelah periode diisi.
export const timeline: TimelineItem[] = [
  {
    category: "Pendidikan",
    title: "Diploma 3 (D3) Sistem Informasi",
    organization: "Universitas Esa Unggul",
    period: null, // PLACEHOLDER: periode belum diberikan
  },
  {
    category: "Pengalaman",
    title: "Warehouse & Inventory Management",
    organization: "The Dens Living",
    period: "1 tahun",
    description:
      "Pekerjaan gudang yang membentuk logika kuat dalam menyusun database e-commerce dan dashboard.",
  },
  {
    category: "Pengalaman",
    title: "Full Stack Web Developer",
    period: "1+ tahun",
    description:
      "Membangun platform e-commerce FitoMotor: katalog multi-kategori, alur pemesanan real-time, sinkronisasi stok otomatis, dan dashboard admin dengan Next.js App Router dan Supabase.",
  },
];
