-- =====================================================================
-- Skema Supabase — Website Portofolio High-Impact (Fase 1)
-- Jalankan di Supabase Dashboard → SQL Editor. Aman dijalankan berulang (idempoten).
-- Cakupan: tabel projects, contacts, admins + Row Level Security.
-- =====================================================================

-- ---------- 1. Admin ----------
-- Hanya user yang terdaftar di tabel ini yang dianggap admin.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- Tanpa policy: tabel tidak bisa dibaca langsung lewat API, hanya via is_admin().

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- 2. Trigger updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- 3. Projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary text not null,
  category text not null,                       -- mis. Web App, Landing Page, Full Stack
  tech_stack text[] not null default '{}',
  challenge text,
  solution text,
  key_features text[] not null default '{}',
  thumbnail_url text,
  gallery_urls text[] not null default '{}',
  live_url text,
  repo_url text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;

drop policy if exists "Publik membaca proyek terpublikasi" on public.projects;
create policy "Publik membaca proyek terpublikasi"
  on public.projects for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "Admin membaca semua proyek" on public.projects;
create policy "Admin membaca semua proyek"
  on public.projects for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin menambah proyek" on public.projects;
create policy "Admin menambah proyek"
  on public.projects for insert
  to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admin mengubah proyek" on public.projects;
create policy "Admin mengubah proyek"
  on public.projects for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin menghapus proyek" on public.projects;
create policy "Admin menghapus proyek"
  on public.projects for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------- 4. Contacts (pesan dari form kontak) ----------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%._%'),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contacts enable row level security;

grant insert on public.contacts to anon;
grant select, insert, update, delete on public.contacts to authenticated;

-- Pengunjung hanya boleh MENGIRIM pesan (tidak bisa membaca/mengubah).
-- Catatan: insert dari form jangan memakai .select() setelahnya.
drop policy if exists "Publik mengirim pesan" on public.contacts;
create policy "Publik mengirim pesan"
  on public.contacts for insert
  to anon, authenticated
  with check (is_read = false);

drop policy if exists "Admin membaca pesan" on public.contacts;
create policy "Admin membaca pesan"
  on public.contacts for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin menandai pesan" on public.contacts;
create policy "Admin menandai pesan"
  on public.contacts for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin menghapus pesan" on public.contacts;
create policy "Admin menghapus pesan"
  on public.contacts for delete
  to authenticated
  using ((select public.is_admin()));

-- ---------- 5. Mendaftarkan akun admin (jalankan SETELAH user dibuat) ----------
-- Authentication → Users → Add user, lalu ganti email di bawah dan jalankan:
--
-- insert into public.admins (user_id)
-- select id from auth.users where email = 'EMAIL_ADMIN_ANDA';
--
-- Disarankan menonaktifkan pendaftaran publik: Authentication → Sign In / Providers
-- → matikan "Allow new users to sign up".
--
-- ---------- 6. Data awal ----------
-- Lanjutkan dengan supabase/seed.sql (studi kasus FitoMotor).
