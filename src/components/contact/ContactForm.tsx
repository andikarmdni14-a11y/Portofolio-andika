"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/actions/contact";
import { CONTACT_LIMITS } from "@/lib/contact";

const initialState: ContactState = {
  status: "idle",
  values: { name: "", email: "", message: "" },
};

const inputClass =
  "w-full rounded-none border border-border bg-transparent px-4 py-3 text-foreground transition-colors focus:border-accent";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-6 border border-border p-6 md:p-8">
      {state.status === "success" ? (
        <p role="status" className="border border-accent px-4 py-3">
          Pesan Anda telah terkirim. Terima kasih.
        </p>
      ) : null}
      {state.status === "error" && state.message ? (
        <p role="alert" className="border border-accent px-4 py-3">
          {state.message}
        </p>
      ) : null}

      <Field id="name" label="Nama" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.name}
          defaultValue={state.values.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={CONTACT_LIMITS.email}
          defaultValue={state.values.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass}
        />
      </Field>

      <Field id="message" label="Pesan" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={CONTACT_LIMITS.message}
          defaultValue={state.values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputClass} min-h-40 resize-y`}
        />
      </Field>

      {/* Honeypot anti-spam: tersembunyi dari pengguna dan pembaca layar */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-none bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Mengirim…" : "Kirim Pesan"}
      </button>
    </form>
  );
}
