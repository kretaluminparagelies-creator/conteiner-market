/**
 * @file CategoryCardIcon.tsx
 * @description Layer B — Lucide icon per category
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { CalendarClock, ShoppingCart, Tag, type LucideIcon } from "lucide-react";
import {
  categoryThemes,
  type CategoryVariant,
} from "@/lib/constants/category-themes";

type CategoryCardIconProps = {
  variant: CategoryVariant;
  size?: "sm" | "lg";
};

export const categoryIconMap: Record<CategoryVariant, LucideIcon> = {
  buy: ShoppingCart,
  sell: Tag,
  rent: CalendarClock,
};

export function getCategoryIcon(variant: CategoryVariant): LucideIcon {
  return categoryIconMap[variant];
}

export function CategoryCardIcon({ variant, size = "sm" }: CategoryCardIconProps) {
  const Icon = categoryIconMap[variant];
  const theme = categoryThemes[variant];
  const isLarge = size === "lg";

  return (
    <div
      aria-hidden="true"
      className={[
        "flex shrink-0 items-center justify-center rounded-full border ring-4 transition-transform duration-300",
        "group-hover/card:scale-110",
        isLarge ? "h-14 w-14" : "h-12 w-12",
        theme.iconWrap,
        theme.iconRing,
      ].join(" ")}
    >
      <Icon
        className={isLarge ? "h-6 w-6" : "h-5 w-5"}
        strokeWidth={1.75}
      />
    </div>
  );
}
