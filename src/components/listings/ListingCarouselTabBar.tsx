/**
 * @file ListingCarouselTabBar.tsx
 * @description Shared segmented tab bar for listing carousel filters
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";
import { listingCarouselTabThemes } from "@/lib/constants/listing-carousel-tab-themes";
import { useLocale } from "@/lib/i18n/locale-context";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";
import { listingCarouselTabs } from "@/lib/utils/listing-carousel-filters";

type ListingCarouselTabBarProps = {
  activeTab: ListingCarouselTab;
  onTabChange: (tab: ListingCarouselTab) => void;
  counts?: Partial<Record<ListingCarouselTab, number>>;
  variant?: "default" | "compact" | "nav";
  surface?: "dark" | "light";
  layoutIdPrefix?: string;
  className?: string;
};

export function ListingCarouselTabBar({
  activeTab,
  onTabChange,
  counts,
  variant = "default",
  surface = "dark",
  layoutIdPrefix = "listing-carousel",
  className,
}: ListingCarouselTabBarProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const isNav = variant === "nav";
  const isCompact = variant === "compact" || isNav;
  const isLight = surface === "light" && !isNav;

  const labels: Record<ListingCarouselTab, string> = {
    offers: t.listings.tabs.offers,
    new: t.listings.tabs.new,
    used: t.listings.tabs.used,
    rent: t.listings.tabs.rent,
  };

  const activeTheme = listingCarouselTabThemes[activeTab];

  return (
    <div
      className={[
        isNav
          ? "mx-auto w-max max-w-[calc(100vw-10.5rem)] rounded-lg border border-cm-border/80 bg-cm-card/40 p-1 sm:max-w-[calc(100vw-12rem)]"
          : "",
        isCompact && !isNav ? "mx-auto w-full max-w-3xl" : !isNav ? "mx-auto max-w-3xl" : "",
        !isNav
          ? isLight
            ? "rounded-xl border border-cm-light-border bg-cm-light-surf p-0.5 shadow-[0_4px_24px_rgba(14,24,40,0.06)] sm:p-1"
            : "rounded-xl border border-cm-border bg-cm-card/55 p-0.5 backdrop-blur-sm sm:p-1"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        boxShadow: isCompact ? undefined : `0 0 40px -12px ${activeTheme.glow}`,
      }}
    >
      <div
        role="tablist"
        aria-label={t.listings.tabs.ariaLabel}
        className={[
          "relative flex",
          isNav
            ? "w-max justify-center gap-1 sm:gap-1.5"
            : "snap-x snap-mandatory gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {listingCarouselTabs.map((tab) => {
          const isActive = tab === activeTab;
          const count = counts?.[tab];
          const theme = listingCarouselTabThemes[tab];
          const Icon = theme.icon;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab)}
              style={{ "--tab-accent": theme.accent } as CSSProperties}
              className={[
                "group relative z-10 flex shrink-0 items-center justify-center text-center",
                isNav
                  ? "px-2 py-1.5 whitespace-nowrap sm:px-2.5 lg:px-3"
                  : "min-w-0 flex-1 snap-center justify-center overflow-hidden whitespace-nowrap",
                !isNav && isCompact
                  ? "gap-1 px-1.5 py-1.5 sm:gap-1.5 sm:px-2 sm:py-2"
                  : !isNav
                    ? "gap-1.5 px-2 py-2 sm:gap-2 sm:px-3 sm:py-2.5"
                    : "",
                isNav
                  ? "font-display text-[10px] leading-snug font-semibold sm:text-[11px] lg:text-[12px]"
                  : isCompact
                    ? "font-display text-[10px] font-semibold sm:text-[11px]"
                    : "font-display text-[11px] font-semibold sm:text-[13px]",
                "transition-colors duration-200",
                isLight ? "text-cm-ink-sub" : "text-cm-sub",
              ].join(" ")}
            >
              {isActive ? (
                <motion.span
                  layoutId={`${layoutIdPrefix}-tab-indicator`}
                  className={[
                    "absolute inset-0 border",
                    isNav ? "rounded-[6px]" : "rounded-[6px] sm:rounded-[8px]",
                  ].join(" ")}
                  style={{
                    backgroundColor: `${theme.accent}18`,
                    borderColor: `${theme.accent}55`,
                    boxShadow: isCompact && !isNav ? undefined : `0 0 20px -4px ${theme.glow}`,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0.01 }
                      : { type: "spring", stiffness: 420, damping: 34 }
                  }
                />
              ) : (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute inset-0 border opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                    isNav ? "rounded-[6px]" : "rounded-[6px] sm:rounded-[8px]",
                  ].join(" ")}
                  style={{
                    backgroundColor: `${theme.accent}14`,
                    borderColor: `${theme.accent}45`,
                  }}
                />
              )}

              {!isNav ? (
                <Icon
                  className={[
                    "relative shrink-0 transition-colors duration-200",
                    isActive
                      ? ""
                      : isLight
                        ? "text-cm-ink-muted group-hover:text-[var(--tab-accent)]"
                        : "text-cm-sub group-hover:text-[var(--tab-accent)]",
                    isCompact
                      ? "h-3 w-3 sm:h-3.5 sm:w-3.5"
                      : "h-3.5 w-3.5 sm:h-4 sm:w-4",
                  ].join(" ")}
                  style={{ color: isActive ? theme.accent : undefined }}
                  aria-hidden="true"
                />
              ) : null}

              <span
                className={[
                  "relative transition-colors duration-200",
                  isNav ? "whitespace-nowrap" : "block w-full",
                    isActive
                      ? "text-[var(--tab-accent)]"
                      : isLight
                        ? "text-cm-ink-muted group-hover:text-[var(--tab-accent)]"
                        : "text-cm-sub group-hover:text-[var(--tab-accent)]",
                ].join(" ")}
              >
                {labels[tab]}
              </span>

              {!isNav && count !== undefined ? (
                <span
                  className={[
                    "relative inline-flex shrink-0 items-center justify-center rounded-full font-mono font-medium",
                    isCompact
                      ? "hidden h-4 min-w-4 px-1 text-[8px] sm:inline-flex sm:h-4 sm:min-w-4 sm:text-[9px]"
                      : "h-5 min-w-5 px-1.5 text-[9px] sm:text-[10px]",
                    isActive ? "text-white" : isLight ? "bg-cm-light-elevated text-cm-ink-muted" : "bg-cm-steel/60 text-cm-sub",
                  ].join(" ")}
                  style={isActive ? { backgroundColor: theme.accent } : undefined}
                >
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
