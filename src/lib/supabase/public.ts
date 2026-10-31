import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase tanpa cookie, khusus membaca data publik (RLS tetap berlaku).
 * Tidak memakai cookies() sehingga halaman publik tetap bisa di-cache/ISR.
 * Mengembalikan null bila environment Supabase belum diisi.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
