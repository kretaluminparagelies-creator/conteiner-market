/**
 * @file ListingsPreview.tsx
 * @description Featured listings 3D carousel on the home page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect } from "react";
import { ListingsCarouselBrowse } from "@/components/listings/ListingsCarouselBrowse";
import { getAllListings } from "@/lib/data/listings";
import { showFeaturedListings } from "@/lib/constants/listing-carousel";
import {
  offersCarouselSectionId,
  scrollToOffersCarousel,
} from "@/lib/nav/navigate-offers-route";

export function ListingsPreview() {
  const listings = getAllListings();

  useEffect(() => {
    if (window.location.hash !== `#${offersCarouselSectionId}`) return;

    const section = document.getElementById(offersCarouselSectionId);
    if (!section) return;

    requestAnimationFrame(() => scrollToOffersCarousel(section));
  }, []);

  if (!showFeaturedListings || listings.length === 0) return null;

  return (
    <section
      id="prosfores"
      className="relative scroll-mt-[60px] overflow-hidden bg-cm-bg px-[6%] pt-4 pb-16 md:pt-5 md:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff10_0%,transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,#4ab0e818_0%,transparent_48%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(#243d5814_1px,transparent_1px),linear-gradient(90deg,#243d5814_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <ListingsCarouselBrowse listings={listings} showSectionHeader />
      </div>
    </section>
  );
}
