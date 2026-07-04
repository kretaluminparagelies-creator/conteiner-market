/**
 * @file ContactLeadForm.tsx
 * @description Public contact form → CRM leads
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useState, useTransition } from "react";
import { submitContactLeadAction } from "@/lib/crm/actions/lead-actions";
import { useLocale } from "@/lib/i18n/locale-context";

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

export function ContactLeadForm() {
  const { t } = useLocale();
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await submitContactLeadAction(formData);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }
      setMessage({
        type: "success",
        text: t.pages.contact.formSuccess ?? "Το μήνυμά σας στάλθηκε. Θα επικοινωνήσουμε σύντομα.",
      });
      event.currentTarget.reset();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4 rounded border border-cm-border bg-cm-card p-8">
      <h2 className="font-display text-lg font-semibold">{t.pages.contact.formTitle ?? "Φόρμα επικοινωνίας"}</h2>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="contact-name">
            {t.common.name ?? "Όνομα"}
          </label>
          <input id="contact-name" name="name" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-email">
            Email
          </label>
          <input id="contact-email" name="email" type="email" required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-phone">
          {t.common.phone ?? "Τηλέφωνο"}
        </label>
        <input id="contact-phone" name="phone" type="tel" className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="contact-message">
          {t.pages.contact.formMessage ?? "Μήνυμα"}
        </label>
        <textarea id="contact-message" name="message" rows={4} required className={inputClass} />
      </div>

      <input type="hidden" name="source" value="contact" />

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-cm-accent px-5 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Αποστολή…" : (t.pages.contact.formSubmit ?? "Αποστολή")}
      </button>
    </form>
  );
}
