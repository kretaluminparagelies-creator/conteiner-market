/**
 * @file rental-location-labels.ts
 * @description Greek labels for rented container location (CRM)
 */

import type { RentalLocation } from "@/lib/types/listing";

export const rentalLocationLabels: Record<RentalLocation, string> = {
  depot: "Depo",
  customer: "Μέρος πελάτη",
};

export function formatRentalLocation(location?: RentalLocation): string {
  if (!location) return "—";
  return rentalLocationLabels[location];
}
