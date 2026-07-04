/**
 * @file listings-server.ts
 * @description Async listing fetch for server components (Supabase + cache)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { unstable_cache } from "next/cache";
import { jsonListingRepository } from "@/lib/repositories/json-listing-repository";
import { fetchListingsFromSupabase } from "@/lib/repositories/supabase-listings";
import { useSupabaseForPublicReads } from "@/lib/repositories/listing-store";
import type { Listing, ListingType } from "@/lib/types/listing";

const LISTINGS_CACHE_TAG = "listings";

async function loadPublicListingsUncached(): Promise<Listing[]> {
  if (useSupabaseForPublicReads()) {
    try {
      return await fetchListingsFromSupabase({ includeInactive: false });
    } catch (error) {
      console.error("[listings-server] Supabase fetch failed, falling back to JSON:", error);
    }
  }

  return jsonListingRepository.getAll();
}

export const fetchPublicListings = unstable_cache(
  loadPublicListingsUncached,
  ["public-listings"],
  { revalidate: 60, tags: [LISTINGS_CACHE_TAG] },
);

export async function fetchPublicListingBySlug(slug: string): Promise<Listing | undefined> {
  const listings = await fetchPublicListings();
  return listings.find((listing) => listing.slug === slug);
}

export async function fetchPublicListingsByType(listingType: ListingType): Promise<Listing[]> {
  const listings = await fetchPublicListings();
  return listings.filter((listing) => listing.listingType === listingType);
}

export async function fetchFeaturedListings(limit = 9): Promise<Listing[]> {
  const listings = await fetchPublicListings();
  return listings.slice(0, limit);
}

export { LISTINGS_CACHE_TAG };
