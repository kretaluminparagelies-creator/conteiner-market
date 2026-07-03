/**
 * @file ListingsCarouselBrowse.tsx
 * @description 3D carousel + detail modal — shared home & catalog
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useState } from "react";
import { ContainerCarousel3D } from "@/components/listings/carousel/ContainerCarousel3D";
import { ListingDetailModal } from "@/components/listings/detail/ListingDetailModal";
import { getListingBySlug } from "@/lib/data/listings";
import { mapListingsToCarousel } from "@/lib/utils/map-listing-carousel";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";
import type { Listing } from "@/lib/types/listing";

type ListingsCarouselBrowseProps = {
  listings: Listing[];
  /** Hide «Δες όλα» in modal — e.g. already on /listings */
  showViewAllInModal?: boolean;
};

export function ListingsCarouselBrowse({
  listings,
  showViewAllInModal = true,
}: ListingsCarouselBrowseProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const carouselItems = mapListingsToCarousel(listings);

  const handleListingClick = (item: CarouselListingItem) => {
    const listing = getListingBySlug(item.slug);
    if (listing) setSelectedListing(listing);
  };

  if (carouselItems.length === 0) return null;

  return (
    <>
      <div data-offers-carousel>
        <ContainerCarousel3D listings={carouselItems} onListingClick={handleListingClick} />
      </div>
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        showViewAll={showViewAllInModal}
      />
    </>
  );
}
