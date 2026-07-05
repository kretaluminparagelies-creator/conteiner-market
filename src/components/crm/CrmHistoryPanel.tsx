/**
 * @file CrmHistoryPanel.tsx
 * @description Archived listings with CRM filters
 */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { formatArchiveReason } from "@/lib/crm/archive-labels";
import { formatCrmDate } from "@/lib/crm/format-crm-date";
import { formatRentalLocation, rentalLocationLabels } from "@/lib/crm/rental-location-labels";
import { containerTypeOptions } from "@/lib/crm/listing-form";
import type { ArchiveReason, Listing, ListingType, RentalLocation, StockCondition } from "@/lib/types/listing";
import { resolveIsOffer, resolveStockCondition } from "@/lib/utils/listing-carousel-filters";

type CrmHistoryPanelProps = {
  listings: Listing[];
};

type HistoryFilters = {
  type: string;
  listingType: "" | ListingType;
  stockCondition: "" | StockCondition;
  archiveReason: "" | ArchiveReason;
  rentalLocation: "" | RentalLocation;
  isOffer: "" | "yes" | "no";
  containerNumber: string;
};

const defaultFilters: HistoryFilters = {
  type: "",
  listingType: "",
  stockCondition: "",
  archiveReason: "",
  rentalLocation: "",
  isOffer: "",
  containerNumber: "",
};

const selectClass =
  "rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm text-cm-text outline-none focus:border-cm-accent";

const iconActionClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-cm-border bg-white text-cm-ink-muted transition-colors hover:border-cm-accent/40 hover:bg-cm-accent/5 hover:text-cm-accent";

export function CrmHistoryPanel({ listings }: CrmHistoryPanelProps) {
  const [filters, setFilters] = useState<HistoryFilters>(defaultFilters);

  const filtered = useMemo(() => {
    const q = filters.containerNumber.trim().toLowerCase();

    return listings.filter((listing) => {
      if (filters.type && listing.type !== filters.type) return false;
      if (filters.listingType && listing.listingType !== filters.listingType) return false;
      if (filters.stockCondition && resolveStockCondition(listing) !== filters.stockCondition) {
        return false;
      }
      if (filters.archiveReason && listing.archiveReason !== filters.archiveReason) return false;
      if (filters.rentalLocation && listing.rentalLocation !== filters.rentalLocation) {
        return false;
      }
      if (filters.isOffer === "yes" && !resolveIsOffer(listing)) return false;
      if (filters.isOffer === "no" && resolveIsOffer(listing)) return false;
      if (q && !(listing.containerNumber ?? "").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [listings, filters]);

  const hasFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-cm-border bg-cm-card/40 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-sm font-semibold">Φίλτρα</h2>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => setFilters(defaultFilters)}
              className="font-mono text-[10px] tracking-wide text-cm-muted uppercase hover:text-cm-accent"
            >
              Καθαρισμός
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Τύπος
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="">Όλοι</option>
              {containerTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Deal
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.listingType}
              onChange={(e) =>
                setFilters((f) => ({ ...f, listingType: e.target.value as "" | ListingType }))
              }
            >
              <option value="">Όλα</option>
              <option value="sale">Αγορά</option>
              <option value="rent">Ενοικίαση</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Stock
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.stockCondition}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  stockCondition: e.target.value as "" | StockCondition,
                }))
              }
            >
              <option value="">Όλα</option>
              <option value="new">Καινούριο</option>
              <option value="used">Μεταχειρισμένο</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Αποτέλεσμα
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.archiveReason}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  archiveReason: e.target.value as "" | ArchiveReason,
                }))
              }
            >
              <option value="">Όλα</option>
              <option value="sold">Πωλήθηκε</option>
              <option value="rented">Ενοικιάστηκε</option>
              <option value="withdrawn">Αποσύρθηκε</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Τοποθεσία
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.rentalLocation}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  rentalLocation: e.target.value as "" | RentalLocation,
                }))
              }
            >
              <option value="">Όλες</option>
              <option value="depot">{rentalLocationLabels.depot}</option>
              <option value="customer">{rentalLocationLabels.customer}</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Προσφορά
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.isOffer}
              onChange={(e) =>
                setFilters((f) => ({ ...f, isOffer: e.target.value as "" | "yes" | "no" }))
              }
            >
              <option value="">Όλα</option>
              <option value="yes">Ναι</option>
              <option value="no">Όχι</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Αριθμός κοντέινερ
            </label>
            <input
              type="search"
              className={`${selectClass} w-full`}
              placeholder="π.χ. ABCD1234567"
              value={filters.containerNumber}
              onChange={(e) => setFilters((f) => ({ ...f, containerNumber: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-cm-sub">
        {filtered.length} από {listings.length} εγγραφές στο ιστορικό
      </p>

      <div className="overflow-hidden rounded-xl border border-cm-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="border-b border-cm-border bg-cm-surf/50 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
              <tr>
                <th className="px-3 py-3 text-center">Α/Α</th>
                <th className="px-4 py-3">Ημ. αρχειοθ.</th>
                <th className="px-4 py-3">Αριθμός</th>
                <th className="px-4 py-3">Τύπος</th>
                <th className="px-4 py-3">Deal</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Αποτέλεσμα</th>
                <th className="px-4 py-3">Τοποθεσία</th>
                <th className="px-4 py-3">Τιμή</th>
                <th className="px-3 py-3 text-center" aria-label="Επεξεργασία">
                  <Pencil className="mx-auto h-3.5 w-3.5" aria-hidden="true" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-border/70 bg-cm-card/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-cm-muted">
                    Δεν βρέθηκαν εγγραφές με τα τρέχοντα φίλτρα.
                  </td>
                </tr>
              ) : (
                filtered.map((listing, index) => (
                  <tr key={listing.id} className="hover:bg-cm-surf/30">
                    <td className="px-3 py-3 text-center font-mono text-xs text-cm-muted">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-cm-sub">
                      {listing.archivedAt
                        ? formatCrmDate(listing.archivedAt)
                        : listing.updatedAt
                          ? formatCrmDate(listing.updatedAt)
                          : "—"}
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
                    <td className="px-4 py-3 font-mono text-[10px] uppercase text-cm-sub">
                      {formatArchiveReason(listing.archiveReason)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] uppercase text-cm-sub">
                      {listing.archiveReason === "rented"
                        ? formatRentalLocation(listing.rentalLocation)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 font-display font-semibold">
                      {listing.priceFormatted}
                      {listing.unit ? (
                        <span className="ml-1 text-xs font-normal text-cm-muted">{listing.unit}</span>
                      ) : null}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
