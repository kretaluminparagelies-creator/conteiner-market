/**
 * @file navigate-offers-route.ts
 * @description Nav to listings — smooth scroll to home offers section when already on /
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { emitHomeListingTabChange, isListingCarouselTab } from "@/lib/nav/home-listing-tab-sync";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";
import {
  parseContainerTypeParam,
  serializeContainerTypeParam,
} from "@/lib/utils/container-type-params";

export const listingsHref = "/listings";

export const offersCarouselSectionId = "prosfores";

export const listingCarouselTabParam = "tab";

export const containerTypeParam = "containerType";

export const dealParam = "deal";

export type HomeCarouselSearchParams = {
  tab?: ListingCarouselTab;
  containerTypes?: string[];
  deal?: "sale" | "rent";
};

const navHeightPx = 60;
const sectionGapPx = 12;
/** Extra scroll past section top — keep carousel in view without overshooting */
const carouselScrollExtraPx = 0;
const carouselLeadBelowNavPx = 100;

export const homeCarouselFilterEvent = "cm-home-carousel-filter";

export type HomeCarouselFilterEventDetail = {
  containerTypes: string[];
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

export function buildHomeCarouselUrl(
  params?: ListingCarouselTab | HomeCarouselSearchParams,
): string {
  const options: HomeCarouselSearchParams =
    typeof params === "string" ? { tab: params } : (params ?? {});

  const search = new URLSearchParams();
  if (options.tab) search.set(listingCarouselTabParam, options.tab);
  const containerTypesQuery = serializeContainerTypeParam(options.containerTypes ?? []);
  if (containerTypesQuery) search.set(containerTypeParam, containerTypesQuery);
  if (options.deal === "sale" || options.deal === "rent") {
    search.set(dealParam, options.deal);
  }

  const query = search.toString();
  return query ? `/?${query}` : "/";
}

export function stripHomeCarouselHashFromUrl(): void {
  if (typeof window === "undefined") return;
  if (window.location.hash !== `#${offersCarouselSectionId}`) return;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
}

let homeLoadedViaReload: boolean | null = null;

/** True once per full page load when the user refreshed (F5 / restart). */
export function isHomePageReload(): boolean {
  if (typeof window === "undefined") return false;
  if (homeLoadedViaReload === null) {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    homeLoadedViaReload = nav?.type === "reload";
  }
  return homeLoadedViaReload;
}

export function parseHomeCarouselSearch(search: string): HomeCarouselSearchParams {
  const params = new URLSearchParams(search);
  const tab = params.get(listingCarouselTabParam);
  const deal = params.get(dealParam);
  const containerTypes = parseContainerTypeParam(params.get(containerTypeParam));

  return {
    tab: tab && isListingCarouselTab(tab) ? tab : undefined,
    containerTypes: containerTypes.length > 0 ? containerTypes : undefined,
    deal: deal === "sale" || deal === "rent" ? deal : undefined,
  };
}

export function parseListingTabFromSearch(search: string): ListingCarouselTab | null {
  return parseHomeCarouselSearch(search).tab ?? null;
}

function isMobileOffersLayout(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}

function scrollMobileOffersCarousel(section: HTMLElement): number {
  const block =
    section.querySelector<HTMLElement>("[data-offers-carousel-mobile-block]") ??
    section.querySelector<HTMLElement>("[data-offers-carousel-mobile]") ??
    section;

  const rect = block.getBoundingClientRect();
  const visibleHeight = window.innerHeight - navHeightPx;
  const blockHeight = rect.height;

  if (blockHeight >= visibleHeight - sectionGapPx * 2) {
    return Math.max(0, window.scrollY + rect.top - navHeightPx - sectionGapPx);
  }

  return Math.max(
    0,
    window.scrollY + rect.top - navHeightPx - (visibleHeight - blockHeight) / 2,
  );
}

export function scrollToOffersCarousel(
  section: HTMLElement,
  params?: ListingCarouselTab | HomeCarouselSearchParams,
): void {
  const options: HomeCarouselSearchParams =
    typeof params === "string" ? { tab: params } : (params ?? {});

  if (isMobileOffersLayout()) {
    const top = scrollMobileOffersCarousel(section);
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", buildHomeCarouselUrl(options));
    return;
  }

  const carousel = section.querySelector<HTMLElement>("[data-offers-carousel]");
  const target = carousel ?? section;
  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    navHeightPx -
    (carousel ? carouselLeadBelowNavPx : sectionGapPx) +
    (carousel ? carouselScrollExtraPx : carouselScrollExtraPx / 2);

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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToOffersCarousel(section, { tab });
        });
      });
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
    containerTypes: options.containerTypes ?? [],
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
