-- =====================================================================
-- Seed data — Studi Kasus FitoMotor (PRD §6C & §8C) — Fase 8
-- Jalankan SETELAH supabase/schema.sql, di Supabase Dashboard → SQL Editor.
-- Aman dijalankan berulang: baris yang sudah ada (slug sama) tidak ditimpa.
--
-- Tanpa seed ini, FitoMotor hanya tampil dari data cadangan kode
-- (src/lib/projects.ts) dan HILANG begitu ada proyek lain yang dipublikasikan.
-- Screenshot, galeri, Live Demo, dan Repository diisi lewat /admin/projects.
-- =====================================================================

insert into public.projects (
  slug, title, summary, category, tech_stack,
  challenge, solution, key_features,
  is_featured, is_published, sort_order
)
values (
  'fitomotor',
  'FitoMotor',
  'Platform e-commerce otomotif & manajemen suku cadang terintegrasi.',
  'Full Stack',
  array['Next.js (App Router)', 'Supabase'],
  'Membangun alur pemesanan produk secara real-time, sinkronisasi stok otomatis, serta pengelolaan katalog multi-kategori.',
  'Diimplementasikan secara end-to-end menggunakan Next.js App Router dan Supabase Database.',
  array[
    'Manajemen katalog produk',
    'Alur pemesanan & keranjang belanja',
    'Kontrol inventaris stok',
    'Dashboard autentikasi admin backend'
  ],
  true,
  true,
  0
)
on conflict (slug) do nothing;
