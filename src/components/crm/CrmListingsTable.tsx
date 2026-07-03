/**
 * @file CrmListingsTable.tsx
 * @description Listings table for CRM preview
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import Link from "next/link";
import type { Listing } from "@/lib/types/listing";
import { resolveIsOffer, resolveStockCondition } from "@/lib/utils/listing-carousel-filters";

type CrmListingsTableProps = {
  listings: Listing[];
};

export function CrmListingsTable({ listings }: CrmListingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-cm-border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-cm-border bg-cm-surf/50 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
            <tr>
              <th className="px-4 py-3">Τύπος</th>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Προσφορά</th>
              <th className="px-4 py-3">Τιμή</th>
              <th className="px-4 py-3">Ενεργό</th>
              <th className="px-4 py-3">Προβολή</th>
              <th className="px-4 py-3">CRM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cm-border/70 bg-cm-card/30">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-cm-surf/30">
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
                <td className="px-4 py-3">
                  <span
                    className={[
                      "font-mono text-[10px] uppercase",
                      listing.active ? "text-emerald-400" : "text-cm-muted",
                    ].join(" ")}
                  >
                    {listing.active ? "Ενεργό" : "Ανενεργό"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/listings/${listing.slug}`}
                    className="text-xs text-cm-accent hover:underline"
                    target="_blank"
                  >
                    Προβολή →
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/listings/${listing.slug}/edit`}
                    className="text-xs text-cm-rent hover:underline"
                  >
                    Επεξεργασία
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
