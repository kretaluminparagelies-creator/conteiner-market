/**
 * @file category-themes.ts
 * @description Visual theme tokens per service category (buy / sell / rent)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export type CategoryVariant = "buy" | "sell" | "rent";

const hrefVariantMap: Record<string, CategoryVariant> = {
  "/agora": "buy",
  "/polisi": "sell",
  "/enoikiasi": "rent",
};

export function getCategoryVariant(href: string): CategoryVariant {
  return hrefVariantMap[href] ?? "buy";
}

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
};

export const categoryThemes: Record<CategoryVariant, CategoryTheme> = {
  buy: {
    border: "border-cm-accent/30",
    hoverBorder: "hover:border-cm-accent/70",
    bar: "bg-cm-accent",
    topBar: "from-cm-accent via-[#e07030cc] to-transparent",
    cardGradient: "bg-linear-to-br from-[#1a2438] via-cm-card to-[#2a1810]",
    glow: "bg-[radial-gradient(circle_at_80%_0%,#e0703045_0%,transparent_55%)]",
    iconWrap: "border-cm-accent/50 bg-cm-accent/15 text-cm-accent shadow-[0_0_24px_#e0703033]",
    iconRing: "ring-cm-accent/25",
    arrow: "text-cm-accent",
    tag: "text-cm-accent",
    title: "text-cm-text group-hover/card:text-cm-accent",
    watermark: "text-cm-accent/20",
    bgIcon: "text-cm-accent/15",
    shadow: "hover:shadow-[0_24px_60px_rgba(224,112,48,0.18)]",
    containerTinted: false,
  },
  sell: {
    border: "border-cm-sub/25",
    hoverBorder: "hover:border-cm-sub/55",
    bar: "bg-cm-sub",
    topBar: "from-cm-sub via-[#7a9ab899] to-transparent",
    cardGradient: "bg-linear-to-br from-[#141e30] via-cm-card to-[#1a2838]",
    glow: "bg-[radial-gradient(circle_at_80%_0%,#7a9ab830_0%,transparent_55%)]",
    iconWrap: "border-cm-sub/40 bg-cm-steel/40 text-cm-sub shadow-[0_0_20px_#7a9ab822]",
    iconRing: "ring-cm-sub/20",
    arrow: "text-cm-sub",
    tag: "text-cm-sub",
    title: "text-cm-text group-hover/card:text-cm-sub",
    watermark: "text-cm-sub/15",
    bgIcon: "text-cm-sub/12",
    shadow: "hover:shadow-[0_24px_60px_rgba(122,154,184,0.12)]",
    containerTinted: false,
  },
  rent: {
    border: "border-cm-rent/30",
    hoverBorder: "hover:border-cm-rent/70",
    bar: "bg-cm-rent",
    topBar: "from-cm-rent via-[#4ab0e8cc] to-transparent",
    cardGradient: "bg-linear-to-br from-[#101e30] via-cm-card to-[#0f2538]",
    glow: "bg-[radial-gradient(circle_at_80%_0%,#4ab0e845_0%,transparent_55%)]",
    iconWrap: "border-cm-rent/50 bg-cm-rent/15 text-cm-rent shadow-[0_0_24px_#4ab0e833]",
    iconRing: "ring-cm-rent/25",
    arrow: "text-cm-rent",
    tag: "text-cm-rent",
    title: "text-cm-text group-hover/card:text-cm-rent",
    watermark: "text-cm-rent/20",
    bgIcon: "text-cm-rent/15",
    shadow: "hover:shadow-[0_24px_60px_rgba(74,176,232,0.18)]",
    containerTinted: true,
  },
};
