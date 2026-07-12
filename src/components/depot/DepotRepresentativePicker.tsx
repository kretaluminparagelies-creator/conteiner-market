/**
 * @file DepotRepresentativePicker.tsx
 * @description Searchable representative picker for mobile dispatch
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useMemo, useRef, useState } from "react";
import {
  filterRepresentatives,
  representativeDisplayLabel,
  representativeSearchSubtitle,
} from "@/lib/depot/filter-representatives";
import type { DepotRepresentative } from "@/lib/depot/types";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-cm-light-border-strong bg-white px-3 py-2.5 text-base text-cm-ink outline-none focus:border-cm-accent/50";

export type DepotRecipientMode = "crm" | "external";

type DepotRepresentativePickerProps = {
  representatives: DepotRepresentative[];
  value: string;
  onChange: (id: string) => void;
  recipientMode: DepotRecipientMode;
  onRecipientModeChange: (mode: DepotRecipientMode) => void;
  onSearchQueryChange?: (query: string) => void;
};

export function DepotRepresentativePicker({
  representatives,
  value,
  onChange,
  recipientMode,
  onRecipientModeChange,
  onSearchQueryChange,
}: DepotRepresentativePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const selected = representatives.find((item) => item.id === value);
  const hasQuery = query.trim().length > 0;
  const filtered = useMemo(
    () => (hasQuery ? filterRepresentatives(representatives, query) : []),
    [representatives, query, hasQuery],
  );

  const openPicker = () => setPickerOpen(true);

  const handleExternalShare = () => {
    onChange("");
    onRecipientModeChange("external");
    setPickerOpen(false);
  };

  const handleSelect = (id: string) => {
    onChange(id);
    onRecipientModeChange("crm");
    setPickerOpen(false);
    setQuery("");
  };

  return (
    <div className="space-y-3">
      {recipientMode === "external" && !pickerOpen ? (
        <div className="rounded-2xl border border-cm-accent/30 bg-cm-accent/8 px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.14em] text-cm-accent uppercase">
            Επιλογή
          </p>
          <p className="mt-1 font-display text-sm font-semibold text-cm-ink">
            Αποστολή με Viber / WhatsApp
          </p>
          <p className="mt-1 text-xs text-cm-ink-sub">
            Διάλεξε παραλήπτη στο Viber ή WhatsApp μετά την αποστολή.
          </p>
        </div>
      ) : null}

      {selected && recipientMode === "crm" && !pickerOpen ? (
        <div className="rounded-2xl border border-cm-accent/30 bg-cm-accent/8 px-4 py-3">
          <p className="font-mono text-[10px] tracking-[0.14em] text-cm-accent uppercase">
            Επιλογή
          </p>
          <p className="mt-1 font-display text-sm font-semibold text-cm-ink">
            {representativeDisplayLabel(selected)}
          </p>
          {representativeSearchSubtitle(selected) ? (
            <p className="mt-0.5 text-xs text-cm-ink-sub">{representativeSearchSubtitle(selected)}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className="mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
          Εύρεση / επιλογή
        </label>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onFocus={openPicker}
          onClick={openPicker}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            onSearchQueryChange?.(nextQuery);
            setPickerOpen(true);
          }}
          placeholder="Γράψε επωνυμία, πόλη ή τηλέφωνο..."
          className={fieldClass}
        />
      </div>

      {pickerOpen ? (
        <div className="overflow-hidden rounded-2xl border border-cm-light-border-strong bg-white">
          <button
            type="button"
            onClick={handleExternalShare}
            className={cn(
              "w-full border-b border-cm-light-border-strong px-4 py-3 text-left transition-colors hover:bg-cm-accent/5",
              recipientMode === "external"
                ? "bg-cm-accent/10 font-display text-sm font-semibold text-cm-accent"
                : "font-display text-sm font-semibold text-cm-accent",
            )}
          >
            Αποστολή σε άλλο (Viber / WhatsApp)
          </button>

          <div className="max-h-56 overflow-y-auto p-2">
            {!hasQuery ? (
              <p className="px-2 py-4 text-center text-sm text-cm-ink-sub">
                Γράψε στο πεδίο για εύρεση από τη λίστα, ή διάλεξε αποστολή με Viber / WhatsApp.
              </p>
            ) : filtered.length === 0 ? (
              <button
                type="button"
                onClick={handleExternalShare}
                className="w-full rounded-xl px-3 py-4 text-center text-sm font-semibold text-cm-accent transition-colors hover:bg-cm-accent/5"
              >
                Δεν βρέθηκε στη λίστα — συνέχεια με Viber / WhatsApp
              </button>
            ) : (
              <div className="space-y-2">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-3 text-left transition-colors",
                      value === item.id
                        ? "border-cm-accent bg-cm-accent/10"
                        : "border-transparent hover:border-cm-light-border-strong hover:bg-cm-light-bg",
                    )}
                  >
                    <p className="font-display text-sm font-semibold text-cm-ink">
                      {representativeDisplayLabel(item)}
                    </p>
                    {representativeSearchSubtitle(item) ? (
                      <p className="mt-0.5 text-xs text-cm-ink-muted">
                        {representativeSearchSubtitle(item)}
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasQuery && filtered.length > 0 ? (
            <p className="border-t border-cm-light-border-strong px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
              {filtered.length} {filtered.length === 1 ? "αποτέλεσμα" : "αποτελέσματα"}
            </p>
          ) : null}
        </div>
      ) : null}

      {recipientMode === "crm" && !selected && !pickerOpen ? (
        <p className="rounded-2xl border border-dashed border-cm-light-border-strong bg-white px-4 py-3 text-sm text-cm-ink-sub">
          Γράψε για εύρεση από τη λίστα ή διάλεξε αποστολή με Viber / WhatsApp.
        </p>
      ) : null}
    </div>
  );
}
