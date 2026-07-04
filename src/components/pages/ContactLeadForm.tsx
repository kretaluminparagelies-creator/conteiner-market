/**
 * @file ContactLeadForm.tsx
 * @description Public contact form → CRM leads
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useState, useTransition } from "react";
import type { ContactFormFlow } from "@/lib/crm/resolve-lead-source";
import { submitContactLeadAction } from "@/lib/crm/actions/lead-actions";
import { useLocale } from "@/lib/i18n/locale-context";

type ContactLeadFormProps = {
  theme?: "dark" | "light";
  flow: ContactFormFlow;
  showInterestSelect?: boolean;
  compact?: boolean;
};

const darkInputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const darkLabelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

const lightInputClass = "input-light w-full rounded-lg px-3 py-2.5 text-sm outline-none";

const lightLabelClass =
  "mb-1.5 block font-mono text-[10px] font-semibold tracking-[0.14em] text-cm-ink-muted uppercase";

export function ContactLeadForm({
  theme = "dark",
  flow,
  showInterestSelect = false,
  compact = false,
}: ContactLeadFormProps) {
  const { t } = useLocale();
  const page = t.pages.contact;
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const isLight = theme === "light";

  const inputClass = isLight ? lightInputClass : darkInputClass;
  const labelClass = isLight ? lightLabelClass : darkLabelClass;
  const compactInputClass = compact
    ? `${inputClass} py-1.5 text-sm`
    : inputClass;
  const resolvedLabelClass = compact
    ? labelClass.replace("mb-1.5", "mb-1")
    : labelClass;
  const fieldGap = compact ? "space-y-1.5" : "space-y-4";
  const formPadding = compact ? "p-3.5 md:p-4" : "p-5 md:p-6";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitContactLeadAction(formData);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
        return;
      }
      setMessage({
        type: "success",
        text: page.formSuccess ?? "Το μήνυμά σας στάλθηκε. Θα επικοινωνήσουμε σύντομα.",
      });
      form.reset();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        "relative overflow-hidden rounded-xl",
        formPadding,
        isLight ? "sell-flow-panel" : "mt-10 border border-cm-border bg-cm-card p-8",
      ].join(" ")}
    >
      <div className={isLight ? `relative z-[1] ${fieldGap}` : fieldGap}>
        <h2
          className={[
            "font-display font-semibold",
            compact ? "text-base" : "text-lg",
            isLight ? "text-cm-ink" : "text-cm-text",
          ].join(" ")}
        >
          {page.formTitle ?? "Φόρμα επικοινωνίας"}
        </h2>

        {message ? (
          <div
            className={[
              "rounded-lg border px-4 py-3 text-sm",
              message.type === "error"
                ? isLight
                  ? "border-red-400/50 bg-red-50 text-red-800"
                  : "border-red-500/40 bg-red-500/10 text-red-200"
                : isLight
                  ? "border-emerald-400/50 bg-emerald-50 text-emerald-900"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
            ].join(" ")}
          >
            {message.text}
          </div>
        ) : null}

        {showInterestSelect ? (
          <div>
            <label className={resolvedLabelClass} htmlFor="contact-interest">
              {page.formInterestLabel}
            </label>
            <select id="contact-interest" name="interest" required className={compactInputClass} defaultValue="buy">
              <option value="buy">{page.formInterestBuy}</option>
              <option value="rent">{page.formInterestRent}</option>
              <option value="both">{page.formInterestBoth}</option>
            </select>
          </div>
        ) : null}

        <div className={compact ? "grid gap-2 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
          <div>
            <label className={resolvedLabelClass} htmlFor="contact-name">
              {t.common.name ?? "Όνομα"}
            </label>
            <input id="contact-name" name="name" required className={compactInputClass} />
          </div>
          <div>
            <label className={resolvedLabelClass} htmlFor="contact-email">
              Email
            </label>
            <input id="contact-email" name="email" type="email" required className={compactInputClass} />
          </div>
        </div>

        <div>
          <label className={resolvedLabelClass} htmlFor="contact-phone">
            {t.common.phone ?? "Τηλέφωνο"}
          </label>
          <input id="contact-phone" name="phone" type="tel" className={compactInputClass} />
        </div>

        <div>
          <label className={resolvedLabelClass} htmlFor="contact-message">
            {page.formMessage ?? "Μήνυμα"}
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={compact ? 2 : 4}
            required
            className={compactInputClass}
          />
        </div>

        <input type="hidden" name="flow" value={flow} />

        <button
          type="submit"
          disabled={pending}
          className={[
            "rounded-lg font-display text-sm font-semibold transition-all disabled:opacity-50",
            compact ? "px-4 py-2" : "px-5 py-2.5",
            isLight
              ? "bg-cm-ink-sub text-white hover:bg-cm-ink"
              : "bg-cm-accent text-white hover:opacity-90",
          ].join(" ")}
        >
          {pending ? "Αποστολή…" : (page.formSubmit ?? "Αποστολή")}
        </button>
      </div>
    </form>
  );
}
