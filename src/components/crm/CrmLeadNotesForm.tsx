/**
 * @file CrmLeadNotesForm.tsx
 * @description Internal admin notes on a lead (CRM only)
 */

"use client";

import { useState, useTransition } from "react";
import { updateLeadAdminNotesAction } from "@/lib/crm/actions/lead-actions";

type CrmLeadNotesFormProps = {
  leadId: string;
  initialNotes: string;
  canEdit: boolean;
};

const textareaClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

export function CrmLeadNotesForm({ leadId, initialNotes, canEdit }: CrmLeadNotesFormProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(initialNotes);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        await updateLeadAdminNotesAction(leadId, notes);
        setSaved(notes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Αποτυχία αποθήκευσης.");
      }
    });
  };

  const isDirty = notes !== saved;

  return (
    <section className="rounded-xl border border-cm-border bg-cm-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base font-semibold">Σημειώσεις admin</h2>
        {!canEdit ? (
          <span className="font-mono text-[10px] text-amber-800">Preview — μόνο ανάγνωση</span>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-cm-ink-sub">
        Εσωτερικές σημειώσεις — δεν φαίνονται στον πελάτη.
      </p>

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={5}
        disabled={!canEdit || pending}
        placeholder="Π.χ. τιμή προσφοράς, follow-up, τηλεφώνημα…"
        className={`${textareaClass} mt-4`}
      />

      {error ? (
        <p className="mt-3 text-sm text-red-700">{error}</p>
      ) : isDirty && canEdit ? (
        <p className="mt-3 text-xs text-cm-ink-muted">Υπάρχουν μη αποθηκευμένες αλλαγές.</p>
      ) : saved ? (
        <p className="mt-3 text-xs text-emerald-700">Αποθηκευμένες σημειώσεις.</p>
      ) : null}

      {canEdit ? (
        <button
          type="button"
          onClick={handleSave}
          disabled={pending || !isDirty}
          className="mt-4 rounded-lg bg-cm-accent px-4 py-2 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Αποθήκευση…" : "Αποθήκευση σημειώσεων"}
        </button>
      ) : null}
    </section>
  );
}
