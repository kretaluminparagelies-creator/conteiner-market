/**
 * @file navigate-offers-route.ts
 * @description Nav to listings — smooth scroll to home offers section when already on /
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import {
  emitHomeListingTabChange,
  isListingCarouselTab,
} from "@/lib/nav/home-listing-tab-sync";
import { isKnownContainerTypeId } from "@/lib/constants/container-types";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";

export const listingsHref = "/listings";

export const offersCarouselSectionId = "prosfores";

export const listingCarouselTabParam = "tab";

export const containerTypeParam = "containerType";

export const dealParam = "deal";

export type HomeCarouselSearchParams = {
  tab?: ListingCarouselTab;
  containerType?: string;
  deal?: "sale" | "rent";
};

const navHeightPx = 60;
const sectionGapPx = 12;

export const homeCarouselFilterEvent = "cm-home-carousel-filter";

export type HomeCarouselFilterEventDetail = {
  containerType: string | null;
  deal: "sale" | "rent" | null;
  source: "hero" | "section";
};

export function emitHomeCarouselFilterChange(
  detail: Omit<HomeCarouselFilterEventDetail, "source"> & {
    source: HomeCarouselFilterEventDetail["source"];
  },
): void {
  window.dispatchEvent(
    new CustomEvent<HomeCarouselFilterEventDetail>(homeCarouselFilterEvent, { detail }),
  );
}

export function buildHomeCarouselUrl(params?: ListingCarouselTab | HomeCarouselSearchParams): string {
  const options: HomeCarouselSearchParams =
    typeof params === "string" ? { tab: params } : (params ?? {});

  const search = new URLSearchParams();
  if (options.tab) search.set(listingCarouselTabParam, options.tab);
  if (options.containerType && isKnownContainerTypeId(options.containerType)) {
    search.set(containerTypeParam, options.containerType);
  }
  if (options.deal === "sale" || options.deal === "rent") {
    search.set(dealParam, options.deal);
  }

  const query = search.toString();
  return `/${query ? `?${query}` : ""}#${offersCarouselSectionId}`;
}

export function parseHomeCarouselSearch(search: string): HomeCarouselSearchParams {
  const params = new URLSearchParams(search);
  const tab = params.get(listingCarouselTabParam);
  const containerType = params.get(containerTypeParam);
  const deal = params.get(dealParam);

  return {
    tab: tab && isListingCarouselTab(tab) ? tab : undefined,
    containerType:
      containerType && isKnownContainerTypeId(containerType) ? containerType : undefined,
    deal: deal === "sale" || deal === "rent" ? deal : undefined,
  };
}

export function parseListingTabFromSearch(search: string): ListingCarouselTab | null {
  return parseHomeCarouselSearch(search).tab ?? null;
}

export function scrollToOffersCarousel(
  section: HTMLElement,
  params?: ListingCarouselTab | HomeCarouselSearchParams,
): void {
  const options: HomeCarouselSearchParams =
    typeof params === "string" ? { tab: params } : (params ?? {});

  const top =
    section.getBoundingClientRect().top + window.scrollY - navHeightPx - sectionGapPx;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", buildHomeCarouselUrl(options));
}

export function navigateToCategoryCarousel(
  tab: ListingCarouselTab,
  pathname: string,
  push: (url: string) => void,
): void {
  emitHomeListingTabChange(tab, "category");

  if (pathname === "/") {
    const section = document.getElementById(offersCarouselSectionId);
    if (section) {
      scrollToOffersCarousel(section, { tab });
      return;
    }
  }

  push(buildHomeCarouselUrl({ tab }));
}

export function navigateHomeCarouselSearch(
  options: HomeCarouselSearchParams,
  pathname: string,
  push: (url: string) => void,
): void {
  if (options.tab) emitHomeListingTabChange(options.tab, "hero");
  emitHomeCarouselFilterChange({
    containerType: options.containerType ?? null,
    deal: options.deal ?? null,
    source: "hero",
  });

  if (pathname === "/") {
    const section = document.getElementById(offersCarouselSectionId);
    if (section) {
      scrollToOffersCarousel(section, options);
      return;
    }
  }

  push(buildHomeCarouselUrl(options));
}

export function navigateOffersRoute(
  href: string,
  pathname: string,
  push: (url: string) => void,
): void {
  if (href !== listingsHref) {
    push(href);
    return;
  }

  if (pathname === "/") {
    const section = document.getElementById(offersCarouselSectionId);
    if (section) {
      scrollToOffersCarousel(section);
      return;
    }
  }

  push(listingsHref);
}
