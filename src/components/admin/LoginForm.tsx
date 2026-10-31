"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/actions/admin/auth";
import { buttonPrimary, inputClass } from "./ui";

const initialState: LoginState = { email: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5 border border-border p-6 md:p-8">
      {state.error ? (
        <p role="alert" className="border border-accent px-4 py-3 text-sm">
          {state.error}
        </p>
      ) : null}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className={inputClass} />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">Kata sandi</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>
      <button type="submit" disabled={pending} className={buttonPrimary}>
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
