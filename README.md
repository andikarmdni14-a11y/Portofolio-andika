# Website Portofolio High-Impact — Andika Ramadhani

Status: **Fase 9** — seluruh kriteria PRD terimplementasi di kode. Sisa pekerjaan hanya pengisian data (lihat [Data yang masih dibutuhkan](#data-yang-masih-dibutuhkan)).
Stack: Next.js 16 (App Router), Tailwind CSS v3.4, Supabase + Supabase Auth, Framer Motion, React Three Fiber, Vercel.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi nilai Supabase & Resend
npm run dev
npm run typecheck            # tsc --noEmit
```

Build memerlukan akses internet ke Google Fonts (`next/font/google` mengunduh font saat build).

## Supabase

1. Buat project di Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor (tabel `projects`, `contacts`, `admins` + RLS).
3. Jalankan `supabase/seed.sql` — studi kasus FitoMotor (wajib; aman dijalankan berulang).
4. Jalankan `supabase/certificates.sql` — tabel `certificates` + bucket Storage `certificates` (publik, maks. 5 MB, JPG/PNG/WebP/PDF) beserta policy admin.
5. Buat user admin (Authentication → Users), daftarkan lewat query bagian 5 di `schema.sql`.
6. Matikan pendaftaran publik: Authentication → Sign In / Providers → "Allow new users to sign up".

## Deploy (Vercel)

Hubungkan repository GitHub ke Vercel, lalu isi Environment Variables sesuai `.env.example`:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`.

## Akses Admin

- **Tombol rahasia:** klik 3x cepat pada nama **ANDIKA RAMADHANI** di header (dari halaman mana pun) → `/admin`.
- Atau buka langsung `https://<domain>/admin`. Belum login → diarahkan ke `/admin/login`.
- Hanya akun yang terdaftar di tabel `admins` yang bisa masuk (lihat bagian Supabase).

## Struktur

| Lokasi | Isi |
|---|---|
| `tailwind.config.ts` | Token warna (CSS variable), font display/body, container |
| `src/app/globals.css` | Nilai warna Dark (default) & Light, transisi tema, reduced motion |
| `src/lib/fonts.ts` | Bebas Neue, Oswald, Anton, Inter, Plus Jakarta Sans (`next/font/google`) |
| `src/lib/site.ts` | Nama, kontak, WhatsApp, sosial, lokasi, **statistik**, navigasi |
| `src/lib/about-data.ts` | Tech stack, keahlian, soft skills, timeline |
| `src/lib/services-data.ts` | Layanan PRD + seluruh isi Pricelist |
| `src/lib/projects.ts` | Baca proyek dari Supabase (+ data cadangan FitoMotor) |
| `src/app/(site)/` | Halaman publik: `/`, `/about`, `/projects`, `/projects/[slug]`, `/services`, `/contact` |
| `src/app/admin/` | Panel admin: `/admin/login`, `/admin/projects`, `/admin/certificates`, `/admin/messages` |
| `src/actions/` | Server Actions: `contact.ts`, `admin/auth.ts`, `admin/projects.ts`, `admin/messages.ts` |
| `src/proxy.ts` | Proxy Next.js 16: sesi Supabase & redirect login untuk `/admin` |
| `src/components/motion/` | SplashScreen, PageTransition, CustomCursor, Magnetic, RevealText, Reveal, ImageReveal |
| `src/components/home/` | Hero, HeroScene (3D), FeaturedProjects, ProjectCard, ServicesSummary, Bio |
| `src/components/services/ServiceList.tsx` | Ringkasan 3 layanan (dipakai di Home & Services) |
| `src/components/certificates/` | Grid & kartu sertifikat (About), `home/CertificatesSummary.tsx` (3 terbaru di Home) |
| `src/lib/certificates.ts`, `src/lib/certificate-shared.ts` | Baca sertifikat publik; konstanta & validasi bersama (server + browser) |
| `supabase/schema.sql`, `supabase/seed.sql`, `supabase/certificates.sql` | Skema + RLS, data awal FitoMotor, sertifikat + Storage |

## Riwayat fase

- **Fase 1–2** — Fondasi (tema, font, Supabase) dan Home: Hero ("PORTFOLIO" paralaks, foto overlapping, partikel 3D, statistik), Featured Work, Bio.
- **Fase 3** — About: bio, bento grid keahlian, timeline dengan garis rel mengikuti gulir.
- **Fase 4** — Projects: katalog + filter kategori, grid bento asimetris, detail `/projects/[slug]` (tantangan, solusi, fitur, tech stack, galeri mockup laptop, tautan).
- **Fase 5** — Services & Contact: form kontak (validasi server → tabel `contacts` → email Resend via `after()`, honeypot), WhatsApp direct.
- **Fase 6** — Admin: login Supabase Auth, CRUD proyek (termasuk draf), kelola pesan. Keamanan berlapis: `proxy.ts` → `getAdminContext()` di layout & setiap Server Action → RLS.
- **Fase 7 / 7.1** — Motion global (splash 0–100%, transisi halaman menyapu, kursor kustom, navigasi magnetik), perbaikan listener transisi (capture phase + Back/Forward), pricelist lengkap di Services.

### Fase 8 — Penyelesaian audit QA

- **Foto hero HD**: `public/images/andika-hero-hd.webp` 2553×3840 RGBA (sebelumnya 1702×2560). Sumber palet 253 warna dibersihkan dari dither, diperbesar dengan super-resolution LapSRN, lalu dipertajam halus. Ditampilkan dengan `quality={90}` (`next.config.ts` → `images.qualities: [75, 90]`).
- **Hero tetap gelap di kedua tema** (keputusan final): PRD §5E mewajibkan foto di-blend ke latar gelap; tepi cutout mengikuti bayangan wajah sehingga tidak menyatu di latar terang.
- **Home → Ringkasan Layanan** (`ServicesSummary`) memakai `ServiceList` yang sama dengan halaman Services.
- **Theme Toggle**: `role="switch"` + `aria-checked` (via `useSyncExternalStore`), ikon matahari/bulan berotasi & berganti skala, umpan balik tekan; tetap beranimasi selama transisi warna, nonaktif saat reduced-motion.
- **Statistik** dipusatkan di `siteConfig.stats` dan muncul meluncur dari bawah setelah splash.
- **FitoMotor** di-seed ke database (`supabase/seed.sql`) agar tidak hilang saat proyek lain dipublikasikan.
- **Services**: tambahan Pricelist §4 Matriks Fitur Utama (tabel di desktop, daftar bertumpuk di mobile) dan §7 Teknologi & Standar; Add-On menjadi seksi 05.
- **"PORTFOLIO"**: `pt-[0.03em]` agar puncak huruf tidak terpotong batas hero.
- **Teks sekunder Light Mode** `#6B7280` ditetapkan (kontras ±4,6:1 di `#F9F9F9`; `#9CA3AF` hanya ±2,4:1).
- Data diisi (Fase 8.1): statistik "1 Klien", GitHub, D3 Sistem Informasi Universitas Esa Unggul, pengalaman di The Dens Living (1 tahun).
- Verifikasi: `tsc` 0 error; `next build` 13 rute; tanpa scroll horizontal di 6 halaman × 2 tema × desktop/mobile; sakelar tema, transisi halaman, dan splash diuji di Chromium.

### Fase 8.2 – 8.3

- **Tombol rahasia Admin**: klik 3x pada nama di header (`Header.tsx`).
- **Ketentuan & Garansi → accordion** (`components/services/TermsAccordion.tsx`): berbasis `<details>`/`<summary>` (tetap berfungsi tanpa JS, teks tetap di HTML), animasi tinggi Framer Motion, ikon "+" berotasi 45°, keyboard Enter/Space. Tinggi halaman Services di mobile 390 px: 16.114 → 15.321 px (seksi Ketentuan 1.525 → 732 px).

- **Kartu paket geser horizontal di bawah lg** (`components/services/TierScroller.tsx`): scroll-snap, kartu berikutnya mengintip di tepi, indikator `01 / 03` + tombol lompat; desktop tetap grid 3 kolom. Tinggi Services mobile: 15.321 → 12.929 px (Landing 2.475 → 1.289 px, Company Profile 2.439 → 1.233 px). Total sejak Fase 8.3: 16.114 → 12.929 px (−20%).

### Fase 9 — Sertifikat

- **Admin** → menu **Sertifikat** (`/admin/certificates`): tambah, edit, ganti file, hapus. Isian: judul, penerbit, tahun, file (JPG/PNG/WebP/PDF, maks. 5 MB).
- **Alur unggah:** browser admin mengunggah file langsung ke Supabase Storage (nama acak `<uuid>.<ext>`, hanya admin lewat RLS), lalu Server Action menyimpan metadata. Bila penyimpanan gagal, file baru dihapus; saat file diganti atau sertifikat dihapus, file lama ikut dihapus dari bucket.
- **Tampilan publik:** About → seksi **Sertifikat** (`/about#sertifikat`, semua, terbaru dulu); Home → **3 terbaru** + tautan "Lihat semua sertifikat". Kartu rasio 4:3, color-block reveal, kursor "View", membuka file di tab baru; PDF tampil sebagai ubin "PDF". Seksi tersembunyi otomatis selama belum ada sertifikat.

- **Fase 9.1 — Foto hero diganti**: `public/images/andika-hero-2.webp` 2432×3656 RGBA (147 KB). Sumber 2052×2048 (palet 256 warna) dipotong ke potret ±2:3 di sekitar subjek, dibersihkan dari dither, diperbesar LapSRN, lalu dipertajam halus. Nama file baru agar cache gambar Vercel tidak menampilkan foto lama.

- **Fase 9.2 — Perbaikan**: log error Supabase kini menyebut penyebab & solusinya (`lib/supabase/describe-error.ts`) — sebelumnya mencetak `""` karena supabase-js mengisi `code` dengan string kosong saat jaringan gagal. Kegagalan memuat sertifikat memakai `console.warn` (situs tetap jalan). `schema.sql` kini aman dijalankan ulang (`drop policy if exists`).

## Data yang masih dibutuhkan

Kode sudah siap menampilkan data berikut; selama kosong, situs menampilkan placeholder "menyusul".

| Data | Tempat mengisi |
|---|---|
| URL Instagram, lokasi | `src/lib/site.ts` → `socials.instagram`, `location` |
| Periode D3 (tahun masuk–lulus / sedang berjalan) | `src/lib/about-data.ts` → `timeline` (urutkan kronologis setelah terisi) |
| Screenshot, galeri, Live Demo, Repository FitoMotor | `/admin/projects` → edit FitoMotor |

## Backlog pasca-rilis (di luar PRD)

Tes otomatis & ESLint, rate-limit form kontak, unggah gambar ke Supabase Storage, SEO lanjutan (Open Graph, sitemap).
