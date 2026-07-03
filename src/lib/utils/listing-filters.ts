/**
 * @file listing-filters.ts
 * @description Derive filter options and filter listings by hero search params
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing, ListingType } from "@/lib/types/listing";

export type ListingFilters = {
  deal?: ListingType | "";
  size?: string;
};

/** Leading size token of a type, e.g. "40ft High Cube" -> "40ft" */
export function getListingSize(type: string): string {
  return type.trim().split(/\s+/)[0] ?? "";
}

export function getListingSizes(listings: Listing[]): string[] {
  const sizes = new Set<string>();
  for (const listing of listings) {
    const size = getListingSize(listing.type);
    if (size) sizes.add(size);
  }
  return Array.from(sizes).sort();
}

export function filterListings(listings: Listing[], filters: ListingFilters): Listing[] {
  return listings.filter((listing) => {
    if (filters.deal && listing.listingType !== filters.deal) return false;
    if (filters.size && getListingSize(listing.type).toLowerCase() !== filters.size.toLowerCase()) {
      return false;
    }
    return true;
  });
}

export function hasActiveFilters(filters: ListingFilters): boolean {
  return Boolean(filters.deal || filters.size);
}

/** Normalize raw searchParams (string | string[] | undefined) into filters */
export function parseListingFilters(raw: {
  deal?: string | string[];
  size?: string | string[];
}): ListingFilters {
  const first = (value?: string | string[]): string =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

  const deal = first(raw.deal);
  return {
    deal: deal === "sale" || deal === "rent" ? deal : "",
    size: first(raw.size),
  };
}
