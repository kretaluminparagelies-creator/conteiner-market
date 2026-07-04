/**
 * @file CrmLoginForm.tsx
 * @description Admin login form (browser session — reliable cookie handling)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

type CrmLoginFormProps = {
  nextPath: string;
};

function mapLoginError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Λάθος email ή κωδικός.";
  }
  if (lower.includes("email not confirmed")) {
    return "Το email δεν έχει επιβεβαιωθεί. Στο Supabase → Users → Confirm user.";
  }
  if (lower.includes("too many requests")) {
    return "Πολλές προσπάθειες. Περίμενε 1–2 λεπτά.";
  }
  return message;
}

export function CrmLoginForm({ nextPath }: CrmLoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const next = String(formData.get("next") ?? "/admin").trim() || "/admin";

    if (!email || !password) {
      setError("Συμπλήρωσε email και κωδικό.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          setError(mapLoginError(signInError.message));
          return;
        }

        router.refresh();
        router.push(next.startsWith("/admin") ? next : "/admin");
      } catch {
        setError("Αποτυχία σύνδεσης. Έλεγξε Supabase URL settings.");
      }
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
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/admin/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setInfo("Στάλθηκε email reset. Άνοιξε τον σύνδεσμο και όρισε νέο κωδικό.");
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
        Ο λογαριασμός δημιουργείται στο Supabase → Authentication → Users (Add user).
      </p>
    </form>
  );
}
