// Logika murni form kontak (tanpa dependensi Next.js) agar mudah diuji.

export type ContactValues = { name: string; email: string; message: string };
export type ContactFieldErrors = Partial<Record<keyof ContactValues, string>>;

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function parseContactForm(formData: FormData) {
  const values: ContactValues = {
    name: field(formData, "name").trim().replace(/\s+/g, " "),
    email: field(formData, "email").trim(),
    message: field(formData, "message").replace(/\r\n/g, "\n").trim(),
  };

  // Honeypot: kolom tersembunyi yang tidak diisi manusia.
  const isBot = field(formData, "website").trim() !== "";

  const fieldErrors: ContactFieldErrors = {};
  if (!values.name) fieldErrors.name = "Nama wajib diisi.";
  else if (values.name.length > CONTACT_LIMITS.name)
    fieldErrors.name = `Nama maksimal ${CONTACT_LIMITS.name} karakter.`;

  if (!values.email) fieldErrors.email = "Email wajib diisi.";
  else if (
    values.email.length > CONTACT_LIMITS.email ||
    !EMAIL_PATTERN.test(values.email)
  )
    fieldErrors.email = "Format email tidak valid.";

  if (!values.message) fieldErrors.message = "Pesan wajib diisi.";
  else if (values.message.length > CONTACT_LIMITS.message)
    fieldErrors.message = `Pesan maksimal ${CONTACT_LIMITS.message} karakter.`;

  return {
    values,
    fieldErrors,
    isBot,
    isValid: Object.keys(fieldErrors).length === 0,
  };
}

/**
 * Notifikasi email via Resend (REST API). Kegagalan tidak boleh membatalkan
 * pengiriman pesan: pesan sudah tersimpan di database.
 */
export async function sendContactNotification(
  values: ContactValues,
  fetchImpl: typeof fetch = fetch,
): Promise<"sent" | "skipped" | "failed"> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.warn(
      "[contact] RESEND_API_KEY / CONTACT_NOTIFY_EMAIL belum diisi; notifikasi email dilewati.",
    );
    return "skipped";
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Portofolio <onboarding@resend.dev>";

  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `Pesan baru dari ${values.name}`,
        // Teks biasa (bukan HTML) agar input pengguna tidak bisa menyisipkan markup.
        text: `Nama: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("[contact] Resend menolak permintaan, status:", response.status);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error(
      "[contact] gagal mengirim email notifikasi:",
      error instanceof Error ? error.name : "unknown",
    );
    return "failed";
  }
}
