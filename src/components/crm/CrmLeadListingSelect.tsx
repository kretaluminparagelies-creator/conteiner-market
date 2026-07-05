/**
 * @file CrmLeadListingSelect.tsx
 * @description Link a lead to a listing (CRM)
 */

"use client";

import Link from "next/link";
import { useTransition } from "react";
import { updateLeadListingSlugAction } from "@/lib/crm/actions/lead-actions";
import type { LeadListingOption } from "@/lib/crm/lead-store";

type CrmLeadListingSelectProps = {
  leadId: string;
  listingSlug?: string;
  options: LeadListingOption[];
  canEdit: boolean;
};

const selectClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm text-cm-text outline-none focus:border-cm-accent";

export function CrmLeadListingSelect({
  leadId,
  listingSlug,
  options,
  canEdit,
}: CrmLeadListingSelectProps) {
  const [pending, startTransition] = useTransition();

  const handleChange = (value: string) => {
    startTransition(async () => {
      await updateLeadListingSlugAction(leadId, value);
    });
  };

  return (
    <section className="rounded-xl border border-cm-border bg-cm-card p-6">
      <h2 className="font-display text-base font-semibold">Σύνδεση με καταχώριση</h2>
      <p className="mt-1 text-xs text-cm-ink-sub">
        Δέσε το αίτημα με το κοντέινερ που συζητάτε ή κλείσατε.
      </p>

      {canEdit ? (
        <select
          value={listingSlug ?? ""}
          disabled={pending}
          onChange={(event) => handleChange(event.target.value)}
          className={`${selectClass} mt-4`}
          aria-label="Καταχώριση"
        >
          <option value="">— Χωρίς σύνδεση —</option>
          {options.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.label}
            </option>
          ))}
        </select>
      ) : listingSlug ? (
        <p className="mt-4 font-mono text-sm text-cm-accent">{listingSlug}</p>
      ) : (
        <p className="mt-4 text-sm text-cm-ink-muted">Δεν έχει συνδεθεί καταχώριση.</p>
      )}

      {listingSlug ? (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/listings/${listingSlug}`}
            className="text-cm-accent hover:underline"
            target="_blank"
          >
            Προβολή στο site
          </Link>
          <Link href={`/admin/listings/${listingSlug}/edit`} className="text-cm-accent hover:underline">
            Επεξεργασία στο CRM
          </Link>
        </div>
      ) : null}
    </section>
  );
}
