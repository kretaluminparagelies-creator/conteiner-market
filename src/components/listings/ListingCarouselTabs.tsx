/**
 * @file ListingCarouselTabs.tsx
 * @description Filter tabs above 3D listings carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ListingCarouselTabBar } from "@/components/listings/ListingCarouselTabBar";
import { useLocale } from "@/lib/i18n/locale-context";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";

type ListingCarouselTabsProps = {
  activeTab: ListingCarouselTab;
  onTabChange: (tab: ListingCarouselTab) => void;
  counts?: Partial<Record<ListingCarouselTab, number>>;
  showSectionHeader?: boolean;
  tone?: "dark" | "light";
};

export function ListingCarouselTabs({
  activeTab,
  onTabChange,
  counts,
  showSectionHeader = false,
  tone = "dark",
}: ListingCarouselTabsProps) {
  const { t } = useLocale();
  const isLight = tone === "light";

  return (
    <div className={showSectionHeader ? "mb-0" : "mb-3 md:mb-4"}>
      {showSectionHeader ? (
        <div className="mb-1.5 text-center md:mb-2">
          <h2
            className={[
              "font-display text-[clamp(1.25rem,2.2vw,1.625rem)] font-bold tracking-tight",
              isLight ? "text-cm-ink" : "text-cm-text",
            ].join(" ")}
          >
            {t.listings.sectionSubtitle}
          </h2>
        </div>
      ) : null}

      <ListingCarouselTabBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        counts={counts}
        layoutIdPrefix="listing-section"
        surface={isLight ? "light" : "dark"}
      />
    </div>
  );
}
