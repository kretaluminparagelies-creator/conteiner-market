/**
 * @file ListingsPreview.tsx
 * @description Featured listings 3D carousel on the home page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ListingsCarouselBrowse } from "@/components/listings/ListingsCarouselBrowse";
import { useListings } from "@/lib/context/listings-context";
import { showFeaturedListings } from "@/lib/constants/listing-carousel";
import {
  carouselBackgroundImage,
  homePhotoImageClass,
  homePhotoOverlayFadeClass,
  homePhotoOverlayPrimaryClass,
} from "@/lib/constants/home";
import { emitHomeListingTabChange } from "@/lib/nav/home-listing-tab-sync";
import {
  emitHomeCarouselFilterChange,
  offersCarouselSectionId,
  parseHomeCarouselSearch,
  scrollToOffersCarousel,
} from "@/lib/nav/navigate-offers-route";
import { defaultListingCarouselTab } from "@/lib/utils/listing-carousel-filters";

export function ListingsPreview() {
  const listings = useListings();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const parsed = parseHomeCarouselSearch(search ? `?${search}` : "");
  const initialTab = parsed.tab ?? defaultListingCarouselTab;

  useEffect(() => {
    const carouselSearch = parseHomeCarouselSearch(window.location.search);
    const hashMatches = window.location.hash === `#${offersCarouselSectionId}`;
    const hasFilters = Boolean(carouselSearch.tab || carouselSearch.containerType || carouselSearch.deal);

    if (carouselSearch.tab) emitHomeListingTabChange(carouselSearch.tab, "category");
    if (carouselSearch.containerType || carouselSearch.deal) {
      emitHomeCarouselFilterChange({
        containerType: carouselSearch.containerType ?? null,
        deal: carouselSearch.deal ?? null,
        source: "hero",
      });
    }

    if (!hashMatches && !hasFilters) return;

    const section = document.getElementById(offersCarouselSectionId);
    if (!section) return;

    requestAnimationFrame(() => scrollToOffersCarousel(section, carouselSearch));
  }, [search]);

  if (!showFeaturedListings || listings.length === 0) return null;

  return (
    <section
      id="prosfores"
      className="relative overflow-hidden px-[6%] pt-8 pb-16 md:pt-10 md:pb-20 scroll-mt-[60px]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={carouselBackgroundImage}
          alt=""
          fill
          sizes="100vw"
          className={[homePhotoImageClass, "object-[center_40%]"].join(" ")}
        />
        <div className={["absolute inset-0", homePhotoOverlayPrimaryClass].join(" ")} />
        <div className={["absolute inset-0", homePhotoOverlayFadeClass].join(" ")} />
      </div>

      <div className="relative z-[1] mx-auto max-w-6xl overflow-visible">
        <ListingsCarouselBrowse
          listings={listings}
          initialTab={initialTab}
          initialContainerType={parsed.containerType}
          initialDeal={parsed.deal}
          showSectionHeader
          tone="light"
        />
      </div>
    </section>
  );
}
