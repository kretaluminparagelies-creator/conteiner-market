/**
 * @file navigate-offers-route.ts
 * @description Nav to listings — smooth scroll to home offers section when already on /
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export const listingsHref = "/listings";

export const offersCarouselSectionId = "prosfores";

const navHeightPx = 60;
const sectionGapPx = 12;

export function scrollToOffersCarousel(section: HTMLElement): void {
  const top =
    section.getBoundingClientRect().top + window.scrollY - navHeightPx - sectionGapPx;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `/#${offersCarouselSectionId}`);
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
