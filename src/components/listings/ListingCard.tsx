/**
 * @file ListingCard.tsx
 * @description Card component for a single container listing
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { ContainerSVG } from "@/components/ui/ContainerSVG";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Listing } from "@/lib/types/listing";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const { t } = useLocale();
  const isRent = listing.listingType === "rent";

  return (
    <article className="overflow-hidden border border-cm-border bg-cm-card">
      <div className="relative flex h-[120px] items-center justify-center border-b border-cm-border bg-linear-to-br from-cm-steel/50 to-cm-bg">
        <ContainerSVG tinted={isRent} />
        <span
          className={[
            "absolute top-2.5 right-2.5 rounded-[2px] px-2.5 py-1",
            "font-mono text-[9px] tracking-wide uppercase",
            isRent ? "tag-rent" : "tag-sale",
          ].join(" ")}
        >
          {isRent ? t.listings.rent : t.listings.sale}
        </span>
      </div>

      <div className="p-5 pb-6">
        <h2 className="font-display text-[17px] font-semibold">{listing.type}</h2>
        <p className="mt-1 text-xs text-cm-sub">{listing.condition}</p>
        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span
              className={[
                "font-display text-[21px] font-bold",
                isRent ? "text-cm-rent" : "text-cm-accent",
              ].join(" ")}
            >
              {listing.priceFormatted}
            </span>
            {listing.unit ? (
              <span className="ml-1 text-[11px] text-cm-muted">{listing.unit}</span>
            ) : null}
          </div>
          <span className="font-mono text-[11px] text-cm-muted">📍 {listing.location}</span>
        </div>
      </div>
    </article>
  );
}
