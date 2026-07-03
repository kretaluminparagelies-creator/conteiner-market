/**
 * @file map-listing-carousel.ts
 * @description Map Listing → carousel item shape
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing } from "@/lib/types/listing";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";
import { resolveIsOffer } from "@/lib/utils/listing-carousel-filters";

export function mapListingToCarousel(listing: Listing): CarouselListingItem {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.type,
    location: listing.location,
    price: listing.priceFormatted,
    unit: listing.unit,
    condition: listing.condition,
    listingType: listing.listingType,
    isOffer: resolveIsOffer(listing),
    image: listing.image,
  };
}

export function mapListingsToCarousel(listings: Listing[]): CarouselListingItem[] {
  return listings.map(mapListingToCarousel);
}
