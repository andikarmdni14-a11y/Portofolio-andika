-- =====================================================================
-- Sertifikat — Fase 9
-- Jalankan di Supabase Dashboard → SQL Editor, SETELAH schema.sql.
-- Aman dijalankan berulang (idempotent).
-- Isi: tabel certificates + RLS, bucket Storage "certificates" + policy.
-- =====================================================================

-- ---------- 1. Tabel ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  issuer text not null check (char_length(issuer) between 1 and 120),
  year smallint not null check (year between 1990 and 2100),
  -- Path objek di bucket "certificates", mis. "3f2c...e1.pdf"
  file_path text not null unique,
  file_type text not null check (file_type in ('image', 'pdf')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists certificates_latest_idx
  on public.certificates (year desc, created_at desc);

drop trigger if exists certificates_set_updated_at on public.certificates;
create trigger certificates_set_updated_at
  before update on public.certificates
  for each row execute function public.set_updated_at();

alter table public.certificates enable row level security;

grant select on public.certificates to anon;
grant select, insert, update, delete on public.certificates to authenticated;

drop policy if exists "Publik membaca sertifikat" on public.certificates;
create policy "Publik membaca sertifikat"
  on public.certificates for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin menambah sertifikat" on public.certificates;
create policy "Admin menambah sertifikat"
  on public.certificates for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admin mengubah sertifikat" on public.certificates;
create policy "Admin mengubah sertifikat"
  on public.certificates for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin menghapus sertifikat" on public.certificates;
create policy "Admin menghapus sertifikat"
  on public.certificates for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------- 2. Storage ----------
-- Bucket publik: file bisa dibuka lewat URL publik (untuk ditampilkan di situs).
-- Batas 5 MB; hanya JPG, PNG, WebP, dan PDF.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'certificates', 'certificates', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Hanya admin yang bisa mengunggah, mengganti, dan menghapus file.
drop policy if exists "Admin melihat file sertifikat" on storage.objects;
create policy "Admin melihat file sertifikat"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'certificates' and (select public.is_admin()));

drop policy if exists "Admin mengunggah file sertifikat" on storage.objects;
create policy "Admin mengunggah file sertifikat"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'certificates' and (select public.is_admin()));

drop policy if exists "Admin mengganti file sertifikat" on storage.objects;
create policy "Admin mengganti file sertifikat"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'certificates' and (select public.is_admin()))
  with check (bucket_id = 'certificates' and (select public.is_admin()));

drop policy if exists "Admin menghapus file sertifikat" on storage.objects;
create policy "Admin menghapus file sertifikat"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'certificates' and (select public.is_admin()));
