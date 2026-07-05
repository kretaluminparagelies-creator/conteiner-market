/**
 * @file CrmNewRentalForm.tsx
 * @description Register a walk-in rental — pick active container + customer contract
 */

"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CrmRentalContractFields } from "@/components/crm/CrmRentalContractFields";
import { setListingActiveAction } from "@/lib/crm/actions/listing-actions";
import { emptyRentalHandover, validateRentalHandover } from "@/lib/crm/rental-contract";
import type { Listing } from "@/lib/types/listing";

type CrmNewRentalFormProps = {
  available: Listing[];
};

const inputClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2.5 text-sm text-cm-text outline-none transition-colors focus:border-cm-accent";

const labelClass = "mb-1.5 block font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase";

export function CrmNewRentalForm({ available }: CrmNewRentalFormProps) {
  const [slug, setSlug] = useState("");
  const [handover, setHandover] = useState(emptyRentalHandover);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selected = available.find((listing) => listing.slug === slug);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!slug) {
      setError("Επίλεξε κοντέινερ από το depo.");
      return;
    }

    const contractError = validateRentalHandover(handover);
    if (contractError) {
      setError(contractError);
      return;
    }

    startTransition(async () => {
      try {
        await setListingActiveAction(slug, false, "rented", handover);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Αποτυχία καταχώρησης ενοικίασης.");
      }
    });
  };

  if (available.length === 0) {
    return (
      <div className="max-w-xl rounded-xl border border-cm-border bg-cm-card/40 p-6">
        <p className="text-sm text-cm-sub">
          Δεν υπάρχουν διαθέσιμα κοντέινερ για ενοικίαση στο site. Πρώτα πρόσθεσε καταχώριση τύπου{" "}
          <strong className="text-cm-text">Ενοικίαση</strong> στις{" "}
          <Link href="/admin/listings/new" className="text-cm-accent hover:underline">
            Καταχωρίσεις
          </Link>
          .
        </p>
        <Link
          href="/admin/rentals"
          className="mt-4 inline-block text-sm text-cm-muted hover:text-cm-accent"
        >
          ← Πίσω στα ενοικιασμένα
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border border-cm-border bg-cm-card/40 p-5">
        <h2 className="font-display text-base font-semibold">1. Επίλεξε κοντέινερ</h2>
        <p className="mt-1 text-sm text-cm-sub">
          Ο πελάτης διάλεξε από τα διαθέσιμα στο depo / catalog. Δεν δημιουργείς νέο κοντέινερ εδώ
          — μόνο σημειώνεις την ενοικίαση.
        </p>

        <div className="mt-4">
          <label className={labelClass} htmlFor="containerSlug">
            Διαθέσιμο για ενοικίαση
          </label>
          <select
            id="containerSlug"
            className={inputClass}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            <option value="">— Επίλεξε κοντέινερ —</option>
            {available.map((listing) => (
              <option key={listing.slug} value={listing.slug}>
                {listing.type}
                {listing.containerNumber ? ` · ${listing.containerNumber}` : ""}
                {" · "}
                {listing.priceFormatted}
                {listing.unit}
              </option>
            ))}
          </select>
        </div>

        {selected ? (
          <div className="mt-3 rounded-lg border border-cm-border/60 bg-cm-surf/30 px-3 py-2 text-sm text-cm-sub">
            <span className="font-medium text-cm-text">{selected.type}</span>
            {selected.containerNumber ? (
              <span className="ml-2 font-mono text-xs text-cm-accent">{selected.containerNumber}</span>
            ) : null}
            <span className="ml-2">
              {selected.priceFormatted}
              {selected.unit}
            </span>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-cm-border bg-cm-card/40 p-5">
        <h2 className="font-display text-base font-semibold">2. Στοιχεία πελάτη & σύμβαση</h2>
        <CrmRentalContractFields
          value={handover}
          onChange={setHandover}
          inputClass={inputClass}
          labelClass={labelClass}
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-cm-accent px-5 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Καταχώρηση…" : "Καταχώρηση ενοικίασης"}
        </button>
        <Link
          href="/admin/rentals"
          className="rounded-lg border border-cm-border px-5 py-2.5 font-display text-sm text-cm-sub hover:text-cm-text"
        >
          Ακύρωση
        </Link>
      </div>
    </form>
  );
}
