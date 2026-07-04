/**
 * @file ListingDetailPeerCard.tsx
 * @description Compact peer listing — photo + price for modal flanks
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useState } from "react";
import { ContainerSVG } from "@/components/ui/ContainerSVG";
import { useLocale } from "@/lib/i18n/locale-context";
import { resolveIsOffer } from "@/lib/utils/listing-carousel-filters";
import { shouldShowListingPhoto } from "@/lib/utils/listing-image";
import type { Listing } from "@/lib/types/listing";

type ListingDetailPeerCardProps = {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  surface?: "dark" | "light";
};

export function ListingDetailPeerCard({ listing, onSelect, surface = "dark" }: ListingDetailPeerCardProps) {
  const { t } = useLocale();
  const [imageFailed, setImageFailed] = useState(false);
  const isRent = listing.listingType === "rent";
  const isOffer = resolveIsOffer(listing);
  const isLight = surface === "light";
  const showPhoto = shouldShowListingPhoto(listing.image, imageFailed);

  return (
    <button
      type="button"
      onClick={() => onSelect(listing)}
      aria-label={t.listings.peerSelect.replace("{type}", listing.type)}
      className={[
        "group w-[160px] shrink-0 overflow-hidden rounded-xl border text-left",
        "transition-[border-color,box-shadow,transform] duration-300",
        "hover:-translate-y-0.5",
        isLight
          ? "bg-white shadow-cm-light-md hover:shadow-cm-light-lg"
          : "bg-cm-card shadow-[0_10px_28px_rgba(0,0,0,0.22)] hover:shadow-[0_16px_36px_rgba(224,112,48,0.2)]",
        isRent
          ? isLight
            ? "border-cm-rent/45 hover:border-cm-rent/65 hover:ring-1 hover:ring-cm-rent/25"
            : "border-cm-rent/40 hover:border-cm-rent/65 hover:ring-1 hover:ring-cm-rent/30"
          : isLight
            ? "border-cm-light-border-strong hover:border-cm-accent/55 hover:ring-1 hover:ring-cm-accent/25"
            : "border-cm-border/70 hover:border-cm-accent/55 hover:ring-1 hover:ring-cm-accent/30",
      ].join(" ")}
    >
      <div
        className={[
          "relative h-[112px] overflow-hidden md:h-[124px]",
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
        {!isLight ? (
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0",
              isRent
                ? "bg-[radial-gradient(circle_at_50%_38%,#ffffff35_0%,transparent_58%)]"
                : "bg-[radial-gradient(circle_at_50%_38%,#ffffff28_0%,transparent_58%)]",
            ].join(" ")}
          />
        ) : null}

        {showPhoto ? (
          <>
            <img
              src={listing.image}
              alt=""
              className={[
                "absolute inset-0 h-full w-full object-cover transition-all duration-300",
                isLight
                  ? "opacity-90 saturate-[1.05] group-hover:opacity-100"
                  : "opacity-75 saturate-[0.85] contrast-[1.05] group-hover:opacity-95 group-hover:saturate-100",
              ].join(" ")}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
            <div
              aria-hidden="true"
              className={
                isLight
                  ? "pointer-events-none absolute inset-0 bg-linear-to-t from-[#0e1828]/55 via-transparent to-transparent"
                  : "pointer-events-none absolute inset-0 bg-linear-to-t from-[#1a3050]/75 via-[#1a3050]/20 to-transparent"
              }
            />
          </>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center">
          <ContainerSVG
            tinted={isRent}
            className={[
              "relative z-10 h-14 w-auto transition-transform duration-300 group-hover:scale-105",
              isLight
                ? "drop-shadow-[0_4px_12px_rgba(14,24,40,0.15)] opacity-90"
                : "drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]",
              showPhoto ? (isLight ? "opacity-35 mix-blend-multiply" : "opacity-45 mix-blend-soft-light") : "opacity-90",
            ].join(" ")}
          />
        </div>

        {!isLight ? (
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0 rounded-t-xl opacity-60",
              isRent
                ? "shadow-[inset_0_0_24px_rgba(74,176,232,0.25)]"
                : "shadow-[inset_0_0_24px_rgba(224,112,48,0.2)]",
            ].join(" ")}
          />
        ) : null}

        {isOffer ? (
          <span className="absolute top-2 left-2 z-20 rounded-full bg-cm-accent px-2 py-0.5 font-mono text-[7px] tracking-wide text-white uppercase shadow-sm">
            {t.listings.offerBadge}
          </span>
        ) : null}
      </div>

      <div
        className={[
          "space-y-1 border-t px-2.5 py-2.5",
          isLight ? "border-cm-light-border bg-white" : "border-cm-border/50 bg-cm-carousel-panel/40",
        ].join(" ")}
      >
        <p
          className={[
            "truncate font-display text-xs font-semibold leading-tight",
            isLight ? "text-cm-ink" : "text-cm-text",
          ].join(" ")}
        >
          {listing.type}
        </p>
        <p
          className={[
            "font-display text-base font-bold leading-none",
            isRent ? "text-cm-rent" : "text-cm-accent",
          ].join(" ")}
        >
          {listing.priceFormatted}
          {listing.unit ? (
            <span
              className={[
                "ml-0.5 text-[10px] font-normal",
                isLight ? "text-cm-ink-muted" : "text-cm-muted",
              ].join(" ")}
            >
              {listing.unit}
            </span>
          ) : null}
        </p>
      </div>
    </button>
  );
}
