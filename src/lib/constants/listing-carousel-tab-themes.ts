/**
 * @file listing-carousel-tab-themes.ts
 * @description Per-tab accent colors for carousel filters
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { LucideIcon } from "lucide-react";
import { Flame, Key, Recycle, Sparkles } from "lucide-react";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";

export type ListingCarouselTabTheme = {
  accent: string;
  glow: string;
  icon: LucideIcon;
};

export const listingCarouselTabThemes: Record<ListingCarouselTab, ListingCarouselTabTheme> = {
  offers: {
    accent: "#e07030",
    glow: "rgba(224, 112, 48, 0.35)",
    icon: Flame,
  },
  new: {
    accent: "#34d399",
    glow: "rgba(52, 211, 153, 0.35)",
    icon: Sparkles,
  },
  used: {
    accent: "#b8956a",
    glow: "rgba(184, 149, 106, 0.42)",
    icon: Recycle,
  },
  rent: {
    accent: "#36bffa",
    glow: "rgba(54, 191, 250, 0.42)",
    icon: Key,
  },
};
