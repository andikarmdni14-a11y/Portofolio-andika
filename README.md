# Website Portofolio High-Impact — Andika Ramadhani

Status: **Fase 8** — seluruh kriteria PRD terimplementasi di kode. Sisa pekerjaan hanya pengisian data (lihat [Data yang masih dibutuhkan](#data-yang-masih-dibutuhkan)).
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
4. Buat user admin (Authentication → Users), daftarkan lewat query bagian 5 di `schema.sql`.
5. Matikan pendaftaran publik: Authentication → Sign In / Providers → "Allow new users to sign up".

## Deploy (Vercel)

Hubungkan repository GitHub ke Vercel, lalu isi Environment Variables sesuai `.env.example`:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL`.

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
| `src/app/admin/` | Panel admin: `/admin/login`, `/admin/projects`, `/admin/messages` |
| `src/actions/` | Server Actions: `contact.ts`, `admin/auth.ts`, `admin/projects.ts`, `admin/messages.ts` |
| `src/proxy.ts` | Proxy Next.js 16: sesi Supabase & redirect login untuk `/admin` |
| `src/components/motion/` | SplashScreen, PageTransition, CustomCursor, Magnetic, RevealText, Reveal, ImageReveal |
| `src/components/home/` | Hero, HeroScene (3D), FeaturedProjects, ProjectCard, ServicesSummary, Bio |
| `src/components/services/ServiceList.tsx` | Ringkasan 3 layanan (dipakai di Home & Services) |
| `supabase/schema.sql`, `supabase/seed.sql` | Skema + RLS, data awal FitoMotor |

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

## Data yang masih dibutuhkan

Kode sudah siap menampilkan data berikut; selama kosong, situs menampilkan placeholder "menyusul".

| Data | Tempat mengisi |
|---|---|
| URL Instagram, lokasi | `src/lib/site.ts` → `socials.instagram`, `location` |
| Periode D3 (tahun masuk–lulus / sedang berjalan) | `src/lib/about-data.ts` → `timeline` (urutkan kronologis setelah terisi) |
| Screenshot, galeri, Live Demo, Repository FitoMotor | `/admin/projects` → edit FitoMotor |

## Backlog pasca-rilis (di luar PRD)

Tes otomatis & ESLint, rate-limit form kontak, unggah gambar ke Supabase Storage, SEO lanjutan (Open Graph, sitemap).
