/**
 * @file index.ts
 * @description Active listing repository — sync JSON for client fallback; server uses listings-server.ts
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { jsonListingRepository } from "@/lib/repositories/json-listing-repository";
import type { ListingRepository } from "@/lib/repositories/listing-repository";

/** Bundled JSON — client components fallback; server pages use fetchPublicListings(). */
export const listingRepository: ListingRepository = jsonListingRepository;
