/**
 * @file CrmLeadListingSelect.tsx
 * @description Link a lead to a listing (CRM)
 */

"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  searchLeadListingOptionsAction,
  updateLeadListingSlugAction,
} from "@/lib/crm/actions/lead-actions";
import type { LeadListingOption } from "@/lib/crm/lead-store";

type CrmLeadListingSelectProps = {
  leadId: string;
  listingSlug?: string;
  initialOption?: LeadListingOption | null;
  canEdit: boolean;
};

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm text-cm-text outline-none focus:border-cm-accent";

export function CrmLeadListingSelect({
  leadId,
  listingSlug,
  initialOption,
  canEdit,
}: CrmLeadListingSelectProps) {
  const [selectedSlug, setSelectedSlug] = useState(listingSlug ?? "");
  const [selectedLabel, setSelectedLabel] = useState(initialOption?.label ?? listingSlug ?? "");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LeadListingOption[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [searching, startSearch] = useTransition();

  useEffect(() => {
    setSelectedSlug(listingSlug ?? "");
    setSelectedLabel(initialOption?.label ?? listingSlug ?? "");
  }, [listingSlug, initialOption]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }

    const timer = window.setTimeout(() => {
      startSearch(async () => {
        try {
          setSearchError(null);
          const options = await searchLeadListingOptionsAction(trimmed);
          setResults(options);
        } catch {
          setSearchError("Αποτυχία αναζήτησης.");
          setResults([]);
        }
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  const applySelection = (slug: string, label: string) => {
    setSelectedSlug(slug);
    setSelectedLabel(label);
    setQuery("");
    setResults([]);

    startTransition(async () => {
      await updateLeadListingSlugAction(leadId, slug);
    });
  };

  const clearSelection = () => {
    setSelectedSlug("");
    setSelectedLabel("");
    setQuery("");
    setResults([]);

    startTransition(async () => {
      await updateLeadListingSlugAction(leadId, "");
    });
  };

  return (
    <section className="rounded-xl border border-cm-border bg-cm-card p-6">
      <h2 className="font-display text-base font-semibold">Σύνδεση με καταχώριση</h2>
      <p className="mt-1 text-xs text-cm-ink-sub">
        Αναζήτησε τύπο, αριθμό κοντέινερ ή slug — δεν φορτώνονται όλες οι καταχωρίσεις.
      </p>

      {canEdit ? (
        <div className="mt-4 space-y-3">
          {selectedSlug ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cm-border bg-cm-bg px-3 py-2">
              <p className="text-sm text-cm-ink">{selectedLabel}</p>
              <button
                type="button"
                onClick={clearSelection}
                disabled={pending}
                className="text-xs text-cm-accent hover:underline disabled:opacity-60"
              >
                Αφαίρεση σύνδεσης
              </button>
            </div>
          ) : (
            <p className="text-sm text-cm-ink-muted">Δεν έχει συνδεθεί καταχώριση.</p>
          )}

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Αναζήτηση καταχώρισης (τουλάχιστον 2 χαρακτήρες)…"
            className={inputClass}
            aria-label="Αναζήτηση καταχώρισης"
            disabled={pending}
          />

          {searching ? (
            <p className="text-xs text-cm-sub">Αναζήτηση…</p>
          ) : null}
          {searchError ? <p className="text-xs text-red-600">{searchError}</p> : null}

          {results.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto rounded-lg border border-cm-border bg-cm-bg">
              {results.map((option) => (
                <li key={option.slug} className="border-t border-cm-border/60 first:border-t-0">
                  <button
                    type="button"
                    onClick={() => applySelection(option.slug, option.label)}
                    disabled={pending}
                    className="w-full px-3 py-2 text-left text-sm text-cm-ink hover:bg-cm-light-bg disabled:opacity-60"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : query.trim().length >= 2 && !searching && !searchError ? (
            <p className="text-xs text-cm-sub">Δεν βρέθηκαν καταχωρίσεις.</p>
          ) : null}
        </div>
      ) : selectedSlug ? (
        <p className="mt-4 font-mono text-sm text-cm-accent">{selectedSlug}</p>
      ) : (
        <p className="mt-4 text-sm text-cm-ink-muted">Δεν έχει συνδεθεί καταχώριση.</p>
      )}

      {selectedSlug ? (
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/listings/${selectedSlug}`}
            className="text-cm-accent hover:underline"
            target="_blank"
          >
            Προβολή στο site
          </Link>
          <Link href={`/admin/listings/${selectedSlug}/edit`} className="text-cm-accent hover:underline">
            Επεξεργασία στο CRM
          </Link>
        </div>
      ) : null}
    </section>
  );
}
