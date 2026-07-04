/**
 * @file CategoryCardVisual.tsx
 * @description Layer A — container art, watermark, accent bar, glow
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ReactNode } from "react";
import Image from "next/image";
import { CalendarClock, ShoppingCart, Tag } from "lucide-react";
import { ContainerSVG } from "@/components/ui/ContainerSVG";
import {
  categoryCardImages,
  categoryThemes,
  type CategoryVariant,
} from "@/lib/constants/category-themes";

type CategoryCardVisualProps = {
  variant: CategoryVariant;
  index: number;
  icon: ReactNode;
  children: ReactNode;
};

function CategoryBackgroundIcon({
  variant,
  className,
}: {
  variant: CategoryVariant;
  className: string;
}) {
  switch (variant) {
    case "buy":
      return <ShoppingCart aria-hidden="true" className={className} strokeWidth={1} />;
    case "sell":
      return <Tag aria-hidden="true" className={className} strokeWidth={1} />;
    case "rent":
      return <CalendarClock aria-hidden="true" className={className} strokeWidth={1} />;
  }
}

export function CategoryCardVisual({ variant, index, icon, children }: CategoryCardVisualProps) {
  const theme = categoryThemes[variant];
  const cardImage = categoryCardImages[variant];
  const watermark = String(index + 1).padStart(2, "0");

  return (
    <div
      className={[
        "group/card category-card-shine relative flex h-[465px] flex-col overflow-hidden rounded-2xl md:h-[480px]",
        "p-8 transition-[border-color,box-shadow,transform] duration-350 md:p-10",
        theme.border,
        theme.hoverBorder,
        theme.shadow,
        theme.cardGradient,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={["absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-90", theme.topBar].join(
          " ",
        )}
      />

      <div
        aria-hidden="true"
        className={["absolute inset-y-0 left-0 w-1.5", theme.bar].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300",
          theme.glow,
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className="category-card-read-layer pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[72%] rounded-b-2xl"
      />

      <CategoryBackgroundIcon
        variant={variant}
        className={[
          "pointer-events-none absolute -right-6 -bottom-10 h-40 w-40 transition-transform duration-500",
          "group-hover/card:scale-110 group-hover/card:-translate-y-1",
          theme.bgIcon,
        ].join(" ")}
      />

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute top-1 right-2 font-display text-[6.5rem] leading-none font-bold",
          theme.watermark,
        ].join(" ")}
      >
        {watermark}
      </span>

      <div className="relative z-10 mb-5 flex shrink-0 items-start justify-between gap-4 pt-1">
        <div className="rounded-xl bg-white/80 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-sm transition-transform duration-300 group-hover/card:scale-105 group-hover/card:-translate-y-0.5">
          {cardImage ? (
            <div className="relative h-[4.5rem] w-[9rem] sm:h-20 sm:w-[10rem]">
              <Image
                src={cardImage}
                alt=""
                fill
                sizes="160px"
                className="object-contain object-left"
              />
            </div>
          ) : (
            <ContainerSVG
              tinted={theme.containerTinted}
              className="h-[4.5rem] w-auto opacity-95 sm:h-20"
            />
          )}
        </div>
        {icon}
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
