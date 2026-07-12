/**
 * @file CrmRepresentativesPanel.tsx
 * @description CRM list + create representatives
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CrmRepresentativeFormFields } from "@/components/crm/CrmRepresentativeFormFields";
import { createRepresentativeAction } from "@/lib/crm/actions/representative-actions";
import { representativeDisplayLabel } from "@/lib/depot/filter-representatives";
import type { DepotRepresentative } from "@/lib/depot/types";

type CrmRepresentativesPanelProps = {
  representatives: DepotRepresentative[];
};

export function CrmRepresentativesPanel({ representatives }: CrmRepresentativesPanelProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createRepresentativeAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      form.reset();
      if (result.id) {
        router.push(`/admin/representatives/${result.id}`);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-cm-ink">
          Αντιπρόσωποι ({representatives.length})
        </h2>

        {representatives.length === 0 ? (
          <p className="rounded-xl border border-cm-border bg-cm-card/50 px-4 py-6 text-sm text-cm-sub">
            Δεν υπάρχουν ακόμα αντιπρόσωποι.
          </p>
        ) : (
          <ul className="space-y-2">
            {representatives.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/admin/representatives/${item.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-cm-border bg-cm-card/50 px-4 py-4 transition-colors hover:border-cm-accent/35 hover:bg-cm-accent/5"
                >
                  <div>
                    <p className="font-display text-sm font-semibold text-cm-ink">
                      {representativeDisplayLabel(item)}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-cm-muted">
                      {[item.city, item.afm ? `ΑΦΜ ${item.afm}` : null, item.phone]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 font-mono text-[10px]",
                      item.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-cm-light-bg text-cm-muted",
                    ].join(" ")}
                  >
                    {item.active ? "Ενεργός" : "Ανενεργός"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="rounded-xl border border-cm-border bg-cm-card/50 p-5">
        <h3 className="font-display text-base font-semibold text-cm-ink">Νέος αντιπρόσωπος</h3>
        <p className="mt-1 text-sm text-cm-sub">
          Πλήρη καρτέλα για τιμολόγηση — επωνυμία, ΑΦΜ, ΔΟΥ, διεύθυνση.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <CrmRepresentativeFormFields />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-cm-accent px-4 py-2.5 font-display text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Αποθήκευση..." : "Δημιουργία καρτέλας"}
          </button>
        </form>
      </aside>
    </div>
  );
}
