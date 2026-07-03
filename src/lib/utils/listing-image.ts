/**
 * @file listing-image.ts
 * @description Helpers for listing image display
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function isPlaceholderImage(src: string): boolean {
  return src.includes("placeholder");
}

export function shouldShowListingPhoto(src: string, failed: boolean): boolean {
  return Boolean(src) && !isPlaceholderImage(src) && !failed;
}
