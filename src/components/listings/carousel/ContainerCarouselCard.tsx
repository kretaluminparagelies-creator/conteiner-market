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
import { shouldShowListingPhoto } from "@/lib/utils/listing-image";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";

type ContainerCarouselCardProps = CarouselListingItem & {
  isCenter?: boolean;
  surface?: "dark" | "light";
};

export function ContainerCarouselCard({
  title,
  location,
  price,
  unit,
  condition,
  listingType,
  isOffer = false,
  image,
  isCenter = false,
  surface = "dark",
}: ContainerCarouselCardProps) {
  const { t } = useLocale();
  const isRent = listingType === "rent";
  const isLight = surface === "light";
  const [imageFailed, setImageFailed] = useState(false);
  const showPhoto = shouldShowListingPhoto(image, imageFailed);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl border transition-[border-color,box-shadow,filter] duration-300",
        isLight
          ? isCenter
            ? "bg-white shadow-cm-light-lg"
            : "bg-white shadow-cm-light-lg"
          : isCenter
            ? "bg-cm-carousel-card shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
            : "bg-cm-carousel-card shadow-[0_16px_40px_rgba(0,0,0,0.28)]",
        isCenter
          ? isRent
            ? isLight
              ? "border-cm-rent/55 shadow-cm-carousel-rent ring-2 ring-cm-rent/25"
              : "border-cm-rent/60 shadow-[0_24px_56px_rgba(74,176,232,0.28)] ring-1 ring-cm-rent/35"
            : isLight
              ? "border-cm-accent/50 shadow-cm-carousel-accent ring-2 ring-cm-accent/22"
              : "border-cm-accent/60 shadow-[0_24px_56px_rgba(224,112,48,0.28)] ring-1 ring-cm-accent/35"
          : isLight
            ? "border-cm-light-border-strong shadow-cm-light-md"
            : "border-cm-border/70",
      ].join(" ")}
    >
      <div
        className={[
          "relative h-[340px] overflow-hidden md:h-[420px]",
          isLight ? "bg-cm-light-elevated" : "bg-cm-carousel-photo",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={
            isLight
              ? "absolute inset-0 bg-linear-to-br from-[#dce8f4] via-[#c5d8ea] to-[#a8c4dc]"
              : "absolute inset-0 bg-linear-to-br from-cm-carousel-photo via-cm-carousel-visual to-[#587898]"
          }
        />

        {showPhoto ? (
          <img
            src={image}
            alt={title}
            className={[
              "absolute inset-0 h-full w-full object-cover",
              !isCenter ? "brightness-[0.82] saturate-[0.88]" : "",
            ].join(" ")}
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
              <ContainerSVG tinted={isRent} className="relative z-10 h-24 w-auto md:h-28" />
            </div>
          </>
        )}

        <div
          aria-hidden="true"
          className={
            isLight
              ? isCenter
                ? "pointer-events-none absolute inset-0 bg-linear-to-t from-[#0e1828]/75 via-[#0e1828]/25 to-transparent"
                : "pointer-events-none absolute inset-0 bg-linear-to-t from-[#0e1828]/88 via-[#0e1828]/45 to-[#0e1828]/15"
              : isCenter
                ? "pointer-events-none absolute inset-0 bg-linear-to-t from-[#1a3050]/88 via-[#1a3050]/35 to-transparent"
                : "pointer-events-none absolute inset-0 bg-linear-to-t from-[#0a1420]/92 via-[#0a1420]/55 to-[#0a1420]/20"
          }
        />

        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          {isOffer ? (
            <span className="rounded-full bg-cm-accent px-3 py-1 font-mono text-[9px] tracking-[0.14em] text-white uppercase shadow-sm">
              {t.listings.offerBadge}
            </span>
          ) : null}
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

      <div
        className={[
          "border-t p-5",
          isLight
            ? isCenter
              ? "border-cm-light-border-strong bg-cm-light-surf"
              : "border-cm-light-border-strong bg-white"
            : isCenter
              ? "border-cm-border/50 bg-cm-carousel-panel"
              : "border-cm-border/60 bg-[#1a2838]",
        ].join(" ")}
      >
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
            {unit ? (
              <span className={isLight ? "text-sm text-cm-ink-muted" : "text-sm text-cm-sub"}>
                {unit}
              </span>
            ) : null}
          </div>
          <div
            className={[
              "flex items-center gap-1.5 font-mono text-[10px] tracking-wide uppercase",
              isLight ? "text-cm-ink-muted" : "text-cm-sub",
            ].join(" ")}
          >
            <Package className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{title.split(" ")[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
