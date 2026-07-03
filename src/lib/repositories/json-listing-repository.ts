/**
 * @file json-listing-repository.ts
 * @description JSON read-only repository (bundled data for site)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import listingsData from "@/data/listings.json";
import type { ListingRepository } from "@/lib/repositories/listing-repository";
import type { Listing } from "@/lib/types/listing";

const bundledListings = listingsData as Listing[];

export const jsonListingRepository: ListingRepository = {
  getAll({ includeInactive = false } = {}) {
    if (includeInactive) return bundledListings;
    return bundledListings.filter((listing) => listing.active);
  },

  getBySlug(slug) {
    return jsonListingRepository.getAll({ includeInactive: true }).find((l) => l.slug === slug);
  },

  getByType(listingType) {
    return jsonListingRepository.getAll().filter((l) => l.listingType === listingType);
  },

  getFeatured(limit = 9) {
    return jsonListingRepository.getAll().slice(0, limit);
  },
};
