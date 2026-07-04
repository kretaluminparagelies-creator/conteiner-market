/**
 * @file container-type-match.ts
 * @description Match listings to container type catalog IDs
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { isKnownContainerTypeId } from "@/lib/constants/container-types";
import type { Listing } from "@/lib/types/listing";

function normalizeListingType(type: string): string {
  return type.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Map a listing `type` label to a catalog container type id */
export function resolveListingContainerTypeId(type: string): string | null {
  const value = normalizeListingType(type);

  if (value.includes("45") && value.includes("pallet")) return "45-pallet-wide";
  if (value.includes("45") && (value.includes("high cube") || value.includes(" hc"))) return "45hc";
  if (value.includes("40") && value.includes("reefer")) return "40-reefer";
  if (value.includes("40") && value.includes("high cube")) return "40hc";
  if (value.includes("40") && value.includes("dry")) return "40dc";
  if (value.includes("20") && value.includes("reefer")) return "20-reefer";
  if (value.includes("open top")) return "open-top";
  if (value.includes("flat rack")) return "flat-rack";
  if (value.includes("double door")) return "double-door";
  if (value.includes("side") && (value.includes("open") || value.includes("opener"))) {
    return "side-door";
  }
  if (value.includes("20") && value.includes("high cube")) return "20hc";
  if (value.includes("20") && value.includes("dry")) return "20dc";

  return null;
}

export function listingMatchesContainerType(listing: Listing, containerTypeId: string): boolean {
  if (!isKnownContainerTypeId(containerTypeId)) return true;
  return resolveListingContainerTypeId(listing.type) === containerTypeId;
}

export function filterListingsByContainerType(
  listings: Listing[],
  containerTypeId?: string,
): Listing[] {
  if (!containerTypeId || !isKnownContainerTypeId(containerTypeId)) return listings;
  return listings.filter((listing) => listingMatchesContainerType(listing, containerTypeId));
}

/** Container types that appear in at least one active listing */
export function getAvailableContainerTypeIds(listings: Listing[]): string[] {
  const ids = new Set<string>();
  for (const listing of listings) {
    const id = resolveListingContainerTypeId(listing.type);
    if (id) ids.add(id);
  }
  return Array.from(ids);
}
