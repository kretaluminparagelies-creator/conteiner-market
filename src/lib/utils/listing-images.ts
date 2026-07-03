/**
 * @file listing-images.ts
 * @description Listing gallery helpers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing } from "@/lib/types/listing";

export function getListingSourceImages(listing: Listing): string[] {
  if (listing.images?.length) return listing.images;
  if (listing.image) return [listing.image];
  return [];
}

/** Triple single image so 3D photo carousel has side slides (Moduspace pattern) */
export function getListingDisplayImages(listing: Listing): string[] {
  const source = getListingSourceImages(listing);
  if (source.length === 0) return [];
  if (source.length === 1) return [source[0], source[0], source[0]];
  return source;
}

export function getListingImages(listing: Listing): string[] {
  return getListingSourceImages(listing);
}
