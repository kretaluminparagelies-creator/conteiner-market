/**
 * @file ListingDetailPageContent.tsx
 * @description Full listing detail page (shareable URL for SEO & AI agents)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { ListingDetailPhotoCarousel } from "@/components/listings/detail/ListingDetailPhotoCarousel";
import { SiteButton } from "@/components/ui/site-button";
import { ListingPageHead } from "@/components/listings/detail/ListingPageHead";
import { localizeListing } from "@/lib/data/listings";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Listing } from "@/lib/types/listing";

type ListingDetailPageContentProps = {
  listing: Listing;
};

export function ListingDetailPageContent({ listing }: ListingDetailPageContentProps) {
  const { locale, t } = useLocale();
  const item = localizeListing(listing, locale);
  const isRent = item.listingType === "rent";

  return (
    <>
      <ListingPageHead listing={listing} />
      <section className="px-[6%] py-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/listings"
            className="inline-flex items-center font-mono text-[11px] tracking-[0.12em] text-cm-muted uppercase transition-colors hover:text-cm-accent"
          >
            {t.listings.backToListings}
          </Link>

          <div className="mt-8 overflow-hidden rounded-xl border border-cm-border bg-cm-card">
            <div className="px-3 pt-4 pb-3 md:px-5 md:pt-6 md:pb-4">
              <ListingDetailPhotoCarousel listing={item} />
            </div>

            <div className="space-y-4 border-t border-cm-border/50 px-3 py-4 md:px-5 md:py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span
                      className={[
                        "rounded-full px-2.5 py-0.5 font-mono text-[8px] tracking-[0.12em] uppercase",
                        isRent ? "tag-rent" : "tag-sale",
                      ].join(" ")}
                    >
                      {isRent ? t.listings.rent : t.listings.sale}
                    </span>
                    <span className="rounded-full border border-cm-border bg-cm-surf px-2.5 py-0.5 font-mono text-[8px] tracking-[0.1em] text-cm-sub uppercase">
                      {item.condition}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl font-bold leading-tight md:text-3xl">{item.type}</h1>
                  <div className="mt-2 flex items-center gap-1.5 text-cm-sub">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-cm-accent" aria-hidden="true" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span
                      className={[
                        "font-display text-2xl font-bold md:text-3xl",
                        isRent ? "text-cm-rent" : "text-cm-accent",
                      ].join(" ")}
                    >
                      {item.priceFormatted}
                    </span>
                    {item.unit ? (
                      <span className="text-sm text-cm-muted">{item.unit}</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 font-mono text-[9px] tracking-[0.18em] text-cm-accent uppercase">
                  {t.listings.detailDescription}
                </p>
                <p className="text-sm leading-7 text-cm-sub md:text-[15px]">{item.description}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <SiteButton href="/epikoinonia?intent=inquiry">{t.listings.detailContact}</SiteButton>
                <SiteButton href="/listings" variant="secondary">
                  {t.listings.viewAll}
                </SiteButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
