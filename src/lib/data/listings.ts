/**
 * @file listings.ts
 * @description Local data layer for container listings (Supabase-ready shape)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import listingsData from "@/data/listings.json";
import type { Listing, ListingType } from "@/lib/types/listing";
import type { Locale } from "@/lib/i18n/types";

const listings = listingsData as Listing[];

export function localizeListing(listing: Listing, locale: Locale): Listing {
  if (locale === "el") return listing;

  return {
    ...listing,
    condition: listing.conditionEn ?? listing.condition,
    location: listing.locationEn ?? listing.location,
    description: listing.descriptionEn ?? listing.description,
    unit: listing.unitEn ?? listing.unit,
  };
}

export function localizeListings(listingsToLocalize: Listing[], locale: Locale): Listing[] {
  return listingsToLocalize.map((listing) => localizeListing(listing, locale));
}

export function getAllListings(): Listing[] {
  return listings.filter((listing) => listing.active);
}

export function getListingBySlug(slug: string): Listing | undefined {
  return getAllListings().find((listing) => listing.slug === slug);
}

export function getListingsByType(listingType: ListingType): Listing[] {
  return getAllListings().filter((listing) => listing.listingType === listingType);
}

export function getFeaturedListings(limit = 9): Listing[] {
  return getAllListings().slice(0, limit);
}
