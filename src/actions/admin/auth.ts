"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/admin-auth";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; email: string };

export async function signIn(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isSupabaseConfigured()) {
    return { email, error: "Supabase belum dikonfigurasi (cek .env.local)." };
  }
  if (!email || !password) {
    return { email, error: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Pesan umum: tidak membocorkan apakah email terdaftar.
    return { email, error: "Email atau kata sandi salah." };
  }

  redirect("/admin");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
