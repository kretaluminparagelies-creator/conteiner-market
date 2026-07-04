/**
 * @file CrmLoginForm.tsx
 * @description Admin login — server actions (no browser fetch to Supabase)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction, requestPasswordResetAction } from "@/lib/crm/actions/auth-actions";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

type CrmLoginFormProps = {
  nextPath: string;
};

export function CrmLoginForm({ nextPath }: CrmLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldsReady, setFieldsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();

  const enableFields = () => setFieldsReady(true);

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

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Βάλε πρώτα το email σου στο πεδίο πάνω.");
      return;
    }

    startTransition(async () => {
      const result = await requestPasswordResetAction(trimmed);
      if (result.error) setError(result.error);
      if (result.success) setInfo(result.success);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
      <input type="hidden" name="next" value={nextPath} />
      <input type="text" name="prevent_autofill" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <input type="password" name="prevent_autofill_pw" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

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
        <label className={labelClass} htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          readOnly={!fieldsReady}
          onFocus={enableFields}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="admin-password">
          Κωδικός
        </label>
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            readOnly={!fieldsReady}
            onFocus={enableFields}
            autoComplete="new-password"
            data-1p-ignore
            data-lpignore="true"
            required
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-cm-muted transition-colors hover:text-cm-text"
            aria-label={showPassword ? "Απόκρυψη κωδικού" : "Εμφάνιση κωδικού"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
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
        Ξέχασα τον κωδικό
      </button>
    </form>
  );
}
