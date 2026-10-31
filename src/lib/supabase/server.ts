import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Supabase client untuk Server Component, Server Action, dan Route Handler. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari Server Component: cookie tidak bisa ditulis. Aman diabaikan.
          }
        },
      },
    },
  );
}
