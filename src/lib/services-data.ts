// Konten halaman Services.
// - `services`: ringkasan layanan dari PRD (bagian 8D).
// - Paket, harga, maintenance, add-on, alur kerja, dan ketentuan bersumber dari
//   "Pricelist Jasa Website (Revisi Final Terpadu)" — Fase 7.1.
// - Matriks perbandingan (§4) dan teknologi & standar performa (§7) — Fase 8.

export const servicesIntro =
  "Jasa pembuatan web dan sistem fungsional kompleks yang disesuaikan untuk skala UMKM.";

export const services = [
  {
    title: "Pengembangan Web Application & Custom Dashboard",
    description:
      "Solusi perangkat lunak berbasis web interaktif dengan integrasi basis data dan analitik terstruktur.",
  },
  {
    title: "Website UMKM & E-Commerce Modular",
    description:
      "Transisi digital untuk usaha kecil dan menengah dengan sistem katalog dan checkout efisien.",
  },
  {
    title: "Modernisasi UI/UX & Optimasi Performa",
    description:
      "Pembaruan tampilan web dan peningkatan kecepatan akses serta visibilitas SEO.",
  },
];

export const pricelistTagline =
  "Solusi Digital Profesional, Fast Loading & High Conversion untuk Perkembangan Bisnis Anda.";

/** Format Rupiah: 850000 → "Rp 850.000". */
export function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export type PackageTier = {
  label: string; // label kecil di atas nama paket
  name: string;
  price: number;
  highlight?: boolean; // tier "Paling Diminati"
  audience: string;
  features: string[];
  revision: string;
  warranty: string;
  duration: string;
};

export const starterPackage = {
  label: "Program Peduli UMKM",
  name: "Paket Starter",
  price: 350_000,
  description:
    "Saya percaya setiap usaha kecil berhak tampil profesional. Paket ini didedikasikan secara khusus untuk membantu pedagang kecil, usaha mikro, atau perintis bisnis agar memiliki etalase digital yang layak dengan biaya sangat terjangkau.",
  features: [
    "Gratis Domain (.my.id / .biz.id) atau Subdomain & Hosting (Tahun Pertama)",
    "Desain Landing Page Ringkas (2–3 Seksi: Profil/Produk, Galeri Singkat, Tombol WA)",
    "Direct WhatsApp Checkout & Tampilan Mobile-First (Super Cepat)",
    "Waktu Pengerjaan 2–3 Hari Kerja · Garansi Dukungan Teknis 14 Hari",
  ],
  note: "Materi teks, harga produk, dan foto disediakan penuh oleh klien.",
};

export const landingPage = {
  title: "Website Landing Page",
  subtitle: "1 Halaman",
  description:
    "Fokus pada halaman tunggal berdaya konversi tinggi untuk promosi produk, jasa, campaign iklan (Google/Meta Ads), atau penutupan transaksi langsung via WhatsApp.",
  tiers: [
    {
      label: "Standard",
      name: "Basic",
      price: 850_000,
      audience:
        "UMKM baru, produk tunggal, atau uji coba pasar dengan anggaran terbatas.",
      features: [
        "Gratis Domain .com/.id & Hosting (Tahun Pertama)",
        "4–5 Seksi Utama (Hero, Keunggulan, Ringkasan, Testimoni, Footer)",
        "Materi disediakan klien",
        "Tombol Floating WhatsApp",
        "Optimasi Gambar & Kode",
      ],
      revision: "1x Minor",
      warranty: "14 Hari",
      duration: "3–5 Hari Kerja",
    },
    {
      label: "Paling Diminati",
      name: "Pro",
      price: 1_500_000,
      highlight: true,
      audience:
        "Bisnis yang ingin tampil kredibel & siap diiklankan di medsos atau Google.",
      features: [
        "Seluruh Fitur Basic",
        "8–10 Seksi Lengkap (+Galeri, FAQ, Maps)",
        "Bantuan Copywriting (s.d. 1.000 kata)",
        "Formulir Lead Kontak ke Email/WA",
        "SEO Dasar & Speed Boost",
      ],
      revision: "2x Major, 3x Minor",
      warranty: "30 Hari",
      duration: "4–7 Hari Kerja",
    },
    {
      label: "Best Value",
      name: "Max",
      price: 2_500_000,
      audience:
        "Brand premium & pengiklan besar yang butuh otomatisasi data calon pembeli.",
      features: [
        "Seluruh Fitur Pro",
        "Maks. 15 Seksi Lengkap & Terstruktur",
        "Copywriting Persuasif Penuh",
        "Bot Telegram / WA Real-Time",
        "Rekap Otomatis Google Sheets",
        "Pemasangan Pixel Meta / TikTok",
      ],
      revision: "2x Major, 5x Minor",
      warranty: "90 Hari (Termasuk Maintenance)",
      duration: "5–8 Hari Kerja",
    },
  ] satisfies PackageTier[],
};

export const companyProfile = {
  title: "Company Profile & Web Bisnis",
  subtitle: "Multi-Halaman",
  description:
    "Meningkatkan citra profesional perusahaan atau bisnis jasa dengan penyampaian informasi bisnis secara komprehensif, elegan, dan mudah dikelola.",
  tiers: [
    {
      label: "Standard",
      name: "Basic",
      price: 2_200_000,
      audience: "Perusahaan kecil/menengah yang butuh profil resmi tepercaya.",
      features: [
        "Gratis Domain & Hosting (Tahun Pertama)",
        "3–4 Halaman Utama (Beranda, Tentang Kami, Layanan, Kontak)",
        "Materi disediakan klien",
        "Arsitektur Web Statis & Cepat",
        "Form Kontak ke Email",
      ],
      revision: "2x Minor",
      warranty: "60 Hari",
      duration: "1–2 Minggu",
    },
    {
      label: "Paling Diminati",
      name: "Pro",
      price: 3_800_000,
      highlight: true,
      audience: "Perusahaan yang rutin update produk, portofolio, atau blog.",
      features: [
        "5–7 Halaman Utama (+Portofolio/Blog)",
        "Bantuan Copywriting (s.d. 1.500 kata)",
        "Dashboard Admin (CMS Login)",
        "Notifikasi Telegram & Sheets",
        "Laporan Google Analytics 4",
      ],
      revision: "2x Major, 3x Minor",
      warranty: "120 Hari",
      duration: "2–3 Minggu",
    },
    {
      label: "Enterprise",
      name: "Enterprise",
      price: 5_800_000,
      audience: "Bisnis berkembang pesat yang butuh transaksi atau booking.",
      features: [
        "Hingga 10 Halaman Utama",
        "Bantuan Teks Profesional Penuh",
        "Termasuk 1 Fitur Khusus (Katalog/Booking/Multi-Bahasa)",
        "Email Balasan Otomatis",
        "Schema Markup SEO Lanjutan",
      ],
      revision: "3x Major, 5x Minor",
      warranty: "270 Hari",
      duration: "3–4 Minggu",
    },
  ] satisfies PackageTier[],
};

export const maintenance = {
  title: "Maintenance & Support Berkelanjutan",
  description:
    "Pastikan website Anda tetap aman, cepat, dan relevan setelah masa garansi berakhir, dengan dukungan purna jual bulanan/tahunan.",
  plans: [
    {
      name: "Basic Care",
      scope:
        "Monitoring Uptime 24/7, Pembaruan Patch Keamanan & Plugin, Backup Database Mingguan.",
      price: 500_000,
    },
    {
      name: "Active Growth",
      scope:
        "Seluruh fitur Basic Care + Kuota update konten minor (s.d. 3 kali), Optimasi Speed Bulanan, Laporan Analitik Pengunjung.",
      price: 1_200_000,
    },
  ],
};

/** Pricelist §4 — Matriks Perbandingan Fitur Utama. */
export const comparisonMatrix = {
  columns: ["Landing Page (Semua Tier)", "Company Profile (Semua Tier)"] as const,
  // Label ringkas untuk tampilan mobile (keterangan "semua tier" ada di deskripsi seksi).
  shortColumns: ["Landing Page", "Company Profile"] as const,
  rows: [
    { spec: "Domain & Hosting", landing: "Gratis (Tahun Pertama)", company: "Gratis (Tahun Pertama)" },
    { spec: "Struktur Website", landing: "1 Halaman Panjang (Seksi)", company: "Multi-Halaman (Menu)" },
    { spec: "Integrasi WA & Maps", landing: "Ya", company: "Ya" },
    { spec: "Dashboard Admin", landing: "Tidak (Desain Statis Kustom)", company: "Ya (Khusus Pro & Enterprise)" },
    { spec: "Fokus Konten", landing: "Direct-Response / Promosi", company: "Brand Awareness / Edukasi" },
    { spec: "Fitur E-Commerce / Booking", landing: "Sebagai Add-on", company: "Termasuk di Paket Enterprise" },
  ],
};

export const addOns = [
  {
    name: "Integrasi Payment Gateway",
    price: 1_000_000,
    description: "Terima bayar otomatis via QRIS, VA Bank, & Credit Card (Midtrans/Xendit).",
  },
  {
    name: "Sistem Booking / Reservasi",
    price: 1_000_000,
    description:
      "Fitur pemilihan tanggal & jam untuk penjadwalan reservasi atau konsultasi.",
  },
  {
    name: "Katalog E-Commerce Dinamis",
    price: 1_500_000,
    description: "Manajemen produk, keranjang belanja, & kalkulasi total otomatis di sistem.",
  },
  {
    name: "Fitur Multi-Bahasa",
    price: 800_000,
    description:
      "Implementasi website bilingual (contoh: ID & EN) untuk menargetkan pasar internasional.",
  },
  {
    name: "Desain UI/UX Khusus Figma",
    price: 1_500_000,
    description:
      "Pembuatan mockup presisi tinggi sebelum proses development dimulai (untuk revisi visual detail).",
  },
  {
    name: "SEO Lanjutan & Artikel Blog",
    price: 750_000,
    unit: "/ Bulan",
    description:
      "Pembuatan 4 artikel teroptimasi SEO setiap bulan untuk meningkatkan peringkat Google organik.",
  },
  {
    name: "Buyout Source Code / Beli Putus",
    price: 2_500_000,
    description:
      "Hak milik penuh atas seluruh arsitektur backend untuk dipindah ke server internal.",
  },
] as { name: string; price: number; unit?: string; description: string }[];

export const workflow = [
  {
    title: "Konsultasi & Pengumpulan Materi",
    description:
      "Penentuan paket, diskusi kebutuhan fitur, dan penyerahan materi awal (Logo, Profil, Referensi, Akses).",
  },
  {
    title: "Pembayaran Down Payment (DP)",
    description: "Pembayaran 50% sebagai tanda jadi dimulainya proyek.",
  },
  {
    title: "Proses Desain & Development",
    description:
      "Pembuatan tata letak awal dan pengkodean website sesuai estimasi waktu paket yang dipilih.",
  },
  {
    title: "Review & Revisi",
    description:
      "Website ditampilkan melalui tautan sementara (staging) untuk diuji coba dan direvisi oleh klien sesuai batasan paket.",
  },
  {
    title: "Pelunasan & Serah Terima Final",
    description:
      "Setelah klien menyetujui hasil akhir, dilakukan pelunasan sisa 50%. Akses admin diberikan, dan website dipublikasikan ke domain publik.",
  },
];

/** Pricelist §7 — Teknologi & Standar Performa. */
export const techStandards = {
  intro:
    "Tanpa template siap pakai yang memberatkan server. Seluruh website dibangun menggunakan standar industri web modern.",
  items: [
    {
      title: "Infrastruktur Modern",
      description:
        "Dibangun dengan arsitektur terkini (seperti Next.js, React, atau optimasi CMS tingkat lanjut) untuk menjamin waktu muat (Fast Loading) kurang dari 3 detik.",
    },
    {
      title: "Mobile-First & Responsif",
      description:
        "Antarmuka dipastikan proporsional dan nyaman dinavigasi dari berbagai ukuran layar, khususnya ponsel pintar.",
    },
    {
      title: "Skor Performa Tinggi",
      description:
        "Telah melalui uji Google Lighthouse untuk memastikan skor performa, aksesibilitas, dan SEO standar (Best Practices) terpenuhi.",
    },
    {
      title: "Keamanan Standar Industri",
      description:
        "Dilengkapi dengan perlindungan SSL Enkripsi, optimasi keamanan database, dan proteksi dari serangan dasar.",
    },
  ],
};

export const terms = [
  {
    title: "Skema Pembayaran",
    description:
      "DP 50% dibayarkan saat proyek disepakati. Pelunasan 50% dibayarkan setelah website selesai 100%, dites, dan disetujui (sebelum aktivasi domain live).",
  },
  {
    title: "Biaya Perpanjangan (Tahun ke-2 dst.)",
    description:
      "Landing Page Rp 450.000/tahun. Company Profile Rp 650.000 – Rp 850.000/tahun. Biaya mencakup perpanjangan Domain, SSL, Hosting, dan server cloud. Paket UMKM menyesuaikan harga ekstensi (.my.id) yang lebih murah.",
  },
  {
    title: "Kebijakan Upgrade Paket",
    description:
      "Klien dapat melakukan upgrade (misal dari Starter ke Pro) hanya dengan membayar selisih harga dan biaya administrasi integrasi, apabila diajukan maksimal 3 bulan sejak serah terima. Lebih dari waktu tersebut, dihitung sebagai pembaruan proyek.",
  },
  {
    title: "Keterlambatan Materi",
    description:
      "Waktu pengerjaan dihitung sejak seluruh materi utama diterima lengkap. Jika penyerahan materi dari klien tertunda lebih dari 14 hari kerja, antrean proyek dijadwalkan ulang.",
  },
  {
    title: "Cakupan Garansi & Maintenance",
    description:
      "Garansi mencakup perbaikan bug/error teknis dan difokuskan pada stabilitas server, bukan perombakan desain. Garansi gugur otomatis apabila kode diubah oleh pihak ketiga.",
  },
  {
    title: "Kepemilikan Sistem & Aset",
    description:
      "Layanan bawaan bersifat Managed Software as a Service (SaaS): arsitektur backend tetap milik pengembang. Klien memiliki hak penuh atas domain, data pelanggan, serta konten, dan dapat membeli hak milik backend melalui opsi Buyout Source Code.",
  },
];

export const closingCta = {
  title: "Mari Diskusikan Kebutuhan Bisnis Anda",
  description:
    "Dapatkan konsultasi gratis untuk menentukan paket terbaik bagi operasional Anda.",
};
