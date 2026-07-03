/**
 * @file listings.ts
 * @description Local data layer for container listings (Supabase-ready shape)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

import listingsData from "@/data/listings.json";
import type { Listing, ListingType } from "@/lib/types/listing";

const listings = listingsData as Listing[];

export function getAllListings(): Listing[] {
  return listings.filter((listing) => listing.active);
}

export function getListingBySlug(slug: string): Listing | undefined {
  return getAllListings().find((listing) => listing.slug === slug);
}

export function getListingsByType(listingType: ListingType): Listing[] {
  return getAllListings().filter((listing) => listing.listingType === listingType);
}

export function getFeaturedListings(limit = 6): Listing[] {
  return getAllListings().slice(0, limit);
}
