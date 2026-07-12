/**
 * @file CrmDepotContainersTable.tsx
 * @description Depot inventory table for CRM — row opens card view
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { formatCrmDate } from "@/lib/crm/format-crm-date";
import { containerTypeById } from "@/lib/constants/container-types";
import { depotStatusLabels } from "@/lib/depot/status";
import type { DepotContainer } from "@/lib/depot/types";

type CrmDepotContainersTableProps = {
  containers: DepotContainer[];
  emptyMessage: string;
};

export function CrmDepotContainersTable({
  containers,
  emptyMessage,
}: CrmDepotContainersTableProps) {
  const router = useRouter();

  if (containers.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-cm-sub">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-cm-border/70 bg-cm-surf/30 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
          <tr>
            <th className="px-4 py-3">Αριθμός</th>
            <th className="px-4 py-3">Τύπος</th>
            <th className="px-4 py-3">Grade</th>
            <th className="px-4 py-3">Κατάσταση</th>
            <th className="px-4 py-3 text-right">Τιμή</th>
            <th className="px-4 py-3">Καταχώρηση</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cm-border/70">
          {containers.map((container) => {
            const typeLabel =
              containerTypeById[container.containerType]?.name.el ?? container.containerType;

            return (
              <tr
                key={container.id}
                tabIndex={0}
                role="link"
                onClick={() => router.push(`/admin/depot/${container.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/admin/depot/${container.id}`);
                  }
                }}
                className="cursor-pointer transition-colors hover:bg-cm-surf/30"
              >
                <td className="px-4 py-3 font-mono text-xs font-bold text-cm-accent">
                  {container.containerNumber}
                </td>
                <td className="px-4 py-3 text-cm-ink-sub">{typeLabel}</td>
                <td className="px-4 py-3 font-mono text-xs">{container.grade}</td>
                <td className="px-4 py-3 text-sm text-cm-sub">
                  {depotStatusLabels[container.status]}
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">
                  {container.salePrice !== undefined
                    ? `€${container.salePrice.toLocaleString("el-GR")}`
                    : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-cm-muted">
                  {formatCrmDate(container.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
