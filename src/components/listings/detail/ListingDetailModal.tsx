/**
 * @file ListingDetailModal.tsx
 * @description Modal for a single container listing (carousel click)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect } from "react";
import { ListingDetailContent } from "@/components/listings/detail/ListingDetailContent";
import { useLocale } from "@/lib/i18n/locale-context";
import type { Listing } from "@/lib/types/listing";

type ListingDetailModalProps = {
  listing: Listing | null;
  onClose: () => void;
};

export function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const open = listing !== null;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && listing ? (
        <motion.div
          className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
        >
          <button
            type="button"
            aria-label={t.listings.detailClose}
            className="absolute inset-0 bg-cm-bg/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-detail-title"
            className="relative z-10 my-auto w-full max-w-4xl translate-y-4 overflow-hidden sm:translate-y-7"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
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

            <div id="listing-detail-title" className="sr-only">
              {listing.type}
            </div>
            <ListingDetailContent listing={listing} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
