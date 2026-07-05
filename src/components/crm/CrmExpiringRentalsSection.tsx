/**
 * @file CrmExpiringRentalsSection.tsx
 * @description Dashboard list — rentals expiring within 30 days or expired
 */

import Link from "next/link";
import { Pencil } from "lucide-react";
import { formatCrmDateOnly } from "@/lib/crm/format-crm-date-only";
import { readExpiringRentals } from "@/lib/crm/expiring-rentals";
import { getRentalContractStatus } from "@/lib/crm/rental-contract";
import { formatRentalLocation } from "@/lib/crm/rental-location-labels";

export async function CrmExpiringRentalsSection() {
  const rentals = await readExpiringRentals();

  if (rentals.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold text-cm-ink">Λήγουν σύντομα</h2>
        <div className="rounded-xl border border-cm-border bg-cm-card p-6 text-sm text-cm-ink-sub">
          Δεν υπάρχουν ενεργές ενοικιάσεις που λήγουν εντός 30 ημερών ή έχουν λήξει.
        </div>
      </section>
    );
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-cm-ink">Λήγουν σύντομα</h2>
          <p className="mt-1 text-sm text-cm-ink-sub">
            Ενοικιάσεις ≤30 ημ. ή ήδη ληγμένες — {rentals.length} συνολικά
          </p>
        </div>
        <Link
          href="/admin/rentals"
          className="font-mono text-[11px] text-cm-accent hover:underline"
        >
          Όλες οι ενοικιάσεις →
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-cm-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-cm-border bg-cm-light-bg font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
              <tr>
                <th className="px-4 py-3">Κοντέινερ</th>
                <th className="px-4 py-3">Πελάτης</th>
                <th className="px-4 py-3">Τοποθεσία</th>
                <th className="px-4 py-3">Λήξη</th>
                <th className="px-4 py-3">Κατάσταση</th>
                <th className="px-3 py-3 text-center" aria-label="Επεξεργασία" />
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-border/70 bg-white">
              {rentals.map((listing) => {
                const contract = getRentalContractStatus(listing.rentalEndsAt);
                const statusClass =
                  contract.status === "expired"
                    ? "font-semibold text-red-700"
                    : "font-semibold text-amber-800";

                return (
                  <tr key={listing.id} className="hover:bg-cm-light-bg">
                    <td className="px-4 py-3">
                      <div className="font-medium">{listing.type}</div>
                      <div className="font-mono text-xs text-cm-accent">
                        {listing.containerNumber || listing.slug}
                      </div>
                    </td>
                    <td className="px-4 py-3">{listing.rentalCustomerName || "—"}</td>
                    <td className="px-4 py-3 text-cm-ink-sub">
                      {formatRentalLocation(listing.rentalLocation)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                      {listing.rentalEndsAt ? formatCrmDateOnly(listing.rentalEndsAt) : "—"}
                    </td>
                    <td className={`px-4 py-3 text-xs ${statusClass}`}>{contract.label}</td>
                    <td className="px-3 py-3 text-center">
                      <Link
                        href={`/admin/listings/${listing.slug}/edit`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-cm-border bg-white text-cm-ink-muted transition-colors hover:border-cm-accent/40 hover:bg-cm-accent/5 hover:text-cm-accent"
                        title="Επεξεργασία"
                        aria-label={`Επεξεργασία ${listing.type}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
