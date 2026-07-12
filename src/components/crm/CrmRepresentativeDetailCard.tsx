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
import { CrmListPaginationBar } from "@/components/crm/CrmListPaginationBar";
import { CrmRepresentativeFormFields } from "@/components/crm/CrmRepresentativeFormFields";
import { updateRepresentativeAction } from "@/lib/crm/actions/representative-actions";
import { formatCrmDate } from "@/lib/crm/format-crm-date";
import {
  representativeDisplayLabel,
  representativeSearchSubtitle,
} from "@/lib/depot/filter-representatives";
import { depotStatusLabels } from "@/lib/depot/status";
import type { DepotRepresentativeProfile } from "@/lib/depot/representative-profile";
import { useCrmUrlFilters } from "@/lib/hooks/useCrmUrlFilters";

type CrmRepresentativeDetailCardProps = {
  profile: DepotRepresentativeProfile;
};

export function CrmRepresentativeDetailCard({ profile }: CrmRepresentativeDetailCardProps) {
  const router = useRouter();
  const { pathname, searchParams } = useCrmUrlFilters();
  const { representative, dispatchSlice, totalDispatches, activeOutCount } = profile;
  const [active, setActive] = useState(representative.active);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const subtitle = representativeSearchSubtitle(representative);

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
    <div className="mx-auto max-w-4xl space-y-4">
      <Link
        href="/admin/representatives"
        className="inline-flex text-sm text-cm-accent hover:underline"
      >
        ← Πίσω στη λίστα
      </Link>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/50 shadow-cm-light-xs"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cm-border/70 px-5 py-4">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold text-cm-ink">
              {representativeDisplayLabel(representative)}
            </p>
            {subtitle ? <p className="mt-1 font-mono text-[11px] text-cm-muted">{subtitle}</p> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cm-border bg-cm-bg px-2.5 py-1 font-mono text-[10px] text-cm-sub">
              {totalDispatches} αποστολές
            </span>
            <span className="rounded-full border border-cm-accent/25 bg-cm-accent/10 px-2.5 py-1 font-mono text-[10px] text-cm-accent">
              {activeOutCount} έξω
            </span>
            <span
              className={[
                "rounded-full px-2.5 py-1 font-mono text-[10px]",
                active
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-cm-light-bg text-cm-muted",
              ].join(" ")}
            >
              {active ? "Ενεργός" : "Ανενεργός"}
            </span>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
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
        </div>

        <div className="border-t border-cm-border/70 px-5 py-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-cm-accent px-4 py-2.5 font-display text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Αποθήκευση..." : "Αποθήκευση αλλαγών"}
          </button>
        </div>
      </form>

      <section className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/50 shadow-cm-light-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cm-border/70 px-5 py-4">
          <h2 className="font-display text-base font-semibold text-cm-ink">Ιστορικό αποστολών</h2>
          <p className="font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
            {totalDispatches} συνολικά
          </p>
        </div>

        {dispatchSlice.items.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-cm-sub">
            Δεν έχουν σταλεί ακόμα κοντέινερ σε αυτόν τον αντιπρόσωπο.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-cm-border/70 bg-cm-surf/30 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
                  <tr>
                    <th className="px-4 py-3">Ημερομηνία</th>
                    <th className="px-4 py-3">Κοντέινερ</th>
                    <th className="px-4 py-3">Τύπος</th>
                    <th className="px-4 py-3">Κατάσταση</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cm-border/70">
                  {dispatchSlice.items.map((dispatch) => {
                    const containerId = dispatch.container?.id ?? dispatch.containerId;
                    const rowClass =
                      "transition-colors hover:bg-cm-surf/30" +
                      (containerId ? " cursor-pointer" : "");

                    return (
                      <tr
                        key={dispatch.id}
                        tabIndex={containerId ? 0 : undefined}
                        role={containerId ? "link" : undefined}
                        onClick={
                          containerId
                            ? () => router.push(`/admin/depot/${containerId}`)
                            : undefined
                        }
                        onKeyDown={
                          containerId
                            ? (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  router.push(`/admin/depot/${containerId}`);
                                }
                              }
                            : undefined
                        }
                        className={rowClass}
                      >
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-cm-muted">
                          {formatCrmDate(dispatch.createdAt)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-cm-ink">
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
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-cm-border/70 px-4 py-3">
              <CrmListPaginationBar
                slice={dispatchSlice}
                pathname={pathname}
                searchParams={searchParams}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
