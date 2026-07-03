/**
 * @file ContainerCarouselCard.tsx
 * @description Single card in 3D listings carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { MapPin, Package } from "lucide-react";
import { useState } from "react";
import { ContainerSVG } from "@/components/ui/ContainerSVG";
import { useLocale } from "@/lib/i18n/locale-context";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";

type ContainerCarouselCardProps = CarouselListingItem & {
  isCenter?: boolean;
};

function isPlaceholderImage(src: string): boolean {
  return src.includes("placeholder");
}

export function ContainerCarouselCard({
  title,
  location,
  price,
  unit,
  condition,
  listingType,
  image,
  isCenter = false,
}: ContainerCarouselCardProps) {
  const { t } = useLocale();
  const isRent = listingType === "rent";
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = Boolean(image) && !isPlaceholderImage(image) && !imageFailed;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border bg-cm-carousel-card",
        "shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition-[border-color,box-shadow] duration-300",
        isCenter
          ? isRent
            ? "border-cm-rent/60 shadow-[0_24px_56px_rgba(74,176,232,0.28)] ring-1 ring-cm-rent/35"
            : "border-cm-accent/60 shadow-[0_24px_56px_rgba(224,112,48,0.28)] ring-1 ring-cm-accent/35"
          : "border-cm-border/60",
      ].join(" ")}
    >
      <div className="relative h-[280px] overflow-hidden bg-cm-carousel-photo md:h-[340px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-br from-cm-carousel-photo via-cm-carousel-visual to-[#587898]"
        />

        {showPhoto ? (
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className={[
                "pointer-events-none absolute inset-0",
                isRent
                  ? "bg-[radial-gradient(circle_at_50%_40%,#ffffff28_0%,transparent_58%)]"
                  : "bg-[radial-gradient(circle_at_50%_40%,#ffffff22_0%,transparent_58%)]",
              ].join(" ")}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <ContainerSVG tinted={isRent} className="relative z-10 h-20 w-auto md:h-24" />
            </div>
          </>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#1a3050]/88 via-[#1a3050]/35 to-transparent"
        />

        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          <span
            className={[
              "rounded-full px-3 py-1 font-mono text-[9px] tracking-[0.14em] uppercase shadow-sm",
              isRent ? "tag-rent" : "tag-sale",
            ].join(" ")}
          >
            {isRent ? t.listings.rent : t.listings.sale}
          </span>
          <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 font-mono text-[9px] tracking-[0.12em] text-white/95 uppercase backdrop-blur-sm">
            {condition}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-4 pt-10">
          <h3 className="line-clamp-2 font-display text-lg font-bold text-white drop-shadow-md md:text-xl">
            {title}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-white/90">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-cm-accent" aria-hidden="true" />
            <span className="text-sm drop-shadow-sm">{location}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-cm-border/50 bg-cm-carousel-panel p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-1">
            <span
              className={[
                "font-display text-2xl font-bold md:text-3xl",
                isRent ? "text-cm-rent" : "text-cm-accent",
              ].join(" ")}
            >
              {price}
            </span>
            {unit ? <span className="text-sm text-cm-sub">{unit}</span> : null}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-cm-sub uppercase">
            <Package className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{title.split(" ")[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
