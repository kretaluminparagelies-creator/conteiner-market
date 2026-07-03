/**
 * @file ListingsCatalogCarousel.tsx
 * @description Catalog carousel with ?tab= URL sync
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ListingsCarouselBrowse } from "@/components/listings/ListingsCarouselBrowse";
import {
  defaultListingCarouselTab,
  type ListingCarouselTab,
} from "@/lib/utils/listing-carousel-filters";
import type { Listing } from "@/lib/types/listing";

type ListingsCatalogCarouselProps = {
  listings: Listing[];
  initialTab: ListingCarouselTab;
};

export function ListingsCatalogCarousel({ listings, initialTab }: ListingsCatalogCarouselProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (tab: ListingCarouselTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === defaultListingCarouselTab) {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/listings?${query}` : "/listings", { scroll: false });
  };

  return (
    <ListingsCarouselBrowse
      listings={listings}
      initialTab={initialTab}
      onTabChange={handleTabChange}
    />
  );
}
