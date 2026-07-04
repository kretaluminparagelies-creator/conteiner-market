/**
 * @file CrmResetPasswordForm.tsx
 * @description Set new password after Supabase recovery email link
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

export function CrmResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 8) {
      setError("Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.");
      return;
    }

    if (password !== confirm) {
      setError("Οι κωδικοί δεν ταιριάζουν.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setSuccess(true);
      router.refresh();
    });
  };

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-emerald-200">Ο κωδικός άλλαξε. Σύνδεση με τον νέο κωδικό.</p>
        <Link
          href="/admin/login"
          className="inline-block rounded-lg bg-cm-accent px-5 py-2.5 font-display text-sm font-semibold text-white"
        >
          Σύνδεση
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="space-y-4 text-sm text-cm-sub">
        <p>Ο σύνδεσμος reset δεν είναι έγκυρος ή έληξε.</p>
        <p>
          Ζήτα νέο reset από{" "}
          <Link href="/admin/login" className="text-cm-accent hover:underline">
            τη σελίδα σύνδεσης
          </Link>{" "}
          ή όρισε κωδικό απευθείας στο Supabase → Users.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="password">
          Νέος κωδικός
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="confirm">
          Επιβεβαίωση κωδικού
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-cm-accent py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Αποθήκευση…" : "Αποθήκευση νέου κωδικού"}
      </button>
    </form>
  );
}
