/**
 * @file listing-carousel-filters.ts
 * @description Carousel tab filters — offers, stock, rent
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { Listing, StockCondition } from "@/lib/types/listing";

export type ListingCarouselTab = "offers" | "new" | "used" | "rent";

export const listingCarouselTabs: ListingCarouselTab[] = ["offers", "new", "used", "rent"];

export const defaultListingCarouselTab: ListingCarouselTab = "offers";

export function resolveStockCondition(listing: Listing): StockCondition {
  if (listing.stockCondition) return listing.stockCondition;

  const label = `${listing.condition} ${listing.conditionEn ?? ""}`.toLowerCase();
  if (label.includes("καινούρι") || label.includes("καινουρι") || label.includes("new")) {
    return "new";
  }
  if (
    label.includes("μεταχειρισμέ") ||
    label.includes("μεταχειρισμ") ||
    label.includes("used")
  ) {
    return "used";
  }

  return "used";
}

export function resolveIsOffer(listing: Listing): boolean {
  return listing.isOffer === true;
}

export function filterListingsByCarouselTab(
  listings: Listing[],
  tab: ListingCarouselTab,
): Listing[] {
  switch (tab) {
    case "offers":
      return listings.filter((listing) => resolveIsOffer(listing));
    case "new":
      return listings.filter((listing) => resolveStockCondition(listing) === "new");
    case "used":
      return listings.filter((listing) => resolveStockCondition(listing) === "used");
    case "rent":
      return listings.filter((listing) => listing.listingType === "rent");
  }
}

export function parseCarouselTab(raw?: string | string[]): ListingCarouselTab {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value && listingCarouselTabs.includes(value as ListingCarouselTab)) {
    return value as ListingCarouselTab;
  }
  return defaultListingCarouselTab;
}

/** Hero ?deal=rent → rent tab; otherwise default offers */
export function resolveInitialCarouselTab(raw: {
  tab?: string | string[];
  deal?: string | string[];
}): ListingCarouselTab {
  const tab = parseCarouselTab(raw.tab);
  if (raw.tab) return tab;

  const deal = Array.isArray(raw.deal) ? raw.deal[0] : raw.deal;
  if (deal === "rent") return "rent";

  return defaultListingCarouselTab;
}
