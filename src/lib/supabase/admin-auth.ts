import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cache } from "react";
import { createClient } from "./server";

export type AdminContext =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "forbidden"; supabase: SupabaseClient; user: User }
  | { status: "admin"; supabase: SupabaseClient; user: User };

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Status akses admin untuk request saat ini. Dipanggil di layout admin DAN di setiap
 * Server Action admin (Server Action adalah endpoint publik — wajib diperiksa ulang).
 * RLS di database tetap menjadi lapisan pengaman terakhir. Di-cache per request.
 */
export const getAdminContext = cache(async (): Promise<AdminContext> => {
  if (!isSupabaseConfigured()) return { status: "unconfigured" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return { status: "forbidden", supabase, user };

  return { status: "admin", supabase, user };
});
