/**
 * @file CrmRepresentativesTable.tsx
 * @description Representatives table for CRM list
 */

"use client";

import { useRouter } from "next/navigation";
import {
  representativeSearchSubtitle,
} from "@/lib/depot/filter-representatives";
import type { DepotRepresentative } from "@/lib/depot/types";

type CrmRepresentativesTableProps = {
  representatives: DepotRepresentative[];
  emptyMessage?: string;
};

export function CrmRepresentativesTable({
  representatives,
  emptyMessage = "Δεν υπάρχουν ακόμα αντιπρόσωποι.",
}: CrmRepresentativesTableProps) {
  const router = useRouter();

  if (representatives.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-cm-sub">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-cm-border/70 bg-cm-surf/30 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
          <tr>
            <th className="px-4 py-3">Επωνυμία</th>
            <th className="px-4 py-3">Υπεύθυνος</th>
            <th className="px-4 py-3">Πόλη</th>
            <th className="px-4 py-3">ΑΦΜ</th>
            <th className="px-4 py-3">Τηλέφωνο</th>
            <th className="px-4 py-3">Κατάσταση</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cm-border/70">
          {representatives.map((item) => (
            <tr
              key={item.id}
              tabIndex={0}
              role="link"
              onClick={() => router.push(`/admin/representatives/${item.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  router.push(`/admin/representatives/${item.id}`);
                }
              }}
              className="cursor-pointer transition-colors hover:bg-cm-surf/30"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-cm-ink">{item.companyName || item.name}</p>
                {representativeSearchSubtitle(item) ? (
                  <p className="mt-0.5 font-mono text-[11px] text-cm-muted">
                    {representativeSearchSubtitle(item)}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-cm-sub">{item.name}</td>
              <td className="px-4 py-3 text-cm-sub">{item.city || "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-cm-sub">{item.afm || "—"}</td>
              <td className="px-4 py-3 font-mono text-xs text-cm-sub">{item.phone || "—"}</td>
              <td className="px-4 py-3">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
