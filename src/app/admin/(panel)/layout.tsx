import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/actions/admin/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { buttonSecondary } from "@/components/admin/ui";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { getAdminContext } from "@/lib/supabase/admin-auth";

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="container grid min-h-dvh place-items-center py-16">
      <div className="max-w-md space-y-4 border border-border p-8">
        <h1 className="font-display text-4xl uppercase">{title}</h1>
        <div className="space-y-4 text-muted">{children}</div>
      </div>
    </main>
  );
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext();

  if (ctx.status === "unconfigured") {
    return (
      <Notice title="Supabase belum dikonfigurasi">
        <p>Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local, lalu jalankan supabase/schema.sql.</p>
      </Notice>
    );
  }
  if (ctx.status === "anonymous") redirect("/admin/login");
  if (ctx.status === "forbidden") {
    return (
      <Notice title="Akses ditolak">
        <p>Akun {ctx.user.email} belum terdaftar sebagai admin. Daftarkan lewat query di bagian 5 supabase/schema.sql.</p>
        <form action={signOut}>
          <button type="submit" className={buttonSecondary}>Keluar</button>
        </form>
      </Notice>
    );
  }

  const { count: unread } = await ctx.supabase
    .from("contacts")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <>
      <header className="border-b border-border">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin/projects" className="font-display text-2xl uppercase tracking-wide">
              Admin
            </Link>
            <AdminNav unread={unread ?? 0} />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="px-2 text-sm text-muted transition-colors hover:text-accent">
              Lihat situs ↗
            </Link>
            <ThemeToggle />
            <form action={signOut}>
              <button type="submit" className={buttonSecondary}>Keluar</button>
            </form>
          </div>
        </div>
      </header>
      <main className="container py-10">{children}</main>
    </>
  );
}
