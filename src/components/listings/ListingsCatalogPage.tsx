/**
 * @file ListingsCatalogPage.tsx
 * @description Full catalog — same 3D carousel as home
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ListingsCatalogCarousel } from "@/components/listings/ListingsCatalogCarousel";
import { useLocale } from "@/lib/i18n/locale-context";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";
import { defaultListingCarouselTab } from "@/lib/utils/listing-carousel-filters";
import type { Listing } from "@/lib/types/listing";

type ListingsCatalogPageProps = {
  listings: Listing[];
  isFiltered?: boolean;
  initialTab?: ListingCarouselTab;
};

export function ListingsCatalogPage({
  listings,
  isFiltered = false,
  initialTab,
}: ListingsCatalogPageProps) {
  const { t } = useLocale();
  const hasResults = listings.length > 0;

  return (
    <section id="prosfores" className="relative overflow-hidden bg-cm-bg px-[6%] py-16 md:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff10_0%,transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,#4ab0e818_0%,transparent_48%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(#243d5814_1px,transparent_1px),linear-gradient(90deg,#243d5814_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {isFiltered ? (
          <p className="mb-6 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
            {t.listings.resultsHint}
          </p>
        ) : null}

        {hasResults ? (
          <div>
            <Suspense
              fallback={
                <div className="rounded-xl border border-cm-border bg-cm-card/40 p-12 text-center text-cm-sub">
                  …
                </div>
              }
            >
              <ListingsCatalogCarousel
                listings={listings}
                initialTab={initialTab ?? defaultListingCarouselTab}
              />
            </Suspense>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-start gap-4 rounded-xl border border-cm-border bg-cm-card/50 p-8">
            <p className="text-cm-sub">{t.listings.noResults}</p>
            <Link
              href="/listings"
              className="inline-flex items-center rounded-[6px] border border-cm-accent/55 px-4 py-2 font-display text-sm font-semibold text-cm-accent transition-colors hover:bg-cm-accent/10"
            >
              {t.listings.clearFilters}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
