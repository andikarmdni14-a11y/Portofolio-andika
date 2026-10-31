export type NavItem = { label: string; href: string };
export type StatItem = { value: string; label: string };

export const siteConfig = {
  name: "Andika Ramadhani",
  role: "Full Stack Web Developer",
  description:
    "Halo, saya Andika Ramadhani — Full Stack Web Developer yang berfokus pada pembangunan aplikasi web berkinerja tinggi, responsif, dan terintegrasi secara modular.",
  email: "Andikarmdni22@gmail.com",
  whatsapp: {
    display: "+62 897-9714-321",
    url: "https://wa.me/628979714321",
  },
  socials: {
    github: "https://github.com/andikarmdni14-a11y" as string | null,
    instagram: null as string | null, // PLACEHOLDER: URL belum diberikan
  },
  // PLACEHOLDER: lokasi belum diberikan.
  location: null as string | null,
  // Statistik / social proof (Home). Tambahkan item baru di sini bila data tersedia,
  // format { value: "…", label: "…" }. Isi hanya dengan angka riil, bukan perkiraan.
  stats: [
    { value: "1+", label: "Tahun pengalaman" },
    { value: "1+", label: "Proyek selesai" },
    { value: "1", label: "Klien" },
  ] satisfies StatItem[],
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
};
