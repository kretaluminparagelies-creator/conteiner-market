/**
 * @file ListingsMobilePager.tsx
 * @description Mobile listings — one card, prev/next (no vertical flood)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CarouselNavButton } from "@/components/listings/carousel/CarouselNavButton";
import { ContainerSVG } from "@/components/ui/ContainerSVG";
import { useLocale } from "@/lib/i18n/locale-context";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";
import { shouldShowListingPhoto } from "@/lib/utils/listing-image";
import { cn } from "@/lib/utils";

type ListingsMobilePagerProps = {
  listings: CarouselListingItem[];
  onListingClick: (listing: CarouselListingItem) => void;
  surface?: "dark" | "light";
};

function CompactListingCard({
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
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "mx-12 block w-[calc(100%-6rem)] overflow-hidden rounded-xl border text-left shadow-cm-light-sm",
        isLight ? "border-cm-light-border-strong bg-white" : "border-cm-border bg-cm-card",
      )}
    >
      <div
        className={cn(
          "relative h-60 overflow-hidden",
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
            sizes="(max-width: 768px) 85vw"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ContainerSVG tinted={isRent} className="h-24 w-auto opacity-90" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0e1828]/80 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {item.isOffer ? (
            <span className="rounded-full bg-cm-accent px-2 py-0.5 font-mono text-[8px] tracking-wide text-white uppercase">
              {t.listings.offerBadge}
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[8px] tracking-wide uppercase",
              isRent ? "tag-rent" : "tag-sale",
            )}
          >
            {isRent ? t.listings.rent : t.listings.sale}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 px-3.5 pb-3.5">
          <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-white drop-shadow-sm">
            {item.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/90">{item.condition}</p>
        </div>
      </div>

      <div className="flex min-h-[4.25rem] flex-col justify-center gap-2 px-3.5 py-4">
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "font-display text-2xl font-bold",
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
            "inline-flex items-center gap-1 text-[11px]",
            isLight ? "text-cm-ink-muted" : "text-cm-muted",
          )}
        >
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          <span className="line-clamp-1">{item.location}</span>
        </span>
      </div>
    </button>
  );
}

export function ListingsMobilePager({
  listings,
  onListingClick,
  surface = "dark",
}: ListingsMobilePagerProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
  }, [listings]);

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + listings.length) % listings.length);
  }, [listings.length]);

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % listings.length);
  }, [listings.length]);

  if (listings.length === 0) return null;

  const item = listings[index]!;

  return (
    <div
      className="relative md:hidden"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null || listings.length < 2) return;
        const endX = event.changedTouches[0]?.clientX;
        if (endX === undefined) return;
        const delta = endX - touchStartX.current;
        if (delta > 48) goPrev();
        else if (delta < -48) goNext();
        touchStartX.current = null;
      }}
    >
      {listings.length > 1 ? (
        <>
          <CarouselNavButton
            onClick={goPrev}
            ariaLabel="Previous listing"
            surface={surface}
            className="absolute top-1/2 left-0 z-10 h-9 w-9 -translate-y-1/2"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
          </CarouselNavButton>
          <CarouselNavButton
            onClick={goNext}
            ariaLabel="Next listing"
            surface={surface}
            className="absolute top-1/2 right-0 z-10 h-9 w-9 -translate-y-1/2"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
          </CarouselNavButton>
        </>
      ) : null}

      <CompactListingCard item={item} surface={surface} onClick={() => onListingClick(item)} />

      {listings.length > 1 ? (
        <p className="mt-2 text-center font-mono text-[10px] tracking-wide text-cm-ink-muted uppercase">
          {index + 1} / {listings.length}
        </p>
      ) : null}
    </div>
  );
}
