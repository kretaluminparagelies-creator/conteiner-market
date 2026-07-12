/**
 * @file CrmRepresentativesPanel.tsx
 * @description CRM representatives list
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CrmListPaginationBar } from "@/components/crm/CrmListPaginationBar";
import { CrmRepresentativesTable } from "@/components/crm/CrmRepresentativesTable";
import { createRepresentativeAction } from "@/lib/crm/actions/representative-actions";
import type { PaginatedSlice } from "@/lib/crm/pagination";
import type { DepotRepresentative } from "@/lib/depot/types";
import { useCrmUrlFilters } from "@/lib/hooks/useCrmUrlFilters";

type CrmRepresentativesPanelProps = {
  result: PaginatedSlice<DepotRepresentative>;
};

const fieldClass =
  "w-full rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm text-cm-text outline-none focus:border-cm-accent";

const labelClass = "mb-1 block font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase";

export function CrmRepresentativesPanel({ result }: CrmRepresentativesPanelProps) {
  const router = useRouter();
  const { pathname, searchParams } = useCrmUrlFilters();
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const actionResult = await createRepresentativeAction(formData);
      if (actionResult.error) {
        setError(actionResult.error);
        return;
      }
      form.reset();
      setShowCreate(false);
      if (actionResult.id) {
        router.push(`/admin/representatives/${actionResult.id}`);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-cm-ink-sub">{result.total} αντιπρόσωποι</p>
        <button
          type="button"
          onClick={() => {
            setShowCreate((value) => !value);
            setError(null);
          }}
          className="rounded-md bg-cm-accent px-4 py-2 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {showCreate ? "Ακύρωση" : "+ Νέος αντιπρόσωπος"}
        </button>
      </div>

      {showCreate ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-cm-border bg-cm-card/50 p-4"
        >
          <p className="font-mono text-[10px] tracking-[0.14em] text-cm-muted uppercase">
            Γρήγορη δημιουργία
          </p>
          <p className="mt-1 text-xs text-cm-sub">
            Συμπλήρωσε τα βασικά — η πλήρης καρτέλα (ΑΦΜ, ΔΟΥ, διεύθυνση) ανοίγει μετά.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="companyName">
                Επωνυμία *
              </label>
              <input
                id="companyName"
                name="companyName"
                required
                className={fieldClass}
                placeholder="π.χ. Alpha Containers AE"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="name">
                Υπεύθυνος *
              </label>
              <input id="name" name="name" required className={fieldClass} />
            </div>
            <div className="sm:col-span-3">
              <label className={labelClass} htmlFor="phone">
                Τηλέφωνο
              </label>
              <input id="phone" name="phone" type="tel" className={fieldClass} />
            </div>
          </div>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-4 rounded-lg bg-cm-accent px-4 py-2.5 font-display text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Δημιουργία..." : "Δημιουργία καρτέλας"}
          </button>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/30">
        <CrmRepresentativesTable representatives={result.items} />
        <CrmListPaginationBar
          slice={result}
          pathname={pathname}
          searchParams={new URLSearchParams(searchParams.toString())}
        />
      </div>
    </div>
  );
}
