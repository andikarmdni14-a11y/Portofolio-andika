"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { saveCertificate, type CertificateFormState } from "@/actions/admin/certificates";
import {
  CERTIFICATE_ACCEPT,
  CERTIFICATE_BUCKET,
  CERTIFICATE_MIME,
  maxYear,
  MIN_YEAR,
  validateCertificateFile,
  validateCertificateValues,
  type CertificateFormErrors,
  type CertificateFormValues,
} from "@/lib/certificate-shared";
import { createClient } from "@/lib/supabase/client";
import { buttonPrimary, buttonSecondary, inputClass } from "./ui";

type FileInfo = { url: string; type: "image" | "pdf"; name?: string };

function FilePreview({ file }: { file: FileInfo }) {
  return (
    <div className="flex items-center gap-4 border border-border p-3">
      <div className="grid h-20 w-28 shrink-0 place-items-center overflow-hidden bg-surface">
        {file.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.url} alt="" className="h-full w-full object-contain" />
        ) : (
          <span className="font-display text-2xl text-accent">PDF</span>
        )}
      </div>
      <div className="min-w-0 text-sm">
        {file.name ? <p className="truncate font-medium">{file.name}</p> : null}
        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-muted underline-offset-4 hover:text-accent hover:underline">
          Buka file ↗
        </a>
      </div>
    </div>
  );
}

export function CertificateForm({
  id,
  initialValues,
  currentFile,
}: {
  id?: string;
  initialValues: CertificateFormValues;
  currentFile?: FileInfo;
}) {
  const [state, formAction, pending] = useActionState<CertificateFormState, FormData>(saveCertificate, {
    values: initialValues,
  });
  const [clientErrors, setClientErrors] = useState<CertificateFormErrors>({});
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<FileInfo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Lepas object URL pratinjau saat diganti / komponen dilepas.
  useEffect(() => () => { if (selected) URL.revokeObjectURL(selected.url); }, [selected]);

  const errors = { ...state.errors, ...clientErrors };
  const busy = uploading || pending;

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return setSelected(null);
    const problem = validateCertificateFile(file);
    setClientErrors((prev) => ({ ...prev, file: problem }));
    setSelected(
      problem ? null : { url: URL.createObjectURL(file), type: CERTIFICATE_MIME[file.type].type, name: file.name },
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: CertificateFormValues = {
      title: String(formData.get("title") ?? ""),
      issuer: String(formData.get("issuer") ?? ""),
      year: String(formData.get("year") ?? ""),
    };
    const file = fileRef.current?.files?.[0];

    // Validasi sebelum unggah, agar tidak ada file yatim di bucket.
    const nextErrors = validateCertificateValues(values);
    if (file) {
      const problem = validateCertificateFile(file);
      if (problem) nextErrors.file = problem;
    } else if (!id) {
      nextErrors.file = "File sertifikat wajib diunggah.";
    }
    setClientErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    formData.delete("file");
    if (file) {
      setUploading(true);
      const path = `${crypto.randomUUID()}.${CERTIFICATE_MIME[file.type].ext}`;
      const { error } = await createClient()
        .storage.from(CERTIFICATE_BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      setUploading(false);
      if (error) {
        setClientErrors({ file: "Gagal mengunggah file. Pastikan certificates.sql sudah dijalankan, lalu coba lagi." });
        return;
      }
      formData.set("filePath", path);
    }
    startTransition(() => formAction(formData));
  }

  const field = (name: keyof CertificateFormValues) => ({
    id: name,
    name,
    defaultValue: state.values[name],
    // Pesan error hilang begitu isian diubah
    onChange: () => errors[name] && setClientErrors((prev) => ({ ...prev, [name]: undefined })),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: inputClass,
  });
  const ErrorText = ({ name }: { name: keyof CertificateFormErrors }) =>
    errors[name] ? <p id={`${name}-error`} className="text-sm text-accent">{errors[name]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-2xl space-y-8">
      {id ? <input type="hidden" name="id" value={id} /> : null}

      {state.message ? (
        <p role="alert" className="border border-accent px-4 py-3 text-sm">{state.message}</p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">Judul sertifikat</label>
        <input {...field("title")} maxLength={160} placeholder="mis. Full Stack Web Development" />
        <ErrorText name="title" />
      </div>

      <div className="grid gap-8 sm:grid-cols-[1fr_10rem]">
        <div className="space-y-2">
          <label htmlFor="issuer" className="block text-sm font-medium">Penerbit</label>
          <input {...field("issuer")} maxLength={120} placeholder="mis. Dicoding Indonesia" />
          <ErrorText name="issuer" />
        </div>
        <div className="space-y-2">
          <label htmlFor="year" className="block text-sm font-medium">Tahun</label>
          <input {...field("year")} type="number" inputMode="numeric" min={MIN_YEAR} max={maxYear()} placeholder={String(new Date().getFullYear())} />
          <ErrorText name="year" />
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="file" className="block text-sm font-medium">
          File sertifikat {id ? <span className="font-normal text-muted">(opsional — isi untuk mengganti)</span> : null}
        </label>
        {currentFile && !selected ? <FilePreview file={currentFile} /> : null}
        {selected ? <FilePreview file={selected} /> : null}
        <input
          ref={fileRef}
          id="file"
          name="file"
          type="file"
          accept={CERTIFICATE_ACCEPT}
          onChange={onFileChange}
          aria-invalid={errors.file ? true : undefined}
          aria-describedby={`file-hint${errors.file ? " file-error" : ""}`}
          className="block w-full text-sm text-muted file:mr-4 file:cursor-pointer file:rounded-none file:border file:border-border file:bg-transparent file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:border-accent hover:file:text-accent"
        />
        <p id="file-hint" className="text-xs text-muted">JPG, PNG, WebP, atau PDF. Maksimal 5 MB.</p>
        <ErrorText name="file" />
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button type="submit" disabled={busy} className={buttonPrimary}>
          {uploading ? "Mengunggah file…" : pending ? "Menyimpan…" : "Simpan sertifikat"}
        </button>
        <Link href="/admin/certificates" className={buttonSecondary}>Batal</Link>
      </div>
    </form>
  );
}
