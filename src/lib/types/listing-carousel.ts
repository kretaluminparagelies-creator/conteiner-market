/**
 * @file listing-carousel.ts
 * @description Types for 3D listings carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ListingType } from "@/lib/types/listing";

export type CarouselListingItem = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  unit: string;
  condition: string;
  listingType: ListingType;
  isOffer?: boolean;
  image: string;
};
