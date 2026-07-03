/**
 * @file ListingsCarouselBrowse.tsx
 * @description 3D carousel + detail modal — shared home & catalog
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useMemo, useState } from "react";
import { ContainerCarousel3D } from "@/components/listings/carousel/ContainerCarousel3D";
import { ListingDetailModal } from "@/components/listings/detail/ListingDetailModal";
import { ListingCarouselTabs } from "@/components/listings/ListingCarouselTabs";
import { getListingBySlug, localizeListing } from "@/lib/data/listings";
import { useLocale } from "@/lib/i18n/locale-context";
import { mapListingsToCarousel } from "@/lib/utils/map-listing-carousel";
import {
  defaultListingCarouselTab,
  filterListingsByCarouselTab,
  listingCarouselTabs,
  type ListingCarouselTab,
} from "@/lib/utils/listing-carousel-filters";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";
import type { Listing } from "@/lib/types/listing";

type ListingsCarouselBrowseProps = {
  listings: Listing[];
  /** Initial tab — home defaults to offers */
  initialTab?: ListingCarouselTab;
  /** Called after tab change — e.g. sync URL on /listings */
  onTabChange?: (tab: ListingCarouselTab) => void;
};

export function ListingsCarouselBrowse({
  listings,
  initialTab = defaultListingCarouselTab,
  onTabChange,
}: ListingsCarouselBrowseProps) {
  const { locale, t } = useLocale();
  const [activeTab, setActiveTab] = useState<ListingCarouselTab>(initialTab);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const tabCounts = useMemo(
    () =>
      Object.fromEntries(
        listingCarouselTabs.map((tab) => [tab, filterListingsByCarouselTab(listings, tab).length]),
      ) as Record<ListingCarouselTab, number>,
    [listings],
  );

  const filteredListings = useMemo(
    () => filterListingsByCarouselTab(listings, activeTab),
    [listings, activeTab],
  );

  const localizedListings = filteredListings.map((listing) => localizeListing(listing, locale));
  const carouselItems = mapListingsToCarousel(localizedListings);

  const handleTabChange = (tab: ListingCarouselTab) => {
    setActiveTab(tab);
    setSelectedListing(null);
    onTabChange?.(tab);
  };

  const handleListingClick = (item: CarouselListingItem) => {
    const listing = getListingBySlug(item.slug);
    if (listing) setSelectedListing(localizeListing(listing, locale));
  };

  if (listings.length === 0) return null;

  return (
    <>
      <ListingCarouselTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={tabCounts}
      />

      {carouselItems.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-cm-border bg-cm-card/50 p-8">
          <p className="text-cm-sub">{t.listings.noTabResults}</p>
          <button
            type="button"
            onClick={() => handleTabChange(defaultListingCarouselTab)}
            className="inline-flex items-center rounded-[6px] border border-cm-accent/55 px-4 py-2 font-display text-sm font-semibold text-cm-accent transition-colors hover:bg-cm-accent/10"
          >
            {t.listings.tabs.offers}
          </button>
        </div>
      ) : (
        <div data-offers-carousel>
          <ContainerCarousel3D listings={carouselItems} onListingClick={handleListingClick} />
        </div>
      )}

      <ListingDetailModal listing={selectedListing} onClose={() => setSelectedListing(null)} />
    </>
  );
}
