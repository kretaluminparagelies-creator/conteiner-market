/**
 * @file listing-mapper.ts
 * @description Map Supabase listing rows ↔ app Listing type
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

import type { ListingFormInput } from "@/lib/crm/listing-form";
import { resolveListingImages } from "@/lib/crm/listing-images";
import { site } from "@/lib/constants/site";
import { formatPriceEur } from "@/lib/repositories/listing-format";
import type { ListingInsert, ListingRow } from "@/lib/supabase/server";
import type { Listing } from "@/lib/types/listing";

/** Columns needed for CRM listings table — skips descriptions, images, locations */
export type ListingAdminRow = Pick<
  ListingRow,
  | "id"
  | "slug"
  | "type"
  | "condition"
  | "price"
  | "price_formatted"
  | "unit"
  | "listing_type"
  | "stock_condition"
  | "is_offer"
  | "active"
>;

export function listingAdminRowToListing(row: ListingAdminRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    condition: row.condition,
    price: Number(row.price),
    priceFormatted: row.price_formatted,
    unit: row.unit ?? "",
    listingType: row.listing_type,
    stockCondition: row.stock_condition,
    isOffer: row.is_offer,
    active: row.active,
    location: "",
    image: "",
    description: "",
  };
}

export function listingRowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    condition: row.condition,
    conditionEn: row.condition_en ?? undefined,
    price: Number(row.price),
    priceFormatted: row.price_formatted,
    unit: row.unit ?? "",
    unitEn: row.unit_en ?? undefined,
    location: row.location,
    locationEn: row.location_en ?? undefined,
    listingType: row.listing_type,
    stockCondition: row.stock_condition,
    isOffer: row.is_offer,
    image: row.image,
    images: row.images ?? undefined,
    description: row.description,
    descriptionEn: row.description_en ?? undefined,
    active: row.active,
  };
}

export function listingFormToInsert(input: ListingFormInput, slug: string): ListingInsert {
  const unit = input.listingType === "rent" && !input.unit ? "/μήνα" : input.unit;
  const unitEn =
    input.listingType === "rent" && !input.unitEn ? (unit ? "/month" : "") : input.unitEn;
  const { image, images } = resolveListingImages(input);

  return {
    slug,
    type: input.type.trim(),
    condition: input.condition.trim(),
    condition_en: input.conditionEn.trim() || null,
    price: input.price,
    price_formatted: formatPriceEur(input.price),
    unit,
    unit_en: unitEn || null,
    location: site.headquarters.el,
    location_en: site.headquarters.en,
    listing_type: input.listingType,
    stock_condition: input.stockCondition,
    is_offer: input.isOffer,
    image,
    images,
    description: input.description.trim(),
    description_en: input.descriptionEn.trim() || null,
    active: input.active,
  };
}

export function listingToInsert(listing: Listing): ListingInsert {
  return {
    slug: listing.slug,
    type: listing.type,
    condition: listing.condition,
    condition_en: listing.conditionEn ?? null,
    price: listing.price,
    price_formatted: listing.priceFormatted,
    unit: listing.unit,
    unit_en: listing.unitEn ?? null,
    location: listing.location,
    location_en: listing.locationEn ?? null,
    listing_type: listing.listingType,
    stock_condition: listing.stockCondition ?? "used",
    is_offer: listing.isOffer ?? false,
    image: listing.image,
    images: listing.images ?? null,
    description: listing.description,
    description_en: listing.descriptionEn ?? null,
    active: listing.active,
  };
}
