// Konstanta & validasi sertifikat yang dipakai server dan browser.

export const CERTIFICATE_BUCKET = "certificates";
export const CERTIFICATE_MAX_BYTES = 5 * 1024 * 1024; // sama dengan file_size_limit bucket

export const CERTIFICATE_MIME: Record<string, { ext: string; type: "image" | "pdf" }> = {
  "image/jpeg": { ext: "jpg", type: "image" },
  "image/png": { ext: "png", type: "image" },
  "image/webp": { ext: "webp", type: "image" },
  "application/pdf": { ext: "pdf", type: "pdf" },
};
export const CERTIFICATE_ACCEPT = Object.keys(CERTIFICATE_MIME).join(",");

/** Path objek yang sah: "<uuid>.<ext>" — dibuat oleh form admin, bukan nama file asli. */
export const CERTIFICATE_PATH_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|pdf)$/;

export function fileTypeFromPath(path: string): "image" | "pdf" {
  return path.endsWith(".pdf") ? "pdf" : "image";
}

export const MIN_YEAR = 1990;
export const maxYear = () => new Date().getFullYear() + 1;

export type CertificateFormValues = { title: string; issuer: string; year: string };
export type CertificateFormErrors = Partial<Record<keyof CertificateFormValues | "file", string>>;

export const EMPTY_CERTIFICATE_VALUES: CertificateFormValues = { title: "", issuer: "", year: "" };

export function validateCertificateValues(values: CertificateFormValues): CertificateFormErrors {
  const errors: CertificateFormErrors = {};
  const title = values.title.trim();
  const issuer = values.issuer.trim();
  const year = Number(values.year);
  if (!title) errors.title = "Judul wajib diisi.";
  else if (title.length > 160) errors.title = "Judul maksimal 160 karakter.";
  if (!issuer) errors.issuer = "Penerbit wajib diisi.";
  else if (issuer.length > 120) errors.issuer = "Penerbit maksimal 120 karakter.";
  if (!/^\d{4}$/.test(values.year.trim()) || year < MIN_YEAR || year > maxYear()) {
    errors.year = `Tahun harus antara ${MIN_YEAR} dan ${maxYear()}.`;
  }
  return errors;
}

export function validateCertificateFile(file: File): string | undefined {
  if (!CERTIFICATE_MIME[file.type]) return "Format harus JPG, PNG, WebP, atau PDF.";
  if (file.size > CERTIFICATE_MAX_BYTES) return "Ukuran file maksimal 5 MB.";
  return undefined;
}
