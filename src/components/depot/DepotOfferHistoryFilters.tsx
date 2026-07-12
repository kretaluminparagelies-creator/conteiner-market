/**
 * @file DepotOfferHistoryFilters.tsx
 * @description Filters for depot offer history
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { representativeDisplayLabel } from "@/lib/depot/filter-representatives";
import {
  EXTERNAL_RECIPIENT_FILTER,
  emptyOfferHistoryFilters,
  type OfferHistoryFilterState,
} from "@/lib/depot/offer-history";
import type { DepotRepresentative } from "@/lib/depot/types";

const fieldClass =
  "w-full rounded-xl border border-cm-light-border-strong bg-white px-3 py-2.5 text-base text-cm-ink outline-none focus:border-cm-accent/50";

type DepotOfferHistoryFiltersProps = {
  value: OfferHistoryFilterState;
  onChange: (value: OfferHistoryFilterState) => void;
  representatives: DepotRepresentative[];
  hasExternalRecipients: boolean;
};

export function DepotOfferHistoryFilters({
  value,
  onChange,
  representatives,
  hasExternalRecipients,
}: DepotOfferHistoryFiltersProps) {
  const patch = (partial: Partial<OfferHistoryFilterState>) => {
    onChange({ ...value, ...partial });
  };

  const hasFilters =
    value.containerQuery !== "" ||
    value.representativeId !== "" ||
    value.recipientQuery !== "";

  return (
    <div className="grid gap-3 rounded-2xl border border-cm-light-border-strong bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
          Φίλτρα
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => onChange(emptyOfferHistoryFilters)}
            className="font-mono text-[10px] text-cm-accent"
          >
            Καθαρισμός
          </button>
        ) : null}
      </div>

      <input
        type="search"
        placeholder="Αριθμός κοντέινερ..."
        value={value.containerQuery}
        onChange={(event) => patch({ containerQuery: event.target.value })}
        className={fieldClass}
      />

      <select
        value={value.representativeId}
        onChange={(event) => patch({ representativeId: event.target.value })}
        className={fieldClass}
      >
        <option value="">Όλοι οι αντιπρόσωποι</option>
        {representatives.map((item) => (
          <option key={item.id} value={item.id}>
            {representativeDisplayLabel(item)}
          </option>
        ))}
        {hasExternalRecipients ? (
          <option value={EXTERNAL_RECIPIENT_FILTER}>Εξωτερικοί παραλήπτες</option>
        ) : null}
      </select>

      <input
        type="search"
        placeholder="Παραλήπτης / πελάτης..."
        value={value.recipientQuery}
        onChange={(event) => patch({ recipientQuery: event.target.value })}
        className={fieldClass}
      />
    </div>
  );
}
