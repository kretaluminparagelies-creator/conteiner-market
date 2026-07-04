/**
 * @file ListingDetailModal.tsx
 * @description Modal for a single container listing (carousel click)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ListingDetailWithPeers } from "@/components/listings/detail/ListingDetailWithPeers";
import {
  carouselBackgroundImage,
  homePhotoImageClass,
  homePhotoOverlayFadeClass,
  homePhotoOverlayPrimaryClass,
} from "@/lib/constants/home";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { useLocale } from "@/lib/i18n/locale-context";
import { getPeerListings } from "@/lib/utils/listing-detail-peers";
import type { ListingCarouselTab } from "@/lib/utils/listing-carousel-filters";
import type { Listing } from "@/lib/types/listing";

type ListingDetailModalProps = {
  listing: Listing | null;
  categoryListings?: Listing[];
  categoryTab?: ListingCarouselTab;
  onClose: () => void;
  surface?: "dark" | "light";
};

type ListingDetailModalContentProps = {
  listing: Listing;
  categoryListings: Listing[];
  categoryTab: ListingCarouselTab;
  onClose: () => void;
  surface: "dark" | "light";
};

function ListingDetailModalContent({
  listing,
  categoryListings,
  categoryTab,
  onClose,
  surface,
}: ListingDetailModalContentProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const isLight = surface === "light";
  const [activeListing, setActiveListing] = useState(listing);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const hasPeers = getPeerListings(categoryListings, activeListing.slug).length > 0;

  return (
    <motion.div
      className={[
        "fixed inset-0 z-[500] grid place-items-center overflow-y-auto",
        hasPeers ? "px-2 py-6 sm:px-3" : "p-4 sm:p-6",
      ].join(" ")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
    >
      <button
        type="button"
        aria-label={t.listings.detailClose}
        className="absolute inset-0 overflow-hidden"
        onClick={onClose}
      >
        {isLight ? (
          <>
            <Image
              src={carouselBackgroundImage}
              alt=""
              fill
              sizes="100vw"
              className={[homePhotoImageClass, "object-[center_40%]"].join(" ")}
            />
            <span className={["absolute inset-0", homePhotoOverlayPrimaryClass].join(" ")} />
            <span className={["absolute inset-0", homePhotoOverlayFadeClass].join(" ")} />
          </>
        ) : (
          <span className="absolute inset-0 bg-cm-bg/95 backdrop-blur-md" aria-hidden="true" />
        )}
      </button>

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-detail-title"
        className={[
          "relative z-10 my-auto w-full translate-y-4 overflow-visible sm:translate-y-7",
          hasPeers ? "max-w-none" : "max-w-5xl",
        ].join(" ")}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <div id="listing-detail-title" className="sr-only">
          {activeListing.type}
        </div>

        <ListingDetailWithPeers
          listing={activeListing}
          categoryListings={categoryListings}
          categoryTab={categoryTab}
          onListingSelect={setActiveListing}
          onClose={onClose}
          surface={surface}
        />
      </motion.div>
    </motion.div>
  );
}

export function ListingDetailModal({
  listing,
  categoryListings = [],
  categoryTab = "offers",
  onClose,
  surface = "dark",
}: ListingDetailModalProps) {
  const mounted = useIsClient();

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {listing ? (
        <ListingDetailModalContent
          key={listing.slug}
          listing={listing}
          categoryListings={categoryListings}
          categoryTab={categoryTab}
          onClose={onClose}
          surface={surface}
        />
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
