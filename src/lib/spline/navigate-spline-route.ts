/**
 * @file navigate-spline-route.ts
 * @description Spline menu navigation — scroll to offers carousel on home
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { splineMenuOffersHref } from "@/lib/constants/spline-menu";

export const offersCarouselSectionId = "prosfores";

const navHeightPx = 60;
/** Breathing gap between the fixed nav and the section top */
const sectionGapPx = 12;

export function scrollToOffersCarousel(section: HTMLElement): void {
  const top =
    section.getBoundingClientRect().top +
    window.scrollY -
    navHeightPx -
    sectionGapPx;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  window.history.replaceState(null, "", `/#${offersCarouselSectionId}`);
}

export function navigateSplineRoute(
  href: string,
  pathname: string,
  push: (url: string) => void,
): void {
  if (href !== splineMenuOffersHref) {
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

  push(splineMenuOffersHref);
}
