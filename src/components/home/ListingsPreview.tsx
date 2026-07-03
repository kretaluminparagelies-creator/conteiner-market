/**
 * @file ListingsPreview.tsx
 * @description Featured listings grid on the home page
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

"use client";

import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/ui/TiltCard";
import { getFeaturedListings } from "@/lib/data/listings";
import { useLocale } from "@/lib/i18n/locale-context";
import { useInView } from "@/lib/hooks/useInView";
import { fadeUpStyle } from "@/lib/utils/motion";

export function ListingsPreview() {
  const { t } = useLocale();
  const { ref, visible } = useInView<HTMLElement>({ threshold: 0.05 });
  const listings = getFeaturedListings();

  return (
    <section ref={ref} className="bg-cm-surf px-[6%] py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
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

        <div className="grid gap-0.5 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, index) => (
            <TiltCard
              key={listing.id}
              className="cursor-pointer overflow-hidden border border-cm-border bg-cm-card"
              style={fadeUpStyle(visible, index * 0.1)}
            >
              <ListingCard listing={listing} />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
