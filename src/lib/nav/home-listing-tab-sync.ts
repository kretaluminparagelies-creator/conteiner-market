/**
 * @file home-listing-tab-sync.ts
 * @description Sync listing carousel tabs between home nav strip and section
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import {
  listingCarouselTabs,
  type ListingCarouselTab,
} from "@/lib/utils/listing-carousel-filters";

export const homeListingTabEvent = "cm-home-listing-tab-change";

export type HomeListingTabEventDetail = {
  tab: ListingCarouselTab;
  source: "nav" | "section";
};

export function emitHomeListingTabChange(
  tab: ListingCarouselTab,
  source: HomeListingTabEventDetail["source"],
): void {
  window.dispatchEvent(
    new CustomEvent<HomeListingTabEventDetail>(homeListingTabEvent, {
      detail: { tab, source },
    }),
  );
}

export function isListingCarouselTab(value: string): value is ListingCarouselTab {
  return listingCarouselTabs.includes(value as ListingCarouselTab);
}
