/**
 * @file CategoryCards.tsx
 * @description Service category card grid — Agora / Polisi / Enoikiasi
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { CategoryCard } from "@/components/home/categories/CategoryCard";
import {
  CategoryCardMotion,
  CategoryGridMotion,
} from "@/components/home/categories/CategoryCardMotion";
import { useLocale } from "@/lib/i18n/locale-context";

export function CategoryCards() {
  const { t } = useLocale();

  return (
    <CategoryGridMotion className="grid gap-5 md:grid-cols-3 md:gap-6">
      {t.categories.items.map((category, index) => (
        <CategoryCardMotion key={category.href} className="h-full">
          <CategoryCard category={category} index={index} />
        </CategoryCardMotion>
      ))}
    </CategoryGridMotion>
  );
}
