"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveProject, type ProjectFormState } from "@/actions/admin/projects";
import type { ProjectFormValues } from "@/lib/admin/project-form";
import { buttonPrimary, buttonSecondary, inputClass } from "./ui";

type FieldName = keyof ProjectFormValues;

function Field({
  name,
  label,
  hint,
  error,
  children,
}: {
  name: FieldName;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium">{label}</label>
      {children}
      {hint ? <p id={`${name}-hint`} className="text-xs text-muted">{hint}</p> : null}
      {error ? <p id={`${name}-error`} className="text-sm text-accent">{error}</p> : null}
    </div>
  );
}

export function ProjectForm({
  id,
  originalSlug,
  initialValues,
}: {
  id?: string;
  originalSlug?: string;
  initialValues: ProjectFormValues;
}) {
  const initialState: ProjectFormState = { values: initialValues };
  const [state, formAction, pending] = useActionState(saveProject, initialState);
  const v = state.values;
  const e = state.errors ?? {};

  // Atribut aksesibilitas per field (error/hint terhubung ke input).
  const a11y = (name: FieldName, hasHint = false) => ({
    id: name,
    name,
    "aria-invalid": e[name] ? true : undefined,
    "aria-describedby":
      [e[name] ? `${name}-error` : "", hasHint ? `${name}-hint` : ""].filter(Boolean).join(" ") || undefined,
  });

  return (
    <form action={formAction} className="space-y-10">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      <input type="hidden" name="originalSlug" value={originalSlug ?? ""} />

      {state.message ? (
        <p role="alert" className="border border-accent px-4 py-3 text-sm">{state.message}</p>
      ) : null}

      <fieldset className="space-y-6 border border-border p-6">
        <legend className="px-2 font-display text-2xl uppercase">Informasi utama</legend>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="title" label="Judul" error={e.title}>
            <input {...a11y("title")} required maxLength={120} defaultValue={v.title} className={inputClass} />
          </Field>
          <Field name="slug" label="Slug (URL)" hint="Kosongkan untuk dibuat otomatis dari judul." error={e.slug}>
            <input {...a11y("slug", true)} maxLength={80} defaultValue={v.slug} className={inputClass} />
          </Field>
        </div>
        <Field name="summary" label="Ringkasan" error={e.summary}>
          <textarea {...a11y("summary")} required rows={2} maxLength={300} defaultValue={v.summary} className={inputClass} />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="category" label="Kategori" hint="Dipakai untuk filter katalog." error={e.category}>
            <input {...a11y("category", true)} required list="kategori-proyek" maxLength={60} defaultValue={v.category} className={inputClass} />
            <datalist id="kategori-proyek">
              <option value="Web App" />
              <option value="Landing Page" />
              <option value="Full Stack" />
            </datalist>
          </Field>
          <Field name="sortOrder" label="Urutan tampil" hint="Angka kecil tampil lebih dulu." error={e.sortOrder}>
            <input {...a11y("sortOrder", true)} type="number" step={1} defaultValue={v.sortOrder} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-6 border border-border p-6">
        <legend className="px-2 font-display text-2xl uppercase">Studi kasus</legend>
        <Field name="challenge" label="Tantangan" error={e.challenge}>
          <textarea {...a11y("challenge")} rows={4} maxLength={3000} defaultValue={v.challenge} className={inputClass} />
        </Field>
        <Field name="solution" label="Solusi teknis" error={e.solution}>
          <textarea {...a11y("solution")} rows={4} maxLength={3000} defaultValue={v.solution} className={inputClass} />
        </Field>
        <Field name="keyFeatures" label="Fitur kunci" hint="Satu fitur per baris." error={e.keyFeatures}>
          <textarea {...a11y("keyFeatures", true)} rows={4} defaultValue={v.keyFeatures} className={inputClass} />
        </Field>
        <Field name="techStack" label="Tech stack" hint="Pisahkan dengan koma, mis. Next.js, Supabase." error={e.techStack}>
          <input {...a11y("techStack", true)} defaultValue={v.techStack} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="space-y-6 border border-border p-6">
        <legend className="px-2 font-display text-2xl uppercase">Media & tautan</legend>
        <Field name="thumbnailUrl" label="URL thumbnail" hint="https://… atau path /images/…" error={e.thumbnailUrl}>
          <input {...a11y("thumbnailUrl", true)} type="text" inputMode="url" defaultValue={v.thumbnailUrl} className={inputClass} />
        </Field>
        <Field name="galleryUrls" label="URL galeri" hint="Satu URL per baris, maksimal 12." error={e.galleryUrls}>
          <textarea {...a11y("galleryUrls", true)} rows={3} defaultValue={v.galleryUrls} className={inputClass} />
        </Field>
        <div className="grid gap-6 md:grid-cols-2">
          <Field name="liveUrl" label="URL Live Demo" error={e.liveUrl}>
            <input {...a11y("liveUrl")} type="text" inputMode="url" defaultValue={v.liveUrl} className={inputClass} />
          </Field>
          <Field name="repoUrl" label="URL Repository" error={e.repoUrl}>
            <input {...a11y("repoUrl")} type="text" inputMode="url" defaultValue={v.repoUrl} className={inputClass} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4 border border-border p-6">
        <legend className="px-2 font-display text-2xl uppercase">Publikasi</legend>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isPublished" defaultChecked={v.isPublished} className="size-4 accent-[#C62227]" />
          Terbitkan (tampil di situs publik)
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={v.isFeatured} className="size-4 accent-[#C62227]" />
          Unggulan (tampil di Featured Work Home, maks. 3)
        </label>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className={buttonPrimary}>
          {pending ? "Menyimpan…" : "Simpan proyek"}
        </button>
        <Link href="/admin/projects" className={buttonSecondary}>Batal</Link>
      </div>
    </form>
  );
}
