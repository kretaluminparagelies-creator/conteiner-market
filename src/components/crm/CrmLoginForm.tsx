/**
 * @file CrmLoginForm.tsx
 * @description Admin login — server actions (no browser fetch to Supabase)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useState, useTransition } from "react";
import { loginAction, requestPasswordResetAction } from "@/lib/crm/actions/auth-actions";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

type CrmLoginFormProps = {
  nextPath: string;
};

export function CrmLoginForm({ nextPath }: CrmLoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  const handleForgotPassword = () => {
    setError(null);
    setInfo(null);
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const email = emailInput?.value.trim();

    if (!email) {
      setError("Βάλε πρώτα το email σου στο πεδίο πάνω.");
      return;
    }

    startTransition(async () => {
      const result = await requestPasswordResetAction(email);
      if (result.error) setError(result.error);
      if (result.success) setInfo(result.success);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {info ? (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {info}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          placeholder="kretalumin.paragelies@gmail.com"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="password">
          Κωδικός
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-cm-accent py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Σύνδεση…" : "Σύνδεση"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={handleForgotPassword}
        className="w-full text-center font-mono text-[11px] text-cm-muted transition-colors hover:text-cm-accent disabled:opacity-50"
      >
        Ξέχασα τον κωδικό → email reset
      </button>

      <p className="text-center text-xs leading-relaxed text-cm-muted">
        Λογαριασμός από Supabase → Authentication → Users (Add user, Auto Confirm ON).
      </p>
    </form>
  );
}
