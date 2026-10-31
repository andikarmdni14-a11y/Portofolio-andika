# Website Portofolio High-Impact — Andika Ramadhani

Status: **Fase 7 (lengkap)** — seluruh fase 1–7 sudah termasuk. Stack: Next.js (App Router), Tailwind CSS v3.4, Supabase + Supabase Auth, Vercel.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi nilai Supabase
npm run dev
```

## Supabase

1. Buat project di Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Buat user admin (Authentication → Users), lalu daftarkan lewat query di bagian 5 pada `schema.sql`.

## Fase 2 — Home

- `src/components/home/` — Hero (teks raksasa "PORTFOLIO" + foto overlapping + partikel 3D + statistik), FeaturedProjects/ProjectCard, Bio.
- `src/components/motion/` — RevealText, Magnetic, CustomCursor (Framer Motion).
- `src/lib/projects.ts` — membaca proyek unggulan dari Supabase (`is_featured` + `is_published`); memakai data FitoMotor dari PRD bila Supabase belum diisi/kosong.
- `public/images/andika-hero.jpg` — foto profil (bar hitam letterbox sudah dipotong).
- Hero selalu bertema gelap (class `dark` pada section) agar teks terbaca di atas foto; hapus class tersebut jika ingin mengikuti tema.

## Fase 3 — About Me

- `src/app/about/page.tsx` — bio, bento grid keahlian, timeline karier.
- `src/components/about/` — SkillsBento, BentoCard, Timeline (garis rel terisi mengikuti gulir).
- `src/lib/about-data.ts` — seluruh konten About (bersumber dari PRD). Field `null` = placeholder "menyusul"; isi setelah data tersedia (institusi/periode D3, perusahaan/periode kerja gudang).

## Fase 4 — Projects

- `/projects` — katalog dengan filter kategori (kategori diambil dari data) dan grid bento asimetris.
- `/projects/[slug]` — detail proyek/studi kasus: tantangan, solusi, fitur kunci, tech stack, galeri dalam frame mockup laptop, tautan Live Demo & Repository.
- `src/lib/projects.ts` — `getAllProjects`, `getFeaturedProjects`, `getProjectBySlug` (dari Supabase; data FitoMotor dari PRD dipakai hanya bila Supabase belum diisi/kosong).
- `src/app/not-found.tsx` — halaman 404 bergaya situs.

## Fase 5 — Services & Contact

- `/services` — tiga layanan (PRD) dan alur kerja 5 tahap. Konten di `src/lib/services-data.ts`; harga belum ditampilkan.
- `/contact` — form (Server Action `src/app/contact/actions.ts`), info kontak, tombol WhatsApp direct.
- Alur form: validasi server → simpan ke tabel `contacts` (Supabase, RLS hanya izinkan INSERT) → email notifikasi via Resend setelah respons (`after`). Kegagalan email tidak membatalkan pengiriman. Honeypot sebagai anti-spam dasar.
- Env baru: `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`, `RESEND_FROM_EMAIL` (lihat `.env.example`).
- Logika form di `src/lib/contact.ts` (murni, mudah diuji).

## Fase 6 — Admin Dashboard

- `/admin/login` — login Supabase Auth (email + kata sandi).
- `/admin/projects` — daftar, buat, edit, hapus proyek (termasuk draf). Simpan/hapus otomatis me-revalidasi `/`, `/projects`, dan halaman detail.
- `/admin/messages` — baca pesan masuk, tandai dibaca/belum, hapus, balas via email.
- Keamanan berlapis: `src/proxy.ts` (sesi & redirect login) → `getAdminContext()` di layout **dan** setiap Server Action (cek `is_admin`) → RLS di database.
- Validasi form proyek di `src/lib/admin/project-form.ts` (hanya URL https/path relatif yang diterima).
- Prasyarat: jalankan `supabase/schema.sql`, buat user admin, daftarkan ke tabel `admins` (bagian 5 schema), dan matikan pendaftaran publik.

## Fase 7 — Motion global

- `SplashScreen` — hitungan 0–100% lalu sapuan berlapis; sekali per sesi, tidak tampil di /admin, tanpa JS, atau saat reduced-motion.
- `PageTransition` — klik tautan internal dicegat: blok merah + gelap menutupi layar (dengan nama halaman tujuan), rute berganti, lalu tersapu terbuka.
- `intro.ts` — animasi masuk (RevealText) menunggu splash/transisi selesai.
- Navigasi header kini magnetik.

## Struktur

- `tailwind.config.ts` — token warna (CSS variable), font display/body, container.
- `src/app/globals.css` — nilai warna Dark (default) dan Light, focus, reduced motion.
- `src/lib/fonts.ts` — Bebas Neue, Oswald, Anton, Inter, Plus Jakarta Sans via `next/font/google`.
- `src/lib/site.ts` — data situs (nama, kontak, navigasi).
- `src/lib/supabase/` — klien browser dan server.
- `src/app/(site)/` — halaman publik (layout dengan Header, Footer, splash, transisi, kursor kustom).
- `src/app/admin/` — panel admin (layout terpisah).
- `src/actions/` — Server Actions (form kontak & admin).
- `src/components/layout/` — Header, Footer, ThemeToggle.

## Catatan

- `src/app/page.tsx` adalah halaman verifikasi sementara; diganti pada fase Home.
- Build memerlukan akses internet ke Google Fonts (`next/font/google` mengunduh font saat build).
