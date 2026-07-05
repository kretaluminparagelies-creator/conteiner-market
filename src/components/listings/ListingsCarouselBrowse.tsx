/**
 * @file ListingsCarouselBrowse.tsx
 * @description 3D carousel + detail modal — shared home & catalog
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { ContainerCarousel3D } from "@/components/listings/carousel/ContainerCarousel3D";
import { ListingDetailModal } from "@/components/listings/detail/ListingDetailModal";
import { ListingsMobilePager } from "@/components/listings/ListingsMobilePager";
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
import { getContainerTypeById } from "@/lib/constants/container-types";
import { filterListingsByContainerTypes } from "@/lib/utils/container-type-match";
import {
  buildHomeCarouselUrl,
  homeCarouselFilterEvent,
  type HomeCarouselFilterEventDetail,
} from "@/lib/nav/navigate-offers-route";
import type { ListingType } from "@/lib/types/listing";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";
import type { Listing } from "@/lib/types/listing";

type ListingsCarouselBrowseProps = {
  listings: Listing[];
  /** Initial tab — home defaults to offers */
  initialTab?: ListingCarouselTab;
  /** Hero / URL container type filter (one or more) */
  initialContainerTypes?: string[];
  /** Hero / URL deal filter */
  initialDeal?: ListingType;
  /** Called after tab change — e.g. sync URL on /listings */
  onTabChange?: (tab: ListingCarouselTab) => void;
  /** Show section title above tabs (home page) */
  showSectionHeader?: boolean;
  /** Light surface for home page below hero */
  tone?: "dark" | "light";
};

function filterListingsByDeal(listings: Listing[], deal?: ListingType): Listing[] {
  if (!deal) return listings;
  return listings.filter((listing) => listing.listingType === deal);
}

export function ListingsCarouselBrowse({
  listings,
  initialTab = defaultListingCarouselTab,
  initialContainerTypes,
  initialDeal,
  onTabChange,
  showSectionHeader = false,
  tone = "dark",
}: ListingsCarouselBrowseProps) {
  const { locale, t } = useLocale();
  const isLight = tone === "light";
  const [activeTab, setActiveTab] = useState<ListingCarouselTab>(initialTab);
  const [containerTypesFilter, setContainerTypesFilter] = useState<string[]>(
    initialContainerTypes ?? [],
  );
  const [dealFilter, setDealFilter] = useState<ListingType | undefined>(initialDeal);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const hasHeroFilters = containerTypesFilter.length > 0 || Boolean(dealFilter);

  const tabCounts = useMemo(
    () =>
      Object.fromEntries(
        listingCarouselTabs.map((tab) => {
          const byTab = filterListingsByCarouselTab(listings, tab);
          const byDeal = filterListingsByDeal(byTab, dealFilter);
          const byType = filterListingsByContainerTypes(byDeal, containerTypesFilter);
          return [tab, byType.length];
        }),
      ) as Record<ListingCarouselTab, number>,
    [listings, containerTypesFilter, dealFilter],
  );

  const filteredListings = useMemo(() => {
    const byTab = filterListingsByCarouselTab(listings, activeTab);
    const byDeal = filterListingsByDeal(byTab, dealFilter);
    return filterListingsByContainerTypes(byDeal, containerTypesFilter);
  }, [listings, activeTab, dealFilter, containerTypesFilter]);

  const localizedListings = filteredListings.map((listing) => localizeListing(listing, locale));
  const carouselItems = mapListingsToCarousel(localizedListings);

  const handleTabChange = (tab: ListingCarouselTab) => {
    setActiveTab(tab);
    setSelectedListing(null);
    onTabChange?.(tab);
    if (showSectionHeader) emitHomeListingTabChange(tab, "section");
  };

  const clearHeroFilters = () => {
    setContainerTypesFilter([]);
    setDealFilter(undefined);
    window.history.replaceState(null, "", buildHomeCarouselUrl({ tab: activeTab }));
  };

  const removeContainerTypeFilter = (id: string) => {
    const next = containerTypesFilter.filter((entry) => entry !== id);
    setContainerTypesFilter(next);
    window.history.replaceState(
      null,
      "",
      buildHomeCarouselUrl({
        tab: activeTab,
        containerTypes: next,
        deal: dealFilter,
      }),
    );
  };

  useEffect(() => {
    if (!showSectionHeader) return;

    const handleExternalTabChange = (event: Event) => {
      const { tab, source } = (event as CustomEvent<HomeListingTabEventDetail>).detail;
      if (source === "section") return;
      setActiveTab(tab);
      setSelectedListing(null);
    };

    const handleFilterChange = (event: Event) => {
      const { containerTypes, deal, source } = (event as CustomEvent<HomeCarouselFilterEventDetail>)
        .detail;
      if (source === "section") return;
      setContainerTypesFilter(containerTypes);
      setDealFilter(deal ?? undefined);
      setSelectedListing(null);
    };

    window.addEventListener(homeListingTabEvent, handleExternalTabChange);
    window.addEventListener(homeCarouselFilterEvent, handleFilterChange);
    return () => {
      window.removeEventListener(homeListingTabEvent, handleExternalTabChange);
      window.removeEventListener(homeCarouselFilterEvent, handleFilterChange);
    };
  }, [showSectionHeader]);

  const handleListingClick = (item: CarouselListingItem) => {
    const listing = listings.find((entry) => entry.slug === item.slug);
    if (listing) setSelectedListing(localizeListing(listing, locale));
  };

  if (listings.length === 0) return null;

  const activeTypeChips = containerTypesFilter
    .map((id) => getContainerTypeById(id))
    .filter((spec): spec is NonNullable<typeof spec> => Boolean(spec))
    .map((spec) => ({
      id: spec.id,
      name: locale === "en" ? spec.name.en : spec.name.el,
    }));

  return (
    <>
      <div data-offers-carousel-mobile-block className="md:contents">
        <ListingCarouselTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={tabCounts}
          showSectionHeader={showSectionHeader}
          tone={tone}
        />

        {hasHeroFilters && showSectionHeader ? (
        <div
          className={[
            "mb-3 flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5",
            isLight
              ? "border-cm-light-border-strong bg-white/92 shadow-cm-light-xs"
              : "border-cm-border bg-cm-card/60",
          ].join(" ")}
        >
          <span className="font-mono text-[10px] tracking-[0.14em] text-cm-ink-muted uppercase">
            {t.heroSearch.activeFilters}
          </span>
          {dealFilter ? (
            <span className="rounded-full bg-cm-accent/12 px-2.5 py-1 font-display text-xs font-semibold text-cm-accent">
              {dealFilter === "rent" ? t.heroSearch.rent : t.heroSearch.sale}
            </span>
          ) : null}
          {activeTypeChips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => removeContainerTypeFilter(chip.id)}
              className="rounded-full bg-cm-rent/12 px-2.5 py-1 font-display text-xs font-semibold text-cm-rent hover:bg-cm-rent/20"
              title={t.heroSearch.clearFilters}
            >
              {chip.name} ×
            </button>
          ))}
          <button
            type="button"
            onClick={clearHeroFilters}
            className="ml-auto font-display text-xs font-semibold text-cm-ink-sub underline-offset-2 hover:underline"
          >
            {t.heroSearch.clearFilters}
          </button>
        </div>
      ) : null}

      {carouselItems.length === 0 ? (
        <div
          className={[
            "flex flex-col items-start gap-3 rounded-xl border p-8",
            isLight
              ? "border-cm-light-border-strong bg-cm-light-surf shadow-cm-light-xs"
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
        <>
          <ListingsMobilePager
            key={activeTab}
            listings={carouselItems}
            onListingClick={handleListingClick}
            surface={tone}
          />
          <div
            data-offers-carousel
            className={["hidden md:block", showSectionHeader ? "-mt-1.5 md:-mt-2" : ""].join(" ")}
          >
            <ContainerCarousel3D
              key={activeTab}
              listings={carouselItems}
              onListingClick={handleListingClick}
              surface={tone}
            />
          </div>
        </>
      )}
      </div>

      <ListingDetailModal
        listing={selectedListing}
        categoryListings={localizedListings}
        categoryTab={activeTab}
        onClose={() => setSelectedListing(null)}
        surface={tone}
      />
    </>
  );
}
