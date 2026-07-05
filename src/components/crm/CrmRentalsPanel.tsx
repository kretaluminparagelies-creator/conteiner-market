/**
 * @file CrmRentalsPanel.tsx
 * @description Active rental contracts — customers, expiry, location
 */

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { formatCrmDateOnly } from "@/lib/crm/format-crm-date-only";
import { getRentalContractStatus, type RentalContractStatus } from "@/lib/crm/rental-contract";
import { formatRentalLocation, rentalLocationLabels } from "@/lib/crm/rental-location-labels";
import type { Listing, RentalLocation } from "@/lib/types/listing";

type CrmRentalsPanelProps = {
  rentals: Listing[];
};

type RentalFilters = {
  status: "" | RentalContractStatus;
  location: "" | RentalLocation;
  query: string;
};

const defaultFilters: RentalFilters = {
  status: "",
  location: "",
  query: "",
};

const selectClass =
  "rounded-lg border border-cm-border bg-cm-bg px-3 py-2 text-sm text-cm-text outline-none focus:border-cm-accent";

const iconActionClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md border border-cm-border/80 bg-cm-surf/40 text-cm-sub transition-colors hover:border-cm-accent/40 hover:bg-cm-surf hover:text-cm-accent";

const statusBadgeClass: Record<RentalContractStatus, string> = {
  active: "text-emerald-400",
  expiring: "text-amber-300",
  expired: "text-red-300",
};

export function CrmRentalsPanel({ rentals }: CrmRentalsPanelProps) {
  const [filters, setFilters] = useState<RentalFilters>(defaultFilters);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    return rentals.filter((listing) => {
      const { status } = getRentalContractStatus(listing.rentalEndsAt);
      if (filters.status && status !== filters.status) return false;
      if (filters.location && listing.rentalLocation !== filters.location) return false;
      if (!q) return true;

      const haystack = [
        listing.containerNumber,
        listing.type,
        listing.rentalCustomerName,
        listing.rentalCustomerPhone,
        listing.rentalCustomerEmail,
        listing.rentalCustomerCompany,
        listing.rentalCustomerAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [rentals, filters]);

  const stats = useMemo(() => {
    let expiring = 0;
    let expired = 0;
    for (const listing of rentals) {
      const { status } = getRentalContractStatus(listing.rentalEndsAt);
      if (status === "expiring") expiring += 1;
      if (status === "expired") expired += 1;
    }
    return { total: rentals.length, expiring, expired };
  }, [rentals]);

  const hasFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-cm-border bg-cm-card/40 px-4 py-3">
          <p className="font-mono text-[10px] tracking-wide text-cm-muted uppercase">Ενεργές</p>
          <p className="font-display text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <p className="font-mono text-[10px] tracking-wide text-amber-200/80 uppercase">
            Λήγουν ≤30 ημ.
          </p>
          <p className="font-display text-2xl font-bold text-amber-200">{stats.expiring}</p>
        </div>
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3">
          <p className="font-mono text-[10px] tracking-wide text-red-200/80 uppercase">Έληξαν</p>
          <p className="font-display text-2xl font-bold text-red-200">{stats.expired}</p>
        </div>
      </div>

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

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Κατάσταση σύμβασης
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  status: e.target.value as "" | RentalContractStatus,
                }))
              }
            >
              <option value="">Όλες</option>
              <option value="active">Ενεργή</option>
              <option value="expiring">Λήγει σύντομα</option>
              <option value="expired">Έληξε</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block font-mono text-[10px] tracking-wide text-cm-muted uppercase">
              Τοποθεσία
            </label>
            <select
              className={`${selectClass} w-full`}
              value={filters.location}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  location: e.target.value as "" | RentalLocation,
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
              Αναζήτηση
            </label>
            <input
              type="search"
              className={`${selectClass} w-full`}
              placeholder="Πελάτης, τηλέφωνο, αριθμός κοντέινερ…"
              value={filters.query}
              onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-cm-sub">
        {filtered.length} από {rentals.length} ενεργές ενοικιάσεις
      </p>

      <div className="overflow-hidden rounded-xl border border-cm-border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="border-b border-cm-border bg-cm-surf/50 font-mono text-[10px] tracking-[0.12em] text-cm-muted uppercase">
              <tr>
                <th className="px-3 py-3 text-center">Α/Α</th>
                <th className="px-4 py-3">Κοντέινερ</th>
                <th className="px-4 py-3">Πελάτης</th>
                <th className="px-4 py-3">Επικοινωνία</th>
                <th className="px-4 py-3">Τοποθεσία</th>
                <th className="px-4 py-3">Έναρξη</th>
                <th className="px-4 py-3">Λήξη</th>
                <th className="px-4 py-3">Κατάσταση</th>
                <th className="px-3 py-3 text-center" aria-label="Επεξεργασία">
                  <Pencil className="mx-auto h-3.5 w-3.5" aria-hidden="true" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cm-border/70 bg-cm-card/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-cm-muted">
                    Δεν βρέθηκαν ενεργές ενοικιάσεις.
                  </td>
                </tr>
              ) : (
                filtered.map((listing, index) => {
                  const contract = getRentalContractStatus(listing.rentalEndsAt);
                  return (
                    <tr key={listing.id} className="hover:bg-cm-surf/30">
                      <td className="px-3 py-3 text-center font-mono text-xs text-cm-muted">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{listing.type}</p>
                        <p className="font-mono text-xs text-cm-accent">
                          {listing.containerNumber || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{listing.rentalCustomerName || "—"}</p>
                        {listing.rentalCustomerCompany ? (
                          <p className="text-xs text-cm-sub">{listing.rentalCustomerCompany}</p>
                        ) : null}
                        {listing.rentalCustomerAddress ? (
                          <p className="mt-1 text-xs text-cm-muted">{listing.rentalCustomerAddress}</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-cm-sub">
                        {listing.rentalCustomerPhone ? (
                          <p>{listing.rentalCustomerPhone}</p>
                        ) : null}
                        {listing.rentalCustomerEmail ? (
                          <p className="text-cm-muted">{listing.rentalCustomerEmail}</p>
                        ) : null}
                        {!listing.rentalCustomerPhone && !listing.rentalCustomerEmail ? "—" : null}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] uppercase text-cm-sub">
                        {formatRentalLocation(listing.rentalLocation)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-cm-sub">
                        {listing.rentalStartsAt ? formatCrmDateOnly(listing.rentalStartsAt) : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-cm-sub">
                        {listing.rentalEndsAt ? formatCrmDateOnly(listing.rentalEndsAt) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "font-mono text-[10px] uppercase",
                            statusBadgeClass[contract.status],
                          ].join(" ")}
                        >
                          {contract.label}
                        </span>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
