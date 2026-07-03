/**
 * @file listing-location.ts
 * @description HQ location — same for all listings (not per-container)
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import { site } from "@/lib/constants/site";
import type { Locale } from "@/lib/i18n/types";

export function getHeadquartersLabel(locale: Locale): string {
  return locale === "en" ? site.headquarters.en : site.headquarters.el;
}

/** Stored listing location is ignored in UI — always our HQ */
export function resolveListingLocation(_storedLocation: string | undefined, locale: Locale): string {
  return getHeadquartersLabel(locale);
}
