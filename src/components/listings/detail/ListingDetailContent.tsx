/**
 * @file ListingDetailContent.tsx
 * @description Listing info body inside detail modal
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ListingDetailPhotoCarousel } from "@/components/listings/detail/ListingDetailPhotoCarousel";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Listing } from "@/lib/types/listing";

type ListingDetailContentProps = {
  listing: Listing;
  onClose: () => void;
  showViewAll?: boolean;
};

export function ListingDetailContent({
  listing,
  onClose,
  showViewAll = true,
}: ListingDetailContentProps) {
  const { t } = useLocale();
  const router = useRouter();
  const isRent = listing.listingType === "rent";

  const handleViewAll = () => {
    onClose();
    router.push("/listings");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-cm-border bg-cm-card">
      <div className="px-3 pt-4 pb-3 md:px-5 md:pt-6 md:pb-4">
        <ListingDetailPhotoCarousel listing={listing} />
      </div>

      <div className="space-y-3 border-t border-cm-border/50 px-3 py-3 md:px-4 md:py-3.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
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
              <span className="rounded-full border border-cm-border bg-cm-surf px-2 py-0.5 font-mono text-[7px] tracking-[0.1em] text-cm-sub uppercase">
                {listing.condition}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold leading-tight md:text-xl">{listing.type}</h2>
            <div className="mt-1 flex items-center gap-1 text-cm-sub">
              <MapPin className="h-3 w-3 shrink-0 text-cm-accent" aria-hidden="true" />
              <span className="text-xs">{listing.location}</span>
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
                <span className="text-[11px] text-cm-muted">{listing.unit}</span>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1 font-mono text-[8px] tracking-[0.18em] text-cm-accent uppercase">
            {t.listings.detailDescription}
          </p>
          <p className="line-clamp-2 text-xs leading-5 text-cm-sub">{listing.description}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-0.5">
          <Button href="/epikoinonia" className="px-4 py-2 text-xs">
            {t.listings.detailContact}
          </Button>
          <Button href={`/listings/${listing.slug}`} variant="secondary" className="px-4 py-2 text-xs">
            {t.listings.viewPage}
          </Button>
          {showViewAll ? (
            <Button variant="secondary" className="px-4 py-2 text-xs" onClick={handleViewAll}>
              {t.listings.viewAll}
            </Button>
          ) : (
            <Button variant="secondary" className="px-4 py-2 text-xs" onClick={onClose}>
              {t.listings.detailClose}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
