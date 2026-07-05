/**
 * @file ListingsMobileList.tsx
 * @description Mobile listings — vertical list, no 3D carousel
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ContainerSVG } from "@/components/ui/ContainerSVG";
import { useLocale } from "@/lib/i18n/locale-context";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";
import { shouldShowListingPhoto } from "@/lib/utils/listing-image";
import { cn } from "@/lib/utils";

type ListingsMobileListProps = {
  listings: CarouselListingItem[];
  onListingClick: (listing: CarouselListingItem) => void;
  surface?: "dark" | "light";
};

function MobileListingRow({
  item,
  onClick,
  surface,
}: {
  item: CarouselListingItem;
  onClick: () => void;
  surface: "dark" | "light";
}) {
  const { t } = useLocale();
  const isRent = item.listingType === "rent";
  const isLight = surface === "light";
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = shouldShowListingPhoto(item.image, imageFailed);

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full gap-3 overflow-hidden rounded-xl border p-3 text-left shadow-sm transition-[border-color,box-shadow] active:scale-[0.995]",
          isLight
            ? "border-cm-light-border-strong bg-white shadow-cm-light-xs"
            : "border-cm-border bg-cm-card",
        )}
      >
        <div
          className={cn(
            "relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-lg",
            isLight ? "bg-cm-light-elevated" : "bg-cm-carousel-photo",
          )}
        >
          {showPhoto ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              unoptimized
              className="object-cover"
              sizes="88px"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ContainerSVG tinted={isRent} className="h-12 w-auto opacity-90" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.isOffer ? (
              <span className="rounded-full bg-cm-accent/12 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wide text-cm-accent uppercase">
                {t.listings.offerBadge}
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[9px] tracking-wide uppercase",
                isRent ? "tag-rent" : "tag-sale",
              )}
            >
              {isRent ? t.listings.rent : t.listings.sale}
            </span>
          </div>

          <h3
            className={cn(
              "mt-1.5 line-clamp-2 font-display text-[15px] font-bold leading-snug",
              isLight ? "text-cm-ink" : "text-cm-text",
            )}
          >
            {item.title}
          </h3>
          <p className={cn("mt-0.5 text-xs", isLight ? "text-cm-ink-sub" : "text-cm-sub")}>
            {item.condition}
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
            <div className="flex items-baseline gap-1">
              <span
                className={cn(
                  "font-display text-lg font-bold",
                  isRent ? "text-cm-rent" : "text-cm-accent",
                )}
              >
                {item.price}
              </span>
              {item.unit ? (
                <span className={cn("text-xs", isLight ? "text-cm-ink-muted" : "text-cm-muted")}>
                  {item.unit}
                </span>
              ) : null}
            </div>
            <span
              className={cn(
                "inline-flex max-w-[55%] items-center gap-1 text-[11px]",
                isLight ? "text-cm-ink-muted" : "text-cm-muted",
              )}
            >
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              <span className="truncate">{item.location}</span>
            </span>
          </div>
        </div>
      </button>
    </li>
  );
}

export function ListingsMobileList({
  listings,
  onListingClick,
  surface = "dark",
}: ListingsMobileListProps) {
  return (
    <ul className="flex flex-col gap-2.5 md:hidden">
      {listings.map((item) => (
        <MobileListingRow
          key={item.id}
          item={item}
          surface={surface}
          onClick={() => onListingClick(item)}
        />
      ))}
    </ul>
  );
}
