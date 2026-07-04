/**
 * @file listing-store.ts
 * @description Server-only listings persistence — Supabase or JSON fallback
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ListingFormInput } from "@/lib/crm/listing-form";
import { site } from "@/lib/constants/site";
import {
  formatPriceEur,
  placeholderImageForType,
  slugifyListing,
  uniqueSlug,
} from "@/lib/repositories/listing-format";
import {
  createListingInSupabase,
  fetchListingBySlugFromSupabase,
  fetchListingsFromSupabase,
  updateListingInSupabase,
} from "@/lib/repositories/supabase-listings";
import { isSupabaseAdminConfigured, isSupabaseReadConfigured } from "@/lib/supabase/env";
import type { Listing } from "@/lib/types/listing";

export {
  formatPriceEur,
  placeholderImageForType,
  slugifyListing,
  uniqueSlug,
} from "@/lib/repositories/listing-format";

const listingsPath = path.join(process.cwd(), "src/data/listings.json");

export async function readListingsFromDisk(): Promise<Listing[]> {
  const raw = await readFile(listingsPath, "utf-8");
  return JSON.parse(raw) as Listing[];
}

export async function writeListingsToDisk(listings: Listing[]): Promise<void> {
  await writeFile(listingsPath, `${JSON.stringify(listings, null, 2)}\n`, "utf-8");
}

export function nextListingId(listings: Listing[]): string {
  const max = listings.reduce((acc, item) => Math.max(acc, Number.parseInt(item.id, 10) || 0), 0);
  return String(max + 1);
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
  if (isSupabaseAdminConfigured()) {
    try {
      return await fetchListingsFromSupabase({ includeInactive, admin: true });
    } catch (error) {
      console.error("[listing-store] Supabase admin read failed, falling back to JSON:", error);
    }
  }

  const listings = await readListingsFromDisk();
  if (includeInactive) return listings;
  return listings.filter((l) => l.active);
}

export async function readAdminListingBySlug(slug: string): Promise<Listing | undefined> {
  if (isSupabaseAdminConfigured()) {
    try {
      return await fetchListingBySlugFromSupabase(slug, { admin: true });
    } catch (error) {
      console.error("[listing-store] Supabase admin read failed, falling back to JSON:", error);
    }
  }

  const listings = await readListingsFromDisk();
  return listings.find((l) => l.slug === slug);
}

export async function createListingOnDisk(input: ListingFormInput): Promise<Listing> {
  if (isSupabaseAdminConfigured()) {
    return createListingInSupabase(input);
  }

  const listings = await readListingsFromDisk();
  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(
    baseSlug,
    listings.map((l) => l.slug),
  );
  const listing = buildListing(input, nextListingId(listings), slug);

  listings.push(listing);
  await writeListingsToDisk(listings);

  return listing;
}

export async function updateListingOnDisk(
  existingSlug: string,
  input: ListingFormInput,
): Promise<Listing> {
  if (isSupabaseAdminConfigured()) {
    return updateListingInSupabase(existingSlug, input);
  }

  const listings = await readListingsFromDisk();
  const index = listings.findIndex((l) => l.slug === existingSlug);

  if (index === -1) {
    throw new Error("Listing not found");
  }

  const baseSlug = slugifyListing(input.type);
  const slug = uniqueSlug(
    baseSlug,
    listings.map((l) => l.slug),
    existingSlug,
  );
  const listing = buildListing(input, listings[index].id, slug);

  listings[index] = listing;
  await writeListingsToDisk(listings);

  return listing;
}

/** Whether public reads should come from Supabase */
export function useSupabaseForPublicReads(): boolean {
  return isSupabaseReadConfigured();
}
