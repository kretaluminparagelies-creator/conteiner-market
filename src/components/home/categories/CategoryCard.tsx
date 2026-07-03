/**
 * @file CategoryCard.tsx
 * @description Single category card — composes visual (A), icon (B), motion (C)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoryCardIcon } from "@/components/home/categories/CategoryCardIcon";
import { CategoryCardVisual } from "@/components/home/categories/CategoryCardVisual";
import {
  categoryThemes,
  getCategoryVariant,
} from "@/lib/constants/category-themes";

type CategoryItem = {
  tag: string;
  title: string;
  description: string;
  note: string;
  href: string;
};

type CategoryCardProps = {
  category: CategoryItem;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  const variant = getCategoryVariant(category.href);
  const theme = categoryThemes[variant];

  return (
    <Link href={category.href} className="block h-full">
      <CategoryCardVisual
        variant={variant}
        index={index}
        icon={<CategoryCardIcon variant={variant} />}
      >
        <p
          className={[
            "mb-3 font-mono text-[10px] tracking-[0.22em] uppercase",
            theme.tag,
          ].join(" ")}
        >
          {category.tag}
        </p>
        <h3
          className={[
            "mb-4 font-display text-[clamp(1.625rem,3.2vw,2rem)] font-bold transition-colors duration-300",
            theme.title,
          ].join(" ")}
        >
          {category.title}
        </h3>
        <p className="mb-10 flex-1 text-sm leading-[1.85] text-cm-sub">{category.description}</p>
        <div className="flex items-end justify-between gap-4 border-t border-cm-border/60 pt-5">
          <p className="font-mono text-[11px] tracking-wide text-cm-muted">{category.note}</p>
          <span
            aria-hidden="true"
            className={[
              "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300",
              "group-hover/card:scale-110 group-hover/card:border-current",
              theme.iconWrap,
              theme.arrow,
            ].join(" ")}
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>
      </CategoryCardVisual>
    </Link>
  );
}
