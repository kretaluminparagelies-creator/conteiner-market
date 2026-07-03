/**
 * @file listing-store.ts
 * @description Server-only listings.json read/write
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ListingFormInput } from "@/lib/crm/listing-form";
import type { Listing } from "@/lib/types/listing";
import { site } from "@/lib/constants/site";

const listingsPath = path.join(process.cwd(), "src/data/listings.json");

export async function readListingsFromDisk(): Promise<Listing[]> {
  const raw = await readFile(listingsPath, "utf-8");
  return JSON.parse(raw) as Listing[];
}

export async function writeListingsToDisk(listings: Listing[]): Promise<void> {
  await writeFile(listingsPath, `${JSON.stringify(listings, null, 2)}\n`, "utf-8");
}

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

export function nextListingId(listings: Listing[]): string {
  const max = listings.reduce((acc, item) => Math.max(acc, Number.parseInt(item.id, 10) || 0), 0);
  return String(max + 1);
}

export function uniqueSlug(base: string, listings: Listing[], excludeSlug?: string): string {
  let slug = base;
  let counter = 2;

  while (listings.some((l) => l.slug === slug && l.slug !== excludeSlug)) {
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

function buildListing(input: ListingFormInput, id: string, slug: string): Listing {
  const unit = input.listingType === "rent" && !input.unit ? "/μήνα" : input.unit;
  const unitEn =
    input.listingType === "rent" && !input.unitEn ? (unit ? "/month" : "") : input.unitEn;

  return {
    id,
    slug,
    type: input.type.trim(),
    condition: input.condition.trim(),
    conditionEn: input.conditionEn.trim() || undefined,
    price: input.price,
    priceFormatted: formatPriceEur(input.price),
    unit,
    unitEn: unitEn || undefined,
    location: site.headquarters.el,
    locationEn: site.headquarters.en,
    listingType: input.listingType,
    stockCondition: input.stockCondition,
    isOffer: input.isOffer,
    image: input.image.trim() || placeholderImageForType(input.type),
    description: input.description.trim(),
    descriptionEn: input.descriptionEn.trim() || undefined,
    active: input.active,
  };
}

export async function readAdminListings(includeInactive = true): Promise<Listing[]> {
  const listings = await readListingsFromDisk();
  if (includeInactive) return listings;
  return listings.filter((l) => l.active);
}

export async function readAdminListingBySlug(slug: string): Promise<Listing | undefined> {
  const listings = await readListingsFromDisk();
  return listings.find((l) => l.slug === slug);
}

export async function createListingOnDisk(input: ListingFormInput): Promise<Listing> {
  const listings = await readListingsFromDisk();
  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(baseSlug, listings);
  const listing = buildListing(input, nextListingId(listings), slug);

  listings.push(listing);
  await writeListingsToDisk(listings);

  return listing;
}

export async function updateListingOnDisk(
  existingSlug: string,
  input: ListingFormInput,
): Promise<Listing> {
  const listings = await readListingsFromDisk();
  const index = listings.findIndex((l) => l.slug === existingSlug);

  if (index === -1) {
    throw new Error("Listing not found");
  }

  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(baseSlug, listings, existingSlug);
  const listing = buildListing(input, listings[index].id, slug);

  listings[index] = listing;
  await writeListingsToDisk(listings);

  return listing;
}
