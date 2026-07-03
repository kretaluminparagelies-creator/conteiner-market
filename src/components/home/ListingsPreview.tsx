/**
 * @file ListingsPreview.tsx
 * @description Featured listings 3D carousel on the home page
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { useRouter } from "next/navigation";
import { ContainerCarousel3D } from "@/components/listings/carousel/ContainerCarousel3D";
import { Button } from "@/components/ui/Button";
import {
  featuredListingsLimit,
  showFeaturedListings,
} from "@/lib/constants/listing-carousel";
import { getFeaturedListings } from "@/lib/data/listings";
import { useLocale } from "@/lib/i18n/locale-context";
import { mapListingsToCarousel } from "@/lib/utils/map-listing-carousel";

export function ListingsPreview() {
  const { t } = useLocale();
  const router = useRouter();
  const listings = mapListingsToCarousel(getFeaturedListings(featuredListingsLimit));

  if (!showFeaturedListings || listings.length === 0) return null;

  return (
    <section id="listings" className="relative overflow-hidden bg-cm-bg px-[6%] py-20 md:py-24">
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
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-10 sm:flex-row sm:items-end">
          <div className="text-center sm:text-left">
            <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-cm-accent uppercase">
              {t.listings.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.375rem,3vw,2.375rem)] font-bold">
              {t.listings.title}
            </h2>
          </div>
          <Button href="/listings" variant="secondary" className="text-[13px]">
            {t.listings.viewAll}
          </Button>
        </div>

        <ContainerCarousel3D
          listings={listings}
          onListingClick={() => router.push("/listings")}
        />
      </div>
    </section>
  );
}
