export type NavItem = { label: string; href: string };

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
  // PLACEHOLDER: URL belum diberikan — diisi setelah proyek selesai.
  socials: {
    github: null as string | null,
    instagram: null as string | null,
  },
  // PLACEHOLDER: lokasi belum diberikan.
  location: null as string | null,
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
};
