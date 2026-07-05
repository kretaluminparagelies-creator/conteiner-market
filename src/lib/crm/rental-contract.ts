/**
 * @file rental-contract.ts
 * @description Active rental contracts — customer, dates, expiry status (CRM)
 */

import type { Listing, RentalLocation } from "@/lib/types/listing";

export type RentalContractStatus = "active" | "expiring" | "expired";

export type RentalHandoverInput = {
  rentalLocation: RentalLocation;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCompany: string;
  customerAddress: string;
  customerNotes: string;
  startsAt: string;
  endsAt: string;
};

export function emptyRentalHandover(): RentalHandoverInput {
  const today = new Date().toISOString().slice(0, 10);
  return {
    rentalLocation: "depot",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerCompany: "",
    customerAddress: "",
    customerNotes: "",
    startsAt: today,
    endsAt: "",
  };
}

export function rentalHandoverFromListing(listing: Listing): RentalHandoverInput {
  return {
    rentalLocation: listing.rentalLocation ?? "depot",
    customerName: listing.rentalCustomerName ?? "",
    customerPhone: listing.rentalCustomerPhone ?? "",
    customerEmail: listing.rentalCustomerEmail ?? "",
    customerCompany: listing.rentalCustomerCompany ?? "",
    customerAddress: listing.rentalCustomerAddress ?? "",
    customerNotes: listing.rentalCustomerNotes ?? "",
    startsAt: listing.rentalStartsAt ?? new Date().toISOString().slice(0, 10),
    endsAt: listing.rentalEndsAt ?? "",
  };
}

export function validateRentalHandover(input: RentalHandoverInput): string | null {
  if (!input.customerName.trim()) return "Συμπλήρωσε όνομα πελάτη.";
  if (!input.customerPhone.trim()) return "Συμπλήρωσε τηλέφωνο πελάτη.";
  if (!input.startsAt) return "Συμπλήρωσε ημερομηνία έναρξης.";
  if (!input.endsAt) return "Συμπλήρωσε ημερομηνία λήξης σύμβασης.";
  if (input.endsAt < input.startsAt) {
    return "Η λήξη πρέπει να είναι μετά την έναρξη.";
  }
  return null;
}

export function isActiveRentalListing(listing: Listing): boolean {
  return (
    !listing.active &&
    listing.listingType === "rent" &&
    listing.archiveReason === "rented"
  );
}

export function rentalContractDaysLeft(endsAt?: string): number | null {
  if (!endsAt) return null;
  const end = new Date(`${endsAt}T23:59:59`);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getRentalContractStatus(endsAt?: string): {
  status: RentalContractStatus;
  label: string;
  daysLeft: number | null;
} {
  const daysLeft = rentalContractDaysLeft(endsAt);
  if (daysLeft === null) {
    return { status: "active", label: "Χωρίς ημ. λήξης", daysLeft: null };
  }
  if (daysLeft < 0) {
    return {
      status: "expired",
      label: `Έληξε πριν ${Math.abs(daysLeft)} ημ.`,
      daysLeft,
    };
  }
  if (daysLeft <= 30) {
    return {
      status: "expiring",
      label: daysLeft === 0 ? "Λήγει σήμερα" : `Λήγει σε ${daysLeft} ημ.`,
      daysLeft,
    };
  }
  return { status: "active", label: `Λήγει σε ${daysLeft} ημ.`, daysLeft };
}
