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
import { listingCarouselTabThemes } from "@/lib/constants/listing-carousel-tab-themes";
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
  surface?: "dark" | "light";
};

function CategoryContext({
  categoryLabel,
  categoryCount,
  listingType,
  categoryTab,
  surface = "dark",
}: {
  categoryLabel: string;
  categoryCount: number;
  listingType: string;
  categoryTab: ListingCarouselTab;
  surface?: "dark" | "light";
}) {
  const { t } = useLocale();
  const isLight = surface === "light";
  const theme = listingCarouselTabThemes[categoryTab];
  const Icon = theme.icon;

  return (
    <div className={`${SIDE_HEADER_CLASS} space-y-2 text-left`}>
      <span
        className={[
          "inline-flex max-w-full items-center gap-2 rounded-full border-2 px-3 py-1.5 font-mono text-[10px] font-bold tracking-[0.08em] uppercase backdrop-blur-sm",
          isLight
            ? "bg-white shadow-cm-light-md"
            : "bg-cm-card/95 shadow-[0_8px_24px_rgba(0,0,0,0.28)]",
        ].join(" ")}
        style={{
          borderColor: theme.accent,
          color: theme.accent,
          boxShadow: isLight ? `0 4px 18px -2px ${theme.glow}` : `0 8px 24px -4px ${theme.glow}`,
        }}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate">{categoryLabel}</span>
        <span
          className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[9px] font-bold text-white"
          style={{ backgroundColor: theme.accent }}
        >
          {categoryCount}
        </span>
      </span>
      <p
        className={[
          "font-display text-xs leading-snug font-semibold",
          isLight
            ? "rounded-lg border border-white/80 bg-white/95 px-2.5 py-1.5 text-cm-ink shadow-cm-light-xs backdrop-blur-sm"
            : "text-cm-text",
        ].join(" ")}
      >
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
  surface = "dark",
}: {
  peers: Listing[];
  onSelect: (listing: Listing) => void;
  align: "outer-left" | "outer-right";
  surface?: "dark" | "light";
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
          <ListingDetailPeerCard
            key={peer.id}
            listing={peer}
            onSelect={onSelect}
            surface={surface}
          />
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
  surface = "dark",
}: ListingDetailWithPeersProps) {
  const { t } = useLocale();
  const isLight = surface === "light";
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
              categoryTab={categoryTab}
              surface={surface}
            />
            <PeerScrollColumn
              peers={left}
              onSelect={onListingSelect}
              align="outer-left"
              surface={surface}
            />
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
            "transition-colors",
            isLight
              ? "border border-cm-light-border-strong bg-white/95 text-cm-ink-sub shadow-cm-light-sm hover:border-cm-accent hover:text-cm-accent"
              : "border border-cm-border bg-cm-card/95 text-cm-sub backdrop-blur-sm hover:border-cm-accent hover:text-cm-text",
          ].join(" ")}
        >
          <X className="h-5 w-5" />
        </button>

        {!hasPeers ? (
          <div className="mb-3">
            <CategoryContext
              categoryLabel={categoryLabel}
              categoryCount={categoryCount}
              listingType={listing.type}
              categoryTab={categoryTab}
              surface={surface}
            />
          </div>
        ) : null}

        {hasPeers ? (
          <div className="mb-3 md:hidden">
            <CategoryContext
              categoryLabel={categoryLabel}
              categoryCount={categoryCount}
              listingType={listing.type}
              categoryTab={categoryTab}
              surface={surface}
            />
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
              {peers.map((peer) => (
                <ListingDetailPeerCard
                  key={peer.id}
                  listing={peer}
                  onSelect={onListingSelect}
                  surface={surface}
                />
              ))}
            </div>
          </div>
        ) : null}

        <ListingDetailContent key={listing.slug} listing={listing} surface={surface} />
      </div>

      {hasPeers ? (
        <div className="relative hidden min-w-0 md:block">
          <div className="absolute inset-0 flex flex-col">
            <SideHeaderSpacer />
            <PeerScrollColumn
              peers={right}
              onSelect={onListingSelect}
              align="outer-right"
              surface={surface}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
