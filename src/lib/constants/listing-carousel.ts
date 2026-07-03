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
  cardWidthMobile: 330,
  cardWidthDesktop: 480,
  xOffsetMobile: 165,
  xOffsetDesktop: 400,
  stageHeightMobile: 480,
  stageHeightDesktop: 600,
  navInsetDesktop: 340,
  visibleSideCount: 2,
  dragThreshold: 50,
  spring: { stiffness: 150, damping: 24, mass: 0.85 },
  detailPhoto: {
    cardWidthMobile: 300,
    cardWidthDesktop: 440,
    xOffsetMobile: 155,
    xOffsetDesktop: 265,
    stageHeightMobile: 320,
    stageHeightDesktop: 400,
    photoHeightMobile: 290,
    photoHeightDesktop: 365,
    navInsetDesktop: 300,
    visibleSideCount: 2,
  },
} as const;
