/**
 * @file ListingDetailContent.tsx
 * @description Listing info body inside detail modal
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { MapPin } from "lucide-react";
import { SiteButton } from "@/components/ui/site-button";
import { ListingDetailPhotoCarousel } from "@/components/listings/detail/ListingDetailPhotoCarousel";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Listing } from "@/lib/types/listing";

type ListingDetailContentProps = {
  listing: Listing;
  surface?: "dark" | "light";
};

export function ListingDetailContent({ listing, surface = "dark" }: ListingDetailContentProps) {
  const { t } = useLocale();
  const isRent = listing.listingType === "rent";
  const isLight = surface === "light";

  return (
    <div
      className={[
        "w-full overflow-hidden rounded-xl border shadow-cm-light-lg",
        isLight ? "glass-category border-white/80 bg-white/94" : "border-cm-border bg-cm-card",
      ].join(" ")}
    >
      <div className="p-4 md:p-5">
        <ListingDetailPhotoCarousel listing={listing} surface={surface} />
      </div>

      <div
        className={[
          "relative space-y-3 border-t p-4 md:p-5",
          isLight ? "border-cm-light-border-strong/70" : "border-cm-border/50",
        ].join(" ")}
      >
        {isLight ? (
          <div
            aria-hidden="true"
            className="category-card-read-layer pointer-events-none absolute inset-0"
          />
        ) : null}

        <div className="relative z-[1] grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap gap-1.5">
              <span
                className={[
                  "rounded-full px-2 py-0.5 font-mono text-[7px] tracking-[0.12em] uppercase",
                  isRent ? "tag-rent" : "tag-sale",
                ].join(" ")}
              >
                {isRent ? t.listings.rent : t.listings.sale}
              </span>
              <span
                className={[
                  "rounded-full border px-2 py-0.5 font-mono text-[7px] tracking-[0.1em] uppercase",
                  isLight
                    ? "border-cm-light-border-strong bg-white text-cm-ink-muted"
                    : "border-cm-border bg-cm-surf text-cm-sub",
                ].join(" ")}
              >
                {listing.condition}
              </span>
            </div>
            <h2
              className={[
                "line-clamp-2 break-words font-display text-lg font-bold leading-tight md:text-xl",
                isLight ? "text-cm-ink" : "text-cm-text",
              ].join(" ")}
            >
              {listing.type}
            </h2>
            <div
              className={[
                "mt-1 flex items-center gap-1.5",
                isLight ? "text-cm-ink-sub" : "text-cm-sub",
              ].join(" ")}
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-cm-accent" aria-hidden="true" />
              <span className="text-sm font-medium">{listing.location}</span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="flex items-baseline justify-end gap-0.5">
              <span
                className={[
                  "font-display text-xl font-bold md:text-2xl",
                  isRent ? "text-cm-rent" : "text-cm-accent",
                ].join(" ")}
              >
                {listing.priceFormatted}
              </span>
              {listing.unit ? (
                <span
                  className={[
                    "text-xs font-medium",
                    isLight ? "text-cm-ink-muted" : "text-cm-muted",
                  ].join(" ")}
                >
                  {listing.unit}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative z-[1]">
          <p className="mb-1.5 font-mono text-[9px] font-semibold tracking-[0.18em] text-cm-accent uppercase">
            {t.listings.detailDescription}
          </p>
          <p
            className={["text-sm leading-[1.7]", isLight ? "text-cm-ink-sub" : "text-cm-sub"].join(
              " ",
            )}
          >
            {listing.description}
          </p>
        </div>

        <div className="relative z-[1] flex flex-wrap gap-2 pt-0.5">
          <SiteButton href="/epikoinonia?intent=inquiry" className="px-4 py-2 text-xs">
            {t.listings.detailContact}
          </SiteButton>
        </div>
      </div>
    </div>
  );
}
