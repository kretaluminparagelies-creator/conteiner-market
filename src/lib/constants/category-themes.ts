/**
 * @file category-themes.ts
 * @description Visual theme tokens per service category (buy / sell / rent)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";

export type CategoryVariant = "buy" | "sell" | "rent";

/** Home category cards that jump to the listings carousel (not service pages) */
export const categoryHrefCarouselTab: Partial<Record<string, ListingCarouselTab>> = {
  "/agora": "offers",
  "/enoikiasi": "rent",
};

const hrefVariantMap: Record<string, CategoryVariant> = {
  "/agora": "buy",
  "/polisi": "sell",
  "/enoikiasi": "rent",
};

export function getCategoryVariant(href: string): CategoryVariant {
  return hrefVariantMap[href] ?? "buy";
}

/** Optional product photos per category card (home) */
export const categoryCardImages: Partial<Record<CategoryVariant, string>> = {
  buy: "/images/categories/agora-container.png",
  sell: "/images/categories/polisi-container.png",
  rent: "/images/categories/enoikiasi-container.png",
};

export type CategoryTheme = {
  border: string;
  hoverBorder: string;
  bar: string;
  topBar: string;
  cardGradient: string;
  glow: string;
  iconWrap: string;
  iconRing: string;
  arrow: string;
  tag: string;
  title: string;
  watermark: string;
  bgIcon: string;
  shadow: string;
  containerTinted: boolean;
  description: string;
  note: string;
};

export const categoryThemes: Record<CategoryVariant, CategoryTheme> = {
  buy: {
    border: "border-white/70",
    hoverBorder: "hover:border-cm-accent/40",
    bar: "bg-cm-accent",
    topBar: "from-cm-accent via-[#e07030bb] to-transparent",
    cardGradient: "glass-category",
    glow: "bg-[radial-gradient(circle_at_85%_0%,#e0703012_0%,transparent_55%)]",
    iconWrap:
      "border-white/70 bg-white/85 text-cm-accent shadow-cm-light-xs",
    iconRing: "ring-cm-accent/15",
    arrow: "text-cm-accent",
    tag: "font-semibold text-cm-accent",
    title: "text-cm-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.95)] group-hover/card:text-cm-accent",
    watermark: "text-cm-accent/6",
    bgIcon: "text-cm-accent/7",
    shadow: "hover:shadow-cm-light-lg",
    containerTinted: false,
    description: "font-medium text-cm-ink/90 drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]",
    note: "font-medium text-cm-ink-sub",
  },
  sell: {
    border: "border-white/70",
    hoverBorder: "hover:border-cm-ink-muted/35",
    bar: "bg-cm-ink-muted",
    topBar: "from-cm-ink-muted via-[#6b829988] to-transparent",
    cardGradient: "glass-category",
    glow: "bg-[radial-gradient(circle_at_85%_0%,#6b829910_0%,transparent_55%)]",
    iconWrap:
      "border-white/70 bg-white/85 text-cm-ink-sub shadow-cm-light-xs",
    iconRing: "ring-cm-ink-muted/12",
    arrow: "text-cm-ink-sub",
    tag: "font-semibold text-cm-ink-sub",
    title: "text-cm-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.95)] group-hover/card:text-cm-ink-sub",
    watermark: "text-cm-ink-muted/8",
    bgIcon: "text-cm-ink-muted/7",
    shadow: "hover:shadow-cm-light-lg",
    containerTinted: false,
    description: "font-medium text-cm-ink/90 drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]",
    note: "font-medium text-cm-ink-sub",
  },
  rent: {
    border: "border-white/70",
    hoverBorder: "hover:border-cm-rent/45",
    bar: "bg-cm-rent",
    topBar: "from-cm-rent via-[#4ab0e8bb] to-transparent",
    cardGradient: "glass-category",
    glow: "bg-[radial-gradient(circle_at_85%_0%,#4ab0e812_0%,transparent_55%)]",
    iconWrap:
      "border-white/70 bg-white/85 text-cm-rent shadow-cm-light-xs",
    iconRing: "ring-cm-rent/15",
    arrow: "text-cm-rent",
    tag: "font-semibold text-cm-rent",
    title: "text-cm-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.95)] group-hover/card:text-cm-rent",
    watermark: "text-cm-rent/6",
    bgIcon: "text-cm-rent/7",
    shadow: "hover:shadow-cm-light-lg",
    containerTinted: true,
    description: "font-medium text-cm-ink/90 drop-shadow-[0_1px_0_rgba(255,255,255,0.85)]",
    note: "font-medium text-cm-ink-sub",
  },
};
