"use server";

import { after } from "next/server";
import {
  parseContactForm,
  sendContactNotification,
  type ContactFieldErrors,
  type ContactValues,
} from "@/lib/contact";
import { createPublicClient } from "@/lib/supabase/public";
import { describeSupabaseError } from "@/lib/supabase/describe-error";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ContactFieldErrors;
  values: ContactValues;
};

const EMPTY: ContactValues = { name: "", email: "", message: "" };

const FAILURE_MESSAGE =
  "Pesan belum terkirim. Silakan coba lagi atau hubungi saya lewat WhatsApp.";

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const { values, fieldErrors, isBot, isValid } = parseContactForm(formData);

  // Bot: berpura-pura berhasil tanpa menyimpan apa pun.
  if (isBot) return { status: "success", values: EMPTY };

  if (!isValid) {
    return {
      status: "error",
      message: "Periksa kembali isian Anda.",
      fieldErrors,
      values,
    };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    console.error("[contact] Supabase belum dikonfigurasi (env kosong).");
    return { status: "error", message: FAILURE_MESSAGE, values };
  }

  // Tanpa .select(): kebijakan RLS hanya mengizinkan INSERT bagi pengunjung.
  const { error } = await supabase.from("contacts").insert(values);
  if (error) {
    console.error("[contact] gagal menyimpan pesan:", describeSupabaseError(error, undefined, "contacts"));
    return { status: "error", message: FAILURE_MESSAGE, values };
  }

  // Email dikirim setelah respons; kegagalannya tidak memengaruhi pengunjung.
  after(() => sendContactNotification(values));

  return { status: "success", values: EMPTY };
}
