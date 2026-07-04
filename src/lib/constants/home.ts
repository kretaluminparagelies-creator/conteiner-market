/**
 * @file home.ts
 * @description Non-translatable home page data (numbers, durations)
 * @author Katsoulakis
 * @copyright 2025 Katsoulakis. All rights reserved.
 */

/** Ticker scroll duration (seconds) */
export const heroTickerDurationSec = 55;

/** Home hero background — container yard photo */
export const heroBackgroundImage = "/images/hero-containers.png";

/** Home carousel section background */
export const carouselBackgroundImage = "/images/carousel-containers.png";

/** Home categories section background */
export const categoriesBackgroundImage = "/images/categories-containers.png";

/** Home how-it-works section background */
export const howItWorksBackgroundImage = "/images/how-it-works.png";

/** Home CTA section background */
export const ctaBackgroundImage = "/images/cta-container.png";

/** Polisi / sell flow — office photo (cooler, less saturated) */
export const polisiBackgroundImage = "/images/polisi-office.png";

export const polisiPhotoImageClass = "object-cover object-center saturate-[0.82] contrast-[1.04]";

export const polisiPhotoOverlayPrimaryClass =
  "absolute inset-0 bg-linear-to-b from-white/55 via-white/32 to-white/42";

export const polisiPhotoOverlayFadeClass =
  "absolute inset-0 bg-linear-to-t from-[#eef4f9]/75 via-white/24 to-white/16";

/** Shared photo-section treatment (carousel + categories) */
export const homePhotoImageClass = "object-cover saturate-[1.15] contrast-[1.08]";

export const homePhotoOverlayPrimaryClass = "bg-linear-to-b from-white/38 via-white/12 to-white/28";

export const homePhotoOverlayFadeClass =
  "bg-linear-to-t from-cm-light-bg/50 via-transparent to-white/6";

export const statDefinitions = [
  { end: 500, suffix: "+", key: "containers" as const },
  { end: 280, suffix: "+", key: "clients" as const },
  { end: 12, suffix: "", key: "years" as const },
  { end: 32, suffix: "", key: "hubs" as const },
];
