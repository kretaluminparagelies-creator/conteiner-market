/**
 * @file ListingsCarouselBrowse.tsx
 * @description 3D carousel + detail modal — shared home & catalog
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ContainerCarousel3D } from "@/components/listings/carousel/ContainerCarousel3D";
import { ListingDetailModal } from "@/components/listings/detail/ListingDetailModal";
import { ListingCarouselTabs } from "@/components/listings/ListingCarouselTabs";
import { localizeListing } from "@/lib/data/listings";
import { useLocale } from "@/lib/i18n/locale-context";
import {
  emitHomeListingTabChange,
  homeListingTabEvent,
  type HomeListingTabEventDetail,
} from "@/lib/nav/home-listing-tab-sync";
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
  /** Show section title above tabs (home page) */
  showSectionHeader?: boolean;
  /** Light surface for home page below hero */
  tone?: "dark" | "light";
};

export function ListingsCarouselBrowse({
  listings,
  initialTab = defaultListingCarouselTab,
  onTabChange,
  showSectionHeader = false,
  tone = "dark",
}: ListingsCarouselBrowseProps) {
  const { locale, t } = useLocale();
  const reduceMotion = useReducedMotion();
  const isLight = tone === "light";
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
    if (showSectionHeader) emitHomeListingTabChange(tab, "section");
  };

  useEffect(() => {
    if (!showSectionHeader) return;

    const handleExternalTabChange = (event: Event) => {
      const { tab, source } = (event as CustomEvent<HomeListingTabEventDetail>).detail;
      if (source === "section") return;
      setActiveTab(tab);
      setSelectedListing(null);
    };

    window.addEventListener(homeListingTabEvent, handleExternalTabChange);
    return () => window.removeEventListener(homeListingTabEvent, handleExternalTabChange);
  }, [showSectionHeader]);

  const handleListingClick = (item: CarouselListingItem) => {
    const listing = listings.find((entry) => entry.slug === item.slug);
    if (listing) setSelectedListing(localizeListing(listing, locale));
  };

  if (listings.length === 0) return null;

  return (
    <>
      <ListingCarouselTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={tabCounts}
        showSectionHeader={showSectionHeader}
        tone={tone}
      />

      {carouselItems.length === 0 ? (
        <div
          className={[
            "flex flex-col items-start gap-3 rounded-xl border p-8",
            isLight
              ? "border-cm-light-border bg-cm-light-surf shadow-sm"
              : "border-cm-border bg-cm-card/50",
          ].join(" ")}
        >
          <p className={isLight ? "text-cm-ink-sub" : "text-cm-sub"}>{t.listings.noTabResults}</p>
          <button
            type="button"
            onClick={() => handleTabChange(defaultListingCarouselTab)}
            className="inline-flex items-center rounded-[6px] border border-cm-accent/55 px-4 py-2 font-display text-sm font-semibold text-cm-accent transition-colors hover:bg-cm-accent/10"
          >
            {t.listings.tabs.offers}
          </button>
        </div>
      ) : (
        <motion.div
          key={activeTab}
          data-offers-carousel
          className={showSectionHeader ? "-mt-1.5 md:-mt-2" : undefined}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <ContainerCarousel3D listings={carouselItems} onListingClick={handleListingClick} />
        </motion.div>
      )}

      <ListingDetailModal
        listing={selectedListing}
        categoryListings={localizedListings}
        categoryTab={activeTab}
        onClose={() => setSelectedListing(null)}
      />
    </>
  );
}
