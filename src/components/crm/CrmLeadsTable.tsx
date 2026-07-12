/**
 * @file CrmLeadsTable.tsx
 * @description Leads table with status updates
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CrmLeadStatusSelect } from "@/components/crm/CrmLeadStatusSelect";
import { leadSourceLabels } from "@/lib/crm/lead-labels";
import type { Lead } from "@/lib/crm/types";
import { formatCrmDate } from "@/lib/crm/format-crm-date";

type CrmLeadsTableProps = {
  leads: Lead[];
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
  bare?: boolean;
};

export function CrmLeadsTable({
  leads,
  title,
  viewAllHref = "/admin/leads",
  emptyMessage = "Δεν υπάρχουν αιτήματα ακόμα.",
  bare = false,
}: CrmLeadsTableProps) {
  const router = useRouter();
  const showHeader = Boolean(title);

  const table = (
    <>
      {leads.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-cm-sub">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-cm-border/70 bg-cm-surf/30 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
              <tr>
                <th className="px-4 py-3">Ημερομηνία</th>
                <th className="px-4 py-3">Όνομα</th>
                <th className="px-4 py-3">Πηγή</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3">Κατάσταση</th>
                <th className="px-4 py-3">Μήνυμα</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-border/70">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  tabIndex={0}
                  role="link"
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      router.push(`/admin/leads/${lead.id}`);
                    }
                  }}
                  className="cursor-pointer transition-colors hover:bg-cm-surf/30"
                >
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-cm-muted">
                    {formatCrmDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-cm-text">{lead.name}</div>
                    <div className="text-xs text-cm-muted">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-cm-sub">{leadSourceLabels[lead.source]}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-cm-accent">
                    {lead.listingSlug ? (
                      <Link
                        href={`/admin/listings/${lead.listingSlug}/edit`}
                        onClick={(event) => event.stopPropagation()}
                        className="hover:underline"
                      >
                        {lead.listingSlug}
                      </Link>
                    ) : (
                      <span className="text-cm-ink-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <CrmLeadStatusSelect leadId={lead.id} status={lead.status} />
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-cm-sub" title={lead.message}>
                    {lead.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  if (!showHeader) {
    if (bare) {
      return table;
    }

    return (
      <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/30">
        {table}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/30">
      <div className="flex items-center justify-between gap-3 border-b border-cm-border bg-cm-surf/40 px-4 py-3">
        <p className="font-display text-sm font-semibold text-cm-ink">{title}</p>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="font-mono text-[11px] text-cm-accent hover:underline"
          >
            Όλα τα αιτήματα →
          </Link>
        ) : null}
      </div>
      {table}
    </div>
  );
}
