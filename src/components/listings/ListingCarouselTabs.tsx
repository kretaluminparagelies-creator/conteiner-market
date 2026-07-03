/**
 * @file ListingCarouselTabs.tsx
 * @description Filter tabs above 3D listings carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useLocale } from "@/lib/i18n/locale-context";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";
import { listingCarouselTabs } from "@/lib/utils/listing-carousel-filters";

type ListingCarouselTabsProps = {
  activeTab: ListingCarouselTab;
  onTabChange: (tab: ListingCarouselTab) => void;
  counts?: Partial<Record<ListingCarouselTab, number>>;
};

export function ListingCarouselTabs({ activeTab, onTabChange, counts }: ListingCarouselTabsProps) {
  const { t } = useLocale();

  const labels: Record<ListingCarouselTab, string> = {
    offers: t.listings.tabs.offers,
    new: t.listings.tabs.new,
    used: t.listings.tabs.used,
    rent: t.listings.tabs.rent,
  };

  return (
    <div
      className="mb-6 flex flex-wrap gap-2"
      role="tablist"
      aria-label={t.listings.tabs.ariaLabel}
    >
      {listingCarouselTabs.map((tab) => {
        const isActive = tab === activeTab;
        const count = counts?.[tab];

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab)}
            className={[
              "rounded-full border px-4 py-2 font-display text-[13px] font-semibold transition-colors",
              isActive
                ? tab === "rent"
                  ? "border-cm-rent/60 bg-cm-rent/15 text-cm-rent"
                  : "border-cm-accent/60 bg-cm-accent/15 text-cm-accent"
                : "border-cm-border bg-cm-card/40 text-cm-sub hover:border-cm-accent/40 hover:text-cm-text",
            ].join(" ")}
          >
            {labels[tab]}
            {count !== undefined ? (
              <span className="ml-1.5 font-mono text-[10px] font-normal opacity-70">({count})</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
