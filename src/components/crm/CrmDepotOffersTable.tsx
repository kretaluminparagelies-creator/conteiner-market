/**
 * @file CrmDepotOffersTable.tsx
 * @description Offer dispatch history table for CRM depot
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import {
  buildContainerOfferHistories,
  dispatchRecipientLabel,
  formatDepotDispatchDate,
} from "@/lib/depot/offer-history";
import type { DepotDispatch } from "@/lib/depot/types";

type CrmDepotOffersTableProps = {
  dispatches: DepotDispatch[];
  emptyMessage: string;
};

export function CrmDepotOffersTable({ dispatches, emptyMessage }: CrmDepotOffersTableProps) {
  const router = useRouter();
  const histories = buildContainerOfferHistories([], dispatches);

  if (histories.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-cm-sub">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-cm-border/70 bg-cm-surf/30 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
          <tr>
            <th className="px-4 py-3">Κοντέινερ</th>
            <th className="px-4 py-3">Παραλήπτης</th>
            <th className="px-4 py-3">Τελευταία</th>
            <th className="px-4 py-3 text-right">Σύνολο</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cm-border/70">
          {histories.map((history) => (
            <tr
              key={history.container.id}
              tabIndex={0}
              role="link"
              onClick={() => router.push(`/admin/depot/${history.container.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/admin/depot/${history.container.id}`);
                }
              }}
              className="cursor-pointer transition-colors hover:bg-cm-surf/30"
            >
              <td className="px-4 py-3 font-mono text-xs font-bold text-cm-accent">
                {history.container.containerNumber}
              </td>
              <td className="px-4 py-3 text-cm-ink-sub">
                {dispatchRecipientLabel(history.latestDispatch)}
                {history.latestDispatch.recipientLabel && !history.latestDispatch.representative
                  ? " · Εξωτερικό"
                  : ""}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-cm-muted">
                {formatDepotDispatchDate(history.latestDispatch.createdAt)}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs">
                {history.dispatches.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
