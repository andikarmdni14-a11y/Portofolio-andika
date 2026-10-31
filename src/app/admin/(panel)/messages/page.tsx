import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { deleteMessage, setMessageRead } from "@/actions/admin/messages";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { buttonSecondary } from "@/components/admin/ui";
import { getAdminContext } from "@/lib/supabase/admin-auth";

export const metadata: Metadata = { title: "Pesan" };

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// Zona waktu tampilan: WIB (Asia/Jakarta).
const formatDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Jakarta",
});

export default async function AdminMessagesPage() {
  const ctx = await getAdminContext();
  if (ctx.status !== "admin") redirect("/admin/login");

  const { data, error } = await ctx.supabase
    .from("contacts")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const messages = (data ?? []) as Message[];
  const unread = messages.filter((message) => !message.is_read).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl uppercase leading-none">Pesan</h1>
        <p className="text-sm text-muted">
          {messages.length} pesan · {unread} belum dibaca
        </p>
      </div>

      {error ? (
        <p role="alert" className="border border-accent px-4 py-3 text-sm">Gagal memuat pesan.</p>
      ) : null}

      {messages.length === 0 && !error ? (
        <p className="border border-dashed border-border px-4 py-6 text-muted">Belum ada pesan masuk.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`border p-5 md:p-6 ${message.is_read ? "border-border" : "border-border border-l-4 border-l-accent"}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {message.name}
                  {!message.is_read ? (
                    <span className="ml-3 border border-accent px-2 py-0.5 text-xs">Baru</span>
                  ) : null}
                </p>
                <time dateTime={message.created_at} className="text-xs text-muted">
                  {formatDate.format(new Date(message.created_at))}
                </time>
              </div>
              <a href={`mailto:${message.email}`} className="text-sm text-muted transition-colors hover:text-accent">
                {message.email}
              </a>
              <p className="mt-4 whitespace-pre-wrap break-words">{message.message}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent("Re: Pesan dari situs portofolio")}`}
                  className={buttonSecondary}
                >
                  Balas via email
                </a>
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="read" value={message.is_read ? "false" : "true"} />
                  <button type="submit" className={buttonSecondary}>
                    {message.is_read ? "Tandai belum dibaca" : "Tandai dibaca"}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <ConfirmSubmit message={`Hapus pesan dari ${message.name}?`} className={buttonSecondary}>
                    Hapus
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
