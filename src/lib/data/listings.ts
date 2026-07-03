/**
 * @file listings.ts
 * @description Public listing API — delegates to active repository
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { listingRepository } from "@/lib/repositories";
import { resolveListingLocation } from "@/lib/utils/listing-location";
import type { Listing, ListingType } from "@/lib/types/listing";
import type { Locale } from "@/lib/i18n/types";

export function localizeListing(listing: Listing, locale: Locale): Listing {
  const hq = resolveListingLocation(listing.location, locale);

  if (locale === "el") {
    return { ...listing, location: hq };
  }

  return {
    ...listing,
    condition: listing.conditionEn ?? listing.condition,
    location: hq,
    description: listing.descriptionEn ?? listing.description,
    unit: listing.unitEn ?? listing.unit,
  };
}

export function localizeListings(listingsToLocalize: Listing[], locale: Locale): Listing[] {
  return listingsToLocalize.map((listing) => localizeListing(listing, locale));
}

export function getAllListings(): Listing[] {
  return listingRepository.getAll();
}

export function getListingBySlug(slug: string): Listing | undefined {
  return listingRepository.getBySlug(slug);
}

export function getListingsByType(listingType: ListingType): Listing[] {
  return listingRepository.getByType(listingType);
}

export function getFeaturedListings(limit = 9): Listing[] {
  return listingRepository.getFeatured(limit);
}
