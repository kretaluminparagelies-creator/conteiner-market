/**
 * @file ListingDetailPhotoCarousel.tsx
 * @description 3D photo carousel inside listing detail modal (Moduspace PropertyImageCarousel)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { CarouselNavButton } from "@/components/listings/carousel/CarouselNavButton";
import { ContainerSVG } from "@/components/ui/ContainerSVG";
import { listingCarousel } from "@/lib/constants/listing-carousel";
import { getListingDisplayImages, getListingSourceImages } from "@/lib/utils/listing-images";
import { shouldShowListingPhoto } from "@/lib/utils/listing-image";
import type { Listing } from "@/lib/types/listing";

type ListingDetailPhotoCarouselProps = {
  listing: Listing;
  surface?: "dark" | "light";
};

function wrapOffset(offset: number, length: number): number {
  let next = offset;
  if (next > Math.floor(length / 2)) next -= length;
  if (next < -Math.floor(length / 2)) next += length;
  return next;
}

export function ListingDetailPhotoCarousel({
  listing,
  surface = "dark",
}: ListingDetailPhotoCarouselProps) {
  return <ListingDetailPhotoCarouselView key={listing.id} listing={listing} surface={surface} />;
}

function ListingDetailPhotoCarouselView({
  listing,
  surface = "dark",
}: ListingDetailPhotoCarouselProps) {
  const reduceMotion = useReducedMotion();
  const isLight = surface === "light";
  const config = listingCarousel.detailPhoto;
  const sourceImages = getListingSourceImages(listing);
  const displayImages = getListingDisplayImages(listing);
  const isRent = listing.listingType === "rent";
  const hasMultipleImages = sourceImages.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  if (displayImages.length === 0) {
    return (
      <div
        className={[
          "flex h-[320px] items-center justify-center rounded-lg md:h-[400px]",
          isLight ? "bg-cm-light-elevated" : "bg-cm-carousel-photo/30",
        ].join(" ")}
      >
        <ContainerSVG tinted={isRent} className="h-24 w-auto md:h-28" />
      </div>
    );
  }

  const isMobile = windowWidth < 768;
  const xStep = isMobile ? config.xOffsetMobile : config.xOffsetDesktop;
  const cardWidth = isMobile ? config.cardWidthMobile : config.cardWidthDesktop;
  const photoHeight = isMobile ? config.photoHeightMobile : config.photoHeightDesktop;
  const activePhotoIndex = hasMultipleImages ? currentIndex % sourceImages.length : 0;

  return (
    <div
      className={[
        "relative flex w-full flex-col items-center overflow-visible rounded-lg p-2 md:p-3",
        isLight ? "bg-cm-light-elevated/80" : "bg-cm-carousel-photo/25",
      ].join(" ")}
      style={
        {
          "--cm-detail-photo-nav-inset": `${config.navInsetDesktop}px`,
        } as CSSProperties
      }
    >
      <CarouselNavButton
        onClick={prev}
        ariaLabel="Previous photo"
        surface={surface}
        className="absolute top-1/2 left-1 z-40 h-8 w-8 -translate-y-1/2 md:left-[calc(50%-var(--cm-detail-photo-nav-inset))]"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
      </CarouselNavButton>

      <CarouselNavButton
        onClick={next}
        ariaLabel="Next photo"
        surface={surface}
        className="absolute top-1/2 right-1 z-40 h-8 w-8 -translate-y-1/2 md:right-[calc(50%-var(--cm-detail-photo-nav-inset))]"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2} />
      </CarouselNavButton>

      <div
        className="carousel-perspective relative flex w-full items-center justify-center overflow-visible"
        style={{ height: isMobile ? config.stageHeightMobile : config.stageHeightDesktop }}
      >
        {displayImages.map((image, index) => {
          const offset = wrapOffset(index - currentIndex, displayImages.length);
          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= config.visibleSideCount;

          const sourceIndex = hasMultipleImages ? index % sourceImages.length : 0;
          const showPhoto = shouldShowListingPhoto(image, failed[sourceIndex]);

          return (
            <motion.div
              key={`${listing.id}-photo-${index}`}
              layout={false}
              initial={false}
              animate={{
                opacity: isVisible ? (isCenter ? 1 : 0.55 - Math.abs(offset) * 0.12) : 0,
                scale: isVisible ? (isCenter ? 1 : 0.82 - Math.abs(offset) * 0.04) : 0.78,
                x: offset * xStep,
                z: isCenter ? 0 : -280 - Math.abs(offset) * 70,
                rotateY: reduceMotion ? 0 : offset * 42,
                zIndex: isVisible ? 40 - Math.abs(offset) : 0,
              }}
              transition={
                reduceMotion ? { duration: 0.01 } : { type: "spring", ...listingCarousel.spring }
              }
              drag={reduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x > listingCarousel.dragThreshold) prev();
                else if (info.offset.x < -listingCarousel.dragThreshold) next();
              }}
              onClick={() => {
                if (!isCenter) setCurrentIndex(index);
              }}
              className="carousel-perspective-item absolute cursor-grab active:cursor-grabbing"
              style={{
                width: cardWidth,
                transformStyle: "preserve-3d",
                pointerEvents: isVisible ? "auto" : "none",
              }}
            >
              <div
                className={
                  isCenter
                    ? isLight
                      ? "drop-shadow-[0_20px_40px_rgba(14,24,40,0.18)]"
                      : "drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                    : isLight
                      ? "drop-shadow-[0_12px_24px_rgba(14,24,40,0.12)]"
                      : "drop-shadow-[0_12px_24px_rgba(0,0,0,0.22)]"
                }
              >
                <div
                  className={[
                    "overflow-hidden rounded-xl border shadow-xl",
                    isLight
                      ? "border-cm-light-border-strong bg-white"
                      : "border-cm-border/70 bg-cm-card",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "relative overflow-hidden",
                      isLight ? "bg-cm-light-elevated" : "bg-cm-carousel-photo",
                    ].join(" ")}
                    style={{ height: photoHeight }}
                  >
                    {!isLight ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-br from-cm-carousel-photo via-cm-carousel-visual to-[#587898]"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-br from-[#dce8f4] via-[#c5d8ea] to-[#a8c4dc]"
                      />
                    )}

                    {showPhoto ? (
                      <Image
                        src={image}
                        alt={`${listing.type} — ${sourceIndex + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 640px"
                        onError={() =>
                          setFailed((current) => ({ ...current, [sourceIndex]: true }))
                        }
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ContainerSVG tinted={isRent} className="h-20 w-auto md:h-24" />
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className={
                        isLight
                          ? "pointer-events-none absolute inset-0 bg-linear-to-t from-[#0e1828]/70 via-transparent to-transparent"
                          : "pointer-events-none absolute inset-0 bg-linear-to-t from-cm-bg/75 via-transparent to-transparent"
                      }
                    />

                    {isCenter && hasMultipleImages ? (
                      <div
                        className={[
                          "absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full px-3 py-1 font-mono text-[11px] tracking-wide backdrop-blur-sm",
                          isLight ? "bg-white/85 text-cm-ink" : "bg-cm-bg/70 text-white",
                        ].join(" ")}
                      >
                        {activePhotoIndex + 1} / {sourceImages.length}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {hasMultipleImages ? (
        <div className="relative z-40 mb-1.5 flex items-center justify-center">
          <div className="flex max-w-xs flex-wrap justify-center gap-1.5">
            {sourceImages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Photo ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={[
                  "h-1.5 rounded-full transition-all duration-500",
                  index === activePhotoIndex
                    ? "w-6 bg-cm-accent shadow-[0_0_10px_rgba(224,112,48,0.45)]"
                    : isLight
                      ? "w-1.5 bg-cm-ink-muted/35 hover:bg-cm-ink-muted/55"
                      : "w-1.5 bg-cm-sub/35 hover:bg-cm-sub/55",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
