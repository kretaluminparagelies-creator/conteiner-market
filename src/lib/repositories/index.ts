/**
 * @file index.ts
 * @description Active listing repository — change provider when Supabase connects
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { jsonListingRepository } from "@/lib/repositories/json-listing-repository";
import type { ListingRepository } from "@/lib/repositories/listing-repository";

/** Replace with supabaseListingRepository when env is set. */
export const listingRepository: ListingRepository = jsonListingRepository;
