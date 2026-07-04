/**
 * @file listing-format.ts
 * @description Shared listing formatting helpers
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

export function formatPriceEur(price: number): string {
  return `€${price.toLocaleString("el-GR")}`;
}

export function slugifyListing(type: string): string {
  const base = type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return base || "listing";
}

export function uniqueSlug(base: string, slugs: string[], excludeSlug?: string): string {
  let slug = base;
  let counter = 2;

  while (slugs.includes(slug) && slug !== excludeSlug) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export function placeholderImageForType(type: string): string {
  const normalized = type.toLowerCase();
  if (normalized.includes("reefer")) return "/images/containers/placeholder-20ft-reefer.jpg";
  if (normalized.includes("open")) return "/images/containers/placeholder-20ft-open.jpg";
  if (normalized.includes("45ft")) return "/images/containers/placeholder-45ft-pw.jpg";
  if (normalized.includes("high cube") || normalized.includes("40ft")) {
    return "/images/containers/placeholder-40ft-hc.jpg";
  }
  return "/images/containers/placeholder-20ft-dry.jpg";
}
