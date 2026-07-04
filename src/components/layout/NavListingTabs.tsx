/**
 * @file NavListingTabs.tsx
 * @description Listing filter tabs inline in the main nav on home
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { ListingCarouselTabBar } from "@/components/listings/ListingCarouselTabBar";
import { getAllListings } from "@/lib/data/listings";
import {
  emitHomeListingTabChange,
  homeListingTabEvent,
  type HomeListingTabEventDetail,
} from "@/lib/nav/home-listing-tab-sync";
import {
  offersCarouselSectionId,
  scrollToOffersCarousel,
} from "@/lib/nav/navigate-offers-route";
import {
  defaultListingCarouselTab,
  type ListingCarouselTab,
} from "@/lib/utils/listing-carousel-filters";

export function NavListingTabs() {
  const listings = useMemo(() => getAllListings(), []);
  const [activeTab, setActiveTab] = useState<ListingCarouselTab>(defaultListingCarouselTab);

  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const { tab } = (event as CustomEvent<HomeListingTabEventDetail>).detail;
      setActiveTab(tab);
    };

    window.addEventListener(homeListingTabEvent, handleTabChange);
    return () => window.removeEventListener(homeListingTabEvent, handleTabChange);
  }, []);

  if (listings.length === 0) return null;

  const handleTabChange = (tab: ListingCarouselTab) => {
    setActiveTab(tab);
    emitHomeListingTabChange(tab, "nav");

    const section = document.getElementById(offersCarouselSectionId);
    if (section) scrollToOffersCarousel(section);
  };

  return (
    <ListingCarouselTabBar
      activeTab={activeTab}
      onTabChange={handleTabChange}
      variant="nav"
      layoutIdPrefix="home-nav-listing"
    />
  );
}
