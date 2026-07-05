/**
 * @file expiring-rentals.ts
 * @description Active rentals expiring within 30 days or already expired
 */

import "server-only";

import { cache } from "react";
import { getRentalContractStatus } from "@/lib/crm/rental-contract";
import { readAdminActiveRentals } from "@/lib/repositories/listing-store";
import type { Listing } from "@/lib/types/listing";

export async function readExpiringRentalsUncached(): Promise<Listing[]> {
  const rentals = await readAdminActiveRentals();

  return rentals
    .filter((listing) => {
      const { status } = getRentalContractStatus(listing.rentalEndsAt);
      return status === "expiring" || status === "expired";
    })
    .sort((a, b) => (a.rentalEndsAt ?? "").localeCompare(b.rentalEndsAt ?? ""));
}

export const readExpiringRentals = cache(readExpiringRentalsUncached);

export async function countExpiringRentals(): Promise<number> {
  const rentals = await readExpiringRentals();
  return rentals.length;
}
