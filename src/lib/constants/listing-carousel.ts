/**
 * @file listing-carousel.ts
 * @description Featured listings carousel config
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

/** Toggle featured listings carousel on home page */
export const showFeaturedListings = true;

/** Max items in 3D carousel (Moduspace parity) */
export const featuredListingsLimit = 9;

export const listingCarousel = {
  cardWidthMobile: 300,
  cardWidthDesktop: 420,
  xOffsetMobile: 150,
  xOffsetDesktop: 360,
  visibleSideCount: 2,
  dragThreshold: 50,
  spring: { stiffness: 120, damping: 25, mass: 1.1 },
} as const;
