/**
 * @file ContainerCarousel3D.tsx
 * @description 3D carousel for featured container listings (Moduspace-style)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CarouselNavButton } from "@/components/listings/carousel/CarouselNavButton";
import { ContainerCarouselCard } from "@/components/listings/carousel/ContainerCarouselCard";
import { listingCarousel } from "@/lib/constants/listing-carousel";
import type { CarouselListingItem } from "@/lib/types/listing-carousel";

type ContainerCarousel3DProps = {
  listings: CarouselListingItem[];
  onListingClick?: (listing: CarouselListingItem) => void;
};

function wrapOffset(offset: number, length: number): number {
  let next = offset;
  if (next > Math.floor(length / 2)) next -= length;
  if (next < -Math.floor(length / 2)) next += length;
  return next;
}

export function ContainerCarousel3D({ listings, onListingClick }: ContainerCarousel3DProps) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % listings.length);
  }, [listings.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + listings.length) % listings.length);
  }, [listings.length]);

  if (listings.length === 0) return null;

  const isMobile = windowWidth < 768;
  const xStep = isMobile ? listingCarousel.xOffsetMobile : listingCarousel.xOffsetDesktop;
  const cardWidth = isMobile ? listingCarousel.cardWidthMobile : listingCarousel.cardWidthDesktop;

  return (
    <div className="relative flex w-full flex-col items-center overflow-visible px-1 md:px-4">
      <CarouselNavButton
        onClick={prev}
        ariaLabel="Previous listing"
        className="absolute top-[42%] left-0 z-50 -translate-y-1/2 md:left-[calc(50%-280px)]"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      </CarouselNavButton>

      <CarouselNavButton
        onClick={next}
        ariaLabel="Next listing"
        className="absolute top-[42%] right-0 z-50 -translate-y-1/2 md:right-[calc(50%-280px)]"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={2} />
      </CarouselNavButton>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ffffff12_0%,#e0703014_35%,transparent_70%)]"
      />

      <div className="carousel-perspective relative flex h-[400px] w-full items-center justify-center md:h-[480px]">
        <AnimatePresence mode="sync" initial={false}>
          {listings.map((listing, index) => {
            const offset = wrapOffset(index - currentIndex, listings.length);
            const isCenter = offset === 0;
            const isVisible = Math.abs(offset) <= listingCarousel.visibleSideCount;
            if (!isVisible) return null;

            return (
              <motion.div
                key={listing.id}
                layout={false}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, scale: 0.5, z: -1000 }
                }
                animate={{
                  opacity: isCenter ? 1 : 0.72 - Math.abs(offset) * 0.1,
                  scale: isCenter ? 1 : 0.9 - Math.abs(offset) * 0.03,
                  x: offset * xStep,
                  z: isCenter ? 0 : -350 - Math.abs(offset) * 90,
                  rotateY: reduceMotion ? 0 : offset * 38,
                  zIndex: 50 - Math.abs(offset),
                  filter: isCenter ? "brightness(1.02)" : "brightness(0.95)",
                }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 0.5, z: -1000 }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { type: "spring", ...listingCarousel.spring }
                }
                drag={reduceMotion ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x > listingCarousel.dragThreshold) prev();
                  else if (info.offset.x < -listingCarousel.dragThreshold) next();
                }}
                onClick={() => {
                  if (!isCenter) setCurrentIndex(index);
                  else if (onListingClick) onListingClick(listing);
                }}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  width: cardWidth,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className={
                    isCenter
                      ? "drop-shadow-[0_28px_56px_rgba(0,0,0,0.4)]"
                      : "drop-shadow-[0_16px_32px_rgba(0,0,0,0.28)]"
                  }
                >
                  <ContainerCarouselCard {...listing} isCenter={isCenter} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="relative z-50 mt-2 flex items-center justify-center md:mt-4">
        <div className="flex max-w-xs flex-wrap justify-center gap-2 md:max-w-none">
          {listings.map((listing, index) => (
            <button
              key={listing.id}
              type="button"
              aria-label={`Go to listing ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={[
                "h-1.5 rounded-full transition-all duration-500",
                index === currentIndex
                  ? "w-8 bg-cm-accent shadow-[0_0_12px_rgba(224,112,48,0.45)]"
                  : "w-2 bg-cm-sub/35 hover:bg-cm-sub/55",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
