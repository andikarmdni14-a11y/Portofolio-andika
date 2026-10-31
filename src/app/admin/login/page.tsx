import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/admin-auth";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="container grid min-h-dvh place-items-center py-16">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="font-display text-6xl uppercase leading-none">Admin</h1>
          <p className="mt-3 text-muted">Masuk untuk mengelola proyek dan pesan.</p>
        </div>
        {!isSupabaseConfigured() ? (
          <p role="alert" className="border border-dashed border-border px-4 py-3 text-sm text-muted">
            Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan
            NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.
          </p>
        ) : null}
        <LoginForm />
        <Link href="/" className="text-sm text-muted transition-colors hover:text-accent">
          ← Kembali ke situs
        </Link>
      </div>
    </main>
  );
}
