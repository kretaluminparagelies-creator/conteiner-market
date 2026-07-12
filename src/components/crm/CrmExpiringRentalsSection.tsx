/**
 * @file CrmExpiringRentalsSection.tsx
 * @description Dashboard list — rentals expiring within 30 days or expired
 */

import Link from "next/link";
import { formatCrmDateOnly } from "@/lib/crm/format-crm-date-only";
import { readExpiringRentalsPaginated } from "@/lib/crm/expiring-rentals";
import { getRentalContractStatus } from "@/lib/crm/rental-contract";
import { formatRentalLocation } from "@/lib/crm/rental-location-labels";
import { CrmListPaginationBar } from "@/components/crm/CrmListPaginationBar";
import { parsePageParam } from "@/lib/crm/pagination";

type CrmExpiringRentalsSectionProps = {
  page?: string;
};

export async function CrmExpiringRentalsSection({ page }: CrmExpiringRentalsSectionProps) {
  const safePage = parsePageParam(page);
  const result = await readExpiringRentalsPaginated(safePage);

  if (result.total === 0) {
    return null;
  }

  const baseParams = new URLSearchParams();

  return (
    <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card/30">
      <div className="flex items-center justify-end border-b border-cm-border bg-cm-surf/40 px-4 py-2">
        <Link
          href="/admin/rentals"
          className="font-mono text-[11px] text-cm-accent hover:underline"
        >
          Όλες οι ενοικιάσεις →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-cm-border/70 bg-cm-surf/30 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
            <tr>
              <th className="px-4 py-3">Κοντέινερ</th>
              <th className="px-4 py-3">Πελάτης</th>
              <th className="px-4 py-3">Τοποθεσία</th>
              <th className="px-4 py-3">Λήξη</th>
              <th className="px-4 py-3">Κατάσταση</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cm-border/70">
            {result.items.map((listing) => {
              const contract = getRentalContractStatus(listing.rentalEndsAt);
              const statusClass =
                contract.status === "expired"
                  ? "font-semibold text-red-700"
                  : "font-semibold text-amber-800";
              const editHref = `/admin/listings/${listing.slug}/edit`;

              return (
                <tr key={listing.id} className="transition-colors hover:bg-cm-surf/30">
                  <td className="px-4 py-3">
                    <Link href={editHref} className="block">
                      <div className="font-medium text-cm-text">{listing.type}</div>
                      <div className="font-mono text-xs text-cm-accent">
                        {listing.containerNumber || listing.slug}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={editHref} className="block text-cm-sub">
                      {listing.rentalCustomerName || "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={editHref} className="block text-cm-ink-sub">
                      {formatRentalLocation(listing.rentalLocation)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                    <Link href={editHref} className="block">
                      {listing.rentalEndsAt ? formatCrmDateOnly(listing.rentalEndsAt) : "—"}
                    </Link>
                  </td>
                  <td className={`px-4 py-3 text-xs ${statusClass}`}>
                    <Link href={editHref} className="block">
                      {contract.label}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <CrmListPaginationBar
        slice={result}
        pathname="/admin"
        searchParams={baseParams}
      />
    </div>
  );
}
