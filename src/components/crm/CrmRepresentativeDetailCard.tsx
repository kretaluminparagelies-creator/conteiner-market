/**
 * @file CrmRepresentativeDetailCard.tsx
 * @description Full CRM card for one representative
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CrmRepresentativeFormFields } from "@/components/crm/CrmRepresentativeFormFields";
import { updateRepresentativeAction } from "@/lib/crm/actions/representative-actions";
import { representativeDisplayLabel } from "@/lib/depot/filter-representatives";
import { depotStatusLabels } from "@/lib/depot/status";
import type { DepotRepresentativeProfile } from "@/lib/depot/representative-profile";

const labelClass = "font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

type CrmRepresentativeDetailCardProps = {
  profile: DepotRepresentativeProfile;
};

export function CrmRepresentativeDetailCard({ profile }: CrmRepresentativeDetailCardProps) {
  const router = useRouter();
  const { representative, dispatches, totalDispatches, activeOutCount } = profile;
  const [active, setActive] = useState(representative.active);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.set("active", active ? "true" : "false");

    startTransition(async () => {
      const result = await updateRepresentativeAction(representative.id, formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="rounded-xl border border-cm-border bg-cm-card/50 p-5">
        <p className="font-display text-xl font-bold text-cm-ink">
          {representativeDisplayLabel(representative)}
        </p>
        <p className="mt-1 text-sm text-cm-sub">Καρτέλα τιμολόγησης & αποστολών</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-cm-border bg-cm-card/50 px-4 py-4">
          <p className={labelClass}>Συνολικές αποστολές</p>
          <p className="mt-1 font-display text-2xl font-bold text-cm-ink">{totalDispatches}</p>
        </div>
        <div className="rounded-xl border border-cm-border bg-cm-card/50 px-4 py-4">
          <p className={labelClass}>Έξω τώρα</p>
          <p className="mt-1 font-display text-2xl font-bold text-cm-accent">{activeOutCount}</p>
        </div>
        <div className="rounded-xl border border-cm-border bg-cm-card/50 px-4 py-4">
          <p className={labelClass}>Κατάσταση</p>
          <p className="mt-1 font-display text-lg font-semibold text-cm-ink">
            {representative.active ? "Ενεργός" : "Ανενεργός"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-cm-border bg-cm-card/50 p-6"
      >
        <CrmRepresentativeFormFields representative={representative} />

        <label className="flex items-center gap-2 text-sm text-cm-ink-sub">
          <input
            type="checkbox"
            checked={active}
            onChange={(event) => setActive(event.target.checked)}
            className="size-4 rounded border-cm-border"
          />
          Ενεργός αντιπρόσωπος (εμφανίζεται στο depot κινητό)
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-cm-accent px-4 py-2.5 font-display text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Αποθήκευση..." : "Αποθήκευση αλλαγών"}
        </button>
      </form>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-cm-ink">Ιστορικό αποστολών</h2>

        {dispatches.length === 0 ? (
          <p className="rounded-xl border border-cm-border bg-cm-card/50 px-4 py-6 text-sm text-cm-sub">
            Δεν έχουν σταλεί ακόμα κοντέινερ σε αυτόν τον αντιπρόσωπο.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-cm-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-cm-light-bg font-mono text-[10px] tracking-[0.1em] text-cm-muted uppercase">
                <tr>
                  <th className="px-4 py-3">Ημερομηνία</th>
                  <th className="px-4 py-3">Κοντέινερ</th>
                  <th className="px-4 py-3">Τύπος</th>
                  <th className="px-4 py-3">Κατάσταση</th>
                </tr>
              </thead>
              <tbody>
                {dispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="border-t border-cm-border/60">
                    <td className="px-4 py-3 font-mono text-xs text-cm-sub">
                      {formatDate(dispatch.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs font-bold">
                      {dispatch.container?.containerNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-cm-sub">
                      {dispatch.dispatchType === "offer" ? "Προσφορά" : "Δωρεάν αποθήκη"}
                    </td>
                    <td className="px-4 py-3 text-cm-sub">
                      {dispatch.container
                        ? depotStatusLabels[dispatch.container.status]
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Link href="/admin/representatives" className="inline-block text-sm text-cm-accent hover:underline">
        ← Πίσω στη λίστα
      </Link>
    </div>
  );
}
