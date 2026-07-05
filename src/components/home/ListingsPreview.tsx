/**
 * @file ListingsPreview.tsx
 * @description Featured listings 3D carousel on the home page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
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
  isHomePageReload,
  offersCarouselSectionId,
  parseHomeCarouselSearch,
  scrollToOffersCarousel,
  stripHomeCarouselHashFromUrl,
} from "@/lib/nav/navigate-offers-route";
import { defaultListingCarouselTab } from "@/lib/utils/listing-carousel-filters";

export function ListingsPreview() {
  const listings = useListings();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const parsed = parseHomeCarouselSearch(search ? `?${search}` : "");
  const initialTab = parsed.tab ?? defaultListingCarouselTab;
  const containerTypesKey = (parsed.containerTypes ?? []).join(",");
  const hasHandledInitial = useRef(false);

  useLayoutEffect(() => {
    if (!isHomePageReload()) return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    stripHomeCarouselHashFromUrl();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const carouselSearch = parseHomeCarouselSearch(window.location.search);
    const hashMatches = window.location.hash === `#${offersCarouselSectionId}`;
    const hasFilters = Boolean(
      carouselSearch.tab || carouselSearch.containerTypes?.length || carouselSearch.deal,
    );

    if (carouselSearch.tab) emitHomeListingTabChange(carouselSearch.tab, "category");
    if (carouselSearch.containerTypes?.length || carouselSearch.deal) {
      emitHomeCarouselFilterChange({
        containerTypes: carouselSearch.containerTypes ?? [],
        deal: carouselSearch.deal ?? null,
        source: "hero",
      });
    }

    if (!hasHandledInitial.current) {
      hasHandledInitial.current = true;
      if (isHomePageReload()) return;
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
      className="relative px-[6%] pt-8 pb-16 md:pt-10 md:pb-20 scroll-mt-[60px]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
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
          key={[initialTab, containerTypesKey, parsed.deal ?? "", search].join("|")}
          listings={listings}
          initialTab={initialTab}
          initialContainerTypes={parsed.containerTypes}
          initialDeal={parsed.deal}
          showSectionHeader
          tone="light"
        />
      </div>
    </section>
  );
}
