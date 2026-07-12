/**
 * @file CrmListingsTable.tsx
 * @description Listings table for CRM preview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { formatCrmDate } from "@/lib/crm/format-crm-date";
import type { Listing } from "@/lib/types/listing";
import { resolveIsOffer, resolveStockCondition } from "@/lib/utils/listing-carousel-filters";

type CrmListingsTableProps = {
  listings: Listing[];
  rowOffset?: number;
};

const iconActionClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-cm-border bg-white text-cm-ink-muted transition-colors hover:border-cm-accent/40 hover:bg-cm-accent/5 hover:text-cm-accent";

export function CrmListingsTable({ listings, rowOffset = 0 }: CrmListingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-cm-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-cm-border bg-cm-surf/50 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
            <tr>
              <th className="px-3 py-3 text-center">Α/Α</th>
              <th className="px-4 py-3">Ημερομηνία</th>
              <th className="px-4 py-3">Αριθμός</th>
              <th className="px-4 py-3">Τύπος</th>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Ειδ. προσφ.</th>
              <th className="px-4 py-3">Τιμή</th>
              <th className="px-3 py-3 text-center" aria-label="Προβολή στο site">
                <Eye className="mx-auto h-3.5 w-3.5" aria-hidden="true" />
              </th>
              <th className="px-3 py-3 text-center" aria-label="Επεξεργασία">
                <Pencil className="mx-auto h-3.5 w-3.5" aria-hidden="true" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cm-border/70 bg-cm-card/30">
            {listings.map((listing, index) => (
              <tr key={listing.id} className="hover:bg-cm-surf/30">
                <td className="px-3 py-3 text-center font-mono text-xs text-cm-muted">
                  {rowOffset + index + 1}
                </td>
                <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-cm-sub">
                  {listing.createdAt ? formatCrmDate(listing.createdAt) : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-cm-accent">
                  {listing.containerNumber || "—"}
                </td>
                <td className="px-4 py-3 font-medium">{listing.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase",
                      listing.listingType === "rent" ? "tag-rent" : "tag-sale",
                    ].join(" ")}
                  >
                    {listing.listingType === "rent" ? "Ενοικίαση" : "Αγορά"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase text-cm-sub">
                  {resolveStockCondition(listing) === "new" ? "Καινούριο" : "Μεταχ."}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "font-mono text-[10px] uppercase",
                      resolveIsOffer(listing) ? "text-cm-accent" : "text-cm-muted",
                    ].join(" ")}
                  >
                    {resolveIsOffer(listing) ? "Ναι" : "—"}
                  </span>
                </td>
                <td className="px-4 py-3 font-display font-semibold">
                  {listing.priceFormatted}
                  {listing.unit ? (
                    <span className="ml-1 text-xs font-normal text-cm-muted">{listing.unit}</span>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-center">
                  <Link
                    href={`/listings/${listing.slug}`}
                    className={iconActionClass}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Προβολή στο site"
                    aria-label={`Προβολή ${listing.type} στο site`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </td>
                <td className="px-3 py-3 text-center">
                  <Link
                    href={`/admin/listings/${listing.slug}/edit`}
                    className={iconActionClass}
                    title="Επεξεργασία"
                    aria-label={`Επεξεργασία ${listing.type}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
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
