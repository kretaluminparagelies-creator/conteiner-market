/**
 * @file ListingDetailWithPeers.tsx
 * @description Center listing card flanked by same-category peer cards
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { X } from "lucide-react";
import { ListingDetailContent } from "@/components/listings/detail/ListingDetailContent";
import { ListingDetailPeerCard } from "@/components/listings/detail/ListingDetailPeerCard";
import { useLocale } from "@/lib/i18n/locale-context";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";
import { getPeerListings, splitPeersForSides } from "@/lib/utils/listing-detail-peers";
import type { Listing } from "@/lib/types/listing";

/** Center card max width */
const CENTER_CARD_MAX = "max-w-5xl";

/** Matches category block height on both sides for symmetry */
const SIDE_HEADER_CLASS = "min-h-[3.5rem] shrink-0";

type ListingDetailWithPeersProps = {
  listing: Listing;
  categoryListings: Listing[];
  categoryTab: ListingCarouselTab;
  onListingSelect: (listing: Listing) => void;
  onClose: () => void;
};

function CategoryContext({
  categoryLabel,
  categoryCount,
  listingType,
}: {
  categoryLabel: string;
  categoryCount: number;
  listingType: string;
}) {
  const { t } = useLocale();

  return (
    <div className={`${SIDE_HEADER_CLASS} space-y-1.5 text-left`}>
      <span className="inline-block rounded-full border border-cm-accent/40 bg-cm-accent/10 px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] text-cm-accent uppercase">
        {categoryLabel} ({categoryCount})
      </span>
      <p className="font-display text-xs leading-snug font-semibold text-cm-text">
        {t.listings.detailActiveIn
          .replace("{type}", listingType)
          .replace("{category}", categoryLabel)}
      </p>
    </div>
  );
}

function SideHeaderSpacer() {
  return <div aria-hidden="true" className={SIDE_HEADER_CLASS} />;
}

function PeerScrollColumn({
  peers,
  onSelect,
  align,
}: {
  peers: Listing[];
  onSelect: (listing: Listing) => void;
  align: "outer-left" | "outer-right";
}) {
  if (peers.length === 0) return null;

  const scrollbarLeft = align === "outer-left";

  return (
    <div
      // rtl on the scroll container moves the vertical scrollbar to the left edge
      dir={scrollbarLeft ? "rtl" : "ltr"}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.28)_transparent]"
    >
      <div
        dir="ltr"
        className={[
          "flex flex-col gap-3.5 pb-2",
          scrollbarLeft ? "items-start pl-1" : "items-end pr-1",
        ].join(" ")}
      >
        {peers.map((peer) => (
          <ListingDetailPeerCard key={peer.id} listing={peer} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export function ListingDetailWithPeers({
  listing,
  categoryListings,
  categoryTab,
  onListingSelect,
  onClose,
}: ListingDetailWithPeersProps) {
  const { t } = useLocale();
  const peers = getPeerListings(categoryListings, listing.slug);
  const { left, right } = splitPeersForSides(peers);
  const hasPeers = peers.length > 0;

  const categoryLabel = t.listings.tabs[categoryTab];
  const categoryCount = categoryListings.length;

  return (
    <div
      className={
        hasPeers
          ? "w-full md:grid md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-4 lg:gap-6"
          : "w-full"
      }
    >
      {hasPeers ? (
        <div className="relative hidden min-w-0 md:block">
          {/* absolute inner → column height locks to center card height, never taller */}
          <div className="absolute inset-0 flex flex-col">
            <CategoryContext
              categoryLabel={categoryLabel}
              categoryCount={categoryCount}
              listingType={listing.type}
            />
            <PeerScrollColumn peers={left} onSelect={onListingSelect} align="outer-left" />
          </div>
        </div>
      ) : null}

      <div className={`relative w-full shrink-0 md:justify-self-center ${CENTER_CARD_MAX}`}>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.listings.detailClose}
          className={[
            "absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full",
            "border border-cm-border bg-cm-card/95 text-cm-sub backdrop-blur-sm",
            "transition-colors hover:border-cm-accent hover:text-cm-text",
          ].join(" ")}
        >
          <X className="h-5 w-5" />
        </button>

        {hasPeers ? (
          <div className="mb-3 md:hidden">
            <CategoryContext
              categoryLabel={categoryLabel}
              categoryCount={categoryCount}
              listingType={listing.type}
            />
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
              {peers.map((peer) => (
                <ListingDetailPeerCard key={peer.id} listing={peer} onSelect={onListingSelect} />
              ))}
            </div>
          </div>
        ) : null}

        <ListingDetailContent key={listing.slug} listing={listing} />
      </div>

      {hasPeers ? (
        <div className="relative hidden min-w-0 md:block">
          <div className="absolute inset-0 flex flex-col">
            <SideHeaderSpacer />
            <PeerScrollColumn peers={right} onSelect={onListingSelect} align="outer-right" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
