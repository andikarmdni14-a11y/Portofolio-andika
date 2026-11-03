// Menerjemahkan error Supabase menjadi pesan log yang bisa ditindaklanjuti.
// Catatan: saat jaringan gagal, supabase-js mengisi code = "" (string kosong),
// sehingga `error.code ?? error.message` justru mencetak "" — jangan dipakai.

type SupabaseLikeError = { code?: string | null; message?: string | null; details?: string | null; hint?: string | null };

export function describeSupabaseError(error: SupabaseLikeError, status?: number, table?: string): string {
  const code = error.code || "";
  const message = error.message || "";
  const details = error.details || "";
  const raw = [code, message].filter(Boolean).join(" ") || (status ? `HTTP ${status}` : "tanpa detail");

  let hint: string;
  if (code === "PGRST205" || code === "42P01") {
    hint = `tabel ${table ? `"${table}" ` : ""}belum ada — jalankan file SQL-nya di Supabase SQL Editor` +
      (table === "certificates" ? " (supabase/certificates.sql)" : " (supabase/schema.sql)");
  } else if (/fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|network/i.test(`${message} ${details}`)) {
    hint = "Supabase tidak terjangkau — cek NEXT_PUBLIC_SUPABASE_URL di .env.local, koneksi internet, dan status project (Dashboard: bila di-pause, klik Restore)";
  } else if (status === 540 || (status && status >= 500 && !message)) {
    hint = "project Supabase kemungkinan sedang di-pause atau gangguan server — buka Dashboard dan klik Restore project";
  } else if (status === 401 || code === "PGRST301" || /JWT|API key/i.test(message)) {
    hint = "kunci API tidak valid — cek NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local";
  } else if (code === "42501") {
    hint = "izin ditolak — pastikan GRANT & policy RLS dari file SQL sudah dijalankan";
  } else {
    hint = "lihat detail di atas";
  }
  return `${raw} → ${hint}`;
}
