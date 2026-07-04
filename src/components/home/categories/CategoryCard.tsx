/**
 * @file CategoryCard.tsx
 * @description Single category card — composes visual (A), icon (B), motion (C)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CategoryCardIcon } from "@/components/home/categories/CategoryCardIcon";
import { CategoryCardVisual } from "@/components/home/categories/CategoryCardVisual";
import {
  categoryHrefCarouselTab,
  categoryThemes,
  getCategoryVariant,
} from "@/lib/constants/category-themes";
import { buildHomeCarouselUrl, navigateToCategoryCarousel } from "@/lib/nav/navigate-offers-route";

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

function CategoryCardContent({ category, index }: CategoryCardProps) {
  const variant = getCategoryVariant(category.href);
  const theme = categoryThemes[variant];
  const pinFooter = Boolean(category.title);

  return (
    <CategoryCardVisual
      variant={variant}
      index={index}
      icon={<CategoryCardIcon variant={variant} />}
    >
      <div className="space-y-3">
        <p className={["font-mono text-[10px] tracking-[0.22em] uppercase", theme.tag].join(" ")}>
          {category.tag}
        </p>
        {category.title ? (
          <h3
            className={[
              "font-display text-[clamp(1.625rem,3.2vw,2rem)] font-bold transition-colors duration-300",
              theme.title,
            ].join(" ")}
          >
            {category.title}
          </h3>
        ) : null}
        <p
          className={[
            "text-sm leading-[1.75]",
            category.title ? "line-clamp-4" : "",
            theme.description,
          ].join(" ")}
        >
          {category.description}
        </p>
      </div>
      <div
        className={[
          "flex shrink-0 items-end justify-between gap-4 border-t border-cm-light-border-strong/70 pt-4",
          pinFooter ? "mt-auto" : "mt-3",
        ].join(" ")}
      >
        <p className={["font-mono text-[11px] tracking-wide", theme.note].join(" ")}>
          {category.note}
        </p>
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
  );
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const carouselTab = categoryHrefCarouselTab[category.href];

  if (carouselTab) {
    return (
      <a
        href={buildHomeCarouselUrl(carouselTab)}
        className="block h-full cursor-pointer"
        onClick={(event) => {
          event.preventDefault();
          navigateToCategoryCarousel(carouselTab, pathname, router.push);
        }}
      >
        <CategoryCardContent category={category} index={index} />
      </a>
    );
  }

  return (
    <Link href={category.href} className="block h-full cursor-pointer">
      <CategoryCardContent category={category} index={index} />
    </Link>
  );
}
