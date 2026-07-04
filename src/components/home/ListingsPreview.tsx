/**
 * @file ListingsPreview.tsx
 * @description Featured listings 3D carousel on the home page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect } from "react";
import { ListingsCarouselBrowse } from "@/components/listings/ListingsCarouselBrowse";
import { useListings } from "@/lib/context/listings-context";
import { showFeaturedListings } from "@/lib/constants/listing-carousel";
import {
  offersCarouselSectionId,
  scrollToOffersCarousel,
} from "@/lib/nav/navigate-offers-route";

export function ListingsPreview() {
  const listings = useListings();

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
      className="relative scroll-mt-[60px] overflow-hidden bg-cm-light-bg px-[6%] pt-4 pb-16 md:pt-5 md:pb-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,#e0703010_0%,transparent_45%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,#4ab0e812_0%,transparent_50%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <ListingsCarouselBrowse listings={listings} showSectionHeader tone="light" />
      </div>
    </section>
  );
}
