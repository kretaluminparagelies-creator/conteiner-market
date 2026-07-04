/**
 * @file CrmPasswordForm.tsx
 * @description Change admin password
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "@/lib/crm/actions/auth-actions";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

export function CrmPasswordForm() {
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await changePasswordAction(formData);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }
      if (result?.success) {
        setMessage({ type: "success", text: result.success });
        event.currentTarget.reset();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message ? (
        <div
          className={[
            "rounded-lg border px-4 py-3 text-sm",
            message.type === "error"
              ? "border-red-500/40 bg-red-500/10 text-red-200"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
          ].join(" ")}
        >
          {message.text}
        </div>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="currentPassword">
          Τρέχων κωδικός
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="newPassword">
          Νέος κωδικός
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="confirmPassword">
          Επιβεβαίωση νέου κωδικού
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-cm-accent px-5 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Αποθήκευση…" : "Αλλαγή κωδικού"}
      </button>
    </form>
  );
}
