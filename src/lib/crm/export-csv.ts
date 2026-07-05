/**
 * @file export-csv.ts
 * @description CSV export helpers for CRM (leads, rentals)
 */

import { formatCrmDate } from "@/lib/crm/format-crm-date";
import { formatCrmDateOnly } from "@/lib/crm/format-crm-date-only";
import { leadSourceLabels, leadStatusLabels } from "@/lib/crm/lead-labels";
import { formatRentalLocation } from "@/lib/crm/rental-location-labels";
import { getRentalContractStatus } from "@/lib/crm/rental-contract";
import type { Lead } from "@/lib/crm/types";
import type { Listing } from "@/lib/types/listing";

function escapeCsvField(value: string | number | undefined | null): string {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsvRow(fields: (string | number | undefined | null)[]): string {
  return fields.map(escapeCsvField).join(",");
}

export function leadsToCsv(leads: Lead[]): string {
  const header = toCsvRow([
    "Ημερομηνία",
    "Όνομα",
    "Email",
    "Τηλέφωνο",
    "Πηγή",
    "Κατάσταση",
    "Listing",
    "Μήνυμα",
    "Σημειώσεις admin",
  ]);

  const rows = leads.map((lead) =>
    toCsvRow([
      formatCrmDate(lead.createdAt),
      lead.name,
      lead.email,
      lead.phone ?? "",
      leadSourceLabels[lead.source],
      leadStatusLabels[lead.status],
      lead.listingSlug ?? "",
      lead.message,
      lead.adminNotes ?? "",
    ]),
  );

  return `\uFEFF${[header, ...rows].join("\r\n")}`;
}

export function rentalsToCsv(rentals: Listing[]): string {
  const header = toCsvRow([
    "Αριθμός",
    "Τύπος",
    "Πελάτης",
    "Τηλέφωνο",
    "Email",
    "Τοποθεσία",
    "Έναρξη",
    "Λήξη",
    "Κατάσταση",
    "Slug",
  ]);

  const rows = rentals.map((listing) => {
    const contract = getRentalContractStatus(listing.rentalEndsAt);
    return toCsvRow([
      listing.containerNumber ?? "",
      listing.type,
      listing.rentalCustomerName ?? "",
      listing.rentalCustomerPhone ?? "",
      listing.rentalCustomerEmail ?? "",
      formatRentalLocation(listing.rentalLocation),
      listing.rentalStartsAt ? formatCrmDateOnly(listing.rentalStartsAt) : "",
      listing.rentalEndsAt ? formatCrmDateOnly(listing.rentalEndsAt) : "",
      contract.label,
      listing.slug,
    ]);
  });

  return `\uFEFF${[header, ...rows].join("\r\n")}`;
}
