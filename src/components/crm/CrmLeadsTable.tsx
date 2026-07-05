/**
 * @file CrmLeadsTable.tsx
 * @description Leads table with status updates
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { CrmLeadStatusSelect } from "@/components/crm/CrmLeadStatusSelect";
import { leadSourceLabels } from "@/lib/crm/lead-labels";
import type { Lead } from "@/lib/crm/types";
import { formatCrmDate } from "@/lib/crm/format-crm-date";

type CrmLeadsTableProps = {
  leads: Lead[];
};

export function CrmLeadsTable({ leads }: CrmLeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-cm-border bg-cm-card/40 p-8 text-center text-cm-sub">
        Δεν υπάρχουν αιτήματα ακόμα.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-cm-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-cm-border bg-cm-surf/50 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
            <tr>
              <th className="px-4 py-3">Ημερομηνία</th>
              <th className="px-4 py-3">Όνομα</th>
              <th className="px-4 py-3">Πηγή</th>
              <th className="px-4 py-3">Κατάσταση</th>
              <th className="px-4 py-3">Μήνυμα</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-cm-border/70 bg-cm-card/30">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-cm-surf/30">
                <td className="px-4 py-3 font-mono text-xs text-cm-sub whitespace-nowrap">
                  {formatCrmDate(lead.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-cm-text">{lead.name}</div>
                  <div className="text-xs text-cm-muted">{lead.email}</div>
                </td>
                <td className="px-4 py-3 text-cm-sub">{leadSourceLabels[lead.source]}</td>
                <td className="px-4 py-3">
                  <CrmLeadStatusSelect leadId={lead.id} status={lead.status} />
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-cm-sub" title={lead.message}>
                  {lead.message}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-mono text-[11px] text-cm-accent hover:underline"
                  >
                    Λεπτομέρειες
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
