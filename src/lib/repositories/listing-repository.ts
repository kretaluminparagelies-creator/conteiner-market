/**
 * @file listing-repository.ts
 * @description Listing data access — swap JSON for Supabase later
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing, ListingType } from "@/lib/types/listing";

export type ListingRepository = {
  getAll: (options?: { includeInactive?: boolean }) => Listing[];
  getBySlug: (slug: string) => Listing | undefined;
  getByType: (listingType: ListingType) => Listing[];
  getFeatured: (limit?: number) => Listing[];
};
